import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { delay, filter, share, shareReplay, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import {
  getPageUrlByName,
  PebPageShort,
  PebPageVariant,
  PebShopContainer,
  PebShopRoute,
  PebShopThemeVersionEntity,
  PebShopThemeVersionId,
} from '@pe/builder-core';
import { PebEditorApi, PEB_STORAGE_PATH } from '@pe/builder-api';
import { AbstractComponent, BackgroundActivityService, PebEditorStore, SnackbarErrorService } from '@pe/builder-editor';

import { OverlayData, OVERLAY_DATA } from '../../overlay.data';
import { ErrorDialogComponent } from '../../../components/error-dialog/error-dialog.component';
@Component({
  selector: 'peb-editor-publish-dialog',
  templateUrl: 'publish.dialog.html', // TODO: add skeleton
  styleUrls: ['./publish.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebEditorPublishDialogComponent extends AbstractComponent implements OnInit {
  @ViewChild('logoFileInput') logoFileInput: ElementRef;
  @ViewChild('logo') logoEl: ElementRef;
  @ViewChild('logoWrapper') logoWrapperEl: ElementRef;

  shopPicture: string;
  versionName: string;
  shopNameValue = '';
  currentShopName$ = new BehaviorSubject<string>('');

  isVersionCreating: boolean;
  isVersionsLoading = true;
  isEmpty = true;
  isLargeThenParent = false;
  isLoading = false;
  uploadProgress = 0;

  hasActiveBackgroundTasks$ = this.backgroundActivityService.hasActiveTasks$.pipe(
    shareReplay(1),
  );

  readonly versions$ = new BehaviorSubject<PebShopThemeVersionEntity[]>([]);
  // private readonly publishedVersionIdSubject$ = new BehaviorSubject<PebShopThemeVersionId>(null);
  // get publishedVersionId$(): Observable<PebShopThemeVersionId> {
  //   return this.publishedVersionIdSubject$.asObservable().pipe(share());
  // }

  private readonly activatedVersionIdSubject$ = new BehaviorSubject<PebShopThemeVersionId>(null);
  get activatedVersionId$(): Observable<PebShopThemeVersionId> {
    return this.activatedVersionIdSubject$.asObservable().pipe(share());
  }

  private store: PebEditorStore;

  constructor(
    @Inject(OVERLAY_DATA) public data: OverlayData,
    @Inject(PEB_STORAGE_PATH) private storagePath: string,
    private api: PebEditorApi,
    private cdr: ChangeDetectorRef,
    private backgroundActivityService: BackgroundActivityService,
    private snackbarErrorService: SnackbarErrorService,
    private dialog: MatDialog,
  ) {
    super();
    this.store = data.data;
  }

  ngOnInit() {
    this.store.theme$.pipe(
      tap((theme) => {
        if (theme.name) {
          this.currentShopName$.next(theme.name);
          this.shopNameValue = theme.name;
        }
        if (theme.picture) {
          this.shopPicture = `${this.storagePath}${theme.picture}`;
        }
      }),
      takeUntil(this.destroyed$),
    ).subscribe();

    this.store.theme$.pipe(
      take(1),
      switchMap(theme => this.api.getShopThemeVersions(theme.id)),
      tap((versions) => {
        versions.sort((a: any, b: any) => {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
        this.isVersionsLoading = false;
        this.versions$.next(versions);
        this.cdr.detectChanges();
      }),
      takeUntil(this.destroyed$),
    ).subscribe();

    this.versions$.pipe(
        tap((versions) => {
          this.versionName = '0';
          versions.map((version) => {
            if (
                !isNaN(parseInt(version.name)) &&
                version.name.length < 10 &&
                (parseInt(version.name) >= parseInt(this.versionName))) {
              this.versionName = version.name;
            }
          });
          this.versionName = '' + (parseInt(this.versionName) + 1);
        }),
        takeUntil(this.destroyed$),
    ).subscribe();
  }

  onCreateVersion(name: string) {
    if (this.isVersionCreating) {
      return;
    }

    this.isVersionCreating = true;
    const homePage = Object.values(this.store.snapshot.pages).find(
      page => page.variant === 'front' && page.type !== 'master',
    );
    const homeMasterPage = Object.values(this.store.snapshot.pages).find(
      page => page.variant === 'front' && page.type === 'master',
    );

    if (!homePage) {
      this.dialog.open(ErrorDialogComponent, {
        position: {
          top: 'calc(50vh - 82px)',
          left: 'calc(50vw - 200px)',
        },
        data: {
          setBtnCaption: 'Set',
          cancelBtnCaption: 'Cancel',
          errorText: 'Oh no!',
          maintext: `Please select at least one page as homepage.`,
          setAction: () => {
            const activePage = this.store.snapshot.pages[this.store.lastActivePages.replica];
            const pagesPayload = this.getPagesPayload(true, activePage);
            const routingPayload = this.getRoutingPayload(pagesPayload);
            this.store.versionUpdatedSubject$.next(homeMasterPage ? false : true);

            this.store.updatePagesWithShopRouting(pagesPayload, routingPayload).pipe(
              switchMap(() => this.store.theme$),
              take(1),
              delay(200),
              switchMap(theme => this.api.createShopThemeVersion(theme.id, name)),
              tap((version: PebShopThemeVersionEntity) => {
                this.versionName = '';
                this.isVersionCreating = false;
                this.versions$.next([version, ...this.versions$.value.map(v => ({ ...v, isActive: false }))]);
              }),
              takeUntil(this.destroyed$),
            ).subscribe();
          },
          cancelAction: () => {
            this.versionName = '';
            this.isVersionCreating = false;
            this.cdr.detectChanges();
          },
        },
        height: '164px',
        maxWidth: '400px',
        width: '400px',
        panelClass: 'error-dialog',
      });
      return;
    }
    this.store.theme$.pipe(
      take(1),
      switchMap(theme => this.api.createShopThemeVersion(theme.id, name)),
      tap((version: PebShopThemeVersionEntity) => {
        this.versionName = '';
        this.isVersionCreating = false;
        this.versions$.next([version, ...this.versions$.value.map(v => ({ ...v, isActive: false }))]);
      }),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  private getPagesPayload(value: boolean, activePage: PebPageShort): Array<Partial<PebPageShort>> {
    const prevFrontPage = Object.values(this.store.snapshot.pages).find(page => page.variant === PebPageVariant.Front);

    return [
      ...(prevFrontPage ? [{
        ...prevFrontPage,
        variant: PebPageVariant.Default,
      }] : []),
      ...(value ? [{
        ...activePage,
        variant: PebPageVariant.Front,
      }] : []),
    ];
  }

  private getRoutingPayload(pages: Array<Partial<PebPageShort>>): PebShopRoute[] {
    return pages.map((page) => {
      const route = this.store.snapshot.shop.routing.find(r => r.pageId === page.id);
      return {
        ...route,
        url: page.variant === PebPageVariant.Front ? '/' : getPageUrlByName(page.name),
      };
    });
  }

  onSelectVersion(id: PebShopThemeVersionId) {
    this.versions$.next(
      this.versions$.value.map(version => ({
        ...version,
        isActive: version.id === id,
      })),
    );
    this.store.theme$.pipe(
      take(1),
      switchMap(theme => this.api.activateShopThemeVersion(theme.id, id)),
      switchMap(({ theme }) => forkJoin([
        this.api.getShopThemeById(theme),
        this.api.getSnapshot(theme),
      ])),
      tap(([theme, snapshot]) => this.store.openTheme(theme, snapshot, null)),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  onPublishVersion(id: PebShopThemeVersionId) {
    this.store.theme$.pipe(
      take(1),
      switchMap(theme => this.api.publishShopThemeVersion(theme.id, id)),
      tap(version => this.versions$.next(this.versions$.value.map((v) => {
        v.published = v.id === version.id;
        return v;
      }))),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  onDeleteVersion(id: PebShopThemeVersionId) {
    this.store.theme$.pipe(
      take(1),
      switchMap(theme => this.api.deleteShopThemeVersion(theme.id, id)),
      tap(() => this.versions$.next(this.versions$.value.filter(v => v.id !== id))),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  onChangeShopName() {
    const name = this.shopNameValue;
    this.currentShopName$.next(name);
    this.store.theme$.pipe(
      take(1),
      switchMap(() => this.store.updateThemeName(name)),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  onLogoUpload($event: Event) {
    const files = ($event.target as HTMLInputElement).files;
    if (files.length > 0) {
      this.isLoading = true;
      this.isLargeThenParent = false;
      const file = files[0];
      this.logoFileInput.nativeElement.value = '';

      this.api.uploadImageWithProgress(PebShopContainer.Builder, file, true).pipe(
        tap((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress: {
              this.uploadProgress = event.loaded;
              this.cdr.detectChanges();
              break;
            }
            case HttpEventType.Response: {
              this.shopPicture = `${this.storagePath}${event.body.blobName}`;
              this.isLoading = false;
              this.uploadProgress = 0;
              this.cdr.detectChanges();
              this.store.updateThemePreview(event.body.blobName).subscribe();
              break;
            }
            default: break;
          }
        }),
        takeUntil(this.destroyed$),
      ).subscribe();
    }
  }

  onLogoLoad() {
    const logo: HTMLImageElement = this.logoEl.nativeElement;
    const logoWrapper: HTMLImageElement = this.logoWrapperEl.nativeElement;
    this.isLargeThenParent = logo.width >= logoWrapper.clientWidth || logo.height >= logoWrapper.clientHeight;
  }
}

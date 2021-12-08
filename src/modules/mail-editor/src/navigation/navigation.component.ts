import {
  AfterViewInit, ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input, OnDestroy,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector, TemplatePortal } from '@angular/cdk/portal';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { delay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

import { toBlob } from '@pe/dom-to-image';
import {
  pebGenerateId,
  PebPageId,
  PebPageShort,
  PebPageType,
  PebPageVariant,
  PebShopContainer,
  PebShopImageResponse,
} from '@pe/builder-core';
import { PebEditorApi } from '@pe/builder-api';
import {
  OVERLAY_POSITIONS,
  PageSnapshot,
  PebEditorAbstractNavigation,
  PebEditorState,
  PebEditorStore,
} from '@pe/builder-editor';

import { OVERLAY_DATA } from '../toolbar';
import { PebMailEditorCreatePageDialogComponent } from './dialogs/create-page/create-page.dialog';

@Component({
  selector: 'peb-mail-editor-navigation',
  templateUrl: 'navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebEditorMailNavigationComponent implements PebEditorAbstractNavigation, AfterViewInit, OnDestroy {
  readonly pageType: typeof PebPageType = PebPageType;

  @Input() pages: PebPageShort[];

  @Input() activePageSnapshot: PageSnapshot;

  @Output() execCommand = new EventEmitter<any>();

  /* old code */
  @Input() set loading(loading: boolean) {
    this.loadingSubject$.next(loading);
  }
  @Input() set snapshot(pageSnapshot: PageSnapshot) {
    if (!pageSnapshot?.data?.preview || this.currentPageHasChanges(this.activePageSnapshot, pageSnapshot)) {
      this.previewShouldUpdate = true;
    }
    this.activePageSnapshot = pageSnapshot;
  }

  @ViewChild('pageMenu') pageMenu: TemplateRef<any>;

  contextMenuPage: PebPageShort;
  private overlayRef: OverlayRef;
  private previewShouldUpdate = false;

  private readonly loadingSubject$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject$.asObservable();

  skeletonPages = Array.from({ length: 6 });

  snapshotsForPreviews: {
    [id: string]: PageSnapshot,
  } = {};

  private destroyed$ = new Subject<boolean>();

  public cdr = this.injector.get(ChangeDetectorRef);
  public sanitizer = this.injector.get(DomSanitizer);
  private editorApi = this.injector.get(PebEditorApi);
  private editorState = this.injector.get(PebEditorState);
  private element = this.injector.get(ElementRef);
  private overlay = this.injector.get(Overlay);
  private renderer = this.injector.get(Renderer2);
  public store = this.injector.get(PebEditorStore);
  private viewContainerRef = this.injector.get(ViewContainerRef);

  constructor(
    private injector: Injector,
  ) {}

  ngAfterViewInit(): void {
    // Scroll to the new created page preview in Navigator sidebar pages.sidebar
    // TODO: Do
    // this.store.activePageId$
    //   .pipe(
    //     filter((activePageId) => !!activePageId),
    //     tap((pageId: PebPageId) => {
    //       if (this.pages && this.pages.map((page) => page.id).includes(pageId)) {
    //         this.scrollable.scrollToElement(`[id='${pageId}']`, {})
    //       }
    //     }),
    //     takeUntil(this.destroyed$),
    //   ).subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  getPageSnapshot(pageId: PebPageId): PageSnapshot {
    if (pageId === this.activePageSnapshot.id) {
      return this.activePageSnapshot;
    }
    return this.snapshotsForPreviews[pageId];
  }

  onSelect(selectedPage: PebPageShort) {
    // save current page id as previous page id before switch to selected page
    const previousPageId = this.activePageSnapshot.id;
    if (this.previewShouldUpdate) {
      this.snapshotsForPreviews[this.activePageSnapshot.id] = this.activePageSnapshot;
    }
    // switch current page to selected page asap for faster user experience
    // this.selected.emit(selectedPage);
    this.execCommand.next({ type: 'activatePage', params: selectedPage });
    // update previous page previw image
    if (this.previewShouldUpdate) {
      this.updatePagePreview(previousPageId);
      this.previewShouldUpdate = false;
    }
  }

  onCreate(element: HTMLElement) {
    // if (this.editorState.pagesView === PebPageType.Master) {
    //   this.createPage();
    // } else {
    this.createPageDialog(element);
    // }
  }

  private createPageDialog(connectTo: HTMLElement) {
    const masterPages = Object
      .values((this.store.snapshot as any).pages)
      .filter((page: any) => page.type === PebPageType.Master); // TODO: Set proper type

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(connectTo)
        .withFlexibleDimensions(false)
        .withViewportMargin(0)
        .withPositions(OVERLAY_POSITIONS),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: 'dialog-publish-panel',
      disposeOnNavigation: true,
      maxHeight: '700px',
    });
    const emitter: Subject<any> = new Subject();
    const emitter$: Observable<any> = emitter.asObservable();
    const injectionTokens = new WeakMap();
    injectionTokens.set(
      OVERLAY_DATA,
      {
        emitter,
        data: {
          pages: masterPages,
          label: this.editorState.pagesView === PebPageType.Master ? 'Add a Master Page' : 'Add a Page',
        },
      });
    const injector = new PortalInjector(this.injector, injectionTokens);
    const portal = new ComponentPortal(PebMailEditorCreatePageDialogComponent, null, injector);

    this.overlayRef.attach(portal);
    this.overlayRef.backdropClick().pipe(tap(() => this.detachOverlay())).subscribe();

    emitter$.pipe(
      tap(() => this.detachOverlay()),
      tap(selectedMaster => this.createPage(selectedMaster)),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  createPage(selectedMaster?: PebPageShort) {
    this.closeContextMenu();
    this.execCommand.next({ type: 'createPage', params: {
      type: this.editorState.pagesView,
      masterId: selectedMaster?.id,
    }});
  }

  forkPage(selectedMaster?: PebPageShort) {
    this.closeContextMenu();
    this.execCommand.next({ type: 'createPage', params: {
      type: PebPageType.Replica,
      masterId: selectedMaster?.id,
    }});
    this.editorState.pagesView = PebPageType.Replica;
  }

  deletePage(page: PebPageShort) {
    if (this.isDeleteDisabled(page)) {
      return;
    }
    this.closeContextMenu();
    this.execCommand.next({ type: 'deletePage', params: page });
  }

  isDeleteDisabled(page: PebPageShort): boolean {
    return page.variant === PebPageVariant.Front || (page.type === PebPageType.Replica && this.pages.length === 1);
  }

  isPageRemovable(page: PebPageShort): boolean {
    if (page.type !== this.pageType.Master) {
      return true;
    }

    const isMasterPageReplicated = Object.keys(this.store.snapshot.pages).some((pageId) => {
      const innerPage = this.store.snapshot.pages[pageId];
      return innerPage.master != null && innerPage.master.id === page.id;
    });

    return !isMasterPageReplicated;
  }

  duplicatePage(page: PebPageShort) {
    this.closeContextMenu();
    this.execCommand.next({ type: 'duplicatePage', params: page });
  }

  openContextMenu(evt: MouseEvent, page: PebPageShort) {
    this.closeContextMenu();
    if ((window as any).PEB_CONTEXT_MENUS_DISABLED) {
      console.warn('Context menus are disabled.\nActivate them by setting "PEB_CONTEXT_MENUS_DISABLED = false"');
      return;
    }

    evt.preventDefault();
    evt.stopPropagation();

    this.contextMenuPage = page;

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(evt)
        .withFlexibleDimensions(false)
        .withViewportMargin(10)
        .withPositions(OVERLAY_POSITIONS),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
    });

    this.overlayRef.backdropClick().pipe(
      tap(() => this.overlayRef.dispose()),
    ).subscribe();

    this.overlayRef.attach(new TemplatePortal(this.pageMenu, this.viewContainerRef));
  }

  closeContextMenu() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  private detachOverlay(): void {
    if (this.hasOverlayAttached()) {
      this.overlayRef.detach();
    }
  }

  private hasOverlayAttached(): boolean {
    return this.overlayRef && this.overlayRef.hasAttached();
  }

  private updatePagePreview(pageId: PebPageId) {
    const pagePreviewElement = this.element.nativeElement.querySelector(`.page[id="${pageId}"] .page__preview`);
    const rendererEl = pagePreviewElement.querySelector(`peb-renderer`);
    const pageDOM = rendererEl.shadowRoot.querySelector('peb-element-document').cloneNode(true);

    this.getDOMScreenshot(pageDOM, pagePreviewElement.clientWidth, pagePreviewElement.clientHeight).pipe(
      switchMap((blob) => {
        return this.editorApi.uploadImage(
          PebShopContainer.Images,
          new File([blob], `builder-page-preview-${pebGenerateId()}`),
        );
      }),
      switchMap((image: PebShopImageResponse) => {
        return this.store.updatePage(
          this.pages.find(page => page.id === pageId),
          { data: { preview: image.blobName } },
        );
      }),
      tap(() => this.cdr.detectChanges()),
      delay(500),
      tap(() => {
        if (pageId !== this.activePageSnapshot.id) {
          delete this.snapshotsForPreviews[pageId];
        }
      }),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  private getDOMScreenshot(DOM: Node, width: number, height: number): Observable<Blob> {
    // TODO move it to dom-to-image library
    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'position', 'absolute');
    this.renderer.setStyle(wrapper, 'width', `${width}px`);
    this.renderer.setStyle(wrapper, 'height', `${height}px`);
    this.renderer.setStyle(wrapper, 'top', `-${height}px`);
    this.renderer.setStyle(wrapper, 'overflow', 'hidden');
    this.renderer.appendChild(wrapper, DOM);
    this.renderer.setStyle(DOM, 'width', '100%');
    this.renderer.setStyle(DOM, 'height', '100%');
    this.renderer.appendChild(document.body, wrapper);
    return from(toBlob(DOM as HTMLElement, {
      width,
      height,
      cacheBust: true,
      skipFonts: true,
    }).then((blob: Blob) => {
      this.renderer.removeChild(document.body, wrapper);
      return blob;
    }).catch(() => {
      this.renderer.removeChild(document.body, wrapper);
      return null;
    })) as Observable<Blob>;
  }

  private currentPageHasChanges(currentSnapshot: PageSnapshot, comingSnapshot: PageSnapshot): boolean {
    return false;
    // return currentSnapshot &&
    //   currentSnapshot.id === comingSnapshot.id &&
    //   currentSnapshot?.lastActionId !== comingSnapshot?.lastActionId;
  }
}

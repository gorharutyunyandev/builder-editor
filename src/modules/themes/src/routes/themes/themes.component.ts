import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { BehaviorSubject, combineLatest, EMPTY, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, pluck, shareReplay, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { MessageBus, PebEnvService, PebShopThemeEntity, PebTranslateService } from '@pe/builder-core';
import { PebEditorApi, PebThemesApi, PEB_STORAGE_PATH } from '@pe/builder-api';
import { PebViewerPreviewDialog } from '@pe/builder-viewer';
import {
  PeDataGridAdditionalFilter,
  PeDataGridFilter,
  PeDataGridFilterItem,
  PeDataGridItem,
  PeDataGridListOptions,
  PeDataGridMultipleSelectedAction,
  PeDataGridSingleSelectedAction,
} from '@pe/data-grid';

import { AbstractComponent } from '../../abstract/abstract.component';
import { PebThemesSnackbarComponent } from '../../components/snackbar/snackbar.component';

/**
 * my themes - current shop themes
 * application themes - system themes templates
 */
enum ThemesType {
  Application = 'application',
  My = 'my',
}

@Component({
  selector: 'peb-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebThemesComponent extends AbstractComponent {
  @Input() useInstantInstall = false;
  @Output() installed = new EventEmitter<string>();

  themesTypeSubject = new BehaviorSubject<ThemesType>(ThemesType.Application);
  filters: PeDataGridFilter[];
  dataGridListOptions: PeDataGridListOptions;
  showCollectionsCountInHeader = true;

  private readonly selectedThemesSubject$ = new BehaviorSubject<string[]>([]);
  selectedThemes$ = this.selectedThemesSubject$.asObservable();

  private readonly installingThemeIdSubject$ = new BehaviorSubject(null);
  installingThemeId$ = this.installingThemeIdSubject$.asObservable();

  set selectedThemes(ids: string[]) {
    this.selectedThemesSubject$.next(ids);
  }
  get selectedThemes() {
    return this.selectedThemesSubject$.value;
  }

  activeThemeId$ = new BehaviorSubject<string>(null);

  private readonly selectedFiltersSubject$ = new BehaviorSubject<PeDataGridFilterItem[]>([]);
  selectedFilters$ = this.selectedFiltersSubject$.asObservable();
  set selectedFilters(filters: PeDataGridFilterItem[]) {
    this.selectedFiltersSubject$.next(filters);
  }

  private readonly searchStringSubject$ = new BehaviorSubject<string>(null);
  searchString$ = this.searchStringSubject$.asObservable();
  set searchString(searchString: string) {
    this.searchStringSubject$.next(searchString);
  }

  themes$: Observable<PeDataGridItem[]> = this.themesTypeSubject.asObservable().pipe(
    tap(() => {
      this.selectedThemes = [];
    }),
    switchMap((type: ThemesType) => {
      if (type === ThemesType.My) {
        return this.themesApi.getThemesList().pipe(map(themes => themes.map(theme => theme.theme).reverse()));
      }
      return this.themesApi.getTemplateThemes().pipe(
        tap((templates: any) => {
          if (!this.filters) {
            this.filters = [
              this.ownThemesFilter,
              ...templates.map(category => {
                return {
                  title: this.translateService.translate(`${this.categoryTranslationKey + category.code}`),
                  icon: category.icon,
                  items: category.items.map(subCategory => {
                    return {
                      title: this.translateService.translate(`${this.industryTranslationKey + subCategory.code}`),
                      key: subCategory.id,
                    };
                  }),
                };
              }),
            ];
          }
        }),
        switchMap((templates: any) => {
          return combineLatest([this.selectedFilters$, this.searchString$]).pipe(
            map(([selectedFilters, searchString]) => {
              return this.getFilteredTemplates(templates, selectedFilters, searchString);
            }),
          );
        }),
      );
    }),
    map(themes =>
      themes.map(t => ({
        ...t,
        image: `${this.storagePath}${t.picture}`,
        title: t.name,
        customField1: t.category ? this.translateService.translate(`${this.industryTranslationKey + t.category}`) : '',
        labels: t.isActive || t.id === this.activeThemeId$.value ? ['INSTALLED'] : [],
        actions: [
          {
            label: 'Preview',
            callback: (themeId: string) => {
              this.onOpenPreview(themeId);
            },
          },
          {
            label: 'Install',
            callback: (themeId: string) => {
              this.onInstall(themeId);
            },
            isLoading$: this.installingThemeId$.pipe(map(id => id === t.id)),
          },
        ],
      })),
    ),
    tap(themes => {
      // TODO(@vberezin): Fix typing
      if (this.themesTypeSubject.value === ThemesType.My) {
        this.dataGridListOptions = {
          nameTitle: 'Theme',
          customField1Title: 'Industry',
          conditionTitle: 'Condition',
        } as any;
        this.showCollectionsCountInHeader = false;
      } else {
        this.dataGridListOptions = {
          nameTitle: 'Theme',
          descriptionTitle: 'Description',
          customField1Title: 'Industry',
          conditionTitle: 'Condition',
        } as any;
        this.showCollectionsCountInHeader = true;
      }
    }),
    shareReplay(1),
  );

  multipleSelectedActions$: Observable<PeDataGridMultipleSelectedAction[]> = this.themesTypeSubject.asObservable().pipe(
    map((type: ThemesType) => {
      if (type === ThemesType.My) {
        return [
          {
            label: 'Delete',
            callback: () => this.onDelete(this.selectedThemes),
          },
        ];
      }
      return [];
    }),
    map((onlyOwnThemesActions: PeDataGridMultipleSelectedAction[]) => {
      return ([
        {
          label: 'Select all',
          callback: () => {
            this.themes$
              .pipe(
                take(1),
                tap((themes: any) => {
                  this.selectedThemes = themes.map((t: any) => t.id);
                }),
              )
              .subscribe();
          },
        },
        {
          label: 'Deselect all',
          callback: () => (this.selectedThemes = []),
        },
        {
          label: 'Duplicate',
          callback: () => this.onDuplicate(this.selectedThemes[0]),
          onlyForSingleItem: true,
        },
      ] as PeDataGridMultipleSelectedAction[]).concat(onlyOwnThemesActions);
    }),
  );

  ownThemesFilter: PeDataGridAdditionalFilter = {
    label: 'My Themes',
    allItemsLabel: 'All Themes',
    labelCallback: () => {
      if (this.themesTypeSubject.value !== ThemesType.My) {
        this.themesTypeSubject.next(ThemesType.My);
      }
    },
    allItemsLabelCallback: () => {
      if (this.themesTypeSubject.value !== ThemesType.Application) {
        this.themesTypeSubject.next(ThemesType.Application);
      }
    },
  };

  private readonly categoryTranslationKey = 'assets.product.';
  private readonly industryTranslationKey = 'assets.industry.';

  constructor(
    @Inject(PEB_STORAGE_PATH) private storagePath: string,
    @Inject('PEB_ENTITY_NAME') private entityName: string,
    private themesApi: PebThemesApi,
    private editorApi: PebEditorApi,
    private envService: PebEnvService,
    private dialog: MatDialog,
    private messageBus: MessageBus,
    private snackBar: MatSnackBar,
    private translateService: PebTranslateService,
  ) {
    super();
    this.editorApi
      .getShopActiveTheme(this.envService.shopId)
      .pipe(map(result => (result ? result.id : null)))
      .pipe(take(1))
      .subscribe(theme => this.activeThemeId$.next(theme));
  }

  onSelectedItemsChanged(items: string[]) {
    this.selectedThemes = items;
  }

  onFiltersChanged(filters: PeDataGridFilterItem[]): void {
    this.selectedFilters = filters;
  }

  onSearchChanged(searchString: string) {
    this.searchString = searchString;
  }

  navbarTitle(): Observable<string> {
    return this.themes$.pipe(
      map(themes => {
        const count = themes.length;
        return `${count} theme${count === 1 ? '' : 's'}`;
      }),
    );
  }

  private onInstall(themeId: string) {
    this.installingThemeIdSubject$.next(themeId);

    this.installTemplateTheme(themeId)
      .pipe(
        tap(() => {
          this.installingThemeIdSubject$.next(null);
          this.activeThemeId$.next(themeId);
          this.messageBus.emit(`${this.entityName}.theme.installed`, themeId);
          this.installed.emit(themeId);
          this.themesTypeSubject.next(this.themesTypeSubject.value);
          this.openSnackbar('Theme successfully installed', true)
            .afterDismissed()
            .pipe(
              tap(() => {
                this.messageBus.emit(`${this.entityName}.open-builder`, null);
              }),
              takeUntil(this.destroyed$),
            )
            .subscribe();
        }),
        catchError((error: HttpErrorResponse) => {
          this.installingThemeIdSubject$.next(null);
          this.openSnackbar(error.error?.message || error.message, true);
          return of(error);
        }),
        takeUntil(this.destroyed$),
      )
      .subscribe();
  }

  testOnInstall(themeId: string) {
    this.onInstall(themeId);
  }

  private onDuplicate(themeId: string) {
    this.themesApi
      .duplicateTemplateTheme(themeId)
      .pipe(
        tap(() => {
          this.themesTypeSubject.next(this.themesTypeSubject.value);
          this.openSnackbar('Theme successfully duplicated', true);
        }),
        takeUntil(this.destroyed$),
      )
      .subscribe();
  }

  testOnDuplicate(themeId: string) {
    this.onDuplicate(themeId);
  }

  private onDelete(themeIds: string[]) {
    forkJoin(themeIds.map(themeId => this.themesApi.deleteTemplateTheme(themeId)))
      .pipe(
        tap(() => {
          this.themesTypeSubject.next(this.themesTypeSubject.value);
          this.openSnackbar('Theme successfully deleted', true);
        }),
        catchError(() => {
          this.openSnackbar('Cannot delete theme', false);
          return EMPTY;
        }),
        takeUntil(this.destroyed$),
      )
      .subscribe();
  }

  testOnDelete(themeIds: string[]) {
    return this.onDelete(themeIds);
  }

  private async onOpenPreview(themeId: string) {
    const themeSnapshot = await this.themesApi.getThemeById(themeId).pipe(pluck('source', 'snapshot')).toPromise();

    this.dialog.open(PebViewerPreviewDialog, {
      position: {
        top: '0',
        left: '0',
      },
      height: '100vh',
      maxWidth: '100vw',
      width: '100vw',
      panelClass: 'themes-preview-dialog',
      data: {
        themeSnapshot,
      },
    });
  }

  async testOnOpenPreview(themeId: string) {
    this.onOpenPreview(themeId);
  }

  private getFilteredTemplates(templates, selectedFilters, searchString) {
    const subCategories = templates
      .map(category => {
        return category.items;
      })
      .reduce((acc, actual) => acc.concat(...actual), []);
    const searchRegexp = new RegExp(searchString, 'i');

    const themeCategories =
      !selectedFilters || selectedFilters.length === 0
        ? subCategories
        : subCategories.filter(subCategory => {
            return !!selectedFilters.find(filter => filter.key === subCategory.id);
          });

    return themeCategories
      .map(subCategory => {
        return searchString
          ? subCategory.themes
              .filter(theme => searchRegexp.test(theme.name))
              .map(theme => {
                theme.category = subCategory.code;
                return theme;
              })
          : subCategory.themes.map(theme => {
              theme.category = subCategory.code;
              return theme;
            });
      })
      .reduce((acc, actual) => acc.concat(...actual), [])
      .filter((theme, i, array) => {
        return array.findIndex(item => item.id === theme.id) === i;
      });
  }

  testGetFilteredTemplates(templates, selectedFilters, searchString) {
    return this.getFilteredTemplates(templates, selectedFilters, searchString);
  }

  private installTemplateTheme(themeId: string): Observable<PebShopThemeEntity> {
    return this.themesTypeSubject.value === ThemesType.Application
      ? this.themesApi.instantInstallTemplateTheme(themeId)
      : this.themesApi.switchTemplateTheme(themeId);
  }

  testInstallTemplateTheme(themeId: string): Observable<PebShopThemeEntity> {
    return this.installTemplateTheme(themeId);
  }

  private openSnackbar(text: string, success: boolean): MatSnackBarRef<any> {
    return this.snackBar.openFromComponent(PebThemesSnackbarComponent, {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: 'mat-snackbar-shop-panel-class',
      data: {
        text,
        icon: success ? '#icon-snackbar-success' : '#icon-snackbar-error',
      },
    });
  }

  testOpenSnackbar(text: string, success: boolean): MatSnackBarRef<any> {
    return this.openSnackbar(text, success);
  }
}

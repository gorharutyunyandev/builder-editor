import { Inject, Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';

import { pebCreateLogger, pebGenerateId, PebPageSeo, PebPageShort, PebShopRoute } from '@pe/builder-core';
import {
  AfterGlobalInit,
  EditorSidebarTypes,
  PebAbstractEditor,
  PebActionType,
  pebCreateAction,
  PebEditorAccessorService,
  PebEditorSlot,
  PebEditorStore,
  PEB_EDITOR_STATE,
} from '@pe/builder-editor';

import { PebEditorMailSeoSidebarComponent } from './seo.sidebar';
import { PebMailEditorState } from '../../../mail-editor.state';

const log = pebCreateLogger('mail-editor:plugins:seo');

@Injectable()
export class PebEditorMailSeoPlugin implements AfterGlobalInit {

  get editor(): PebAbstractEditor {
    return this.editorAccessorService.editorComponent;
  }

  constructor(
    private editorAccessorService: PebEditorAccessorService,
    private store: PebEditorStore,
    @Inject(PEB_EDITOR_STATE) private state: PebMailEditorState,
  ) {}

  get activePage(): PebPageShort {
    const snapshot = this.store.snapshot;
    return snapshot.pages[this.store.activePageId];
  }

  afterGlobalInit(): Observable<any> {
    return this.editor.commands$.pipe(
      filter(command => command.type === 'toggleSeoSidebar' && !this.state.seoSidebarOpened),
      switchMap(() => {
        log('open sidebar');
        let returnPrevSelection = false;
        const prevSelected = this.state.selectedElements;

        this.state.seoSidebarOpened = true;

        this.state.hoveredElement = null;
        this.state.selectedElements = [];

        const snapshot = this.store.snapshot;
        const activePage = snapshot.pages[this.store.activePageId];

        const sidebarCmpRef = this.editor.insertToSlot(PebEditorMailSeoSidebarComponent, PebEditorSlot.sidebar);
        sidebarCmpRef.instance.page = activePage;
        sidebarCmpRef.instance.routing = snapshot.shop.routing;
        const pageRoute = snapshot.shop.routing.find(route => route.pageId === activePage.id);
        sidebarCmpRef.instance.url = pageRoute ? pageRoute.url : '';

        this.state.sidebarsActivity[EditorSidebarTypes.Inspector] = true;

        return this.trackSidebarChanges(sidebarCmpRef.instance).pipe(
          takeUntil(
            merge(
              this.editor.commands$.pipe(
                filter(command => command.type === 'toggleSeoSidebar' && this.state.seoSidebarOpened),
                tap(() =>
                  returnPrevSelection = true,
                ),
              ),
              this.editor.commands$.pipe(
                filter(command => command.type === 'createPage'),
              ),
              this.state.selectedElements$.pipe(
                filter(els => els.length > 0),
              ),
            ),
          ),
          finalize(() => {
            log('close sidebar');
            if (!this.state.selectedElements.length) {
              // this.state.sidebarsActivity[EditorSidebarTypes.Inspector] = false;
            }
            sidebarCmpRef.destroy();

            if (returnPrevSelection) {
              this.state.selectedElements = prevSelected;
            }
            this.state.seoSidebarOpened = false;
          }),
        );
      }),
    );
  }

  trackSidebarChanges(sidebar: PebEditorMailSeoSidebarComponent): Observable<any> {

    return merge(
      sidebar.changeTitle.pipe(
        switchMap((value: any) => {
          return this.store.updatePage(this.activePage, value);
        })),
      sidebar.changeUrl.pipe(
        switchMap((url: string) => {
          const activePage = this.activePage;
          const route = this.store.snapshot.shop.routing.find(r => r.pageId === activePage.id);
          const routing: PebShopRoute[] = [{
            ...route,
            url,
            pageId: activePage.id,
            routeId: route?.routeId ?? pebGenerateId(),
          }];
          return this.store.updateShopThemeRouting(routing);
        })),
      sidebar.changeDescription.pipe(
        switchMap((description: string) => this.updateSeo({ description }))),
      sidebar.changeShowInSearchResults.pipe(
        switchMap((showInSearchResults: boolean) => this.updateSeo({ showInSearchResults }))),
      sidebar.changeCanonicalUrl.pipe(
        switchMap((canonicalUrl: string) => this.updateSeo({ canonicalUrl }))),
      sidebar.changeMarkupData.pipe(
        switchMap((markupData: string) => this.updateSeo({ markupData }))),
      sidebar.changeCustomMetaTags.pipe(
        switchMap((customMetaTags: string) => this.updateSeo({ customMetaTags }))),
    );
  }

  private updateSeo(seoChanges: Partial<PebPageSeo>) {
    const activePage = this.activePage;
    const updateAction = pebCreateAction(
      PebActionType.UpdatePageData,
      {
        ...activePage,
        data: {
          ...activePage.data,
          seo: {
            ...(activePage.data?.seo ?? {
              description: null,
              showInSearchResults: null,
              canonicalUrl: null,
              markupData: null,
              customMetaTags: null,
            }),
            ...seoChanges,
          },
        },
      },
    );

    return this.store.commitAction(updateAction);
  }
}

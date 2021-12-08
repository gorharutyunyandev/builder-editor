import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { distinctUntilChanged, filter, finalize, map, repeat, switchMap, take, takeUntil } from 'rxjs/operators';
import { isEqual } from 'lodash';

import {
  getPageUrlByName,
  pebCreateLogger,
  PebElementId,
  PebPageShort,
  PebPageVariant,
  PebShopRoute,
} from '@pe/builder-core';
import { AbstractEditElementPlugin, AfterGlobalInit, PebEditorElement, } from '@pe/builder-editor';

import { PebEditorPageSidebarComponent } from './page.sidebar';

const log = pebCreateLogger('editor:plugin:page');

@Injectable()
export class PebEditorPagePlugin
  extends AbstractEditElementPlugin<PebEditorPageSidebarComponent>
  implements AfterGlobalInit
{
  sidebarComponent = PebEditorPageSidebarComponent;

  logger = { log };

  afterGlobalInit(): Observable<any> {
    return this.store.activePageId$.pipe(
      switchMap(() => {
        return this.state.selectedElements$.pipe(
          distinctUntilChanged(isEqual),
          filter((selectedIds: PebElementId[]) => {
            const activePage = this.store.snapshot.pages[this.store.activePageId];

            if (!activePage) {
              return false;
            }

            const documentId = this.store.snapshot.templates[activePage.templateId].id;
            return !selectedIds.length || selectedIds.includes(documentId);
          }),
        );
      }),
      switchMap((res) => {
        const snapshot = this.store.snapshot;
        const activePage = snapshot.pages[this.store.activePageId];
        const documentEl: PebEditorElement = this.renderer.getElementComponent(
          snapshot.templates[activePage.templateId].id,
        );
        if (!documentEl) {
          // This element hasn't rendered yet
          return this.renderer.rendered.pipe(
            map(() => this.renderer.getElementComponent(snapshot.templates[activePage.templateId].id)),
            filter(Boolean),
            // filter((documentElement: PebAbstractElement) => !!documentElement),
            take(1),
            switchMap(documentElement => this.openPageSidebar(activePage, snapshot, documentElement)),
          );
        }

        return this.openPageSidebar(activePage, snapshot, documentEl);
      }),
      repeat(),
    );
  }

  private openPageSidebar(activePage: PebPageShort, snapshot, documentEl): Observable<any> {
    const sidebarCmpRef = this.editor.openSidebar(this.sidebarComponent);
    this.initBackgroundForm(documentEl);

    sidebarCmpRef.instance.page = activePage;
    sidebarCmpRef.instance.shop = snapshot.shop;
    sidebarCmpRef.instance.styles = documentEl.styles;
    sidebarCmpRef.changeDetectorRef.detectChanges();
    sidebarCmpRef.instance.component = documentEl;

    return merge(
      this.trackSidebarChanges(activePage, documentEl, sidebarCmpRef.instance),
      this.handleBackgroundForm(documentEl, sidebarCmpRef),
    )
      .pipe(
      takeUntil(
        this.state.selectedElements$.pipe(
          filter(els => els.length > 0 && !els.includes(documentEl?.definition.id)),
        ),
      ),
      finalize(() => {
        sidebarCmpRef.destroy();
      }),
    );
  }

  trackSidebarChanges(
    activePage: PebPageShort,
    documentEl: PebEditorElement,
    sidebar: PebEditorPageSidebarComponent,
  ): Observable<any> {
    return merge(
      sidebar.changePageName.pipe(
        filter((value: string) => value && activePage.name !== value),
        switchMap((value: string) => this.store.updatePage(activePage, { name: value })),
      ),

      sidebar.changePageType.pipe(
        switchMap(({ value }) => this.store.updatePage(activePage, { variant: value })),
      ),

      sidebar.changeRootPage.pipe(
        switchMap((value: boolean) => {
          const pagesPayload = this.getPagesPayload(value, activePage);
          const routingPayload = this.getRoutingPayload(pagesPayload);
          return this.store.updatePagesWithShopRouting(pagesPayload, routingPayload);
        }),
      ),
      // TODO(@nastya): Refactor sidebar - move common code of background style
      sidebar.changeBgImage.pipe(
        switchMap((value: string) => {
          documentEl.styles.backgroundColor = '';
          documentEl.styles.backgroundImage = value;

          return this.store.updateStyles(this.state.screen, {
            [documentEl.definition.id]: { backgroundImage: value, backgroundColor: '' },
          });
        }),
      ),
    );
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
}

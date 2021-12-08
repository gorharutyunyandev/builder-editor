import { ComponentRef, Inject, Injectable, Injector } from '@angular/core';
import { distinctUntilChanged, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

import {
  applyIdsMapForPage,
  generateUniqueIdsForPage,
  PebAction,
  PebMasterElementIdMap,
  PebPage,
  PebPageId,
  PebPageShort,
  PebPageType,
} from '@pe/builder-core';
import {
  AfterGlobalInit,
  extractPageFromSnapshot,
  PebActionType,
  pebCreateAction,
  PebEditorAccessorService,
  PebEditorSlot,
  PebEditorState,
  PebEditorStore,
  PebInitPageIds,
  PEB_EDITOR_STATE,
} from '@pe/builder-editor';

import { PebEditorMasterChangesBannerComponent } from './master-changes-banner/master-changes-banner.component';
import { ShopEditorSidebarTypes } from '../../../shop-editor.state';

interface PluginState {
  masterPage: PebPageShort;
  banner: ComponentRef<PebEditorMasterChangesBannerComponent>;
  notUpdatedForks: PebPageShort[];
}

@Injectable()
export class PebEditorShopMasterPageChangesPlugin implements AfterGlobalInit {

  private get editor() {
    return this.editorAccessorService.editorComponent;
  }

  constructor(
    private store: PebEditorStore,
    @Inject(PEB_EDITOR_STATE) protected state: PebEditorState,
    private editorAccessorService: PebEditorAccessorService,
  ) { }

  afterGlobalInit() {
    return this.store.activePageId$.pipe(
      distinctUntilChanged(),
      filter(Boolean),
      switchMap((activePageId: PebPageId) => {
        const currentPage: PebPageShort = this.store.snapshot.pages[activePageId];

        if (!currentPage || currentPage.type !== PebPageType.Master) {
          return EMPTY;
        }

        const pluginState: PluginState = {
          masterPage: currentPage,
          banner: this.editor.insertToSlot(
            PebEditorMasterChangesBannerComponent,
            PebEditorSlot.contentContainer,
          ),
          notUpdatedForks: [],
        };

        pluginState.banner.instance.loading = false;
        pluginState.banner.instance.pageName = currentPage.name;
        pluginState.banner.changeDetectorRef.detectChanges();



        return pluginState.banner.instance.apply.pipe(
          map(() => {
            const updatedMasterPage: PebPageShort = this.store.snapshot.pages[currentPage.id];
            const forks: PebPageShort[] =
              Object.values(this.store.snapshot.pages).filter(p => p.master?.id === updatedMasterPage.id);
            const notUpdatedForks = forks.filter(fork => fork.master.lastActionId !== updatedMasterPage.lastActionId);
            pluginState.notUpdatedForks = notUpdatedForks;

            return notUpdatedForks;
          }),
          switchMap(() => this.applyChanges(pluginState)),
          takeUntil(this.store.activePageId$.pipe(filter(nextPageId => nextPageId !== pluginState.masterPage.id))),
          finalize(() => pluginState.banner?.destroy()),
        );
      }),
    );
  }

  private applyChanges({ masterPage, banner, notUpdatedForks }: PluginState) {
    banner.instance.loading = true;
    banner.changeDetectorRef.detectChanges();

    if (!notUpdatedForks || !notUpdatedForks.length) {
      return this.closeMasterPages({ masterPage, banner, notUpdatedForks });
    }

    const nextInitActions: PebAction[] = notUpdatedForks.reduce(
      (acc, page) => [...acc, this.getNextInitAction(page)], [],
    );

    return this.store.updateReplicas(nextInitActions).pipe(
      tap(snapshot => this.store.snapshot = snapshot),
      switchMap(() => this.closeMasterPages({ masterPage, banner, notUpdatedForks })),
    );
  }

  private closeMasterPages({ notUpdatedForks }: PluginState) {
    this.state.hoveredElement = null;
    this.state.selectedElements = [];
    this.state.sidebarsActivity[ShopEditorSidebarTypes.EditMasterPages] = false;
    this.state.pagesView = PebPageType.Replica;
    return this.store.activatePage(
      notUpdatedForks[0]?.id
      ?? Object.values(this.store.snapshot.pages).find(p => p.type === PebPageType.Replica)?.id,
    );
  }

  private getNextInitAction(page: PebPageShort): PebAction {
    const { templateId, stylesheetIds, contextId, master } = page;
    const routeId = this.store.snapshot.shop.routing.find(r => r.pageId === page.id).routeId;

    const ids: PebInitPageIds = {
      templateId,
      stylesheetIds,
      contextId,
      routeId,
      pageId: page.id,
    };

    const masterPageSource: PebPage = extractPageFromSnapshot(this.store.snapshot, master.id);

    const updatedIdsMap: PebMasterElementIdMap = generateUniqueIdsForPage(masterPageSource);

    const idsMap: PebMasterElementIdMap = { ...updatedIdsMap, ...master.idsMap };

    const masterPageWithAppliedIds = applyIdsMapForPage(masterPageSource, idsMap);

    return pebCreateAction(
      PebActionType.CreatePageWithIds,
      {
        ids,
        page: {
          ...masterPageWithAppliedIds,
          type: PebPageType.Replica,
          master: {
            ...master,
            idsMap,
            lastActionId: masterPageSource.lastActionId,
          },
        },
      },
    );
  }
}

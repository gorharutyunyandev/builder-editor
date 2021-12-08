import { Inject, Injectable, Injector } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { debounceTime, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { pebCreateLogger, PebElementType } from '@pe/builder-core';
import { AbstractEditElementPlugin, AfterGlobalInit, PebEditorElement } from '@pe/builder-editor';

import { PebEditorProductDetailsSidebarComponent } from './product-details.sidebar';

const log = pebCreateLogger('shop-editor:plugins:edit-product-details');

@Injectable()
export class PebEditorShopProductDetailsPlugin
  extends AbstractEditElementPlugin<PebEditorProductDetailsSidebarComponent> implements AfterGlobalInit {

  logger = { log };

  sidebarComponent = PebEditorProductDetailsSidebarComponent;

  afterGlobalInit(): Observable<PebEditorElement> {
    const productPageFocused$ = this.state.selectedElements$.pipe(
      map((selectedIds) => {
        if (selectedIds.length !== 1) {
          return false;
        }

        const element = this.renderer.getElementComponent(selectedIds[0]);

        if (!element) {
          return false;
        }

        return element.definition.type === 'shop-product-details' as PebElementType
          ? element
          : false;
      }),
    );

    return productPageFocused$.pipe(
      filter(Boolean),
      switchMap((element: PebEditorElement) => {
        const sidebarCmpRef = this.editor.openSidebar(this.sidebarComponent);
        sidebarCmpRef.instance.component = element;
        sidebarCmpRef.instance.element = element.definition;
        sidebarCmpRef.instance.styles = element.styles;
        sidebarCmpRef.changeDetectorRef.detectChanges();

        this.initBackgroundForm(element);

        this.initAlignmentForm(sidebarCmpRef);

        return merge(
          this.handleAlignmentForm(element, sidebarCmpRef),
          this.editFlow(element, sidebarCmpRef.instance),
          this.handleBackgroundForm(element, sidebarCmpRef),
        )
          .pipe(
          takeUntil(productPageFocused$.pipe(filter(v => !v))),
          finalize(() => {
            sidebarCmpRef.destroy();
          }),
        );
      }),
    );
  }

  editFlow(
    element: PebEditorElement,
    sidebar: PebEditorProductDetailsSidebarComponent,
  ): Observable<any> {
    return merge(
      sidebar.changeStyle.pipe(
        tap((style) => {
          element.styles = { ...element.styles, ...style };
          sidebar.styles = element.styles;
        }),
        debounceTime(500),
        switchMap(() => {
          return this.store.updateStyles(this.state.screen, {
            [element.definition.id]: element.styles,
          });
        }),
      ),
    );
  }
}

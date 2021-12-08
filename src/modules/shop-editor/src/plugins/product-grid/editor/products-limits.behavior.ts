import { Inject, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EMPTY, merge, Observable } from 'rxjs';
import { pairwise, startWith, tap } from 'rxjs/operators';

import {  DimensionsFormValues, PebEditorStore, PEB_EDITOR_STATE } from '@pe/builder-editor';

import { PebShopEditorState } from '../../../shop-editor.state';
import { PebEditorProductsSidebarComponent } from './products.sidebar';
import { ProductUtils } from './products.utils';
import { PebEditorElementProduct } from './products.plugin';

@Injectable({ providedIn: 'any' })
export class ProductsLimitsBehavior {
  constructor(
    private formBuilder: FormBuilder,
    private store: PebEditorStore,
    private productUtils: ProductUtils,
    @Inject(PEB_EDITOR_STATE) private state: PebShopEditorState,
  ) { }

  initProductLimits(elCmp: PebEditorElementProduct, sidebar: PebEditorProductsSidebarComponent) {

    const productDimensions = elCmp.productDimensions;
    const productGaps = elCmp.productGaps;
    const position = elCmp.position;

    let blockWidth = 1024;
    switch (this.state.screen.toString()) {
      case 'desktop':blockWidth = 1024; break;
      case 'tablet': blockWidth = 768; break;
      case 'mobile': blockWidth = 360; break;
    }

    // W=n*Cw+(n-1)*Gw

    const columnsCount = sidebar.form.get('template').get('columns').value;
    sidebar.maxCol = Math.floor((blockWidth - position.form.value.x) / (productDimensions?.form.value.width
      +  productGaps?.form.value.columnGap));
    sidebar.maxColGap =
      Math.floor(((blockWidth - position.form.value.x) - (columnsCount
        * productDimensions?.form.value.width))
                   / (columnsCount - 1));
    sidebar.maxCardWidth =
      Math.floor(((blockWidth - position.form.value.x) - (columnsCount - 1)
        * productGaps?.form.value.columnGap) /  columnsCount);
    this.normalizeLimits(sidebar);
  }

  handleProductLimits(elCmp: PebEditorElementProduct, sidebar: PebEditorProductsSidebarComponent): Observable<any> {

    const productDimensions = elCmp.productDimensions;
    const productGaps = elCmp.productGaps;
    const position = elCmp.position;

    let blockWidth = 1024;
    switch (this.state.screen.toString()) {
      case 'desctop':blockWidth = 1024; break;
      case 'tablet': blockWidth = 768; break;
      case 'mobile': blockWidth = 360; break;
    }

    if (!productDimensions || !productGaps || !sidebar.form) {
      return EMPTY;
    }

    return merge(
      productDimensions.form.valueChanges.pipe(
        startWith(null as DimensionsFormValues),
        pairwise(),
        tap(([prevValue, value]: any[]) => {
          if (productGaps.form.invalid) {
            return;
          }
          const columnsCount = sidebar.form.get('template').get('columns').value;
          sidebar.maxCol = Math.floor((blockWidth - position.form.value.x) / (productDimensions?.form.value.width
            +  productGaps?.form.value.columnGap));
          sidebar.maxColGap =
            Math.floor(((blockWidth - position.form.value.x) - (columnsCount
              * productDimensions?.form.value.width))
                         / (columnsCount - 1));
          this.normalizeLimits(sidebar);
        }),
      ),
      productGaps.form.valueChanges.pipe(
        tap(() => {
          if (productGaps.form.invalid) {
            return;
          }
          const columnsCount = sidebar.form.get('template').get('columns').value;
          sidebar.maxCol = Math.floor((blockWidth - position.form.value.x) / (productDimensions?.form.value.width
            +  productGaps?.form.value.columnGap));
          this.normalizeLimits(sidebar);
          this.productUtils.updateDimensions(elCmp, columnsCount);
        }),
      ),
      sidebar.form.valueChanges.pipe(
        tap(() => {
          const columnsCount = sidebar.form.get('template').get('columns').value;
          sidebar.maxColGap =
            Math.floor(((blockWidth - position.form.value.x) - (columnsCount
              * productDimensions?.form.value.width))
                         / (columnsCount - 1));
          sidebar.maxCardWidth =
            Math.floor(((blockWidth - position.form.value.x) - (columnsCount - 1)
              * productGaps?.form.value.columnGap) /  columnsCount);
          this.normalizeLimits(sidebar);
          this.productUtils.updateDimensions(elCmp, columnsCount);
        }),
      ),
      position.form.valueChanges.pipe(
        tap(() => {
          const columnsCount = sidebar.form.get('template').get('columns').value;
          sidebar.maxCol = Math.floor((blockWidth - position.form.value.x) / (productDimensions?.form.value.width
            +  productGaps?.form.value.columnGap));
          sidebar.maxColGap =
            Math.floor(((blockWidth - position.form.value.x) - (columnsCount
              * productDimensions?.form.value.width))
                         / (columnsCount - 1));
          sidebar.maxCardWidth =
            Math.floor(((blockWidth - position.form.value.x) - (columnsCount - 1)
              * productGaps?.form.value.columnGap) /  columnsCount);
          this.normalizeLimits(sidebar);
          this.productUtils.updateDimensions(elCmp, columnsCount);
        }),
      ) ,
    );
  }

  normalizeLimits(sidebar) {
    if (!isFinite(sidebar.maxCol)) {
      sidebar.maxCol = 1;
    }
    if (!isFinite(sidebar.maxColGap)) {
      sidebar.maxColGap = 0;
    }
    if (!isFinite(sidebar.maxCardWidth)) {
      sidebar.maxCardWidth = 0;
    }
  }
}

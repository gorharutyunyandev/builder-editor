import { Inject, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EMPTY, merge, Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { PebEditorStore, PEB_EDITOR_STATE } from '@pe/builder-editor';

import {  getValidGap, ProductUtils } from './products.utils';
import { PebShopEditorState } from '../../../shop-editor.state';
import { PebEditorProductsSidebarComponent } from './products.sidebar';
import { PebEditorElementProduct, PebProductGaps } from './products.plugin';

@Injectable({ providedIn: 'any' })
export class ProductsGapsBehavior {
  constructor(
    private formBuilder: FormBuilder,
    private store: PebEditorStore,
    @Inject(PEB_EDITOR_STATE) private state: PebShopEditorState,
    private productUtils: ProductUtils,
  ) { }

  initGapsForm(elementCmp: PebEditorElementProduct) {

    const initialValue: PebProductGaps = {
      columnGap: getValidGap(elementCmp.styles.columnGap),
      rowGap: getValidGap(elementCmp.styles.rowGap),
    };

    elementCmp.productGaps = {
      initialValue,
      form: this.formBuilder.group({
        columnGap: [initialValue.columnGap],
        rowGap: [initialValue.rowGap],
      }),
      activate: this.activateProductGapsForm(elementCmp),
      update: null,
      submit: new Subject<any>(),
    };

  }

  handleGapsForm(elCmp: PebEditorElementProduct, sidebar: PebEditorProductsSidebarComponent): Observable<any> {
    const productGaps = elCmp.productGaps;

    if (!productGaps) {
      return EMPTY;
    }

    return merge(
      productGaps.form.valueChanges.pipe(
        tap((value: PebProductGaps) => {
          if (productGaps.form.invalid) {
            return;
          }

          elCmp.styles.columnGap = value.columnGap;
          elCmp.styles.rowGap = value.rowGap;

          elCmp.productGaps.form.patchValue(
            {
              columnGap: elCmp.styles.columnGap,
              rowGap: elCmp.styles.rowGap,
            },
            { emitEvent: false },
          );

          const { width, height } = elCmp.productDimensions.form.value;

          const {
            productTemplateColumns,
            productTemplateRows,
          } = this.productUtils.getColumnsAndRows(elCmp);

          const nextWidth =
            (+width * productTemplateColumns)
            + (value.columnGap * (productTemplateColumns - 1));
          const nextHeight =
            (+height * productTemplateRows)
            + (value.rowGap * (productTemplateRows - 1));

          elCmp.styles.width = nextWidth;
          elCmp.styles.height = nextHeight;

          elCmp.dimensions.form.patchValue(
            {
              width: elCmp.styles.width,
              height: elCmp.styles.height,
            },
            { emitEvent: false },
          );

          elCmp.applyStyles();

          const payload: any = {
            columnGap: elCmp.styles.columnGap,
            rowGap: elCmp.styles.rowGap,
          };

          this.productUtils.updateDimensions(elCmp, sidebar.form.get('template').get('columns').value);

          return this.store.updateStyles(this.state.screen, {
            [elCmp.definition.id]: {
              ...payload,
            },
          });

        }),
      ),
      productGaps.submit.pipe(
        switchMap(() => {
          const payload: any = {
            columnGap: elCmp.styles.columnGap,
            rowGap: elCmp.styles.rowGap,
          };
          return this.store.updateStyles(this.state.screen, {
            [elCmp.definition.id]: {
              ...payload,
            },
          });
        }),
      ),
    );
  }

  private activateProductGapsForm = (elementCmp: PebEditorElementProduct) => () => {
    elementCmp.productGaps.form.setValue(
      {
        columnGap: getValidGap(elementCmp.styles.columnGap),
        rowGap: getValidGap(elementCmp.styles.rowGap),
      },
      { emitEvent: false },
    );
  }
}

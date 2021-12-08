import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { PebElementDef, PebElementStyles } from '@pe/builder-core';
import { PebEditorApi } from '@pe/builder-api';
import {
  defaultColors,
  fontNamesVariables,
  PebEditorElement,
  PebEditorElementPropertyAlignment,
  SidebarBasic,
  TextAlignmentConstants,
} from '@pe/builder-editor';

import { CategoryFont } from './products-category-font.behavior';

export enum CategoryImageCornersConstants {
  RIGHT = 'right',
  ROUNDED = 'rounded',
}

@Component({
  selector: 'peb-mail-editor-product-category-sidebar',
  templateUrl: 'product-category.sidebar.html',
  styleUrls: ['./product-category.sidebar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PebEditorProductCategorySidebarComponent extends SidebarBasic {
  @Input() element: PebElementDef;
  @Input() styles: PebElementStyles;
  @Input() component: PebEditorElement;

  @Output() changeStyle = new EventEmitter<any>();
  @Output() addCategories = new EventEmitter();
  @Output() removeCategory = new EventEmitter<string>();

  productTitleFont: CategoryFont;
  productPriceFont: CategoryFont;
  categoryTitleFont: CategoryFont;
  categoryFilterFont: CategoryFont;

  defaultColumns = 3;
  gridColors = defaultColors;
  fontNames = fontNamesVariables;
  textAlignmentConstants = TextAlignmentConstants;
  imageCornersConstants = CategoryImageCornersConstants;

  productsPerRowLimits = {
    min: 1,
    max: 6,
  };

  selectedCategoriesCount$: Observable<number>;

  styleForm: FormGroup = this.formBuilder.group({
    columns: [
      3,
      [
        Validators.min(this.productsPerRowLimits.min),
        Validators.max(this.productsPerRowLimits.max),
      ],
    ],
    textAlign: '',
    imageCorners: CategoryImageCornersConstants.RIGHT,
  });

  productSettingsForm: FormGroup = this.formBuilder.group({
    selectAll: true,
    showPrice: true,
    showProductName: true,
  });

  alignment: PebEditorElementPropertyAlignment;

  constructor(
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    api: PebEditorApi,
  ) {
    super(api);
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebRendererSharedModule } from '@pe/builder-renderer';

import { PebShopProductsElement } from './product-grid.element';
import { PebShopProductElement } from './product/product.element';

@NgModule({
  imports: [
    CommonModule,
    PebRendererSharedModule,
  ],
  declarations: [
    PebShopProductsElement,
    PebShopProductElement,
  ],
  exports: [
    PebShopProductsElement,
  ],
})
export class PebElementsProductGridModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PebRendererSharedModule } from '@pe/builder-renderer';

import { PebShopProductDetailsElement } from './product-details.element';
import { PebShopProductDetailsCarouselElement } from './product-details-carousel/product-details-carousel.element';
import { PebShopProductDetailsMobileCarouselElement } from './product-details-mobile-carousel/product-details-mobile-carousel.element';

@NgModule({
  imports: [
    CommonModule,
    PebRendererSharedModule,
    FormsModule,
  ],
  declarations: [
    PebShopProductDetailsElement,
    PebShopProductDetailsCarouselElement,
    PebShopProductDetailsMobileCarouselElement,
  ],
  exports: [
    PebShopProductDetailsElement,
  ],
})
export class PebElementsProductDetailsModule {}

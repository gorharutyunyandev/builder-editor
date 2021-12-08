import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebRendererSharedModule } from '@pe/builder-renderer';

import { PebShopCategoryElement } from './category.element';
import { PebShopCategoryFiltersElement } from './category-filters/category-filters.element';
import { PebShopCategoryHeaderElement } from './category-header/category-header.element';
import { PebShopCategoryNavbarElement } from './category-navbar/category-navbar.element';
import { PebShopCategoryNavbarMobileElement } from './category-navbar-mobile/category-navbar-mobile.element';
import { PebShopCategoryProductElement } from './category-product/category-product.element';

@NgModule({
  imports: [
    CommonModule,
    PebRendererSharedModule,
  ],
  declarations: [
    PebShopCategoryElement,
    PebShopCategoryFiltersElement,
    PebShopCategoryHeaderElement,
    PebShopCategoryNavbarElement,
    PebShopCategoryNavbarMobileElement,
    PebShopCategoryProductElement,
  ],
  exports: [
    PebShopCategoryElement,
  ],
})
export class PebElementsCategoryModule {}

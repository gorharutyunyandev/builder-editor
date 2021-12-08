import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebRendererSharedModule } from '@pe/builder-renderer';

import { PebPosCatalogElement } from './catalog.element';
import { PebPosCatalogFiltersElement } from './catalog-filters/catalog-filters.element';
import { PebPosCatalogNavbarElement } from './catalog-navbar/catalog-navbar.element';
import { PebPosCatalogNavbarMobileElement } from './catalog-navbar-mobile/catalog-navbar-mobile.element';
import { PebPosCatalogProductElement } from './catalog-product/catalog-product.element';

@NgModule({
  imports: [
    CommonModule,
    PebRendererSharedModule,
  ],
  declarations: [
    PebPosCatalogElement,
    PebPosCatalogFiltersElement,
    PebPosCatalogNavbarElement,
    PebPosCatalogNavbarMobileElement,
    PebPosCatalogProductElement,
  ],
  exports: [
    PebPosCatalogElement,
  ],
})
export class PebElementsPosCatalogModule {}

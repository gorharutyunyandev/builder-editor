import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';

import { PeDataGridModule } from '@pe/data-grid';
import { PePlatformHeaderModule } from '@pe/platform-header';

import { PebProductsComponent } from './products/products.component';
import { PebProductCategoriesComponent } from './product-categories/product-categories.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatMenuModule,
    PeDataGridModule,
    PePlatformHeaderModule,
  ],
  declarations: [
    PebProductsComponent,
    PebProductCategoriesComponent,
  ],
  exports: [
    PebProductsComponent,
    PebProductCategoriesComponent,
  ],
})
export class PebProductsModule {}

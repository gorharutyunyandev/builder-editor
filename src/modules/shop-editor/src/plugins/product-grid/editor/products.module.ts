import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PebEditorIconsModule, PebEditorSharedModule } from '@pe/builder-editor';

import { PebEditorProductsSidebarComponent } from './products.sidebar';
import { PebShopSharedModule } from '../../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PebEditorIconsModule,
    PebEditorSharedModule,
    PebShopSharedModule,
  ],
  declarations: [
    PebEditorProductsSidebarComponent,
  ],
  exports: [
    PebEditorProductsSidebarComponent,
  ],
})
export class PebEditorShopProductsPluginModule {}

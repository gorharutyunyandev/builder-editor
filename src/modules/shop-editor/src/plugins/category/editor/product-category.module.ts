import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PebEditorIconsModule, PebEditorSharedModule } from '@pe/builder-editor';

import { PebEditorProductCategorySidebarComponent } from './product-category.sidebar';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PebEditorIconsModule,
    PebEditorSharedModule,
  ],
  declarations: [
    PebEditorProductCategorySidebarComponent,
  ],
  exports: [
    PebEditorProductCategorySidebarComponent,
  ],
})
export class PebEditorShopProductCategoryPluginModule {}

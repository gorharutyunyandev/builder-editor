import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PebEditorIconsModule, PebEditorSharedModule } from '@pe/builder-editor';

import { PebEditorShopSeoSidebarComponent } from './seo.sidebar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PebEditorIconsModule,
    PebEditorSharedModule,
  ],
  declarations: [
    PebEditorShopSeoSidebarComponent,
  ],
  exports: [
    PebEditorShopSeoSidebarComponent,
  ],
})
export class PebEditorShopSeoPluginModule {}

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PebEditorIconsModule, PebEditorSharedModule } from '@pe/builder-editor';

import { PebEditorProductsSidebarComponent } from './products.sidebar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PebEditorIconsModule,
    PebEditorSharedModule,
  ],
  declarations: [
    PebEditorProductsSidebarComponent,
  ],
  exports: [
    PebEditorProductsSidebarComponent,
  ],
})
export class PebEditorMailProductsPluginModule {}

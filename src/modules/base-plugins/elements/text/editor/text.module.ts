import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PebEditorSharedModule } from '@pe/builder-editor';
import { PebTextEditorModule } from '@pe/builder-text-editor';

import { PebEditorTextSidebarComponent } from './text.sidebar';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PebTextEditorModule,
    PebEditorSharedModule,
  ],
  declarations: [
    PebEditorTextSidebarComponent,
  ],
  exports: [
    PebEditorTextSidebarComponent,
  ],
})
export class PebEditorTextPluginModule { }

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PebEditorIconsModule, PebEditorSharedModule } from '@pe/builder-editor';

import { PebEditorDocumentsSidebarComponent } from './documents.sidebar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PebEditorIconsModule,
    PebEditorSharedModule,
  ],
  declarations: [
    PebEditorDocumentsSidebarComponent,
  ],
  exports: [
    PebEditorDocumentsSidebarComponent,
  ],
})
export class PebEditorMailDocumentsPluginModule {}

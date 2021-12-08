import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PebEditorIconsModule, PebEditorSharedModule } from '@pe/builder-editor';

import { PebEditorPageSidebarComponent } from './page.sidebar';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PebEditorIconsModule,
    PebEditorSharedModule,
  ],
  declarations: [
    PebEditorPageSidebarComponent,
  ],
  exports: [
    PebEditorPageSidebarComponent,
  ],
})
export class PebEditorPagePluginModule { }

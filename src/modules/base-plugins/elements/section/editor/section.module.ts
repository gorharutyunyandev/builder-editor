import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { PebEditorIconsModule, PebEditorSharedModule } from '@pe/builder-editor';

import { PebEditorSectionSidebarComponent } from './section.sidebar';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    PebEditorIconsModule,
    PebEditorSharedModule,
  ],
  declarations: [
    PebEditorSectionSidebarComponent,
  ],
  exports: [
    PebEditorSectionSidebarComponent,
  ],
})
export class PebEditorSectionPluginModule { }

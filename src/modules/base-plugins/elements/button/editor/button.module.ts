import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { PebEditorIconsModule, PebEditorSharedModule } from '@pe/builder-editor';

import { PebEditorButtonSidebarComponent } from './button.sidebar';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    PebEditorIconsModule,
    PebEditorSharedModule,
  ],
  declarations: [
    PebEditorButtonSidebarComponent,
  ],
  exports: [
    PebEditorButtonSidebarComponent,
  ],
})
export class PebEditorButtonPluginModule { }

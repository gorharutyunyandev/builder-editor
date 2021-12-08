import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PebEditorSharedModule } from '@pe/builder-editor';

import { PebEditorVideoSidebarComponent } from './video.sidebar';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PebEditorSharedModule,
  ],
  declarations: [
    PebEditorVideoSidebarComponent,
  ],
  exports: [
    PebEditorVideoSidebarComponent,
  ],
})
export class PebEditorVideoPluginModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PebEditorIconsModule, PebEditorSharedModule } from '@pe/builder-editor';
import { PebRendererSharedModule } from '@pe/builder-renderer';

import { PebEditorImageSidebarComponent } from './image.sidebar';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PebEditorIconsModule,
    PebEditorSharedModule,
    PebRendererSharedModule,
  ],
  declarations: [
    PebEditorImageSidebarComponent,
  ],
  exports: [
    PebEditorImageSidebarComponent,
  ],
})
export class PebEditorImagePluginModule { }

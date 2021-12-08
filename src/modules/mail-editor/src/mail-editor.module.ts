import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebEditor, PebEditorModule } from '@pe/builder-editor';
import { PebViewerModule } from '@pe/builder-viewer';
import { PebTextEditorModule } from '@pe/builder-text-editor';

import {
  pebEditorMailConfig,
  pebEditorMailConfigElements,
  pebEditorMailConfigModules,
} from './mail-editor.config';

// HACK: fix --prod build
// https://github.com/angular/angular/issues/23609
export const pebEditorModuleForRoot = PebEditorModule.forRoot(pebEditorMailConfig);
export const pebViewerModuleForRoot = PebViewerModule.withConfig(pebEditorMailConfigElements);

// @dynamic
@NgModule({
  imports: [
    CommonModule,
    pebEditorModuleForRoot,
    pebViewerModuleForRoot,
    PebTextEditorModule,

    ...pebEditorMailConfigModules,
  ],
  exports: [
    PebEditor,
  ],
})
export class PebMailEditorModule {}

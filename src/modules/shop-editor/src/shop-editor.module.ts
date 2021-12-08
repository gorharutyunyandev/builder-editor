import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebEditor, PebEditorModule } from '@pe/builder-editor';
import { PebViewerModule } from '@pe/builder-viewer';
import { PebTextEditorModule } from '@pe/builder-text-editor';

import {
  pebEditorShopConfig,
  pebEditorShopConfigElements,
  pebEditorShopConfigModules,
} from './shop-editor.config';
import { PebShopSharedModule } from './shared/shared.module';

// HACK: fix --prod build
// https://github.com/angular/angular/issues/23609
export const pebEditorModuleForRoot = PebEditorModule.forRoot(pebEditorShopConfig);
export const pebViewerModuleForRoot = PebViewerModule.withConfig(pebEditorShopConfigElements);

// @dynamic
@NgModule({
  imports: [
    CommonModule,
    pebEditorModuleForRoot,
    pebViewerModuleForRoot,
    PebTextEditorModule,
    PebShopSharedModule,

    ...pebEditorShopConfigModules,
  ],
  exports: [
    PebEditor,
  ],
})
export class PebShopEditorModule {}

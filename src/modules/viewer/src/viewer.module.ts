import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { ELEMENT_FACTORIES, PebRendererModule } from '@pe/builder-renderer';

import { PebViewer } from './viewer/viewer';
import {
  defaultScreenThresholds,
  PebViewerConfig,
  ScreenThresholds,
  SCREEN_FROM_WIDTH,
  SCREEN_THRESHOLDS,
} from './viewer.constants';
import { screenFromWidthFactory } from './viewer.utils';
import { PebViewerPreviewDialog } from './preview-dialog/preview.dialog';
import { ViewerIconsModule } from './icons/_icons.module';
import { PebViewerDeviceFrameComponent } from './preview-dialog/device-frame/device-frame.component';
import { pebShopElementsConfig } from './shop.config';

const exports = [
  PebViewer,
  PebViewerPreviewDialog,
];

// @dynamic
@NgModule({
  exports,
  declarations: [
    ...exports,
    PebViewerDeviceFrameComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    NgScrollbarModule,
    PebRendererModule,
    ViewerIconsModule,
  ],
})
export class PebViewerModule {
  // TODO: Remove forRoot and pebShopElementsConfig when all modules will provide configs for viewer
  /** @deprecated: Use PebViewerModule.withConfig instead and provide config with possible elements */
  static forRoot(thresholds: ScreenThresholds = defaultScreenThresholds): ModuleWithProviders<PebViewerModule> {
    return PebViewerModule.withConfig({
      thresholds,
      elements: pebShopElementsConfig.elements,
    });
  }
  static withConfig(config: PebViewerConfig): ModuleWithProviders<PebViewerModule> {
    return {
      ngModule: PebViewerModule,
      providers: [
        // TODO: At certain point it would be better to store such things as thresholds
        //       inside theme, but for now this values are predefined for everyone
        {
          provide: SCREEN_THRESHOLDS,
          useValue: config.thresholds || defaultScreenThresholds,
        },
        {
          provide: SCREEN_FROM_WIDTH,
          useValue: screenFromWidthFactory(config.thresholds || defaultScreenThresholds),
        },
        {
          provide: ELEMENT_FACTORIES,
          useValue: config.elements,
        },
      ],
    };
  }

  constructor(
    @Optional() @Inject(SCREEN_THRESHOLDS) thresholds: any,
    @Optional() @Inject(SCREEN_FROM_WIDTH) screenFromWidth: any,
  ) {
    if (!thresholds || !screenFromWidth) {
      console.error('Viewer module should be imported with `forRoot()`');
    }
  }
}

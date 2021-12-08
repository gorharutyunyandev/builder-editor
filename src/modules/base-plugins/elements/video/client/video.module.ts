import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PebRendererSharedModule } from '@pe/builder-renderer';

import { PebVideoElement } from './video.element';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    PebRendererSharedModule,
  ],
  declarations: [
    PebVideoElement,
  ],
  exports: [
    PebVideoElement,
  ],
})
export class PebElementsVideoModule {}

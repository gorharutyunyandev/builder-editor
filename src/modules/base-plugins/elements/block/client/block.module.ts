import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PebRendererSharedModule } from '@pe/builder-renderer';

import { PebBlockElement } from './block.element';

@NgModule({
  imports: [
    CommonModule,
    PebRendererSharedModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    PebBlockElement,
  ],
  exports: [
    PebBlockElement,
  ],
})
export class PebElementsBlockModule {
}

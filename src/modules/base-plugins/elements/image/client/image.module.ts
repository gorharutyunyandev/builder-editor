import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebRendererSharedModule } from '@pe/builder-renderer';

import { PebImageElement } from './image.element';

@NgModule({
  imports: [
    CommonModule,
    PebRendererSharedModule,
  ],
  declarations: [
    PebImageElement,
  ],
  exports: [
    PebImageElement,
  ],
})
export class PebElementsImageModule {}

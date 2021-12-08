import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebShapeElement } from './shape.element';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PebShapeElement,
  ],
  exports: [
    PebShapeElement,
  ],
})
export class PebElementsShapeModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebLineElement } from './line.element';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PebLineElement,
  ],
  exports: [
    PebLineElement,
  ],
})
export class PebElementsLineModule {}

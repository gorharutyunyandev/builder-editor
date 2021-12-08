import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebButtonElement } from './button.element';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PebButtonElement,
  ],
  exports: [
    PebButtonElement,
  ],
})
export class PebElementsButtonModule {}

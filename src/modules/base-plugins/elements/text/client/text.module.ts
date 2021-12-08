import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebTextElement } from './text.element';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PebTextElement,
  ],
  exports: [
    PebTextElement,
  ],
})
export class PebElementsTextModule {}

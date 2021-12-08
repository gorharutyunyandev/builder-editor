import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebLogoElement } from './logo.element';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PebLogoElement,
  ],
  exports: [
    PebLogoElement,
  ],
})
export class PebElementsLogoModule {}

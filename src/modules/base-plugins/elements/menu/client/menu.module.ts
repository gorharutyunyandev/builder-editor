import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebMenuElement } from './menu.element';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PebMenuElement,
  ],
  exports: [
    PebMenuElement,
  ],
})
export class PebElementsMenuModule {}

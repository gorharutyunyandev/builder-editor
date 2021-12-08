import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebHtmlElement } from './html.element';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PebHtmlElement,
  ],
  exports: [
    PebHtmlElement,
  ],
})
export class PebElementsHtmlModule {}

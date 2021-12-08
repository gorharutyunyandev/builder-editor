import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebScriptElement } from './script.element';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PebScriptElement,
  ],
  exports: [
    PebScriptElement,
  ],
})
export class PebElementsScriptModule {}

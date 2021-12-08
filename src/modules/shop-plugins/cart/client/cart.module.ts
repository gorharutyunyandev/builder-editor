import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebShopCartElement } from './cart.element';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PebShopCartElement,
  ],
  exports: [
    PebShopCartElement,
  ],
})
export class PebElementsCartModule {}

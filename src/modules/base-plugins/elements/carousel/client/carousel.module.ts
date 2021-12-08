import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebCarouselElement } from './carousel.element';
import { PebLeftArrowIcon } from './icons/left-arrow.icon';
import { PebRightArrowIcon } from './icons/right-arrow.icon';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PebCarouselElement,
    PebLeftArrowIcon,
    PebRightArrowIcon,
  ],
  exports: [
    PebCarouselElement,
  ],
})
export class PebElementsCarouselModule {}

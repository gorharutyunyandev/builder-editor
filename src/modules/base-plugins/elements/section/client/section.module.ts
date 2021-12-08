import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PebRendererSharedModule } from '@pe/builder-renderer';

import { PebSectionElement } from './section.element';

@NgModule({
  imports: [
    CommonModule,
    PebRendererSharedModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    PebSectionElement,
  ],
  exports: [
    PebSectionElement,
  ],
})
export class PebElementsSectionModule {}

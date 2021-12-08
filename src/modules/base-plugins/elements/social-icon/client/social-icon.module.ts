import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebRendererSharedModule } from '@pe/builder-renderer';

import { PebSocialIconElement } from './social-icon.element';

@NgModule({
  imports: [
    CommonModule,
    PebRendererSharedModule,
  ],
  declarations: [
    PebSocialIconElement,
  ],
  exports: [
    PebSocialIconElement,
  ],
})
export class PebElementsSocialIconModule {}

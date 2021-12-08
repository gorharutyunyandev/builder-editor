import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShopEditorProductGapsForm } from './forms';
import { PebEditorSharedModule } from '@pe/builder-editor';

import 'hammerjs';

const forms = [
  ShopEditorProductGapsForm,
];

@NgModule({
  declarations: [
    ...forms,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PebEditorSharedModule,
  ],
  exports: [
    ...forms,
  ],
})
export class PebShopSharedModule {}

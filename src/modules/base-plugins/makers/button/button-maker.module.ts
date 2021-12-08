import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebTextEditorModule } from '@pe/builder-text-editor';

import { PebEditorButtonMaker } from './button.maker';


@NgModule({
  imports: [
    CommonModule,
    PebTextEditorModule,
  ],
  declarations: [
    PebEditorButtonMaker,
  ],
  exports: [
    PebEditorButtonMaker,
  ],
})
export class PebEditorButtonMakerModule {}

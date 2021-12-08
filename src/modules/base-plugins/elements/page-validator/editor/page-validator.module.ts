import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebEditorSharedModule } from '@pe/builder-editor';

import { PebEditorPageValidatorSidebarComponent } from './page-validator.sidebar';

@NgModule({
  imports: [
    CommonModule,
    PebEditorSharedModule,
  ],
  declarations: [
    PebEditorPageValidatorSidebarComponent,
  ],
  exports: [
    PebEditorPageValidatorSidebarComponent,
  ],
})
export class PebEditorPageValidatorPluginModule { }

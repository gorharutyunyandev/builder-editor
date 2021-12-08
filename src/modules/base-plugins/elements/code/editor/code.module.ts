import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebEditorSharedModule } from '@pe/builder-editor';

import { PebEditorCodeSidebarComponent } from './code.sidebar';


@NgModule({
  imports: [
    CommonModule,
    PebEditorSharedModule,
  ],
  declarations: [
    PebEditorCodeSidebarComponent,
  ],
  exports: [
    PebEditorCodeSidebarComponent,
  ],
})
export class PebEditorCodePluginModule { }

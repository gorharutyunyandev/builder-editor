import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebEditorSharedModule } from '@pe/builder-editor';

import { PebEditorLogoSidebarComponent } from './logo.sidebar';

@NgModule({
  imports: [
    CommonModule,
    PebEditorSharedModule,
  ],
  declarations: [
    PebEditorLogoSidebarComponent,
  ],
  exports: [
    PebEditorLogoSidebarComponent,
  ],
})
export class PebEditorLogoPluginModule { }

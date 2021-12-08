import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebEditorIconsModule, PebEditorSharedModule } from '@pe/builder-editor';

import { PebEditorMenuSidebarComponent } from './menu.sidebar';

@NgModule({
  imports: [
    CommonModule,
    PebEditorIconsModule,
    PebEditorSharedModule,
  ],
  declarations: [
    PebEditorMenuSidebarComponent,
  ],
  exports: [
    PebEditorMenuSidebarComponent,
  ],
})
export class PebEditorMenuPluginModule { }

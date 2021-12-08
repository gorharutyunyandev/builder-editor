import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PebEditorSharedModule } from '@pe/builder-editor';

import { PebEditorSocialIconSidebarComponent } from './social-icon.sidebar';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PebEditorSharedModule,
  ],
  declarations: [
    PebEditorSocialIconSidebarComponent,
  ],
  exports: [
    PebEditorSocialIconSidebarComponent,
  ],
})
export class PebEditorSocialIconPluginModule { }

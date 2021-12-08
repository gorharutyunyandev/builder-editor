import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

import { PebEditorIconsModule } from '@pe/builder-editor';

import { PebEditorMailNavigationComponent } from './navigation.component';
import { PebMailEditorCreatePageDialogComponent } from './dialogs/create-page/create-page.dialog';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PebEditorIconsModule,
  ],
  declarations: [
    PebEditorMailNavigationComponent,

    // dialogs
    PebMailEditorCreatePageDialogComponent,
  ],
  exports: [
    PebEditorMailNavigationComponent,
  ],
})
export class PebEditorMailNavigationModule {}

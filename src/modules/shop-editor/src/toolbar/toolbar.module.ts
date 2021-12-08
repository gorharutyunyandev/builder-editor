import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule as CdkOverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PebEditorIconsModule } from '@pe/builder-editor';

import { PebEditorShopToolbarComponent } from './toolbar.component';
import {
  PebEditorCodeDialogComponent,
  PebEditorMediaDialogComponent,
  PebEditorObjectsDialogComponent,
  PebEditorProductDialogComponent,
  PebEditorPublishDialogComponent,
  PebEditorScreenDialogComponent,
  PebEditorViewDialogComponent,
  PebEditorZoomDialogComponent,
} from './dialogs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CdkOverlayModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    PebEditorIconsModule,
  ],
  declarations: [
    PebEditorShopToolbarComponent,
    // dialogs
    PebEditorScreenDialogComponent,
    PebEditorZoomDialogComponent,
    PebEditorObjectsDialogComponent,
    PebEditorCodeDialogComponent,
    PebEditorMediaDialogComponent,
    PebEditorProductDialogComponent,
    PebEditorPublishDialogComponent,
    PebEditorViewDialogComponent,
  ],
  exports: [
    PebEditorShopToolbarComponent,
  ],
})
export class PebEditorShopToolbarModule {}

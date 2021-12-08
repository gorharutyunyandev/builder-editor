import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

import { PebEditorIconsModule } from '@pe/builder-editor';

import { PebEditorShopNavigationComponent } from './navigation.component';
import { PebShopEditorCreatePageDialogComponent } from './dialogs/create-page/create-page.dialog';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PebEditorIconsModule,
  ],
  declarations: [
    PebEditorShopNavigationComponent,

    // dialogs
    PebShopEditorCreatePageDialogComponent,
  ],
  exports: [
    PebEditorShopNavigationComponent,
  ],
})
export class PebEditorShopNavigationModule {}

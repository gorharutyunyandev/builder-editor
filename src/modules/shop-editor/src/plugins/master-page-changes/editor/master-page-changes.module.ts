import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PebEditorMasterChangesBannerComponent } from './master-changes-banner/master-changes-banner.component';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    PebEditorMasterChangesBannerComponent,
  ],
  exports: [
    PebEditorMasterChangesBannerComponent,
  ],
})
export class PebEditorShopMasterPageChangesPluginModule { }

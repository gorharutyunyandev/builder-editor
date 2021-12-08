import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PebEditorSharedModule } from '@pe/builder-editor';

import { PebEditorCarouselSidebarComponent } from './carousel.sidebar';
import { PebEditorSlidesListElementSidebarComponent } from './components/slides-list-element/slides-list-element.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    PebEditorSharedModule,
    // PebRendererSharedModule,
  ],
  declarations: [
    PebEditorCarouselSidebarComponent,
    PebEditorSlidesListElementSidebarComponent,
  ],
  exports: [
    PebEditorCarouselSidebarComponent,
  ],
})
export class PebEditorCarouselPluginModule { }

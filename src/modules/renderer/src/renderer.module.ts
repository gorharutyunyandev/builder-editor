import { CommonModule } from '@angular/common';
import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PebDocumentElement } from './elements/general/document/document.element';
import { PebRenderer } from './root/renderer.component';
import { PebLoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { ElementFactories, ELEMENT_FACTORIES, PebRendererConfig } from './renderer.constants';
import { PebRendererSharedModule } from './shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PebRendererSharedModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    PebRenderer,
    PebLoadingSpinnerComponent,
    PebDocumentElement,
  ],
  exports: [
    PebRenderer,
  ],
})
export class PebRendererModule {
  static forRoot(config: PebRendererConfig): ModuleWithProviders<PebRendererModule> {
    return {
      ngModule: PebRendererModule,
      providers: [
        {
          provide: ELEMENT_FACTORIES,
          useValue: config.elements,
        },
      ],
    };
  }

  constructor(@Optional() @Inject(ELEMENT_FACTORIES) factories: ElementFactories) {
    if (!factories) {
      throw new Error('Element factories are not defined. You should import PebRendererModule with "forRoot()" or provide ELEMENT_FACTORIES for all app in other module');
    }
  }
}

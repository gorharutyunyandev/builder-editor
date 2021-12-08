import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OverlayModule as CdkOverlayModule } from '@angular/cdk/overlay';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { NgxHmCarouselModule } from 'ngx-hm-carousel';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { merge } from 'lodash';

import { PebMediaService } from '@pe/builder-core';
import { PebEditorApi } from '@pe/builder-api';
import { ELEMENT_FACTORIES, PebRendererModule } from '@pe/builder-renderer';
import { PebProductsModule } from '@pe/builder-products';
import { PebTextEditorModule } from '@pe/builder-text-editor';
import { FontLoaderService } from '@pe/builder-font-loader';

import {
  EDITOR_CONFIG_UI,
  EDITOR_ENABLED_MAKERS,
  PebEditorConfig,
  PEB_EDITOR_CONFIG,
  PEB_EDITOR_EVENTS,
  PEB_EDITOR_PLUGINS,
  PEB_EDITOR_STATE,
} from './editor.constants';
import { PebEditorIconsModule } from './misc/icons';
import { PebEditorTextMaker } from './makers/text/text.maker';
import { PebEditor } from './root/editor.component';
import { PebEditorSnackbarComponent } from './components/snackbar/snackbar.component';
import { PebEditorSnackbarErrorComponent } from './components/snackbar-error/snackbar-error.component';
import { CompanyContext } from './context-services/company.context';
import { ProductsContext } from './context-services/products.context';
import { PebEditorElementAddSectionControl } from './controls/element-add-section/element-add-section.control';
import { PebEditorElementAnchorsControl } from './controls/element-anchors/element-anchors.control';
import { PebEditorElementCoordsControl } from './controls/element-coords/element-coords.control';
import { PebEditorElementEdgesControl } from './controls/element-edges/element-edges.control';
import { PebEditorGuidelinesControl } from './controls/guidelines/guidelines.control';
import { PebEditorSectionBordersControl } from './controls/section-borders/section-borders.control';
import { PebEditorSectionLabelsControl } from './controls/section-labels/section-labels.control';
import { PebEditorMaterialComponent } from './root/material.component';
import { defaultMakers } from './editor.config';
import { WherePipe } from './misc/pipes/where.pipe';
import { PebEditorSharedModule } from './shared/shared.module';
import { PebEditorCompileErrorDialog } from './dialogs/compile-error/compile-error.dialog';
import { ErrorInterceptor } from './services/error-interceptor.service';
import { PebEditorThemeService } from './services/theme.service';
import { SnackbarErrorService } from './services/snackbar-error.service';
import { PebEditorState } from './services/editor.state';
import { PebEditorStore } from './services/editor.store';
import { PebEditorBehaviors } from './services/editor.behaviors';
import { PebEditorAccessorService } from './services/editor-accessor.service';
import { PebEditorRenderer } from './renderer/editor-renderer';
import { PebAbstractEditor } from './root/abstract-editor';

const dialogs = [
  PebEditorCompileErrorDialog,
];

const controls = [
  PebEditorElementAddSectionControl,
  PebEditorElementAnchorsControl,
  PebEditorElementEdgesControl,
  PebEditorSectionBordersControl,
  PebEditorElementCoordsControl,
  PebEditorSectionLabelsControl,
  PebEditorGuidelinesControl,
];

const makers = [
  PebEditorTextMaker,
];

// @dynamic
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CdkOverlayModule,
    DragDropModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    NgxHmCarouselModule,
    PebRendererModule,
    PortalModule,
    PebEditorSharedModule,
    PebEditorIconsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PebTextEditorModule,
    PebProductsModule,
    MatExpansionModule,
  ],
  declarations: [
    PebEditor,
    PebEditorMaterialComponent,
    WherePipe,
    PebEditorSnackbarComponent,
    PebEditorSnackbarErrorComponent,
    ...makers,
    ...dialogs,
    ...controls,
  ],
  providers: [
    {
      // TODO: For prod build
      provide: 'ContextServices.Products',
      useClass: ProductsContext,
    },
    {
      // TODO: For prod build
      provide: 'ContextServices.Company',
      useClass: CompanyContext,
    },
    FontLoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    PebEditorState,
    PebEditorStore,
    PebEditorBehaviors,
    PebEditorAccessorService,
  ],
  exports: [PebEditor],
  entryComponents: [
    PebEditorSnackbarComponent,
    PebEditorSnackbarErrorComponent,
  ],
})
export class PebEditorModule {
  static forRoot(config: PebEditorConfig): ModuleWithProviders<PebEditorModule> {
    return {
      ngModule: PebEditorModule,
      providers: [
        {
          provide: PEB_EDITOR_CONFIG,
          useValue: config,
        },
        {
          provide: EDITOR_ENABLED_MAKERS,
          useValue: config.makers || defaultMakers,
        },
        // TODO: For prod build
        {
          provide: 'ContextServices.Products',
          useClass: ProductsContext,
        },
        {
          // TODO: For prod build
          provide: 'ContextServices.Company',
          useClass: CompanyContext,
        },
        {
          provide: PebEditorThemeService,
          useClass: PebEditorThemeService,
          deps: [
            PebEditorApi,
            SnackbarErrorService,
          ],
        },
        {
          provide: SnackbarErrorService,
          useClass: SnackbarErrorService,
          deps: [
            MatSnackBar,
            Router,
          ],
        },
        {
          provide: PEB_EDITOR_PLUGINS,
          useValue: config.plugins || [],
        },
        {
          provide: EDITOR_CONFIG_UI,
          useValue: config.ui,
        },
        {
          provide: PEB_EDITOR_STATE,
          useFactory: (baseEditorState: PebEditorState) => {
            return merge(baseEditorState, config.state);
          },
          deps: [
            PebEditorState,
          ],
        },
        {
          provide: PEB_EDITOR_EVENTS,
          useFactory: (baseEditorBehaviors: PebEditorBehaviors, editorAccessor: PebEditorAccessorService) => {
            return baseEditorBehaviors.initEvents(editorAccessor.editorComponent, editorAccessor.renderer);
          },
          deps: [
            PebEditorBehaviors,
            PebEditorAccessorService,
          ],
        },
        {
          provide: PebAbstractEditor,
          useFactory: (editorAccessorService: PebEditorAccessorService) => {
            return editorAccessorService.editorComponent;
          },
          deps: [
            PebEditorAccessorService,
          ],
        },
        {
          provide: PebEditorRenderer,
          useFactory: (editorAccessorService: PebEditorAccessorService) => {
            return new PebEditorRenderer(editorAccessorService.renderer);
          },
          deps: [
            PebEditorAccessorService,
          ],
        },
        {
          provide: ELEMENT_FACTORIES,
          useValue: config.elements,
        },
        ...config.plugins || [].map(pluginCtor => ({
          provide: pluginCtor,
          useClass: pluginCtor,
        })),
      ],
    };
  }

  constructor(@Optional() api: PebEditorApi, @Optional() media: PebMediaService) {
    if (!api) {
      throw new Error(`
        PebEditorModule requires ApiService to be provided.
        Please make sure that you've defined it.
      `);
    }
    if (!media) {
      throw new Error(`
        PebEditorModule requires MediaService to be provided.
        Please make sure that you've defined it.
      `);
    }
  }
}

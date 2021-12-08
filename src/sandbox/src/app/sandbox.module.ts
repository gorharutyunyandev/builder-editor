import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PortalModule as CdkPortalModule } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MessageBus, PebEnvService, PebMediaService, PebTranslateService } from '@pe/builder-core';
import {
  BUILDER_MEDIA_API_PATH,
  MediaService,
  PebActualShopThemesApi,
  PebEditorApi,
  PebProductsApi,
  PebThemesApi,
  PEB_EDITOR_API_PATH,
  PEB_GENERATOR_API_PATH,
  PEB_MEDIA_API_PATH,
  PEB_PRODUCTS_API_PATH,
  PEB_SHOPS_API_PATH,
  PEB_STORAGE_PATH,
  PEB_STUDIO_API_PATH,
  PEB_SYNCHRONIZER_API_PATH,
  PRODUCTS_API_PATH, PebActualEditorApi, PebShopsApi, PebActualShopsApi,
} from '@pe/builder-api';
import { PEB_SHOP_HOST } from '@pe/builder-shop';
import {
  BackgroundActivityService,
  CompanyContext,
  ProductsContext,
  UploadInterceptorService,
} from '@pe/builder-editor';
import { PePlatformHeaderService } from '@pe/platform-header';

import { SandboxViewerSelectionDialog } from './root/dialogs/viewer-selection.dialog';
import { SandboxMessageBus } from './shared/services/message-bus.service';
import { SandboxFrontRoute } from './root/front.route';
import { SandboxRootComponent } from './root/root.component';
import { SandboxRouting } from './sandbox.routing';
import { SandboxSettingsDialog } from './shared/settings/settings.dialog';
import { SandboxMockBackend } from '../dev/editor.api-local';
import { MockEditorDatabaseConfig } from '../dev/editor.idb-config';
import { SandboxEnv } from './sandbox.env';
import { SandboxDBService } from '../dev/sandbox-idb.service';
import { SandboxTranslateService } from '../dev/sandbox-translate.service';
import { PlatformHeaderService } from './shared/services/app-platform-header.service';
import { environment } from '../environments/environment';
import { SandboxTokenInterceptor } from './sandbox-token.interceptor';
import { SandboxAddThemeFromThemesDialog } from './root/dialogs/add-theme-from-themes/add-theme-from-themes.dialog';
import { SandboxAddPageToThemeDialog } from './root/dialogs/add-page-to-theme/add-page-to-theme.dialog';
import { SandboxMockProductsBackend } from '../dev/products.api-local';
import { SandboxCloneThemeDialog } from './root/dialogs/clone-theme/clone-theme.dialog';
import { PeEnvInitializer, PeEnvProvider } from './env.provider';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    CdkPortalModule,
    SandboxRouting,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ServiceWorkerModule.register('image-upload.worker.js', { registrationStrategy: 'registerImmediately' }),
    NgxIndexedDBModule.forRoot(MockEditorDatabaseConfig),
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SandboxRootComponent,
    SandboxFrontRoute,
    SandboxSettingsDialog,
    SandboxViewerSelectionDialog,
    SandboxAddThemeFromThemesDialog,
    SandboxAddPageToThemeDialog,
    SandboxCloneThemeDialog,
  ],
  providers: [
    SandboxDBService,
    {
      provide: PebEnvService,
      useClass: SandboxEnv,
    },
    {
      provide: PebTranslateService,
      useClass: SandboxTranslateService,
    },
    {
      provide: MessageBus,
      useClass: SandboxMessageBus,
    },
    {
      provide: PePlatformHeaderService,
      useClass: PlatformHeaderService,
    },

    /**
     * Builder API: either SandboxMockBackend or PebEditorApi + BUILDER_API_PATH + PebThemesApi
     */
    {
      provide: PebEditorApi,
      useClass: SandboxMockBackend,
    },
    // {
    //   provide: PebEditorApi,
    //   useClass: PebActualEditorApi,
    // },
    {
      provide: PebShopsApi,
      useClass: PebActualShopsApi,
    },
    {
      provide: PEB_EDITOR_API_PATH,
      // useValue: 'http://localhost:4100/',
      // useValue: 'https://builder-shops.payever.org',
      useValue: 'https://builder-shops.staging.devpayever.com',
      // useValue: 'http://37.235.231.145:3000',
    },
    {
      provide: PebThemesApi,
      // useClass: PebActualTerminalThemesApi,
      useClass: PebActualShopThemesApi,
      // useClass: SandboxMockBackend
    },

    /**
     * Shops API
     */
    {
      provide: PEB_SHOPS_API_PATH,
      // useValue: 'https://shop-backend.test.devpayever.com/api',
      useValue: 'https://shop-backend.test.devpayever.com/api',
    },

    /**
     * Products API
     */
    {
      provide: PebProductsApi,
      useClass: SandboxMockProductsBackend,
      // useClass: PebActualProductsApi,
    },
    {
      provide: PEB_PRODUCTS_API_PATH,
      useValue: 'https://products-backend.test.devpayever.com',
      // useValue: 'https://products-backend.staging.devpayever.com',
    },

    /**
     * Builder media API
     */
    {
      provide: PebMediaService,
      useClass: MediaService,
    },
    {
      provide: PEB_MEDIA_API_PATH,
      // useValue: 'https://media.test.devpayever.com',
      useValue: 'https://media.test.devpayever.com',
    },

    {
      provide: BUILDER_MEDIA_API_PATH,
      // useValue: 'https://media.test.devpayever.com',
      useValue: 'https://builder-media.test.devpayever.com',
    },

    /**
     * Other APIs. Need to be made more configurable
     */
    {
      provide: PEB_GENERATOR_API_PATH,
      // useValue: 'https://builder-generator.test.devpayever.com',
      useValue: 'https://builder-generator.staging.devpayever.com',
    },
    {
      provide: PEB_STORAGE_PATH,
      useValue: 'https://payevertesting.blob.core.windows.net',
      // useValue: 'https://payeverstaging.blob.core.windows.net',
    },
    {
      provide: PEB_STUDIO_API_PATH,
      useValue: 'https://studio-backend.test.devpayever.com',
    },
    {
      provide: PRODUCTS_API_PATH,
      useValue: 'https://products-frontend.test.devpayever.com',
      // useValue: 'https://products-frontend.staging.devpayever.com',
    },
    {
      provide: PEB_SYNCHRONIZER_API_PATH,
      useValue: null,
    },
    {
      provide: PEB_SHOP_HOST,
      useValue: 'test.devpayever.com',
      // useValue: 'staging.devpayever.com',
    },
    {
      provide: 'PEB_ENTITY_NAME',
      useValue: 'shop',
    },
    {
      provide: 'ContextServices.Company',
      useClass: CompanyContext,
    },
    {
      provide: 'ContextServices.Products',
      useClass: ProductsContext,
    },
    { provide: HTTP_INTERCEPTORS, useClass: SandboxTokenInterceptor, multi: true },
    BackgroundActivityService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UploadInterceptorService,
      multi: true,
      deps: [BackgroundActivityService, PEB_EDITOR_API_PATH],
    },
    PeEnvProvider,
    PeEnvInitializer,
  ],
  bootstrap: [SandboxRootComponent],
})
export class SandboxModule {}

import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { PebViewerModule } from '@pe/builder-viewer';

import { PebShopRouteModule } from './shop.routing';
import { PebShopSharedModule } from './shop.shared';
import { PebShopListComponent } from './routes/list/shop-list.component';
import { PebShopSettingsComponent } from './routes/settings/shop-settings.component';
import { PebShopAddImageComponent } from './misc/icons/add-image.icon';
import { PebShopControlDotsComponent } from './misc/icons/control-dots.icon';
import { PebShopComponent } from './routes/_root/shop-root.component';
import { PebShopExternalDomainSettingsComponent } from './routes/settings/external-domain/shop-external-domain-settings.component';
import { PebShopPasswordSettingsComponent } from './routes/settings/password/shop-password-settings.component';
import { PebShopGeneralSettingsComponent } from './routes/settings/general/shop-general-settings.component';
import { ShopResolver } from './resolvers/shop.resolver';
import { PebShopEditComponent } from './routes/edit/shop-edit.component';
import { PebShopDashboardComponent } from './routes/dashboard/shop-dashboard.component';
import { CompanyContext } from './services/company.context';
import { ProductsContext } from './services/products.context';
import { pebShopElementsConfig } from './shop.config';
import { PebShopGroupItemArrowComponent } from './misc/icons/group-item-arrow.icon';
import { PebShopLiveStatusIconComponent } from './misc/icons/live-status.icon';
import { PebShopOwnDomainIconComponent } from './misc/icons/own-domain.icon';
import { PebShopPasswordProtectionComponent } from './misc/icons/password-protection.icon';
import { PebShopConnectExistingDomainComponent } from './routes/settings/connect-existing-domain/connect-existing-domain.component';
import { PebShopInternalDomainSettingsComponent } from './routes/settings/internal-domain/shop-internal-domain-settings.component';

// HACK: fix --prod build
// https://github.com/angular/angular/issues/23609
export const pebViewerModuleForRoot = PebViewerModule.withConfig(pebShopElementsConfig);

const icons = [
  PebShopAddImageComponent,
  PebShopControlDotsComponent,
  PebShopGroupItemArrowComponent,
  PebShopLiveStatusIconComponent,
  PebShopOwnDomainIconComponent,
  PebShopPasswordProtectionComponent,
];

// @dynamic
@NgModule({
  imports: [
    PebShopRouteModule,
    PebShopSharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    pebViewerModuleForRoot,
    NgScrollbarModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [
    ...icons,
    PebShopComponent,
    PebShopListComponent,
    PebShopEditComponent,
    PebShopSettingsComponent,
    PebShopGeneralSettingsComponent,
    PebShopInternalDomainSettingsComponent,
    PebShopExternalDomainSettingsComponent,
    PebShopPasswordSettingsComponent,
    PebShopDashboardComponent,
    PebShopConnectExistingDomainComponent,
  ],
  providers: [
    ShopResolver,
    {
      provide: 'ContextServices.Company',
      useClass: CompanyContext,
    },
    {
      provide: 'ContextServices.Products',
      useClass: ProductsContext,
    },
  ],
})
export class PebShopModule {}

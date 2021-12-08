import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PebShopCreateComponent } from './routes/create/shop-create.component';
import { PebShopListComponent } from './routes/list/shop-list.component';
import { PebShopSettingsComponent } from './routes/settings/shop-settings.component';
import { PebShopComponent } from './routes/_root/shop-root.component';
import { PebShopExternalDomainSettingsComponent } from './routes/settings/external-domain/shop-external-domain-settings.component';
import { PebShopPasswordSettingsComponent } from './routes/settings/password/shop-password-settings.component';
import { PebShopGeneralSettingsComponent } from './routes/settings/general/shop-general-settings.component';
import { ShopResolver } from './resolvers/shop.resolver';
import { PebShopEditComponent } from './routes/edit/shop-edit.component';
import { PebShopDashboardComponent } from './routes/dashboard/shop-dashboard.component';
import { ShopThemeGuard } from './guards/theme.guard';
import { PebShopConnectExistingDomainComponent } from './routes/settings/connect-existing-domain/connect-existing-domain.component';
import { PebShopInternalDomainSettingsComponent } from './routes/settings/internal-domain/shop-internal-domain-settings.component';

const routes: Routes = [
  {
    path: '',
    component: PebShopComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        component: PebShopListComponent,
      },
      {
        path: 'create',
        component: PebShopCreateComponent,
      },
      {
        path: 'edit',
        component: PebShopEditComponent,
      },
      {
        path: 'dashboard',
        component: PebShopDashboardComponent,
        canActivate: [ShopThemeGuard],
      },
      {
        path: 'settings',
        component: PebShopSettingsComponent,
        resolve: [ShopResolver],
        children: [
          {
            path: '',
            component: PebShopGeneralSettingsComponent,
          },
          {
            path: 'internal-domain',
            component: PebShopInternalDomainSettingsComponent,
          },
          {
            path: 'external-domain',
            component: PebShopExternalDomainSettingsComponent,
          },
          {
            path: 'password-protection',
            component: PebShopPasswordSettingsComponent,
          },
          {
            path: 'connect-external-domain',
            component: PebShopConnectExistingDomainComponent,
          },
        ],
      },
    ],
  },
];

// HACK: fix --prod build
// https://github.com/angular/angular/issues/23609
export const routerModuleForChild = RouterModule.forChild(routes);

@NgModule({
  imports: [routerModuleForChild],
  exports: [RouterModule],
  providers: [
    ShopThemeGuard,
  ],
})
export class PebShopRouteModule {}

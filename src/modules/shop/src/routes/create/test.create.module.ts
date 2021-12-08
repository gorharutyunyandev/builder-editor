import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { PebViewerModule } from '@pe/builder-viewer';

import { PebShopAddImageComponent } from '../../misc/icons/add-image.icon';
import { PebShopControlDotsComponent } from '../../misc/icons/control-dots.icon';
import { ShopResolver } from '../../resolvers/shop.resolver';
import { CompanyContext } from '../../services/company.context';
import { ProductsContext } from '../../services/products.context';
import { PebShopCreateComponent } from './shop-create.component';
import { AbbreviationPipe } from '../../misc/pipes/abbreviation.pipe';

// HACK: fix --prod build
// https://github.com/angular/angular/issues/23609
export const pebViewerModuleForRoot = PebViewerModule.forRoot();

const icons = [
  PebShopAddImageComponent,
  PebShopControlDotsComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    pebViewerModuleForRoot,
    NgScrollbarModule,
  ],
  declarations: [
    ...icons,
    AbbreviationPipe,
    PebShopCreateComponent,
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
export class TestCreateModule {}

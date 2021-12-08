import {
  PebEditorAddElementPlugin,
  PebEditorButtonMaker,
  PebEditorButtonMakerModule,
  PebEditorButtonPlugin,
  PebEditorButtonPluginModule,
  PebEditorCarouselPlugin,
  PebEditorCarouselPluginModule,
  PebEditorCodePlugin,
  PebEditorCodePluginModule,
  PebEditorElementManipulationPlugin,
  PebEditorImagePlugin,
  PebEditorImagePluginModule,
  PebEditorLinePlugin,
  PebEditorLinePluginModule,
  PebEditorLogoPlugin,
  PebEditorLogoPluginModule,
  PebEditorMarkHoveredPlugin,
  PebEditorMarkSelectedPlugin,
  PebEditorMenuPlugin,
  PebEditorMenuPluginModule,
  PebEditorMoveWithMousePlugin,
  PebEditorPagePlugin,
  PebEditorPagePluginModule,
  PebEditorPageValidatorPlugin,
  PebEditorPageValidatorPluginModule,
  PebEditorPositioningPlugin,
  PebEditorResizeByKeyboardPlugin,
  PebEditorResizeByMousePlugin,
  PebEditorResizeSectionPlugin,
  PebEditorSectionPlugin,
  PebEditorSectionPluginModule,
  PebEditorShapePlugin,
  PebEditorShapePluginModule,
  PebEditorSocialIconPlugin,
  PebEditorSocialIconPluginModule,
  PebEditorTextPlugin,
  PebEditorTextPluginModule,
  PebEditorVideoPlugin,
  PebEditorVideoPluginModule,
} from '@pe/builder-base-plugins';
import { PebElementType } from '@pe/builder-core';
import { PebEditorTextMaker } from '@pe/builder-editor';

import { PebEditorShopToolbarComponent, PebEditorShopToolbarModule } from './toolbar';
import { PebEditorShopNavigationComponent, PebEditorShopNavigationModule } from './navigation';
import { PebShopEditorState } from './shop-editor.state';
import { PebEditorShopCartPlugin } from './plugins/cart/editor/cart.plugin';
import { PebEditorShopCartPluginModule } from './plugins/cart/editor/cart.module';
import { PebEditorShopProductCategoryPlugin } from './plugins/category/editor/product-category.plugin';
import { PebEditorShopProductCategoryPluginModule } from './plugins/category/editor/product-category.module';
import { PebEditorShopDocumentsPlugin } from './plugins/documents/editor/documents.plugin';
import { PebEditorShopDocumentsPluginModule } from './plugins/documents/editor/documents.module';
import { PebEditorShopMasterPagesPlugin } from './plugins/master-pages/editor';
import { PebEditorShopMasterPageChangesPlugin, PebEditorShopMasterPageChangesPluginModule } from './plugins/master-page-changes/editor';
import { PebEditorShopProductDetailsPlugin } from './plugins/product-details/editor/product-details.plugin';
import { PebEditorShopProductDetailsPluginModule } from './plugins/product-details/editor/product-details.module';
import { PebEditorShopProductsPlugin } from './plugins/product-grid/editor/products.plugin';
import { PebEditorShopProductsPluginModule } from './plugins/product-grid/editor/products.module';
import { PebEditorShopSeoPlugin } from './plugins/seo/editor/seo.plugin';
import { PebEditorShopSeoPluginModule } from './plugins/seo/editor/seo.module';

export const pebEditorShopConfigElements = {
  elements: {
    lazy: {
      block: () => import('@pe/builder-base-plugins/elements/block/client').then(m => m.PebBlockElement),
      button: () => import('@pe/builder-base-plugins/elements/button/client').then(m => m.PebButtonElement),
      carousel: () => import('@pe/builder-base-plugins/elements/carousel/client').then(m => m.PebCarouselElement),
      html: () => import('@pe/builder-base-plugins/elements/html/client').then(m => m.PebHtmlElement),
      image: () => import('@pe/builder-base-plugins/elements/image/client').then(m => m.PebImageElement),
      line: () => import('@pe/builder-base-plugins/elements/line/client').then(m => m.PebLineElement),
      logo: () => import('@pe/builder-base-plugins/elements/logo/client').then(m => m.PebLogoElement),
      menu: () => import('@pe/builder-base-plugins/elements/menu/client').then(m => m.PebMenuElement),
      script: () => import('@pe/builder-base-plugins/elements/script/client').then(m => m.PebScriptElement),
      section: () => import('@pe/builder-base-plugins/elements/section/client').then(m => m.PebSectionElement),
      shape: () => import('@pe/builder-base-plugins/elements/shape/client').then(m => m.PebShapeElement),
      'social-icon': () => import('@pe/builder-base-plugins/elements/social-icon/client')
        .then(m => m.PebSocialIconElement),
      text: () => import('@pe/builder-base-plugins/elements/text/client').then(m => m.PebTextElement),
      video: () => import('@pe/builder-base-plugins/elements/video/client').then(m => m.PebVideoElement),

      'shop-cart': () => import('@pe/builder-shop-plugins/cart/client').then(m => m.PebShopCartElement),
      'shop-category': () => import('@pe/builder-shop-plugins/category/client').then(m => m.PebShopCategoryElement),
      'shop-product-details': () => import('@pe/builder-shop-plugins/product-details/client')
        .then(m => m.PebShopProductDetailsElement),
      'shop-products': () => import('@pe/builder-shop-plugins/product-grid/client').then(m => m.PebShopProductsElement),
      'pos-catalog': () => import('@pe/builder-shop-plugins/catalog/client').then(m => m.PebPosCatalogElement),
    },
  },
};

export const pebEditorShopConfig = {
  ui: {
    toolbar: PebEditorShopToolbarComponent,
    navigation: PebEditorShopNavigationComponent,
  },
  plugins: [
    PebEditorAddElementPlugin,
    PebEditorElementManipulationPlugin,
    PebEditorMarkHoveredPlugin,
    PebEditorMarkSelectedPlugin,
    PebEditorPositioningPlugin,

    PebEditorMoveWithMousePlugin,
    PebEditorResizeByKeyboardPlugin,
    PebEditorResizeByMousePlugin,
    PebEditorResizeSectionPlugin,

    PebEditorButtonPlugin,
    PebEditorCarouselPlugin,
    PebEditorCodePlugin,
    PebEditorImagePlugin,
    PebEditorLinePlugin,
    PebEditorLogoPlugin,
    PebEditorMenuPlugin,
    PebEditorPagePlugin,
    PebEditorPageValidatorPlugin,
    PebEditorSectionPlugin,
    PebEditorShapePlugin,
    PebEditorSocialIconPlugin,
    PebEditorTextPlugin,
    PebEditorVideoPlugin,

    PebEditorShopCartPlugin,
    PebEditorShopProductCategoryPlugin,
    PebEditorShopDocumentsPlugin,
    PebEditorShopMasterPagesPlugin,
    PebEditorShopMasterPageChangesPlugin,
    PebEditorShopProductDetailsPlugin,
    PebEditorShopProductsPlugin,
    PebEditorShopSeoPlugin,
  ],
  makers: {
    [PebElementType.Text]: PebEditorTextMaker,
    [PebElementType.Button]: PebEditorButtonMaker,
  },
  state: PebShopEditorState,
  ...pebEditorShopConfigElements,
};

export const pebEditorShopConfigModules = [
  PebEditorShopNavigationModule,
  PebEditorShopToolbarModule,

  PebEditorButtonMakerModule,

  PebEditorButtonPluginModule,
  PebEditorCarouselPluginModule,
  PebEditorCodePluginModule,
  PebEditorImagePluginModule,
  PebEditorLinePluginModule,
  PebEditorLogoPluginModule,
  PebEditorMenuPluginModule,
  PebEditorPagePluginModule,
  PebEditorPageValidatorPluginModule,
  PebEditorSectionPluginModule,
  PebEditorShapePluginModule,
  PebEditorSocialIconPluginModule,
  PebEditorTextPluginModule,
  PebEditorVideoPluginModule,

  PebEditorShopCartPluginModule,
  PebEditorShopProductCategoryPluginModule,
  PebEditorShopDocumentsPluginModule,
  PebEditorShopMasterPageChangesPluginModule,
  PebEditorShopProductDetailsPluginModule,
  PebEditorShopProductsPluginModule,
  PebEditorShopSeoPluginModule,
];

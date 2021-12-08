export const pebShopElementsConfig = {
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

import { PebScreen } from '../constants';
import { PebPage, PebPageType, PebPageVariant, PebShop, PebTemplate } from '../models/client';
import { PebElementType, PebSectionType } from '../models/element';
import { pebGenerateId } from '../utils/generate-id';

export const pebCreateEmptyPage = (
  name,
  variant: PebPageVariant = PebPageVariant.Default,
  type: PebPageType = PebPageType.Replica,
): PebPage => {
  const template: PebTemplate = {
    id: pebGenerateId('element'),
    type: PebElementType.Document,
    children: Object.values(PebSectionType).map(sectionName => ({
      id: pebGenerateId('element'),
      type: PebElementType.Section,
      data: { name: sectionName },
      meta: { deletable: false },
      children: [],
    })),
  };

  const [headerId, bodyId, footerId] = template.children.map(el => el.id);

  return  {
    name,
    type,
    variant,
    template,
    id: pebGenerateId('page'),
    master: null,
    lastActionId: null,
    data: {},
    stylesheets: {
      [PebScreen.Desktop]: {
        [template.id]: {},
        [headerId]: { height: 200 },
        [bodyId]: { height: 600 },
        [footerId]: { height: 200 },
      },
      [PebScreen.Tablet]: {
        [template.id]: {},
        [headerId]: { height: 200 },
        [bodyId]: { height: 600 },
        [footerId]: { height: 200 },
      },
      [PebScreen.Mobile]: {
        [template.id]: {},
        [headerId]: { height: 200 },
        [bodyId]: { height: 600 },
        [footerId]: { height: 200 },
      },
    },
    context: {},
  };
};

export const getPageUrlByName = (pageName: string, pageVariant?: PebPageVariant): string => {
  if (pageVariant === PebPageVariant.Front) {
    return '/';
  }
  return `/${pageName.toLowerCase().replace(/\s/g, '-')}-${Math.random().toString(36).substring(7)}`;
};

export function pebCreateEmptyShop(): PebShop {
  const frontPage = pebCreateEmptyPage('Front', PebPageVariant.Front);
  // const productsPage = pebCreateEmptyPage('Product', PebPageVariant.Product);
  // const categoriesPage = pebCreateEmptyPage('Category', PebPageVariant.Category);

  return {
    id: pebGenerateId(),
    data: {
      productPages: '/products/:productId',
      categoryPages: '/categories/:categoryId',
    },
    routing: [
      {
        routeId: pebGenerateId(),
        pageId: frontPage.id,
        url: '/',
      },
    ],
    context: {},
    pages: [frontPage/*, productsPage, categoriesPage*/],
  };
}

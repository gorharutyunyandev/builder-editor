import { PebScreen } from '../constants';
import { PebAction, PebActionId } from './action';
import {
  PebContextSchemaId,
  PebPageData,
  PebPageId, PebPageMasterData, PebPageType, PebPageVariant,
  PebShop, PebShopData, PebShopId,
  PebStylesheetId,
  PebTemplateId,
} from './client';
import { PebShopRoute, PebShopThemeSnapshot } from './database';

export type PebShopThemeId = string;
export interface PebShopTheme {
  id: PebShopThemeId;
  name: string;
  description: string;
  picture: string;
  source: PebShopThemeSource;
  versions: PebShopThemeVersion[];
  published: null | PebShopThemeVersion;
  // other meta info like businessId, shopId, etc
}

export type PebShopThemeVersionId = string;
export interface PebShopThemeVersion {
  id: PebShopThemeVersionId;
  name: string;
  source: PebShopThemeSource;
  result: PebShop;
  createdAt: Date;
}

export type PebShopThemeSourceId = string;
export interface PebShopThemeSource {
  id: PebShopThemeSourceId;
  hash: string;
  actions: PebAction[];
  snapshot: PebShopThemeSnapshot;
  previews: {
    [key: string/*PebPageId*/]: {
      actionId: string;
      previewUrl: string;
    };
  };
}

// export type PebShopThemeSnapshotId = string;
// export interface PebShopThemeSnapshot {
//   id: PebShopThemeSnapshotId;
//   shop: {
//     data: PebShopData,
//     routing: PebShopRoute[],
//   };
//   pageIds: {
//     [key: string/*PebPageId*/]: PebPageShort,
//   };
//   templateIds: {
//     [key: string/*PebTemplateId*/]: PebTemplate,
//   };
//   stylesheetIds: {
//     [key: string/*PebStylesheetId*/]: PebStylesheet,
//   };
//   contextSchemaIds: {
//     [key: string/*PebContextSchemaId*/]: PebContextSchema,
//   };
// }

export interface PebShopShort {
  id: PebShopId; // shop theme id??
  data: PebShopData;
  routing: PebShopRoute[];
  contextId: PebContextSchemaId;
  pageIds: PebPageId[];
}

export interface PebPageShort {
  id: PebPageId;
  name: string;
  variant: PebPageVariant;
  type: PebPageType;
  lastActionId: PebActionId,
  master: null | PebPageMasterData;
  data: PebPageData;
  templateId: PebTemplateId;
  stylesheetIds: {
    [screen in PebScreen]: PebStylesheetId;
  };
  contextId: PebContextSchemaId;
}

export enum PebShopContainer {
  Images = 'images',
  Products = 'products',
  Miscellaneous = 'miscellaneous',
  Wallpapers = 'wallpapers',
  Builder = 'builder',
  BuilderVideo = 'builder-video',
}

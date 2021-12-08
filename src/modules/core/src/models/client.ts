import { PebActionId } from './action';
import { PebShopRoute } from './database';
import { PebElementDef, PebElementType } from './element';

export type PebTemplateId = string;
export interface PebTemplate extends PebElementDef {
  type: PebElementType.Document;
}

export type PebStylesheetId = string;

export interface PebStylesheet {
  [selector: string]: PebElementStyles;
}

// TODO: correct styles interface, please don't add universal types here like [key: string]: string | number
export interface PebElementStyles {
  content?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  borderStyle?: string;
  borderColor?: string;
  opacity?: number;
  backgroundSize?: string | number;
  backgroundRepeat?: string;
  backgroundPosition?: string;
  transform?: string;

  display?: string;
  width?: any;
  height?: any;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  margin?: string;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  padding?: string;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  minWidth?: string | number;
  maxWidth?: number;
  minHeight?: string | number;
  zIndex?: number;
  position?: string;
  overflow?: string;
  visibility?: string;

  scaleY?: number;
  scaleX?: number;

  iconColor?: string;

  background?: string;
  backgrounds?: string;
  objectFit?: string;

  fontSize?: string | number;
  fontWeight?: string;
  fontStyle?: string;
  fontFamily?: string;
  lineHeight?: number;
  whiteSpace?: string;
  textOverflow?: string;
  textAlign?: string;
  textDecoration?: string;

  rotate?: any;

  justifyContent?: string;
  alignItems?: string;
  alignContent?: string;

  buttonTextDecoration?: string;
  buttonFontSize?: number;
  buttonFontStyle?: string;
  buttonFontWeight?: string;
  buttonColor?: string;
  buttonBackgroundColor?: string;
  buttonFontFamily?: string;

  mobileButtonHeight?: number;

  categoryTitleTextDecoration?: string;
  categoryTitleFontWeight?: string;
  categoryTitleColor?: string;
  categoryHeaderDisplay?: string;
  categoryTitleFontSize?: string;
  categoryTitleFontFamily?: string;
  categoryTitleFontStyle?: string;

  catalogTitleColor?: string;
  catalogTitleFontSize?: string;
  catalogTitleFontFamily?: string;
  catalogTitleFontStyle?: string;
  catalogTitleFontWeight?: string;
  catalogTitleTextDecoration?: string;

  badgeBorderWidth?: number;
  badgeBorderStyle?: string;
  badgeBackground?: string;
  badgeColor?: string;

  tonBackgroundColor?: string;

  filterFontFamily?: string;
  filterFontStyle?: string;
  filterFontSize?: string;
  filterColor?: string;
  filterFontWeight?: string;
  filterTextDecoration?: string;

  titleColor?: string;
  titleFontSize?: string;
  titleFontStyle?: string;
  titleFontWeight?: string;
  titleFontFamily?: string;
  titleTextDecoration?: string;

  priceFontSize?: string;
  priceFontFamily?: string;
  priceFontWeight?: string;
  priceTextDecoration?: string;
  priceColor?: string;
  priceFontStyle?: string;

  border?: string;
  borderWidth?: string | number;
  borderRadius?: string | number;
  borderSize?: string;
  borderType?: string;
  borderOffset?: string;
  stroke?: string;
  strokeWidth?: string | number;
  filter?: string;
  strokeDasharray?: string;
  stroking?: any;

  imageCorners?: string;
  imageExposure?: string;
  imageSaturation?: string;
  imageFilter?: string;

  mode?: string;
  slot?: string;
  some?: string;

  gridArea?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumn?: string;
  gridRow?: string;
  columns?: string;
  color?: string;

  flexDirection?: string;
  flexWrap?: string;

  productTemplateColumns?: number;
  productTemplateRows?: number;

  itemWidth?: number;
  itemHeight?: number;

  shadow?: string;
  shadowing?: any;
  boxShadow?: string;
  dropShadow?: string;
  shadowOffset?: any;
  shadowAngle?: any;
  shadowOpacity?: any;
  shadowColor?: string;
  shadowFormColor?: string;
  shadowBlur?: string;

  rowGap?: number;
  columnGap?: number;
}

export type PebContextSchemaId = string;

// TODO: fix
// export interface ContextSchemaItem {
//   service: string;
//   method: string;
//   params: any[];
// }

export interface PebContextSchema {
  [key: string]: any;
}

export interface PebContext {
  [selector: string]: any;
}

export enum PebPageType {
  Master = 'master',
  Replica = 'replica',
}

export enum PebPageVariant {
  Front = 'front',
  Default = 'default',
  Category = 'category',
  Product = 'product',
}

export interface PebPageMasterData {
  id: PebPageId;
  lastActionId: PebActionId;
  idsMap: PebMasterElementIdMap;
}

/** We need it to know to which element we should apply master changes */
export type PebMasterElementIdMap = {
  [key: string /** PebPageType.Master id */]: string /** PebPageType.Replica id */;
};

export interface PebPageData {
  url?: string;
  mark?: string;
  preview?: string;
  seo?: PebPageSeo;
}

export interface PebPageSeo {
  description: string;
  showInSearchResults: boolean;
  canonicalUrl: string;
  markupData: string;
  customMetaTags: string;
}

export type PebPageId = string;
export interface PebPage {
  id: PebPageId;
  name: string;
  variant: PebPageVariant;
  type: PebPageType;
  lastActionId: PebActionId;
  master: null | PebPageMasterData;
  data: PebPageData;
  template: PebTemplate;
  stylesheets: {
    [screen: string]: PebStylesheet;
  };
  context: PebContextSchema;
}

export type PebShopId = string;
export interface PebShopData {
  productPages: string; // pattern like "/products/:productId"
  categoryPages: string; // pattern like "/categories/:categoryId"
  [key: string]: any;
}
export interface PebShop {
  id: PebShopId;
  data: PebShopData;
  routing: PebShopRoute[];
  context: PebContextSchema;
  pages: PebPage[];
}

// TODO: move to a more suitable location
export enum ContextService {
  Company = 'company',
  Products = 'products',
}

// TODO: move to a more suitable location
export const CONTEXT_SERVICES = {
  [ContextService.Company]: 'ContextServices.Company',
  [ContextService.Products]: 'ContextServices.Products',
};

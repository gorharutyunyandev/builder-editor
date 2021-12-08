import {
  getPageUrlByName,
  PebAction,
  PebContextSchemaEffect,
  PebContextSchemaId,
  pebGenerateId,
  PebPage,
  PebPageEffect,
  PebPageId,
  PebPageShort,
  PebPageType,
  PebScreen,
  PebShopEffect,
  PebShopRoute,
  PebShopRouteId,
  PebStylesheetEffect,
  PebStylesheetId,
  PebTemplateEffect,
  PebTemplateId,
} from '@pe/builder-core';

import { pebCreateEffect } from './effect-creator.service';

export interface PebInitPageIds {
  pageId: PebPageId;
  templateId: PebTemplateId;
  stylesheetIds: {
    [screen in PebScreen]: PebStylesheetId;
  };
  contextId: PebContextSchemaId;
  routeId: PebShopRouteId;
}

export interface PebPageWithIdsPayload {
  page: PebPage;
  ids: PebInitPageIds;
}

export enum PebActionType {
  CreatePage = 'create-page',
  CreatePageWithIds = 'create-page-with-ids',
  DeletePage = 'delete-page',
  UpdatePageData = 'update-page-data',
}

const pebCreateActionHandlers: {
  [actionType in PebActionType]: (payload: any) => PebAction
} = {
  [PebActionType.CreatePage]: pebCreatePageAction,
  [PebActionType.CreatePageWithIds]: pebCreatePageWithIdsAction,
  [PebActionType.DeletePage]: pebDeletePageAction,
  [PebActionType.UpdatePageData]: pebUpdatePageDataAction,
};

export function pebCreateAction(type: PebActionType.CreatePage, payload: PebPage): PebAction;
export function pebCreateAction(type: PebActionType.DeletePage, payload: PebPageShort): PebAction;
export function pebCreateAction(type: PebActionType.CreatePageWithIds, payload: PebPageWithIdsPayload): PebAction;
export function pebCreateAction(type: PebActionType.UpdatePageData, payload: Partial<PebPageShort>): PebAction;
export function pebCreateAction(type: PebActionType, payload: any): PebAction {
  return pebCreateActionHandlers[type](payload);
}

function pebCreatePageAction(page: PebPage): PebAction {
  const templateId = pebGenerateId('template');
  const stylesIds = {
    [PebScreen.Desktop]: pebGenerateId('stylesheet'),
    [PebScreen.Tablet]: pebGenerateId('stylesheet'),
    [PebScreen.Mobile]: pebGenerateId('stylesheet'),
  };
  const contextId = pebGenerateId('context');
  const routeId = pebGenerateId('route');

  const routes: PebShopRoute[] = [{
    routeId,
    pageId: page.id,
    url: getPageUrlByName(page.name, page.variant),
  }];

  const nextPage: PebPageShort = {
    templateId,
    contextId,
    id: page.id,
    variant: page.variant,
    type: page.type,
    master: page.master,
    name: page.name,
    data: page.data,
    lastActionId: null,
    stylesheetIds: {
      [PebScreen.Desktop]: `${stylesIds[PebScreen.Desktop]}`,
      [PebScreen.Tablet]: `${stylesIds[PebScreen.Tablet]}`,
      [PebScreen.Mobile]: `${stylesIds[PebScreen.Mobile]}`,
    },
  };

  return {
    id: pebGenerateId('action'),
    createdAt: new Date(),
    targetPageId: page.id,
    affectedPageIds: [page.id],
    effects: [
      pebCreateEffect(PebTemplateEffect.Init, templateId, page.template),
      ...Object.values(PebScreen).map(screen => (
        pebCreateEffect(PebStylesheetEffect.Init, stylesIds[screen], page.stylesheets[screen])
      )),
      pebCreateEffect(PebContextSchemaEffect.Init, contextId, page.context),
      pebCreateEffect(PebPageEffect.Create, page.id, nextPage),
      pebCreateEffect(PebShopEffect.AppendPage, null, nextPage.id),
      ...(page.type === PebPageType.Master ? [] : [pebCreateEffect(PebShopEffect.PatchRouting, null, routes)]),
    ],
  };
}

function pebDeletePageAction(page: PebPageShort): PebAction {
  return {
    id: pebGenerateId('action'),
    createdAt: new Date(),
    targetPageId: page.id,
    affectedPageIds: [page.id],
    effects: [
      ...Object.values(PebScreen).map(screen => (
        pebCreateEffect(PebStylesheetEffect.Destroy, page.stylesheetIds[screen], null)
      )),
      pebCreateEffect(PebContextSchemaEffect.Destroy, page.contextId, null),
      pebCreateEffect(PebTemplateEffect.Destroy, page.templateId, page.templateId),
      pebCreateEffect(PebPageEffect.Delete, page.id, page.id),
      pebCreateEffect(PebShopEffect.DeletePage, page.id, page.id),
    ],
  };
}

function pebCreatePageWithIdsAction({ page, ids }: PebPageWithIdsPayload): PebAction {
  const routes: PebShopRoute[] = [{
    routeId: ids.routeId,
    pageId: ids.pageId,
    url: getPageUrlByName(page.name, page.variant),
  }];

  const nextPage: PebPageShort = {
    templateId: ids.templateId,
    contextId: ids.contextId,
    id: ids.pageId,
    variant: page.variant,
    type: page.type,
    master: page.master,
    name: page.name,
    data: page.data,
    lastActionId: page.lastActionId,
    stylesheetIds: ids.stylesheetIds,
  };

  return {
    id: pebGenerateId('action'),
    createdAt: new Date(),
    targetPageId: nextPage.id,
    affectedPageIds: [nextPage.id],
    effects: [
      pebCreateEffect(PebTemplateEffect.Init, nextPage.templateId, page.template),
      ...Object.values(PebScreen).map(screen => (
        pebCreateEffect(PebStylesheetEffect.Init, nextPage.stylesheetIds[screen], page.stylesheets[screen])
      )),
      pebCreateEffect(PebContextSchemaEffect.Init, nextPage.contextId, page.context),
      pebCreateEffect(PebPageEffect.Create, nextPage.id, nextPage),
      pebCreateEffect(PebShopEffect.AppendPage, null, nextPage.id),
      pebCreateEffect(PebShopEffect.PatchRouting, null, routes),
    ],
  };
}

function pebUpdatePageDataAction(payload: Partial<PebPageShort>): PebAction {
  return {
    id: pebGenerateId('action'),
    createdAt: new Date(),
    targetPageId: payload.id,
    affectedPageIds: [payload.id],
    effects: [
      pebCreateEffect(PebPageEffect.Update, payload.id, payload),
    ],
  };
}

import { cloneDeep } from 'lodash';

import { PebMasterElementIdMap, PebPage, PebPageId, PebShop, PebTemplate } from '../models/client';
import { PebShopRoute, PebShopThemeSnapshot } from '../models/database';
import { pebGenerateId } from '../utils/generate-id';
import { PebElementId, PebElementType } from '../models/element';
import { pebFilterElementsDeep, pebMapElementDeep } from '../utils/element-utils';
import { PebAction, PebEffectTarget } from '../models/action';

import { v4 as uuid } from 'uuid';

const usedByElements = {
  '#logo': [PebElementType.Logo],
};

export function pebCloneShopTheme(proto: PebShop): PebShop {
  const result = cloneDeep(proto);

  const pageMappings = proto.pages.reduce(
    (acc, page) => {
      acc.set(page.id, pebGenerateId());
      return acc;
    },
    new Map<PebElementId, PebElementId>(),
  );

  const pages = result.pages.map(page => ({
    ...page,
    id: pageMappings.get(page.id),
  }));

  Object.keys(result.context).forEach((key) => {
    if (!usedByElements[key]) {
      return;
    }

    const elements = pages.reduce(
      (acc, page) => ([
        ...acc,
        ...pebFilterElementsDeep(page.template, e => !!usedByElements[key].find((t: PebElementType) => t === e.type)),
      ]),
      [],
    );

    result.context[key].usedBy = elements.map(el => el.id);
  });

  const routing = result.routing.map((route: PebShopRoute) => {
    const pageId = pageMappings.get(route.pageId);
    return {
      pageId,
      routeId: route.routeId,
      url: route.url,
    };
  });

  return { ...result, routing, pages };
}

export function generateUniqueIdsForPage(page: PebPage): PebMasterElementIdMap {
  const idsMap: PebMasterElementIdMap = {};
  pebMapElementDeep(page.template, (el) => {
    const nextId = uuid();
    idsMap[el.id] = nextId;
    return el;
  });

  return idsMap;
}

export function applyIdsMapForPage(page: PebPage, idsMap: PebMasterElementIdMap): PebPage {

  const template = pebMapElementDeep(
    page.template,
    el => ({ ...el, id: idsMap[el.id] ? idsMap[el.id] : el.id }),
  ) as PebTemplate;

  const stylesheets = Object.entries(page.stylesheets).reduce(
    (acc, [screen, stylesheet]) => ({
      ...acc,
      [screen]: Object.entries(stylesheet).reduce(
        (a, [elId, styles]) => {
          return {
            ...a,
            [idsMap[elId] ? idsMap[elId] : elId]: styles,
          };
        },
        {},
      ),
    }),
    {},
  );

  return {
    ...page,
    stylesheets,
    template,
    master: {
      ...page.master,
      idsMap,
    },
  };
}

export function extractPageActionsFromSnapshot(
  actions: PebAction[],
  snapshot: PebShopThemeSnapshot, pageId: PebPageId,
): PebAction[] {
  const page = snapshot.pages[pageId];

  const effectTargets = [
    `${PebEffectTarget.Pages}:${page.id}`,
    `${PebEffectTarget.Templates}:${page.templateId}`,
    ...Object.values(page.stylesheetIds).map(sid =>
      `${PebEffectTarget.Stylesheets}:${sid}`,
    ),
    `${PebEffectTarget.ContextSchemas}:${page.contextId}`,
  ];

  return actions.filter(a =>
    a.effects.find(e => effectTargets.includes(e.target)),
  );
}


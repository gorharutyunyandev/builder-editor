import { PebShopEffect } from '../../models/action';
import { PebShopRoute } from '../../models/database';
import { PebPageId, PebShopData } from '../../models/client';
import { PebShopShort } from '../../models/editor';

export const pebShopEffectHandlers: {
  [effectName in PebShopEffect]: (prevShop: null | PebShopShort, payload: any) => PebShopShort
} = {
  [PebShopEffect.Init]: pebShopEffectCreateHandler,
  [PebShopEffect.UpdateData]: pebShopEffectUpdateDataHandler,
  [PebShopEffect.UpdateRouting]: pebShopEffectUpdateRoutingHandler,
  [PebShopEffect.PatchRouting]: pebShopEffectPatchRoutingHandler,
  [PebShopEffect.DeleteRoutes]: pebShopEffectDeleteRoutesHandler,
  [PebShopEffect.UpdatePages]: pebShopEffectUpdatePagesHandler,
  [PebShopEffect.AppendPage]: pebShopEffectAppendPageHandler,
  [PebShopEffect.DeletePage]: pebShopEffectDeletePageHandler,
};

function pebShopEffectCreateHandler(_: null, payload: PebShopShort): PebShopShort {
  return payload;
}

function pebShopEffectUpdateDataHandler(prevShop: PebShopShort, payload: Partial<PebShopData>): PebShopShort {
  return {
    ...prevShop,
    data: {
      ...prevShop.data,
      ...payload,
    },
  };
}

function pebShopEffectUpdateRoutingHandler(prevShop: PebShopShort, payload: PebShopRoute[]) {
  return {
    ...prevShop,
    routing: payload,
  };
}

function pebShopEffectPatchRoutingHandler(prevShop: PebShopShort, payload: PebShopRoute[]) {
  const updatedRoutes = payload.filter(route => prevShop.routing.find(r => r.routeId === route.routeId));
  const newRoutes = payload.filter(route => !updatedRoutes.find(r => r.routeId === route.routeId));
  const oldRoutes = prevShop.routing.filter(route =>
    !updatedRoutes.find(r => r.routeId === route.routeId) && !newRoutes.find(r => r.routeId === route.routeId),
  );

  return {
    ...prevShop,
    routing: [
      ...updatedRoutes,
      ...newRoutes,
      ...oldRoutes,
    ],
  };
}

function pebShopEffectDeleteRoutesHandler(prevShop: PebShopShort, payload: PebShopRoute[]) {
  const routing = prevShop.routing.filter(route => !payload.find(r => r.routeId === route.routeId));

  return {
    ...prevShop,
    routing,
  };
}

function pebShopEffectUpdatePagesHandler(prevShop: PebShopShort, payload: PebPageId[]): PebShopShort {
  return {
    ...prevShop,
    pageIds: payload,
  };
}

function pebShopEffectAppendPageHandler(prevShop: PebShopShort, payload: PebPageId): PebShopShort {
  return {
    ...prevShop,
    pageIds: [...prevShop.pageIds, payload],
  };
}

function pebShopEffectDeletePageHandler(prevShop: PebShopShort, payload: PebPageId): PebShopShort {
  return {
    ...prevShop,
    pageIds: prevShop.pageIds?.length
      ? prevShop.pageIds.filter(id => id !== payload)
      : [],
    routing: prevShop.routing?.length
      ? prevShop.routing.filter(route => route.pageId !== payload)
      : [],
  };
}

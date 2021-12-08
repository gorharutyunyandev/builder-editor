import { PebPageEffect } from '../../models/action';
import { PebPageShort } from '../../models/editor';

export const pebPageEffectHandler: {
  [effectName in PebPageEffect]: (page: null | PebPageShort, payload: any) => PebPageShort | null
} = {
  [PebPageEffect.Create]: pebPageEffectCreateHandler,
  [PebPageEffect.Update]: pebPageEffectUpdateHandler,
  [PebPageEffect.Delete]: pebPageEffectDeleteHandler,
};

function pebPageEffectCreateHandler(_: null, payload: PebPageShort): PebPageShort {
  return payload;
}

function pebPageEffectUpdateHandler(prevPage: PebPageShort, payload: Partial<PebPageShort>): PebPageShort {
  return {
    ...prevPage,
    name: payload.name ? payload.name : prevPage.name,
    variant: payload.variant ? payload.variant : prevPage.variant,
    master: {
      ...(prevPage.master ? prevPage.master : {}),
      ...payload.master,
    },
    data: {
      ...prevPage.data,
      ...payload.data,
    },
  };
}

function pebPageEffectDeleteHandler(): PebPageShort {
  return null;
}

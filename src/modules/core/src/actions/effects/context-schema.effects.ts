import { assign } from 'lodash';

import { PebContextSchemaEffect } from '../../models/action';
import { PebContextSchema, PebContextSchemaId } from '../../models/client';

export const pebContextSchemaEffectHandlers: {
  [effectName in PebContextSchemaEffect]:
  (schema: null | PebContextSchema, payload: PebContextSchema | string) => PebContextSchema | null
} = {
  [PebContextSchemaEffect.Init]: pebContextSchemaEffectInitHandler,
  [PebContextSchemaEffect.Update]: pebContextSchemaEffectUpdateHandler,
  [PebContextSchemaEffect.Delete]: pebContextSchemaEffectDeleteHandler,
  [PebContextSchemaEffect.Destroy]: pebContextSchemaEffectDestroyHandler,
};

function pebContextSchemaEffectInitHandler(_: null, payload: PebContextSchema): PebContextSchema {
  return payload;
}

function pebContextSchemaEffectUpdateHandler(
  prevSchema: PebContextSchema,
  payload: PebContextSchema,
): PebContextSchema {
  return assign({}, prevSchema, payload);
}

function pebContextSchemaEffectDeleteHandler(
  prevSchema: PebContextSchema,
  payload: PebContextSchemaId,
): PebContextSchema {
  if (prevSchema[payload]) {
    delete prevSchema[payload];
  }
  return prevSchema;
}

function pebContextSchemaEffectDestroyHandler(): PebContextSchema {
  return null;
}

import { merge, omit } from 'lodash';

import { PebStylesheetEffect, PebStylesReplacePayload } from '../../models/action';
import { PebStylesheet, PebStylesheetId } from '../../models/client';

export const pebStylesheetEffectHandlers: {
  [effectName in PebStylesheetEffect]: (
    stylesheet: null | PebStylesheet,
    payload: PebStylesheet | string | PebStylesReplacePayload,
  ) => PebStylesheet | null
} = {
  [PebStylesheetEffect.Init]: pebStylesheetInitHandler,
  [PebStylesheetEffect.Update]: pebStylesheetUpdateHandler,
  [PebStylesheetEffect.Replace]: pebStylesheetReplaceHandler,
  [PebStylesheetEffect.Delete]: pebStylesheetDeleteHandler,
  [PebStylesheetEffect.Destroy]: pebStylesheetDestroyHandler,
};

function pebStylesheetInitHandler(_: null, payload: PebStylesheet): PebStylesheet {
  return payload;
}

function pebStylesheetUpdateHandler(prevState: PebStylesheet, payload: PebStylesheet): PebStylesheet {
  return merge(
    {},
    prevState,
    payload,
  );
}

function pebStylesheetReplaceHandler(prevState: PebStylesheet, payload: PebStylesReplacePayload): PebStylesheet {
  return {
    ...(omit(prevState, [payload.selector])),
    [payload.selector]: payload.styles,
  };
}

function pebStylesheetDeleteHandler(prevState: PebStylesheet, payload: PebStylesheetId): PebStylesheet {
  return omit(prevState, [payload]);
}

function pebStylesheetDestroyHandler(): PebStylesheet {
  return null;
}

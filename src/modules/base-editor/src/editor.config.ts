import { PebElementType } from '@pe/builder-core';

import { PebEditorTextMaker } from './makers/text/text.maker';

export const defaultMakers = {
  [PebElementType.Text]: PebEditorTextMaker,
  // [PebElementType.Button]: PebButtonMaker,
};

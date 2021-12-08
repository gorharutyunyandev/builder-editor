import { PebAbstractElement } from '@pe/builder-renderer';

import { PebEditorTextMaker } from './text.maker';
import { PebAbstractMaker } from '../abstract-maker';

export const isTextMaker = (value: PebAbstractElement | PebAbstractMaker): value is PebEditorTextMaker =>
  value instanceof PebEditorTextMaker;

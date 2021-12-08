import { PebScreen } from '@pe/builder-core';

export interface PebRendererOptions {
  screen: PebScreen;
  scale: number;
  locale: string;
  interactions: boolean;
}

export const ELEMENT_ID_ATTRIBUTE = 'peb-element-id';

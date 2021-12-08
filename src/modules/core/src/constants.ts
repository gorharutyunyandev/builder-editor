export enum PebScreen {
  Desktop = 'desktop',
  Tablet = 'tablet',
  Mobile = 'mobile',
}

export const PEB_DESKTOP_CONTENT_WIDTH = 1024;

export const PEB_DEFAULT_FONT_SIZE = 15;
export const PEB_DEFAULT_FONT_COLOR = '#d4d4d4';
export const PEB_DEFAULT_FONT_FAMILY = 'Roboto';

export const pebLinkDatasetLink = {
  id: 'peb-link-id',
  type: 'peb-link-action',
  payload: 'peb-link-payload',
};

export const pebScreenWidthList = {
  [PebScreen.Desktop]: 1200,
  [PebScreen.Tablet]: 768,
  [PebScreen.Mobile]: 360,
};

/** @deprecated */
// tslint:disable-next-line: variable-name
export const PebLinkDatasetLink = pebLinkDatasetLink;

/** @deprecated */
// tslint:disable-next-line: variable-name
export const PebScreenWidthList = pebScreenWidthList;

/** @deprecated should use normal font-size property */
export const PEB_FONT_SIZE_ATTRIBUTE = 'peb-font-size';

export interface FontFamily {
  label: string;
  value: string;
}

export const pebFontFamilies: FontFamily[] = [
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'PT Sans', value: 'PT Sans' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Space Mono', value: 'Space Mono' },
  { label: 'Work Sans', value: 'Work Sans' },
  { label: 'Rubik', value: 'Rubik' },
];

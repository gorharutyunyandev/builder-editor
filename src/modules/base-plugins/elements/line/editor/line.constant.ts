import { SelectOption } from '@pe/builder-editor';

export const lineFillOptions: SelectOption[] = [
  {
    name: 'Color fill',
    value: 'color',
  },
];

export enum FillOptions {
  ColorFill = 'Color fill',
  Gradient = 'Gradient fill',
}

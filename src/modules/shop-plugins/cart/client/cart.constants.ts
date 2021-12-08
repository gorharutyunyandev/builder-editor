import { PebElementDef, PebElementId, PebElementType } from '@pe/builder-core';

export enum PebCartVariant {
  SquareCart = 'square-cart',
  AngularCart = 'angular-cart',
  FlatCart = 'flat-cart',
  SquareCartEmpty = 'square-cart--empty',
  AngularCartEmpty = 'angular-cart--empty',
  FlatCartEmpty = 'flat-cart--empty',
}

export interface PebElementCart extends PebElementDef {
  id: PebElementId;
  type: PebElementType.Cart;
  data: {
    text?: string;
    variant: PebCartVariant;
  };
  children: null;
}

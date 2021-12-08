import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import {
  defaultColors,
  PebAbstractSidebar,
  PebEditorElementCart,
  PebEditorElementPropertyAlignment,
} from '@pe/builder-editor';

import { fillOptions } from './cart.constant';

export enum CartFillOptions {
  ColorFill = 'Color fill',
  Gradient = 'Gradient fill',
}

@Component({
  selector: 'peb-shop-editor-cart-sidebar',
  templateUrl: './cart.sidebar.html',
  styleUrls: [
    './cart.sidebar.scss',
    '../../../../../base-plugins/sidebars.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebEditorCartSidebarComponent extends PebAbstractSidebar {
  @Input() component: PebEditorElementCart;

  gridColors = defaultColors;
  cartColorFillTypes = fillOptions;

  alignment: PebEditorElementPropertyAlignment;
}

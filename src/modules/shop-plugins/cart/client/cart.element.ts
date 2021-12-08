import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { sum } from 'lodash';

import {
  PebElementContext,
  PebElementContextState,
  PebElementStyles,
  pebInteractionCreator,
  transformStyleProperty,
} from '@pe/builder-core';
import { PebAbstractElement } from '@pe/builder-renderer';

import { PebCartVariant, PebElementCart } from './cart.constants';

type CartContext = PebElementContext<Array<{ count: number; product: any; }>>;

@Component({
  selector: 'peb-element-shop-cart',
  templateUrl: './cart.element.html',
  styleUrls: ['../../../renderer/src/elements/_abstract/abstract.element.scss', './cart.element.scss'],
})
export class PebShopCartElement extends PebAbstractElement {
  PebCartVariant = PebCartVariant;

  @Input() element: PebElementCart;
  @Input() styles: PebElementStyles;
  @Input() context: CartContext;

  @ViewChild('wrapper') wrapperEl: ElementRef;

  PebElementContextState = PebElementContextState;
  defaultColor = 'black';

  static contextFetcher(ctx) {
    return ctx['@cart'];
  }

  get elements(): { [key: string]: HTMLElement } {
    return {
      host: this.nativeElement,
      wrapper: this.wrapperEl?.nativeElement,
    };
  }

  get mappedStyles() {
    const { scale } = this.options;
    const styles = this.styles;

    return {
      host: {
        display: 'block',
        position: this.styles.position ?? 'relative',
        color: this.styles.color,
        fontSize: transformStyleProperty(this.styles.fontSize, scale),
        width: transformStyleProperty(this.styles.width, scale),
        height: transformStyleProperty(this.styles.height, scale),

        ...('gridArea' in this.styles && { gridArea: this.styles.gridArea }),
        ...('gridRow' in this.styles && { gridRow: this.styles.gridRow }),
        ...('gridColumn' in this.styles && { gridColumn: this.styles.gridColumn }),

        ...('margin' in this.styles && { margin: transformStyleProperty(this.styles.margin, scale) }),
        ...('marginTop' in this.styles && { marginTop: transformStyleProperty(this.styles.marginTop, scale) }),
        ...('marginRight' in this.styles && { marginRight: transformStyleProperty(this.styles.marginRight, scale) }),
        ...('marginBottom' in this.styles && { marginBottom: transformStyleProperty(this.styles.marginBottom, scale) }),
        ...('marginLeft' in this.styles && { marginLeft: transformStyleProperty(this.styles.marginLeft, scale) }),

        ...('padding' in this.styles && { padding: transformStyleProperty(this.styles.padding, scale) }),
      },
      wrapper: {
        transform: this.styles.transform,
      },
    };
  }

  get totalItems(): string {
    const totalItems = sum(this.context?.data?.map(i => i.count));

    return totalItems > 99 ? '99+' : String(totalItems);
  }

  borderWidth(w: string) {
    if (w === 'cart') {
      return this.styles.borderWidth ? (+this.styles.borderWidth / 2) * this.options.scale : null;
    }

    if (w === 'badge') {
      return this.styles.badgeBorderWidth ? (+this.styles.badgeBorderWidth / 2) * this.options.scale : null;
    }
  }

  dashArray(w: string) {
    let borderStyle;

    if (w === 'cart') {
      borderStyle = this.styles.borderStyle;
    }

    if (w === 'badge') {
      borderStyle = this.styles.badgeBorderStyle;
    }

    let array;

    if (borderStyle === 'shortdashed') {
      array = [1, 1];
    }

    if (borderStyle === 'dashed') {
      array = [2, 2];
    }

    if (borderStyle === 'longdashed') {
      array = [6, 6];
    }

    if (borderStyle === 'dotted') {
      array = [0.001, 3];
    }

    if (!array) {
      return undefined;
    }

    array = array.map((x: number) => x * this.borderWidth(w)).join(' ');

    return array;
  }

  get backgroundColor(): string {
    return (this.styles.backgroundColor || this.defaultColor) as string;
  }

  @HostListener('click', ['$event'])
  onOpenCart(): void {
    if (!this.options.interactions) {
      return;
    }

    this.interact(pebInteractionCreator.cart.click());
  }
}

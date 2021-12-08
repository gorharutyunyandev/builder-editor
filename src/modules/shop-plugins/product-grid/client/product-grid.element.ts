import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import {
  PebElementContext,
  PebElementContextState,
  PebElementDef,
  PebElementStyles,
  pebInteractionCreator,
  transformStyleProperty,
} from '@pe/builder-core';
import { PebAbstractElement } from '@pe/builder-renderer';

import { PebShopProductElement } from './product/product.element';

const PEB_DEFAULT_PRODUCTS_FONT_SIZE = 13;
const PEB_DEFAULT_PRODUCTS_GRID_GAP = 15;

export interface PebProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  salePrice: string;
  currency: string;
  images: string[];
}

type ProductsContext = PebElementContext<PebProduct[]>;

@Component({
  selector: 'peb-element-shop-products',
  templateUrl: './product-grid.element.html',
  styleUrls: ['./product-grid.element.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebShopProductsElement extends PebAbstractElement
  implements AfterViewInit {
  @Input() element: PebElementDef;
  @Input() styles: PebElementStyles;
  @Input() context: ProductsContext;

  @ViewChild('productsGridRef') productsGridRef: ElementRef;
  @ViewChildren(PebShopProductElement, { read: ElementRef })
  productElements: QueryList<ElementRef>;

  PebElementContextState = PebElementContextState;

  get products() {
    if (!this.context?.data?.length) {
      const columns = Number(this.styles?.productTemplateColumns || 2);
      const rows = Number(this.styles?.productTemplateRows || 1);
      const possibleSlotsQuantity = columns * rows;

      return Array.from(Array(possibleSlotsQuantity).keys()).map(() => null);
    }

    return this.context?.data;
  }

  get elements(): { [key: string]: HTMLElement | HTMLElement[] } {
    return {
      host: this.nativeElement,
      productsGrid: this.productsGridRef?.nativeElement,
      products: this.productElements?.toArray().map(a => a.nativeElement) || [],
    };
  }

  get mappedStyles() {
    const { scale } = this.options;
    const styles:any = this.styles;

    const itemWidth = Number(styles.itemWidth ?? 220);
    const itemHeight = Number(styles.itemHeight ?? 280);

    const columns = Number(styles.productTemplateColumns ?? 1);
    const rows = Number(styles.productTemplateRows ?? 1);

    const productTemplateColumns = this.context?.data?.length
      ? columns > this.context.data.length
        ? this.context.data.length
        : columns
      : columns;

    const productTemplateRows = this.context?.data?.length
      ? Math.ceil(this.context.data?.length / productTemplateColumns)
      : rows;

    return {
      host: {
        position: 'relative',
        fontSize: `${PEB_DEFAULT_PRODUCTS_FONT_SIZE * scale}px`,
        ...('gridArea' in styles && { gridArea: styles.gridArea }),
        ...('gridRow' in styles && { gridRow: styles.gridRow }),
        ...('gridColumn' in styles && { gridColumn: styles.gridColumn }),
        ...('margin' in styles && { margin: transformStyleProperty(styles.margin, scale) }),
        ...('marginTop' in styles && { marginTop: transformStyleProperty(styles.marginTop, scale) }),
        ...('marginRight' in styles && { marginRight: transformStyleProperty(styles.marginRight, scale) }),
        ...('marginBottom' in styles && { marginBottom: transformStyleProperty(styles.marginBottom, scale) }),
        ...('marginLeft' in styles && { marginLeft: transformStyleProperty(styles.marginLeft, scale) }),
        ...('textAlign' in styles && { textAlign: styles.textAlign }),
        ...('width' in styles && { width: transformStyleProperty(styles.width, scale) }),
        ...('height' in styles && { height: transformStyleProperty(styles.height, scale) }),
      },
      products: {
        width: `${itemWidth * scale}px`,
        height: `${itemHeight * scale}px`,
        ...('boxShadow' in styles && { boxShadow: styles.boxShadow }),
      },
      productsGrid: {
        gridTemplateColumns: `repeat(${productTemplateColumns}, minmax(${+itemWidth * scale}px, 1fr))`,
        gridTemplateRows: `repeat(${productTemplateRows}, minmax(${+itemHeight * scale}px, 1fr))`,
        gridColumnGap: transformStyleProperty(styles.columnGap, scale) || `${PEB_DEFAULT_PRODUCTS_GRID_GAP * scale}px`,
        gridRowGap: transformStyleProperty(styles.rowGap, scale),
      },
    };
  }

  addToCart() {
    if (!this.options.interactions) {
      return;
    }

    this.interact(pebInteractionCreator.product.addToCart(this.context.data));
  }

  @HostBinding('class')
  get hostClass() {
    return `state-${this.context?.state}`;
  }

  // TODO: clean up after fix
  ngAfterViewInit() {
    this.applyStyles();
  }
}

import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';

import {
  PebElementContext,
  PebElementContextState,
  PebElementDef,
  PebElementStyles,
  pebInteractionCreator,
  PebScreen,
  transformStyleProperty,
} from '@pe/builder-core';
import { PebAbstractElement, PebRendererOptions } from '@pe/builder-renderer';

interface ProductElement extends PebElementDef {
  variant: 'link' | 'purchase';
}
interface ProductData {
  title: string;
  description: string;
  price: string;
  salePrice: string;
  currency: string;
  images: string[];
  variants: Array<{
    id: string;
    title: string;
    description: string;
    price: string;
    salePrice: string;
    disabled?: boolean;
    options: Array<{ name: string; value: string; disabled?: boolean; }>;
    images: string[];
  }>;
}
type ProductDetailsContext = PebElementContext<ProductData>;

// TODO: Add empty state layout
@Component({
  selector: 'peb-element-shop-product-details',
  templateUrl: './product-details.element.html',
  styleUrls: ['./product-details.element.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebShopProductDetailsElement extends PebAbstractElement {
  @Input() element: ProductElement;
  @Input() styles: PebElementStyles;
  @Input() options: PebRendererOptions;

  carouselElement: ProductElement = {
    ...this.element,
  };

  @Input() set context(context: ProductDetailsContext) {
    const product = context?.data;
    if (!product) {
      this.contextSubject.next(context);
      return;
    }

    const preparedProduct: ProductData = {
      ...product,
      variants: product.variants
        ? [
          ...product.variants.map(v => ({
            ...v,
            options: v.options.map(o => ({
              ...o,
              name: o.name.trim(),
              value: o.value.trim(),
            })),
          })),
        ]
        : [],
    };

    this.contextSubject.next({
      ...context,
      data: preparedProduct,
    });
  }

  get context(): ProductDetailsContext {
    return this.contextSubject.value;
  }

  contextSubject = new BehaviorSubject<ProductDetailsContext>(null);

  elementContextState = PebElementContextState;
  PebScreen = PebScreen;
  selectedOptions = {};

  selectedVariantIndexSubject = new BehaviorSubject<number>(0);

  defaultFontSize = 12;
  defaultFontFamily = 'Roboto';

  activeProduct$: Observable<any> = combineLatest([
    this.contextSubject,
    this.selectedVariantIndexSubject,
  ]).pipe(
    filter(([context]) => !!context && !!context.data),
    map(
      ([product, selectedVariantIndex]) =>
        (product.data.variants || [])[selectedVariantIndex] || product.data,
    ),
    shareReplay(1),
  );

  @ViewChild('titleRef') titleRef: ElementRef;
  @ViewChild('wrapper') wrapperRef: ElementRef;
  @ViewChild('button') buttonRef: ElementRef;
  @ViewChild('carousel') carouselRef: ElementRef;

  static contextFetcher(ctx) {
    return ctx['@product-details'];
  }

  selectedVariantChanged(index: number): void {
    this.selectedVariantIndexSubject.next(index);
    // this.activeSlideIndexSubj$.next(0);
  }

  getAvailableOptions(option: any): any[] {
    const product = this.contextSubject.value.data;
    if (!product || !product.variants || !product.variants.length) {
      return [];
    }

    const options = product.variants.reduce((acc, v) => {
      const filteredOption = v.options.find((o) => {
        const duplicated = acc.find(item => item.value === o.value);
        const sameOption = o.name === option.name;

        return sameOption && !duplicated;
      });

      if (!filteredOption) {
        return acc;
      }

      const disabled = product.variants.find(variant =>
        variant.options.every(a =>
          filteredOption.name === a.name
            ? filteredOption.value === a.value
            : !this.selectedOptions[a.name] ||
              this.selectedOptions[a.name] === a.value,
        ),
      );

      filteredOption.disabled = !disabled;

      return [...acc, filteredOption];
    },                                      []);

    const value = this.selectedOptions[options[0].name];
    const singleOption = !value && options.length === 1;

    if (value === undefined || singleOption) {
      this.selectedOptions[options[0].name] = options[0].value;
      this.cdr.detectChanges();
    }

    return options;
  }

  onChangeOption(value: string, option: any) {
    const availableOptions = this.getAvailableOptions(option);
    const selectedOption = availableOptions.find(o => o.value === value);

    if (selectedOption && selectedOption.disabled) {
      Object.keys(this.selectedOptions)
        .filter(k => k !== selectedOption.name)
        .forEach(key => (this.selectedOptions[key] = null));

      return;
    }

    const product = this.context.data;
    const selectedVariant = product.variants.findIndex(v =>
      v.options.every(
        o =>
          !this.selectedOptions[o.name] ||
          this.selectedOptions[o.name] === o.value,
      ),
    );

    this.selectedVariantIndexSubject.next(selectedVariant);
  }

  allOptionsSelected(options) {
    if (!options || !options.length) {
      return true;
    }

    return options.every(o => this.selectedOptions[o.name]);
  }

  get elements(): { [key: string]: HTMLElement | HTMLElement[] } {
    return {
      host: this.nativeElement,
      title: this.titleRef?.nativeElement,
      wrapper: this.wrapperRef?.nativeElement,
      button: this.buttonRef?.nativeElement,
      carousel: this.carouselRef?.nativeElement,
    };
  }

  get mappedStyles() {
    const { scale } = this.options;
    const styles = this.styles;

    return {
      host: {
        position: 'relative',
        display: styles.display ?? 'flex',

        ...('gridArea' in styles && { gridArea: styles.gridArea }),
        ...('gridRow' in styles && { gridRow: styles.gridRow }),
        ...('gridColumn' in styles && { gridColumn: styles.gridColumn }),

        height: '100%',
        width: '100%',
        left: this.styles.left
          ? `${(this.styles.left as number) * scale}px`
          : null,
        top: styles.top
          ? `${(styles.top as number) * scale}px`
          : null,
        fontSize:
          `${(+styles.fontSize || this.defaultFontSize) * scale}px`,

        ...('margin' in styles && { margin: transformStyleProperty(styles.margin, scale) }),
        ...('marginTop' in styles && { marginTop: `${+styles.marginTop * scale}px` }),
        ...('marginRight' in styles && { marginRight: `${+styles.marginRight * scale}px` }),
        ...('marginBottom' in styles && { marginBottom: `${+styles.marginBottom * scale}px` }),
        ...('marginLeft' in styles && { marginLeft: `${+styles.marginLeft * scale}px` }),
      },
      title: {
        textDecoration: styles.textDecoration || null,
        fontWeight: styles.fontWeight || null,
        fontStyle: styles.fontStyle || null,
        fontFamily: styles.fontFamily || '',
      },
      wrapper: {
        transform: this.styles.transform || null,
        backgroundColor: this.styles.backgroundColor,
        height: '100%',
        width: this.styles.width
          ? this.options.screen === PebScreen.Mobile
            ? 'calc(100% - 2em)'
            : '100%'
          : '100%',
        color: this.styles.color || 'rgba(17,17,17,.85)',
        textDecoration: this.styles.textDecoration || null,
        fontWeight: this.styles.fontWeight || 'normal',
        fontStyle: this.styles.fontStyle || null,
        fontFamily: this.styles.fontFamily || this.defaultFontFamily,
        flexWrap: this.options.screen === PebScreen.Mobile ? 'wrap' : null,
      },
      button: {
        backgroundColor: styles.buttonBackgroundColor || '#000',
        color: styles.buttonColor || 'white',
        textDecoration: styles.buttonTextDecoration || null,
        fontWeight: styles.buttonFontWeight || null,
        fontStyle: styles.buttonFontStyle || null,
        fontFamily: styles.buttonFontFamily || this.defaultFontFamily,
        fontSize: `${(+styles.buttonFontSize || this.defaultFontSize) * scale}px`,
      },
      carousel: {
        height: this.setCarouselHeight(this.styles.height),
        width: this.setCarouselWidth(this.styles.width),
      },
    };
  }

  private setCarouselWidth(size?: string | number): string {
    if (!size) { return '100%'; }
    if (this.isDesktop) { return `${+size * this.options.scale}px`; }
    if (this.isTablet) { return '50%'; }
    if (this.isMobile) { return '100%'; }
  }

  private setCarouselHeight(size?: string | number): string {
    if (!size) { return null; }
    if (this.isDesktop || this.isTablet) { return `${+size * this.options.scale}px`; }
    if (this.isMobile) { return 'auto'; }
  }

  get isMobile(): boolean {
    return this.options.screen === PebScreen.Mobile;
  }

  get isTablet(): boolean {
    return this.options.screen === PebScreen.Tablet;
  }

  get isDesktop(): boolean {
    return this.options.screen === PebScreen.Desktop;
  }

  addToCart(activeProduct: any) {
    if (!this.options.interactions) {
      return;
    }

    this.interact(pebInteractionCreator.product.addToCart(activeProduct));
  }

  @HostBinding('class')
  get hostClass() {
    return `screen-${this.options.screen}`;
  }
}

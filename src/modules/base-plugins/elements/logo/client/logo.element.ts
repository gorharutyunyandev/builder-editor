import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';

import {
  PebElementContext,
  PebElementContextState,
  PebElementDef,
  PebElementStyles,
  pebInteractionCreator,
  transformStyleProperty,
} from '@pe/builder-core';
import { PebAbstractElement, PebRendererOptions } from '@pe/builder-renderer';

interface ImageDimensions {
  width: number;
  height: number;
}

@Component({
  selector: 'peb-element-logo',
  templateUrl: './logo.element.html',
  styleUrls: ['./logo.element.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebLogoElement extends PebAbstractElement implements AfterViewInit, DoCheck {
  @Input() element: PebElementDef;
  @Input() styles: PebElementStyles;
  @Input() options: PebRendererOptions;
  @Input() context: PebElementContext<{
    src: string;
    name: string;
  }>;

  PebElementContextState = PebElementContextState;
  imageDimensions: ImageDimensions;
  imageWidth: string;
  imageHeight: string;

  @ViewChild('wrapper') wrapperRef: ElementRef;
  @ViewChild('image') imageRef: ElementRef;
  @ViewChild('svg') svgRef: ElementRef<HTMLImageElement>;

  static contextFetcher(ctx) {
    return ctx['#logo'];
  }

  get elements(): { [key: string]: HTMLElement} {
    return {
      host: this.nativeElement,
      wrapper: this.wrapperRef?.nativeElement,
      image: this.imageRef?.nativeElement,
      svg: this.svgRef?.nativeElement,
    };
  }

  get mappedStyles() {
    const { scale } = this.options;
    const styles = this.styles;

    return {
      host: {
        position: styles.position ?? 'relative',
        width: transformStyleProperty(styles.width ?? '100%', scale),
        height: transformStyleProperty(styles.height ?? '100%', scale),
        cursor: this.options.interactions ? 'pointer' : 'initial',
        filter: '',
        ...('color' in styles && { color: styles.color }),
        ...('gridArea' in styles && { gridArea: styles.gridArea }),
        ...('gridRow' in styles && { gridRow: styles.gridRow }),
        ...('gridColumn' in styles && { gridColumn: styles.gridColumn }),
        ...('top' in styles && { top: transformStyleProperty(styles.top, scale) }),
        ...('left' in styles && { left: transformStyleProperty(styles.left, scale) }),
        ...('margin' in styles && { margin: transformStyleProperty(styles.margin, scale) }),
        ...('marginTop' in styles && { marginTop: transformStyleProperty(styles.marginTop, scale) }),
        ...('marginRight' in styles && { marginRight: transformStyleProperty(styles.marginRight, scale) }),
        ...('marginBottom' in styles && { marginBottom: transformStyleProperty(styles.marginBottom, scale) }),
        ...('marginLeft' in styles && { marginLeft: transformStyleProperty(styles.marginLeft, scale) }),
        ...('padding' in styles && { padding: transformStyleProperty(styles.padding, scale) }),
      },
      wrapper: {
        display: styles.display ?? 'block',
        ...('opacity' in styles && { opacity: styles.opacity }),
      },
      image: {
        backgroundImage: this.context?.data?.src ? `url(${this.context?.data?.src})` : '',
        width: this.imageWidth,
        height: this.imageHeight,
        borderStyle: styles.borderStyle ? styles.borderStyle : '',
        borderColor: styles.borderColor ? styles.borderColor : '',
        borderWidth: styles.borderWidth ? transformStyleProperty(styles.borderWidth, this.options.scale) : '0px',
        filter: styles.filter,
      },
      svg: {
        ...('opacity' in styles && { opacity: styles.opacity }),
      },
    };
  }

  borderWidth(w: string) {
    return this.styles.borderWidth ? (+this.styles.borderWidth / 2) * this.options.scale : null;
  }

  dashArray(w: string) {
    let array;

    if (this.styles.borderStyle === 'shortdashed') {
      array = [1, 1];
    }

    if (this.styles.borderStyle === 'dashed') {
      array = [2, 2];
    }

    if (this.styles.borderStyle === 'longdashed') {
      array = [6, 6];
    }

    if (this.styles.borderStyle === 'dotted') {
      array = [0.001, 3];
    }

    if (!array) {
      return undefined;
    }

    array = array.map((x: number) => x * this.borderWidth(w)).join(' ');

    return array;
  }

  @HostListener('click')
  onClick() {
    if (!this.options.interactions) {
      return;
    }

    this.interact(pebInteractionCreator.navigate.internal('/'));
  }

  getImageDimensions() {
    if (this.context?.data?.src) {
      const img = new Image();
      img.src = this.context?.data?.src;
      this.element.data = {
        width: img.width,
        height: img.height,
      };
    }
  }

  calcDimensions(elementWidth, elementHeight, elCmp) {
    const imageWidthToHeightRatio = elCmp.element.data?.width / elCmp.element.data?.height;
    const imageHeightToWidthRatio = elCmp.element.data?.height / elCmp.element.data?.width;

    const elementWidthToHeightRatio =
      (+elementWidth - (elCmp.styles.border ? +elCmp.styles.borderSize * 2 : 0))
      / (+elementHeight - (elCmp.styles.border ? +elCmp.styles.borderSize * 2 : 0));

    const elementHeightToWidthRatio =
      (+elementHeight - (elCmp.styles.border ? +elCmp.styles.borderSize * 2 : 0))
      / (+elementWidth - (elCmp.styles.border ? +elCmp.styles.borderSize * 2 : 0));

    const curWidth = `${(+elementWidth) * imageWidthToHeightRatio / elementWidthToHeightRatio}px`;
    const imageWidth = elementHeightToWidthRatio > imageHeightToWidthRatio ? '100%' : curWidth;

    const curHeight = `${(+elementHeight) * imageHeightToWidthRatio / elementHeightToWidthRatio}px`;
    const imageHeight = elementHeightToWidthRatio < imageHeightToWidthRatio ? '100%' : curHeight;
    return { imageWidth, imageHeight };
  }

  setImageDimensions() {
    this.getImageDimensions();
    const imageDimensions = this.calcDimensions(
      this.nativeElement.clientWidth,
      this.nativeElement.clientHeight,
      this,
    );
    this.imageWidth = imageDimensions.imageWidth;
    this.imageHeight = imageDimensions.imageHeight;
    this.applyStyles();
  }

  @HostBinding('class.interactions')
  get classFrontPage(): boolean {
    return this.options.interactions;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseMove(event) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setImageDimensions();
    }, 200);
  }
  ngDoCheck() {
    this.setImageDimensions();
  }
}

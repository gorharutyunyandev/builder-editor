import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

import {
  PebElementDef,
  PebElementStyles,
  pebInteractionCreator,
  PebInteractionType,
  PEB_DEFAULT_FONT_SIZE,
  transformStyleProperty,
} from '@pe/builder-core';
import { PebAbstractElement, PebRendererOptions } from '@pe/builder-renderer';

@Component({
  selector: 'peb-element-image',
  templateUrl: './image.element.html',
  styleUrls: ['./image.element.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebImageElement extends PebAbstractElement implements OnInit {
  @Input() element: PebElementDef;
  @Input() styles: PebElementStyles;
  @Input() options: PebRendererOptions;

  private readonly fontSize = 13;

  loading = true;

  @ViewChild('image') imageRef: ElementRef<HTMLImageElement>;
  @ViewChild('defaultImage') defaultImageRef: ElementRef<HTMLImageElement>;

  ngOnInit() {
  }

  get elements(): { [ key: string ]: HTMLElement | HTMLElement[] } {
    return {
      host: this.nativeElement,
      image: this.imageRef?.nativeElement,
      defaultImage: this.defaultImageRef?.nativeElement,
    };
  }

  get potentialContainer() {
    return this.nativeElement;
  }

  get mappedStyles() {
    const styles = this.styles;
    const { scale } = this.options;

    return {
      host: {
        position: styles.position ?? 'relative',
        display: styles.display ?? 'flex',
        flexDirection: styles.flexDirection ?? 'row',
        alignContent: styles.alignContent ?? 'auto',
        ...('gridArea' in styles && { gridArea: styles.gridArea }),
        ...('gridRow' in styles && { gridRow: styles.gridRow }),
        ...('gridColumn' in styles && { gridColumn: styles.gridColumn }),
        ...('color' in styles && { color: styles.color }),
        ...('width' in styles && { width: transformStyleProperty(styles.width, scale) }),
        ...('height' in styles && { height: transformStyleProperty(styles.height, scale) }),
        ...('top' in styles && { top: transformStyleProperty(styles.top, scale) }),
        ...('right' in styles && { right: transformStyleProperty(styles.right, scale) }),
        ...('height' in styles && { height: transformStyleProperty(styles.height, scale) }),
        ...('bottom' in styles && { bottom: transformStyleProperty(styles.bottom, scale) }),
        ...('opacity' in styles && { opacity: styles.opacity }),
        ...('filter' in styles && { filter: styles.filter }),
        ...('margin' in styles && { margin: transformStyleProperty(styles.margin, scale) }),
        ...('marginTop' in styles && { marginTop: transformStyleProperty(styles.marginTop, scale) }),
        ...('marginRight' in styles && { marginRight: transformStyleProperty(styles.marginRight, scale) }),
        ...('marginBottom' in styles && { marginBottom: transformStyleProperty(styles.marginBottom, scale) }),
        ...('marginLeft' in styles && { marginLeft: transformStyleProperty(styles.marginLeft, scale) }),
        ...('fontSize' in styles && { fontSize: transformStyleProperty(styles.fontSize, scale) }),
      },
      image: {
        objectFit: styles.objectFit ?? 'contain',
        ...('border' in styles && { border: styles.border }),
        ...('boxShadow' in styles && { boxShadow: styles.boxShadow }),
        ...('padding' in styles && { margin: transformStyleProperty(styles.padding, scale) }),
        ...('imageFilter' in styles && { filter: styles.imageFilter }),
      },
      defaultImage: {
        fontSize: `${PEB_DEFAULT_FONT_SIZE * scale}px`,
      },
    };
  }

  @HostListener('click')
  openProductPage() {
    if (!this.options.interactions || !this.element.data.action) {
      return;
    }

    const { payload, type } = this.element.data.action;

    const interaction =
      type === PebInteractionType.NavigateInternal
        ? pebInteractionCreator.navigate.internal(payload)
        : type === PebInteractionType.NavigateExternal
        ? pebInteractionCreator.navigate.external(payload)
        : null;

    if (!interaction) {
      console.warn('There is no interaction creator for: ', this.element.data);
      return;
    }

    this.interact(interaction);
  }

  loaded() {
    this.loading = false;
    this.cdr.detectChanges();
  }

  get src() {
    return this.styles?.background ?? this.element.data.src;
  }

  get doesHostHasSize(): boolean {
    return true;
  }

  get loadingInProgress(): boolean {
    return this.loading;
  }
}

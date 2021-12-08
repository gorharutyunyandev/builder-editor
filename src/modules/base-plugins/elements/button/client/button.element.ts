import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import {
  PebElementDef,
  PebElementStyles,
  pebInteractionCreator,
  PebInteractionType,
  PEB_DEFAULT_FONT_COLOR,
  PEB_DEFAULT_FONT_SIZE,
  transformStyleProperty,
} from '@pe/builder-core';
import { PebAbstractElement, PebRendererOptions } from '@pe/builder-renderer';

// TODO: Variant should be 'rounded' instead of 'button-rounded'

@Component({
  selector: 'peb-element-button',
  templateUrl: './button.element.html',
  styleUrls: ['./button.element.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebButtonElement extends PebAbstractElement {

  @Input() element: PebElementDef;
  @Input() styles: PebElementStyles;
  @Input() options: PebRendererOptions;

  PebInteractionType = PebInteractionType;

  @ViewChild('textContentRef') textContentRef: ElementRef;

  @HostBinding('attr.peb-link-type')
  get attrButtonLinkType() {
    return this.isActionLink && this.element.data.action.type
      ? this.element.data.action.type
      : null;
  }

  @HostBinding('attr.peb-link-data')
  get attrButtonLinkData() {
    return this.isActionLink && this.element.data.action.payload && this.element.data.action.payload.data
      ? this.element.data.action.payload.data
      : null;
  }

  @HostListener('click')
  onClick() {
    if (!this.element.data.action) {
      return;
    }

    const { payload, type } = this.element.data.action;

    const interaction =
      type === PebInteractionType.NavigateInternal
        ? pebInteractionCreator.navigate.internal(payload)
        : type === PebInteractionType.NavigateExternal
          ? pebInteractionCreator.navigate.external(payload)
          : type === PebInteractionType.CheckoutOpenAmount
            ? pebInteractionCreator.checkout.openAmount()
            : type === PebInteractionType.CheckoutOpenQr
              ? pebInteractionCreator.checkout.openQr()
              : null;

    if (!interaction) {
      console.warn('There is no interaction creator for: ', this.element.data);
      return;
    }

    this.interact(interaction);
  }

  // TODO: Create enum for button action type
  get isActionLink(): boolean {
    return this.element.data.action?.type.split('.')[0] === 'navigate';
  }

  get elements(): { [key: string]: HTMLElement } {
    return {
      host: this.nativeElement,
    };
  }

  get sanitizedText(): SafeHtml {
    let text = this.element.data.text;
    if (text === 'Amount') {
      switch (this.options?.locale) {
        case 'de':
          text = 'Betrag';
          break;
        case 'sv':
          text = 'Belopp';
          break;
      }
    }

    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  get textContent(): HTMLElement {
    return this.textContentRef.nativeElement;
  }

  // TODO: Should be somehow shared with button maker styles because it's 100% the same
  get mappedStyles(): any {
    const styles = this.styles;
    const { scale } = this.options;

    return  {
      host: {
        position: styles.position ?? 'relative',
        display: styles.display ?? 'inline-flex',
        textAlign: styles.textAlign ?? 'center',
        fontWeight: styles.fontWeight ?? 'normal',
        fontFamily: styles.fontFamily ?? 'Roboto',
        color: styles.color ?? '#FFF',
        justifyContent: styles.justifyContent ?? 'center',
        alignItems: styles.alignItems ?? 'center',
        cursor: this.options.interactions ? 'pointer' : 'normal',
        fontSize: transformStyleProperty(styles.fontSize || PEB_DEFAULT_FONT_SIZE, scale),
        width: styles.width ? transformStyleProperty(styles.width, scale) : 'max-content',
        height: styles.height ? transformStyleProperty(styles.height, scale) : 'max-content',
        backgroundColor: 'backgroundColor' in styles
          ? styles.backgroundColor
          : 'background' in styles
            ? styles.background
            : PEB_DEFAULT_FONT_COLOR,
        ...('backgroundImage' in styles && { backgroundImage: styles.backgroundImage }),
        minWidth: styles.minWidth ? transformStyleProperty(styles.minWidth, scale) : 'initial',
        maxWidth: styles.maxWidth ? transformStyleProperty(styles.maxWidth, scale) : 'initial',
        minHeight: styles.minHeight ? transformStyleProperty(styles.minHeight, scale) : 'initial',
        ...('zIndex' in styles && { zIndex: styles.zIndex }),
        ...('lineHeight' in styles && { lineHeight: styles.lineHeight }),
        ...('textDecoration' in styles && { textDecoration: styles.textDecoration }),
        ...('fontStyle' in styles && { fontStyle: styles.fontStyle }),
        ...('borderRadius' in styles && { borderRadius: transformStyleProperty(styles.borderRadius, scale) }),
        ...('top' in styles && { top: transformStyleProperty(styles.top, scale) }),
        ...('left' in styles && { left: transformStyleProperty(styles.left, scale) }),
        ...('transform' in styles && { transform: styles.transform }),
        ...('margin' in styles && { margin: transformStyleProperty(styles.margin, scale) }),
        ...('overflow' in styles && { overflow: styles.overflow }),
        ...('whiteSpace' in styles && { whiteSpace: styles.whiteSpace }),
        ...('textOverflow' in styles && { textOverflow: styles.textOverflow }),
        ...('gridArea' in styles && { gridArea: styles.gridArea }),
        ...('gridRow' in styles && { gridRow: styles.gridRow }),
        ...('gridColumn' in styles && { gridColumn: styles.gridColumn }),
        ...('boxShadow' in styles && { boxShadow: transformStyleProperty(styles.boxShadow, scale) }),
        ...('margin' in styles && { margin: transformStyleProperty(styles.margin, scale) }),
        ...('marginTop' in styles && { marginTop: transformStyleProperty(styles.marginTop, scale) }),
        ...('marginRight' in styles && { marginRight: transformStyleProperty(styles.marginRight, scale) }),
        ...('marginBottom' in styles && { marginBottom: transformStyleProperty(styles.marginBottom, scale) }),
        ...('marginLeft' in styles && { marginLeft: transformStyleProperty(styles.marginLeft, scale) }),
        ...('padding' in styles && { padding: transformStyleProperty(styles.padding, scale) }),
        // Rob asked to remove temporary borders from button element
        // borderStyle: styles.borderStyle ? styles.borderStyle : null ,
        // borderColor: styles.borderColor || null,
        // borderWidth: styles.borderWidth ? (+styles.borderWidth * scale + 'px') : null,
      },
    };
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

import {
  PebElementDef,
  PebElementStyles,
  PebInteraction,
  pebInteractionCreator,
  PebInteractionType,
  PebLink,
  transformStyleProperty,
} from '@pe/builder-core';
import { PebAbstractElement, PebRendererOptions } from '@pe/builder-renderer';

@Component({
  selector: 'peb-element-menu',
  templateUrl: './menu.element.html',
  styleUrls: [
    '../../../../renderer/src/elements/_abstract/abstract.element.scss',
    './menu.element.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebMenuElement extends PebAbstractElement {
  @Input() element: PebElementDef;
  @Input() styles: PebElementStyles;
  @Input() options: PebRendererOptions;

  @ViewChild('wrapper') wrapper: ElementRef;
  @ViewChild('mobileButtonWrapper') mobileButtonWrapper: ElementRef;
  @ViewChild('mobileButton') mobileButton: ElementRef;
  @ViewChildren('mobileButtonLine') mobileButtonLines: QueryList<ElementRef>;

  @ViewChild('mobileMenuRef') mobileMenuRef: ElementRef;

  static contextFetcher(ctx) {
    return { '#logo': ctx['#logo'], '@mobile-menu': ctx['@mobile-menu'] };
  }

  get menuContext() {
    return this.context ? this.context['@mobile-menu'] : null;
  }

  get logoContext() {
    return this.context ? this.context['#logo'] : null;
  }

  get elements(): { [key: string]: HTMLElement | HTMLElement[] } {
    return {
      host: this.nativeElement,
      wrapper: this.wrapper ? this.wrapper.nativeElement : null,
      mobileButtonWrapper: this.mobileButtonWrapper
        ? this.mobileButtonWrapper.nativeElement
        : null,
      mobileButton: this.mobileButton?.nativeElement,
      mobileButtonLine: this.mobileButtonLines
        ? this.mobileButtonLines.toArray().map(a => a.nativeElement)
        : [],
      mobileMenu: this.mobileMenuRef?.nativeElement,
    };
  }

  get mappedStyles() {
    const styles = this.styles;
    const { scale } = this.options;
    return {
      host: {
        display: styles.display || 'block',
        color: styles.color,
        background: styles.background,
        backgroundColor: styles.backgroundColor,
        position: styles.position || 'relative',
        width: styles.width ? transformStyleProperty(styles.width, scale) : 'fit-content',
        height: styles.height ? transformStyleProperty(styles.height, scale) : null,
        textAlign: styles.textAlign || 'center',
        fontWeight: styles.fontWeight || 'normal',

        ...('fontStyle' in styles && { fontStyle: styles.fontStyle }),
        ...('textDecoration' in styles && { textDecoration: styles.textDecoration }),

        ...('fontSize' in styles && { fontSize: transformStyleProperty(styles.fontSize, scale) }),
        fontFamily: styles.fontFamily || 'inherit',
        ...('top' in styles && { top: transformStyleProperty(styles.top, scale) }),
        ...('left' in styles && { left: transformStyleProperty(styles.left, scale) }),
        transform: styles.transform || null,
        borderRadius: styles.borderRadius
          ? `${+styles.borderRadius * scale}px`
          : null,
        boxShadow: styles.boxShadow || null,

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
        ...('paddingRight' in styles && { paddingRight: transformStyleProperty(styles.paddingRight, scale) }),
        ...('paddingLeft' in styles && { paddingLeft: transformStyleProperty(styles.paddingLeft, scale) }),
      },
      wrapper: {
        ...('height' in styles && { height: transformStyleProperty(styles.height, scale) }),
        borderStyle: styles.borderStyle
          ? styles.borderStyle
          : styles.borderWidth
            ? 'solid'
            : null,
        borderColor: styles.borderColor || null,
        borderWidth: styles.borderWidth
          ? `${+styles.borderWidth * scale}px`
          : styles.borderColor
            ? '1px'
            : null,
        borderRadius: styles.borderRadius
          ? `${+styles.borderRadius * scale}px`
          : null,
      },
      mobileButtonWrapper: {
        fontSize: `${14 * scale}px`,
        width: styles.width ? transformStyleProperty(styles.width, scale) : '100%',
        height: styles.height ? transformStyleProperty(styles.height, scale) : '100%',
      },
      mobileButton: {
        ...('mobileButtonHeight' in styles && { height: transformStyleProperty(styles.mobileButtonHeight, scale) }),
      },
      mobileButtonLine: {
        height: `${2 * scale}px`,
        backgroundColor: styles.color,
      },
      mobileMenu: {
        height:
          this.menuContext?.data?.opened === true
            ? '100%'
            : '0%',
      },
    };
  }

  toggleMobileMenu() {
    if (!this.options.interactions) {
      return;
    }

    this.interact(pebInteractionCreator.navigation.toggleMobileMenu());
  }

  redirectTo(route: PebLink): void {
    if (!this.options.interactions) {
      return;
    }

    // TODO: should be removed
    // has been added to support old theme
    if ((route as any).route) {
      this.interact(pebInteractionCreator.navigate.internal((route as any).route));
      return;
    }

    let interaction: PebInteraction;
    switch (route.type) {
      case PebInteractionType.NavigateInternal:
        interaction = pebInteractionCreator.navigate.internal(route.value);
        break;
      case PebInteractionType.NavigateInternalSpecial:
        interaction = pebInteractionCreator.navigate.internalSpecial(route?.variant, route.value);
        break;
      default:
        interaction = pebInteractionCreator.navigate.external(route);
    }

    this.interact(interaction);
  }

  showDropdown(element, route: any) {
    // TODO: do
  }

  hideMobileMenu() {
    if (!this.options.interactions) {
      return;
    }

    this.interact(pebInteractionCreator.navigation.hideMobileMenu());
  }

  getLogoUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustStyle(`url('${url}')`);
  }

}

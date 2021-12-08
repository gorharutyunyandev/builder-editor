import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';

import {
  PebElementContext,
  PebElementDef,
  PebElementSocialIconType,
  PebElementStyles,
  pebInteractionCreator,
  PebInteractionType,
  transformStyleProperty,
} from '@pe/builder-core';
import { PebAbstractElement, PebRendererOptions } from '@pe/builder-renderer';

@Component({
  selector: 'peb-element-social-icon',
  templateUrl: './social-icon.element.html',
  styleUrls: ['./social-icon.element.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebSocialIconElement extends PebAbstractElement {
  @Input() element: PebElementDef;
  @Input() styles: PebElementStyles;
  @Input() options: PebRendererOptions;
  @Input() context: PebElementContext<any>;

  @ViewChild('icon') iconElement: ElementRef;

  socialIconType = PebElementSocialIconType;

  @HostListener('click')
  onClick() {
    if (!this.element.data.link) {
      return;
    }

    const interaction = pebInteractionCreator.navigate.external({
      value: this.element.data?.link,
      type: PebInteractionType.NavigateExternal,
      newTab: this.element.data?.newTab,
    });

    if (!interaction) {
      console.warn('There is no interaction creator for: ', this.element.data);
      return;
    }

    this.interact(interaction);
  }

  @HostBinding('attr.peb-link-type')
  get attrButtonLinkType() {
    return this.element.data.link
      ? PebInteractionType.NavigateExternal
      : null;
  }

  @HostBinding('attr.peb-link-data')
  get attrButtonLinkData() {
    return this.element.data.link
      ? this.element.data.link
      : null;
  }

  get elements(): { [p: string]: HTMLElement | HTMLElement[] } {
    return {
      host: this.nativeElement,
      icon: this.iconElement?.nativeElement,
    };
  }

  get mappedStyles(): any {
    const { scale } = this.options;
    const styles = this.styles;
    const customBorder = styles.borderStyle === 'longdashed' || styles.borderStyle === 'shortdashed';
    return {
      host: {
        position: styles.position ?? 'relative',
        fontSize: `${this.options.scale}rem`,
        width: transformStyleProperty(styles.width ?? 24, scale),
        height: transformStyleProperty(styles.width ?? 24, scale),
        cursor: this.options.interactions ? 'pointer' : 'normal',
        ...('top' in styles && { top: transformStyleProperty(styles.top, scale) }),
        ...('left' in styles && { left: transformStyleProperty(styles.left, scale) }),
        ...('gridArea' in styles && { gridArea: styles.gridArea }),
        ...('gridArea' in styles && { gridArea: styles.gridArea }),
        ...('gridRow' in styles && { gridRow: styles.gridRow }),
        ...('gridColumn' in styles && { gridColumn: styles.gridColumn }),
        ...('margin' in styles && { margin: transformStyleProperty(styles.margin, scale) }),
        ...('marginTop' in styles && { marginTop: transformStyleProperty(styles.marginTop, scale) }),
        ...('marginRight' in styles && { marginRight: transformStyleProperty(styles.marginRight, scale) }),
        ...('marginBottom' in styles && { marginBottom: transformStyleProperty(styles.marginBottom, scale) }),
        ...('marginLeft' in styles && { marginLeft: transformStyleProperty(styles.marginLeft, scale) }),
        ...('opacity' in styles && { opacity: styles.opacity }),
      },
      icon: {
        fill: styles.backgroundColor,
        width: transformStyleProperty(styles.width ?? 24, scale),
        height: transformStyleProperty(styles.width ?? 24, scale),
        ...('filter' in styles && { filter: styles.filter }),
        ...('stroke' in styles && {
          stroke: styles.stroke,
          strokeWidth: transformStyleProperty((styles.strokeWidth as any) * 0.5, scale),
          strokeDasharray: styles.strokeDasharray,
        }),
      },
    };
  }

}

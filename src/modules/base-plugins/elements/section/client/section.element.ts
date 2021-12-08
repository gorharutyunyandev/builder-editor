import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import {
  PebElementDef,
  PebElementStyles,
  PebScreen,
  pebScreenWidthList,
  PEB_DESKTOP_CONTENT_WIDTH,
  transformStyleProperty,
} from '@pe/builder-core';
import { getBackgroundImage, PebAbstractElement, PebRendererOptions } from '@pe/builder-renderer';

@Component({
  selector: 'peb-element-section',
  templateUrl: './section.element.html',
  styleUrls: [
    '../../../../renderer/src/elements/_abstract/abstract.element.scss',
    './section.element.scss',
  ],
})
export class PebSectionElement extends PebAbstractElement {
  @Input() element: PebElementDef;
  @Input() styles: PebElementStyles;
  @Input() options: PebRendererOptions;

  @ViewChild('wrapper') wrapperEl: ElementRef;

  get elements(): { [key: string]: HTMLElement } {
    return {
      host: this.nativeElement,
      wrapper: this.wrapperEl?.nativeElement,
    };
  }

  get contentContainer(): HTMLElement {
    return this.elements.wrapper;
  }

  get mappedStyles() {
    const styles = this.styles;
    const { scale, interactions, screen } = this.options;
    const screenWidth = screen === PebScreen.Desktop ? PEB_DESKTOP_CONTENT_WIDTH : pebScreenWidthList[screen];

    return {
      host: {
        display: styles.display === 'none' ? 'none' : 'block',
        position: interactions && styles.position ? styles.position : 'relative',
        width: '100%',
        ...('top' in styles && { top: transformStyleProperty(styles.top, scale) }),
        ...('bottom' in styles && { bottom: transformStyleProperty(styles.bottom, scale) }),
        ...('zIndex' in styles && { zIndex: styles.zIndex }),
        ...('height' in styles && { minHeight: transformStyleProperty(styles.height, scale) }),
        ...('backgroundImage' in styles && { backgroundImage: getBackgroundImage(styles.backgroundImage as string) }),
        ...('backgroundSize' in styles && { backgroundSize: styles.backgroundSize }),
        ...('backgroundPosition' in styles && { backgroundPosition: styles.backgroundPosition }),
        ...('backgroundRepeat' in styles && { backgroundRepeat: styles.backgroundRepeat }),
        ...('backgroundColor' in styles && { backgroundColor: styles.backgroundColor }),
        ...('boxShadow' in styles && { boxShadow: styles.boxShadow }),
        ...('padding' in styles && { padding: transformStyleProperty(styles.padding, scale) }),
      },
      wrapper: {
        width: screen === 'desktop'
          ? transformStyleProperty(PEB_DESKTOP_CONTENT_WIDTH, scale)
          : '100%',
        display: styles.display || 'block',
        ...('gridTemplateRows' in styles && {
          gridTemplateRows: transformStyleProperty(styles.gridTemplateRows, scale),
        }),
        ...('gridTemplateColumns' in styles ?
          {
            gridTemplateColumns: transformStyleProperty(styles.gridTemplateColumns, scale),
          } :
          (styles.display === 'grid' && { gridTemplateColumns: transformStyleProperty(screenWidth, scale) })
        ),
        ...('height' in styles && { minHeight: transformStyleProperty(styles.height, scale) }),
      },
    };
  }
}

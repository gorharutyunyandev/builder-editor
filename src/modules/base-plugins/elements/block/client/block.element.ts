import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { PebElementDef, PebElementStyles, transformStyleProperty } from '@pe/builder-core';
import { getBackgroundImage, PebAbstractElement, PebRendererOptions } from '@pe/builder-renderer';

@Component({
  selector: 'peb-element-block',
  templateUrl: './block.element.html',
  styleUrls: [
    '../../../../renderer/src/elements/_abstract/abstract.element.scss',
    './block.element.scss',
  ],
})
export class PebBlockElement extends PebAbstractElement {
  @Input() element: PebElementDef;
  @Input() styles: PebElementStyles;
  @Input() options: PebRendererOptions;


  @ViewChild('defaultImage') defaultImageRef: ElementRef<HTMLImageElement>;

  afterImageTransformation = false;


  get elements(): { [key: string]: HTMLElement } {
    return {
      host: this.nativeElement,
      defaultImage: this.defaultImageRef?.nativeElement,
    };
  }

  get contentContainer(): HTMLElement {
    return this.elements.host;
  }

  get mappedStyles() {
    const styles = this.styles;
    const { scale } = this.options;

    this.afterImageTransformation = (
      this.element?.data?.text === 'fromImage' &&
      (styles.backgroundImage === 'undefined'
      ));

    return {
      host: {
        position: styles.position ?? 'relative',
        display: styles.display ?? 'block',
        backgroundImage: getBackgroundImage(styles.backgroundImage as string),
        backgroundSize: styles.backgroundSize
          ? typeof styles.backgroundSize === 'number'
            ? `${Number(styles.backgroundSize) * scale}px`
            : styles.backgroundSize
          : null,
        visibility: this.styles.visibility ?? 'visible',
        ...('zIndex' in styles && { zIndex: styles.zIndex }),
        ...('gridTemplateRows' in styles &&
          { gridTemplateRows: transformStyleProperty(styles.gridTemplateRows, scale) }
        ),
        ...('gridTemplateColumns' in styles &&
          { gridTemplateColumns: transformStyleProperty(styles.gridTemplateColumns, scale) }
        ),
        ...('width' in styles && { width: transformStyleProperty(styles.width, scale) }),
        ...('height' in styles && { height: transformStyleProperty(styles.height, scale) }),
        ...('flexDirection' in styles && { flexDirection: styles.flexDirection }),
        ...('flexWrap' in styles && { flexWrap: styles.flexWrap }),
        ...('justifyContent' in styles && { justifyContent: styles.justifyContent }),
        ...('alignItems' in styles && { alignItems: styles.alignItems }),
        ...('overflow' in styles && { overflow: styles.overflow }),
        ...('backgroundColor' in styles && { backgroundColor: styles.backgroundColor }),
        ...('backgroundRepeat' in styles && { backgroundRepeat: styles.backgroundRepeat }),
        ...('backgroundPosition' in styles && { backgroundPosition: styles.backgroundPosition }),
        ...('top' in styles && { top: transformStyleProperty(styles.top, scale) }),
        ...('left' in styles && { left: transformStyleProperty(styles.left, scale) }),
        ...('margin' in styles && { margin: transformStyleProperty(styles.margin, scale) }),
        ...('marginTop' in styles && { marginTop: transformStyleProperty(styles.marginTop, scale) }),
        ...('marginRight' in styles && { marginRight: transformStyleProperty(styles.marginRight, scale) }),
        ...('marginBottom' in styles && { marginBottom: transformStyleProperty(styles.marginBottom, scale) }),
        ...('marginLeft' in styles && { marginLeft: transformStyleProperty(styles.marginLeft, scale) }),
        ...('padding' in styles && { padding: transformStyleProperty(styles.padding, scale) }),
        ...('opacity' in styles && { opacity: styles.opacity }),
        ...('transform' in styles && { transform: styles.transform }),
        ...('borderStyle' in styles && { borderStyle: styles.borderStyle }),
        ...('borderColor' in styles && { borderColor: styles.borderColor }),
        ...('shadow' in styles && { filter: styles.shadow }),
        ...('borderWidth' in styles && { borderWidth: transformStyleProperty(styles.borderWidth, scale) }),
        ...('gridArea' in styles && { gridArea: styles.gridArea }),
        ...('gridRow' in styles && { gridRow: styles.gridRow }),
        ...('gridColumn' in styles && { gridColumn: styles.gridColumn }),
      },
    };
  }

}

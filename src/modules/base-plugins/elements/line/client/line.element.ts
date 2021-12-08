import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { PebElementDef, PebElementStyles, transformStyleProperty } from '@pe/builder-core';
import { PebAbstractElement, PebRendererOptions } from '@pe/builder-renderer';

@Component({
  selector: 'peb-element-line',
  templateUrl: './line.element.html',
  styleUrls: ['./line.element.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebLineElement extends PebAbstractElement {
  @Input() element: PebElementDef;
  @Input() styles: PebElementStyles;
  @Input() options: PebRendererOptions;

  @ViewChild('lineRef') lineRef: ElementRef;

  get elements(): { [key: string]: HTMLElement } {
    return {
      host: this.nativeElement,
      line: this.lineRef?.nativeElement,
    };
  }
  get mappedStyles(): any {
    const styles = this.styles;
    const { scale } = this.options;

    return  {
      host: {
        display: 'flex',
        position: styles.position ?? 'relative',
        ...('top' in styles && { top: transformStyleProperty(styles.top, scale) }),
        ...('left' in styles && { left: transformStyleProperty(styles.left, scale) }),
        ...('backgroundColor' in styles && { backgroundColor: styles.backgroundColor }),
        ...('gridArea' in styles && { gridArea: styles.gridArea }),
        ...('gridRow' in styles && { gridRow: styles.gridRow }),
        ...('gridColumn' in styles && { gridColumn: styles.gridColumn }),
        ...('width' in styles && { width: transformStyleProperty(styles.width ?? '100%', scale) }),
        ...('height' in styles && { margin: transformStyleProperty(styles.height ?? 1, scale) }),
        ...('margin' in styles && { margin: transformStyleProperty(styles.margin, scale) }),
        ...('marginTop' in styles && { marginTop: transformStyleProperty(styles.marginTop, scale) }),
        ...('marginRight' in styles && { marginRight: transformStyleProperty(styles.marginRight, scale) }),
        ...('marginBottom' in styles && { marginBottom: transformStyleProperty(styles.marginBottom, scale) }),
        ...('marginLeft' in styles && { marginLeft: transformStyleProperty(styles.marginLeft, scale) }),
      },
      line: {
        width: '100%',
        height: '100%',
        backgroundColor: styles.backgroundColor ?? '#474747',
        boxShadow: styles.shadowing ?
          `${+styles.shadowOffset * Math.cos(+styles.shadowAngle * Math.PI / 180) * scale}px
          ${+styles.shadowOffset * (-1) * Math.sin(+styles.shadowAngle * Math.PI / 180) * scale}px
          ${+styles.shadowBlur * scale}px
          0px
          ${this.getShadowColor({ ...this.hexToRgb(styles.shadowColor), opacity: styles.shadowOpacity })}` :
        null,
        opacity: +styles.opacity / 100,
      },
    };
  }

  private hexToRgb(hex): any {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }

  private getShadowColor({ r, g, b, opacity }): string {
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }
}

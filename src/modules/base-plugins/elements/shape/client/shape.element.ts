import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { PebElementContext, PebElementStyles, transformStyleProperty } from '@pe/builder-core';
import {
  getBackgroundImage,
  getGradientProperties,
  isBackgroundGradient,
  PebAbstractElement,
  PebRendererOptions,
} from '@pe/builder-renderer';

import { PebElementShape, PebShapeVariant } from './shape.constants';
import { CircleOrSquareShapeStyles, TriangleShapeStyles } from './shape.interfaces';

@Component({
  selector: 'peb-element-shape',
  templateUrl: './shape.element.html',
  styleUrls: ['./shape.element.scss'],
})
export class PebShapeElement extends PebAbstractElement {
  PebShapeVariant = PebShapeVariant;

  @Input() element: PebElementShape;
  @Input() styles: PebElementStyles;
  @Input() options: PebRendererOptions;
  @Input() context: PebElementContext<any>;

  @ViewChild('shape') shapeEl: ElementRef;

  triangleStyles: TriangleShapeStyles = {
    fill: '#d8d8d8',
    strokeWidth: 3,
    borderColor: 'black',
    strokeDasharray: 0,
    gradientStartColor: 'white',
    gradientStopColor: 'black',
    isGradient: false,
    gradientAngle: {
      x1: '1',
      x2: '1',
      y1: '1',
      y2: '1',
    },
  };

  get elements(): { [key: string]: HTMLElement | HTMLElement[]; } {
    return {
      host: this.nativeElement,
      shape: this.shapeEl?.nativeElement,
    };
  }

  get potentialContainer() {
    return this.element.data.variant === 'square'
      ? this.nativeElement
      : null;
  }

  get mappedStyles(): any {
    const { scale } = this.options;
    const styles = this.styles;

    // TODO: After adding styles for shape's text check that text size is properly scales
    return {
      host: {
        position: styles.position ?? 'relative',
        fontSize: `${this.options.scale}rem`,
        ...('width' in styles && { width: transformStyleProperty(styles.width, scale) }),
        ...('height' in styles && { height: transformStyleProperty(styles.height, scale) }),
        ...('top' in styles && { top: transformStyleProperty(styles.top, scale) }),
        ...('left' in styles && { left: transformStyleProperty(styles.left, scale) }),
        ...('shadow' in styles && { filter: styles.shadow }),
        ...('gridArea' in styles && { gridArea: styles.gridArea }),
        ...('gridArea' in styles && { gridArea: styles.gridArea }),
        ...('gridRow' in styles && { gridRow: styles.gridRow }),
        ...('gridColumn' in styles && { gridColumn: styles.gridColumn }),
        ...('margin' in styles && { margin: transformStyleProperty(styles.margin, scale) }),
        ...('marginTop' in styles && { marginTop: transformStyleProperty(styles.marginTop, scale) }),
        ...('marginRight' in styles && { marginRight: transformStyleProperty(styles.marginRight, scale) }),
        ...('marginBottom' in styles && { marginBottom: transformStyleProperty(styles.marginBottom, scale) }),
        ...('marginLeft' in styles && { marginLeft: transformStyleProperty(styles.marginLeft, scale) }),
      },
      shape: this.getShapeStyle(),
    };
  }

  private getShapeStyle(): TriangleShapeStyles | CircleOrSquareShapeStyles {
    if (this.element.data?.variant === PebShapeVariant.Triangle) {
      return this.getTriangleStyles();
    }

    return this.getCircleOrSquareStyles();
  }

  private getCircleOrSquareStyles(): CircleOrSquareShapeStyles {
    const { scale } = this.options;
    const styles: CircleOrSquareShapeStyles = {
      backgroundColor: this.styles.backgroundImage ? null : this.styles.backgroundColor ?? null,
      borderStyle: this.styles.borderStyle ?? null,
      borderColor: this.styles.borderColor ?? null,
      borderWidth: this.styles.borderWidth ? `${this.styles.borderWidth as number * scale}px` : null,
      opacity: this.styles.opacity ?? null,
      transform: this.styles.transform ?? null,
      backgroundSize: this.styles.backgroundSize ?? null,
      backgroundImage: this.styles.backgroundImage ? getBackgroundImage(this.styles.backgroundImage.toString()) : null,
    };

    if (styles.backgroundImage && !isBackgroundGradient(styles.backgroundImage.toString())) {
      styles.backgroundPosition = this.styles.backgroundPosition ?? null;
      styles.backgroundRepeat = this.styles.backgroundRepeat ?? null;
    }

    return styles;
  }

  // TODO: should be in behaviour
  private getTriangleStyles(): TriangleShapeStyles {
    if (this.styles.backgroundImage)  {
      this.triangleStyles.isGradient = isBackgroundGradient(this.styles.backgroundImage.toString());
      this.triangleStyles.backgroundImage = this.styles.backgroundImage;
    } else {
      this.triangleStyles.isGradient = false;
      this.triangleStyles.backgroundImage = null;
    }
    this.triangleStyles.fill = this.triangleStyles.isGradient
      ? `url(#gradient-${this.element.id})`
      : (this.styles.backgroundColor
        ? this.styles.backgroundColor
        : '#d8d8d8') as string;

    this.triangleStyles.strokeWidth = (this.styles.borderWidth ? this.styles.borderWidth : 0) as number;
    this.triangleStyles.borderColor = (this.styles.borderColor ? this.styles.borderColor : 'black') as string;
    this.triangleStyles.strokeDasharray = (this.styles.borderOffset ? this.styles.borderOffset : 0) as number;

    if (this.triangleStyles.isGradient) {
      const gradientProps = getGradientProperties(this.styles);
      this.triangleStyles.gradientStartColor = gradientProps.startColor ?? null;
      this.triangleStyles.gradientStopColor = gradientProps.endColor ?? null;
      this.triangleStyles.gradientAngle = this.calcGradientAngle(gradientProps.angle);
    }

    return {
      ...this.triangleStyles,
      opacity: this.styles.opacity ?? null,
      transform: this.styles.transform ? this.styles.transform : null,
    };
  }

  private calcGradientAngle(angle: number) {
    const anglePI = angle * (Math.PI / 180);

    return {
      x1: `${Math.round(50 + Math.sin(anglePI) * 50)}%`,
      y1: `${Math.round(50 + Math.cos(anglePI) * 50)}%`,
      x2: `${Math.round(50 + Math.sin(anglePI + Math.PI) * 50)}%`,
      y2: `${Math.round(50 + Math.cos(anglePI + Math.PI) * 50)}%`,
    };
  }

  getBackgroundColor(): string {
    return !this.styles.backgroundImage && !this.styles.backgroundColor ? '#d8d8d8' : '';
  }
}

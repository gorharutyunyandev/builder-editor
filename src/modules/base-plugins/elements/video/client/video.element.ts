import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { PebElementDef, PebElementStyles, transformStyleProperty } from '@pe/builder-core';
import { PebAbstractElement, PebRendererOptions } from '@pe/builder-renderer';

@Component({
  selector: 'peb-element-video',
  templateUrl: './video.element.html',
  styleUrls: ['./video.element.scss'],
})
export class PebVideoElement extends PebAbstractElement {
  @Input() element: PebElementDef;
  @Input() styles: PebElementStyles;
  @Input() options: PebRendererOptions;

  @ViewChild('video') video: ElementRef<HTMLVideoElement>;

  // private readonly defaultWidth = 1024;
  // private readonly defaultHeight = 720;
  private readonly fontSize = 13;

  videoLoaded$ = new BehaviorSubject<boolean>(false);
  isVideoLoading = false;

  get videoLoaded(): boolean {
    return this.videoLoaded$.value;
  }

  get elements(): { [key: string]: HTMLElement | HTMLElement[] } {
    return {
      host: this.nativeElement,
      video: this.video?.nativeElement,
    };
  }

  get mappedStyles() {
    const { scale } = this.options;
    const styles = this.styles;

    return {
      host: {
        position: styles.position ?? 'relative',
        display: styles.display ?? 'block',
        borderStyle: this.styles.borderStyle ? this.styles.borderStyle : null,
        borderColor: this.styles.borderColor ? this.styles.borderColor : null,
        boxShadow: this.styles.boxShadow ? this.styles.boxShadow : null,
        transform: this.styles.transform ? this.styles.transform : null,
        fontSize: `${this.fontSize * scale}px`,

        width: styles.width ? transformStyleProperty(styles.width, scale) : 'max-content',
        height: styles.height ? transformStyleProperty(styles.height, scale) : 'max-content',

        ...('margin' in styles && { margin: transformStyleProperty(styles.margin, scale) }),
        ...('marginTop' in styles && { marginTop: transformStyleProperty(styles.marginTop, scale) }),
        ...('marginRight' in styles && { marginRight: transformStyleProperty(styles.marginRight, scale) }),
        ...('marginBottom' in styles && { marginBottom: transformStyleProperty(styles.marginBottom, scale) }),
        ...('marginLeft' in styles && { marginLeft: transformStyleProperty(styles.marginLeft, scale) }),
        ...('padding' in styles && { padding: transformStyleProperty(styles.padding, scale) }),
        ...('top' in styles && { top: transformStyleProperty(styles.top, scale) }),
        ...('left' in styles && { left: transformStyleProperty(styles.left, scale) }),

        ...('gridArea' in styles && { gridArea: styles.gridArea }),
        ...('gridRow' in styles && { gridRow: styles.gridRow }),
        ...('gridColumn' in styles && { gridColumn: styles.gridColumn }),
      },
      video: {
        opacity: styles.opacity,
        objectFit: styles.objectFit || 'contain',
        visibility: this.element.data?.isLoading ? 'hidden' : 'visible',
      },
    };
  }

  onLoaded(): void {
    this.isVideoLoading = false;
    this.videoLoaded$.next(true);
  }

  videoUploaded$ = () => {
    return this.videoLoaded$.pipe(
      filter(value => value),
      take(1),
    );
  }
}

import { Component, Input } from '@angular/core';

import { PebElementDef } from '@pe/builder-core';

import { PebAbstractElement } from '../../_abstract/abstract.element';
import { PebRendererOptions } from '../../../renderer.types';
import { getBackgroundImage } from '../../../utils';

@Component({
  selector: 'peb-element-document',
  templateUrl: './document.element.html',
  styleUrls: [
    '../../_abstract/abstract.element.scss',
    './document.element.scss',
  ],
})
export class PebDocumentElement extends PebAbstractElement {
  @Input() element: PebElementDef;
  @Input() context: null;
  @Input() options: PebRendererOptions;

  protected get elements() {
    return {
      host: this.nativeElement,
    };
  }

  protected get mappedStyles() {
    const styles = this.styles;

    return {
      host: {
        backgroundRepeat: this.styles.backgroundRepeat ?? 'no-repeat',
        ...('backgroundImage' in styles && { backgroundImage: getBackgroundImage(styles.backgroundImage) }),
        ...('backgroundSize' in styles && { backgroundSize: styles.backgroundSize }),
        ...('backgroundPosition' in styles && { backgroundPosition: styles.backgroundPosition }),
        ...('backgroundColor' in styles && { backgroundColor: styles.backgroundColor }),
      },
    };
  }
}

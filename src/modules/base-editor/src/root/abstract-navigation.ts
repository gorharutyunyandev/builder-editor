import { ChangeDetectorRef, EventEmitter } from '@angular/core';

import { PebPageId } from '@pe/builder-core';

export abstract class PebEditorAbstractNavigation {
  // input
  abstract pages: any[];

  abstract activePageSnapshot: any;

  abstract loading: boolean;

  // output
  abstract execCommand: EventEmitter<any>;

  // methods
  abstract cdr: ChangeDetectorRef;
}

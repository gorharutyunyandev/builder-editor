import { Directive, ViewContainerRef } from '@angular/core';

/**
 * TODO: Use this instead of CONTROLS constant
 */
@Directive({ selector: '[pebRendererControlsSlot]' })
export class PebRendererControlsSlot {
  constructor(
    public viewRef: ViewContainerRef,
  ) {}
}

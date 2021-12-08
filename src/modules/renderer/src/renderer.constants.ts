import { InjectionToken } from '@angular/core';

// TODO: Find how to strictly define type of a component that extends PebAbstractElement
export interface ElementFactories {
  preloaded?: { [elementType: string]: any };
  lazy?: { [elementType: string]: any };
}

export type PebRendererConfig = {
  elements: ElementFactories,
};

/** Collection of elements that renderer knows how to render */
export const ELEMENT_FACTORIES = new InjectionToken<ElementFactories>('ELEMENT_FACTORIES');

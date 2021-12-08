import { EventEmitter, InjectionToken, Type } from '@angular/core';

import { PebMakerType } from '@pe/builder-core';

import { PebAbstractElement } from './elements/_abstract/abstract.element';

/** Collection of elements that maker knows how to render */
type MAKER_COMPONENTS_COLLECTIONType = { [name in PebMakerType]: Type<any> };

export const MAKER_COMPONENTS_COLLECTION = new InjectionToken<MAKER_COMPONENTS_COLLECTIONType>('MAKER_COMPONENTS_COLLECTION');

/** Element render function provided by renderer */
export const RENDERER_INTERACTION_EMITTER = new InjectionToken<EventEmitter<any>>('RENDERER_INTERACTION_EMITTER');

/** Element parent */
export type GetParentComponentFunction = (elementCmp: PebAbstractElement) => PebAbstractElement;

export const RENDERER_GET_PARENT_FUNCTION = new InjectionToken<GetParentComponentFunction>('RENDERER_GET_PARENT_FUNCTION');

import { filter } from 'rxjs/operators';

import { PebEditorState } from '../../services/editor.state';

export const filterAnd = (...predicates) => (evt) => {
  return predicates
    .filter(predicate => !predicate(evt))
    .length === 0;
};

export const filterOr = (...predicates) => evt => predicates
  .map(predicate => Boolean(predicate(evt)))
  .includes(true);

export const filterNot = predicate => evt => !predicate(evt);

/** @deprecated use state.selectedElements$.pipe(filter(ids => !ids.length || ids.length > 1)) instead  */
export function onlyOneElementSelected(state: PebEditorState) {
  return state.selectedElements$.pipe(filter(ids => !ids.length || ids.length > 1));
}

export enum MouseKey {
  Primary = 1,
  Secondary = 2,
  Auxiliary = 4,
  Fourth = 8, // browser back
  Fifth = 16, // browser forward
}

// tslint:disable-next-line:no-bitwise
export const mouseKeyFilter = (mouseKey: MouseKey) => (evt: MouseEvent) => evt.buttons & mouseKey;

export const onlyMouseKeyFilter = (mouseKey: MouseKey) => (evt: MouseEvent) => evt.buttons === mouseKey;

import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { PebRenderer } from '@pe/builder-renderer';

import { PebEditor } from '../root/editor.component';

/**
 * This service is needed for provide access to the same instance of PebEditor component
 * that rendered in root editor component.
 */
@Injectable()
export class PebEditorAccessorService implements OnDestroy {

  private readonly destroyedSubject$ = new Subject();
  readonly destroyed$ = this.destroyedSubject$.asObservable();

  private readonly editorSubject$ = new BehaviorSubject<PebEditor>(null);

  set editorComponent(val: PebEditor) {
    this.editorSubject$.next(val);
  }

  get editorComponent(): PebEditor {
    return this.editorSubject$.value;
  }

  readonly rendererSubject$ = new BehaviorSubject<PebRenderer>(null);

  set renderer(val: PebRenderer) {
    this.rendererSubject$.next(val);
  }

  get renderer() {
    return this.rendererSubject$.value;
  }

  constructor(
  ) {
  }

  ngOnDestroy() {
    this.destroyedSubject$.next();
  }
}

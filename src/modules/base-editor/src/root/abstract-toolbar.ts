import { ChangeDetectorRef, EventEmitter } from '@angular/core';

// import { PebEditorState } from '../services/editor.state';

export abstract class PebEditorAbstractToolbar {
  // // input
  // abstract state: PebEditorState;
  abstract loading: boolean;
  //
  // // output
  abstract execCommand: EventEmitter<any>;
  //
  // // methods
  abstract cdr: ChangeDetectorRef;
}

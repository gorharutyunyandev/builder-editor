import { InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';

import { PebScreen } from '@pe/builder-core';
import { EditorSidebarTypes, PebEditorState, PebEditorStore } from '@pe/builder-editor';

import { ObjectCategory } from './dialogs';
import { MailEditorSidebarTypes } from '../mail-editor.state';

export type OverlayDataValue = ObjectCategory | PebScreen | EditorSidebarTypes | MailEditorSidebarTypes | number;
export interface OverlayData {
  emitter: Subject<OverlayDataValue>;
  data: any | PebEditorState | PebEditorStore;
}
export const OVERLAY_DATA = new InjectionToken<OverlayData>('OVERLAY_DATA');

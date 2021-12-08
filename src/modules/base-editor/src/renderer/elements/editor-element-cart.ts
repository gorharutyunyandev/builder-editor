import { PebEditorElement } from '../editor-element';
import { PebEditorElementProperty, PebEditorElementPropertyBorder, PebEditorElementPropertyOpacity } from '../interfaces';

export class PebEditorElementCart extends PebEditorElement {
  badgeBorder?: PebEditorElementPropertyBorder;
  border?: PebEditorElementPropertyBorder;
  badge?: PebEditorElementProperty<{ background?: string; color?: string }>;
  filterShadow?: PebEditorElementProperty<{ shadowBlur?: string | number; allowShadow?: boolean; }>;
  rotation?: PebEditorElementProperty<{ angle?: number | string; }>;
  opacity?: PebEditorElementPropertyOpacity;
  stroke?:  PebEditorElementPropertyBorder;
}

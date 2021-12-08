import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { isColorPaletteItem, PebEditorColorPaletteItem } from './color-palette.interfaces';

@Component({
  selector: 'peb-editor-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebEditorColorPaletteComponent {
  @Input() gridColors: Array<string | PebEditorColorPaletteItem>;
  @Input() control: FormControl;
  @Output() colorSelected = new EventEmitter<string>();

  get palette(): PebEditorColorPaletteItem[] {
    return this.gridColors.map(color => isColorPaletteItem(color) ? color : ({ color }));
  }

  onColorSelect({ color }) {
    this.control?.patchValue(color);
    this.colorSelected.emit(color);
  }
}

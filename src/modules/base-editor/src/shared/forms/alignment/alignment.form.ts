import { ChangeDetectionStrategy, Component, Injector, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SelectOption } from '../../_old/select/select.component';
import { ALIGN_TYPES } from '../../../behaviors/sidebars/_deprecated-sidebars/sidebar.utils';
import { PebEditorState } from '../../../services/editor.state';

@Component({
  selector: 'editor-alignment-form',
  templateUrl: './alignment.form.html',
  styleUrls: ['./alignment.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorAlignmentForm {
  @Input() formGroup: FormGroup;

  public editorState = this.injector.get(PebEditorState);

  constructor(private injector: Injector) {}

  alignTypes: SelectOption[] = ALIGN_TYPES;
}

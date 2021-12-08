import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'editor-rotation-form',
  templateUrl: './rotation.form.html',
  styleUrls: ['./rotation.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorRotationForm {
  @Input() formGroup: FormGroup;

  @Output() blurred = new EventEmitter<void>();

  blur() {
    this.blurred.emit();
  }
}

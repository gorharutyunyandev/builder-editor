import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'editor-image-filter-form',
  templateUrl: './image-filter.form.html',
  styleUrls: ['./image-filter.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorImageFilterForm {
  @Input() formGroup: FormGroup;

  @Output() blurred = new EventEmitter<void>();

  blur() {
    this.blurred.emit();
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';

// WIP
@Component({
  selector: 'editor-shadow-form',
  templateUrl: './shadow.form.html',
  styleUrls: ['./shadow.form.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorShadowForm {
  @Input() formGroup: FormGroup;

  @Output() blurred = new EventEmitter<void>();

  blur() {
    this.blurred.emit();
  }
}

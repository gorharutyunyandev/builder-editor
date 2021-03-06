import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'editor-image-form',
  templateUrl: './image.form.html',
  styleUrls: ['./image.form.scss'],
})
export class EditorImageForm {
  @Input() formGroup: FormGroup;
  @Output() blurred = new EventEmitter<void>();
  protected destroyed$ = new ReplaySubject<boolean>();
}

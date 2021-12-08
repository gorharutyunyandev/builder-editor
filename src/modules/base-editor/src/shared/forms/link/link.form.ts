import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'editor-link-form',
  templateUrl: './link.form.html',
  styleUrls: ['./link.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorLinkForm implements OnDestroy {

  @Input() formGroup: FormGroup;

  @Output() blurred = new EventEmitter();

  ngOnDestroy() {
    this.blurred.emit();
  }
}

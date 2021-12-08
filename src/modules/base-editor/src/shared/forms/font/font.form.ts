import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AbstractComponent } from '../../../misc/abstract.component';

@Component({
  selector: 'editor-font-form',
  templateUrl: './font.form.html',
  styleUrls: ['./font.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorFontForm  extends AbstractComponent {
  @Input() formGroup: FormGroup;
  @Input() options: any;
  @Input() title = 'Font';

  @Output() blurred = new EventEmitter<void>();

  blur() {
    this.blurred.emit();
  }

}

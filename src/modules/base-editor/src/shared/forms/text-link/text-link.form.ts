import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { PebInteractionType } from '@pe/builder-core';
import { PebTextEditorService } from '@pe/builder-text-editor';

@Component({
  selector: 'editor-text-link-form',
  templateUrl: './text-link.form.html',
  styleUrls: ['./text-link.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorTextLinkForm {
  @Input() title = 'Link';
  @Input() options: any;
  @Input() formGroup: FormGroup;

  PebInteractionType = PebInteractionType;

  constructor(private textEditorService: PebTextEditorService) {
  }

  get selection$(): Observable<Selection> {
    return this.textEditorService.selection$;
  }

}

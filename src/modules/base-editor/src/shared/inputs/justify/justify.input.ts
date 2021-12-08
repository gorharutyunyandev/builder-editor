import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { TextJustifyValue } from './justify.interfaces';
import { ControlValueAccessorConnector } from '../control-value-accessor.connector';

@Component({
  selector: 'editor-justify-form',
  templateUrl: './justify.input.html',
  styleUrls: ['./justify.input.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: EditorJustifyInput,
      multi: true,
    },
  ],
})
export class EditorJustifyInput extends ControlValueAccessorConnector {
  TextJustifyValue = TextJustifyValue;

  constructor(injector: Injector) {
    super(injector);
  }
}

import {
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { merge, of, ReplaySubject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { ControlValueAccessorConnector } from '../control-value-accessor.connector';

@Component({
  selector: 'peb-editor-number-input',
  templateUrl: './number.input.html',
  styleUrls: ['./number.input.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SidebarNumberInput,
      multi: true,
    },
  ],
})
export class SidebarNumberInput extends ControlValueAccessorConnector implements OnDestroy, OnInit {

  private destroyed$ = new ReplaySubject<boolean>();

  @Input() unit: string;
  @Input() label: string;
  @Input() min: number;
  @Input() max: number;

  @Output() focused = new EventEmitter<void>();
  @Output() blurred = new EventEmitter<void>();

  @ViewChild('input', { read: ElementRef, static: false })
  inputRef: ElementRef<HTMLInputElement>;

  inFocus = false;

  constructor(injector: Injector)  {
    super(injector);
  }

  ngOnInit(): void {

  }

  public ngOnDestroy() :void {
    if (this.inFocus) {
      this.blur();
    }
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  focus() {
    this.focused.emit();
    this.inFocus = true;
    this.control.valueChanges.pipe(
      tap((val) => {
        if (this.max && val > this.max) {
          this.control.setValue(this.max);
        }
        if (this.min && val < this.min) {
          this.control.setValue(this.min);
        }
      }),
      takeUntil(merge(this.blurred,  this.destroyed$)),
    ).subscribe();
  }

  blur() {
    this.blurred.emit();
    this.inFocus = false;
  }

  increment() {
    if (!this.inFocus) {
      this.focus();
    }
    if (this.max === undefined || this.control.value <= this.max - 1) {
      this.control.setValue(this.control.value + 1);
    }
  }

  decrement() {
    if (!this.inFocus) {
      this.focus();
    }

    if (this.min === undefined || this.control.value >= this.min + 1) {
      this.control.setValue(this.control.value - 1);
    }
  }

}

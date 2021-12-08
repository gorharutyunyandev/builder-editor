import { Component, ElementRef, EventEmitter, HostListener, Injector, Input, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { ControlValueAccessorConnector } from '../control-value-accessor.connector';


@Component({
  selector: 'peb-editor-font-toggle-input',
  templateUrl: './button-toggle.input.html',
  styleUrls: ['./button-toggle.input.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ButtonToggleInput,
      multi: true,
    },
  ],
})
export class ButtonToggleInput extends ControlValueAccessorConnector {
  @Input() trueValue = '';
  @Input() falseValue = '';
  @Input() multipleValues = false;

  @Output() focused = new EventEmitter<void>();
  @Output() blurred = new EventEmitter<void>();
  @Output() valueChanged = new EventEmitter<void>();

  @ViewChild('input', { read: ElementRef, static: false })
  inputRef: ElementRef<HTMLInputElement>;

  constructor(injector: Injector) {
    super(injector);
  }

  private readonly valueSubject = new BehaviorSubject<string>(null);

  get checked$(): Observable<boolean> {
    return this.value$.pipe(
      startWith(this.control.value as string),
      map(value => value
        ? this.multipleValues
          ? !!value.split(' ').find(v => v === this.trueValue)
          : value === this.trueValue
        : false,
      ),
    );
  }

  get value$(): Observable<string> {
    return this.valueSubject.pipe(
      distinctUntilChanged(),
    );
  }

  set value(value: string) {
    this.valueSubject.next(value);
  }

  writeValue(value: string) {
    this.value = value;
    this.formControlDirective.valueAccessor.writeValue(value);
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();

    if (this.multipleValues) {
      const checked = this.control.value?.split(' ').find((v: string) => v === this.trueValue);
      this.control.setValue(
        checked
          ? this.control.value.split(' ').filter((v: string) => v !== this.trueValue).join(' ')
          : this.control.value
            ? `${this.control.value} ${this.trueValue}`
            : this.trueValue
      );
      this.valueChanged.emit();

      return;
    }

    this.control.setValue(this.control.value === this.trueValue ? this.falseValue : this.trueValue);
    this.valueChanged.emit();
  }

}

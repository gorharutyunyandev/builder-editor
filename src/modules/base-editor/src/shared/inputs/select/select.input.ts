
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';
import {
  AfterContentInit, ChangeDetectorRef, Component, ContentChildren, ElementRef,
  EventEmitter,
  Input, NgZone, OnDestroy, OnInit, Output, QueryList, ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isEqual } from 'lodash';
import { defer, merge, Observable, Subject } from 'rxjs';
import { startWith, switchMap, take, takeUntil } from 'rxjs/operators';

import { SidebarOptionSelect, SidebarOptionSelectSelectionChange, SIDEBAR_SELECT_OPTION_PARENT_COMPONENT } from './select.option';

export interface SidebarSelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'peb-editor-select-input',
  templateUrl: './select.input.html',
  styleUrls: ['./select.input.scss'],
  host: {
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SidebarSelectInput,
      multi: true,
    },
    { provide: SIDEBAR_SELECT_OPTION_PARENT_COMPONENT, useExisting: SidebarSelectInput },
  ],
})
export class SidebarSelectInput implements OnInit, AfterContentInit, ControlValueAccessor, OnDestroy {

  protected readonly destroy = new Subject<void>();

  @Input() placeholder: string;
  @Input() disabled: boolean;
  @Input()
  get value(): any { return this._value; }
  set value(newValue: any) {
    if (newValue !== this._value) {
      if (this.options) {
        this.setSelectionByValue(newValue);
      }

      this._value = newValue;
    }
  }
  private _value: any;

  @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

  panelOpen = false;
  focused = false;

  selectionModel: SelectionModel<SidebarOptionSelect>;
  keyManager: ActiveDescendantKeyManager<SidebarOptionSelect>;

  @ViewChild('panel') panel: ElementRef;
  @ViewChild(CdkConnectedOverlay) overlayDir: CdkConnectedOverlay;

  @ContentChildren(SidebarOptionSelect, { descendants: true }) options: QueryList<SidebarOptionSelect>;

  positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
    },
  ];

  readonly optionSelectionChanges: Observable<SidebarOptionSelectSelectionChange> = defer(() => {
    const options = this.options;

    if (options) {
      return options.changes.pipe(
        startWith(options),
        switchMap(() => merge(...options.map(option => option.onSelectionChange))),
      );
    }

    return this.ngZone.onStable
      .pipe(take(1), switchMap(() => this.optionSelectionChanges));
  }) as Observable<SidebarOptionSelectSelectionChange>;

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.value = value;
  }

  onChange: (value: any) => void = () => {};
  onTouched = () => {};

  onFocus() {
    if (!this.disabled) {
      this.focused = true;
    }
  }

  onBlur() {
    this.focused = false;

    if (!this.disabled && !this.panelOpen) {
      this.changeDetectorRef.markForCheck();
    }
  }

  onAttached(): void {
    this.overlayDir.positionChange.pipe(take(1)).subscribe(() => {
      this.changeDetectorRef.detectChanges();
    });
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  constructor(
    public elementRef: ElementRef,
    protected changeDetectorRef: ChangeDetectorRef,
    protected ngZone: NgZone,
  ) {
  }

  ngOnInit() {
    this.selectionModel = new SelectionModel<SidebarOptionSelect>();
  }

  ngAfterContentInit() {
    this.initKeyManager(this.options);

    this.selectionModel.changed.pipe(takeUntil(this.destroy)).subscribe(event => {
      event.added.forEach(option => option.select());
      event.removed.forEach(option => option.deselect());
    });

    this.options.changes.pipe(startWith(null), takeUntil(this.destroy)).subscribe(() => {
      this.resetOptions();
      this.initializeSelection();
    });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  focus(options?: FocusOptions): void {
    this.elementRef.nativeElement.focus(options);
  }

  private initKeyManager(options) {
    this.keyManager = new ActiveDescendantKeyManager<SidebarOptionSelect>(options);

    this.keyManager.tabOut.pipe(takeUntil(this.destroy)).subscribe(() => {
      if (this.panelOpen) {
        if (this.keyManager.activeItem) {
          this.keyManager.activeItem.selectViaInteraction();
        }

        this.focus();
        this.close();
      }
    });

    this.keyManager.change.pipe(takeUntil(this.destroy)).subscribe(() => {
      if (!this.panelOpen && this.keyManager.activeItem) {
        this.keyManager.activeItem.selectViaInteraction();
      }
    });
  }

  protected canOpen(): boolean {
    return !this.panelOpen && !this.disabled && this.options?.length > 0;
  }

  private resetOptions(): void {
    const changedOrDestroyed = merge(this.options.changes, this.destroy);

    this.optionSelectionChanges.pipe(takeUntil(changedOrDestroyed)).subscribe(event => {
      this.onSelect(event.source, event.isUserInput);

      if (this.panelOpen) {
        this.close();
      }
    });

    merge(...this.options.map(option => option.stateChanges))
      .pipe(takeUntil(changedOrDestroyed))
      .subscribe(() => {
        this.changeDetectorRef.markForCheck();
      });
  }

  private initializeSelection(): void {
    Promise.resolve().then(() => {
      this.setSelectionByValue(this.value);
    });
  }

  private setSelectionByValue(value: any): void {
    this.selectionModel.selected.forEach(option => option.setInactiveStyles());
    this.selectionModel.clear();

    const correspondingOption = this.selectValue(value);

    if (correspondingOption) {
      this.keyManager.updateActiveItem(value);
    } else if (!this.panelOpen) {
      this.keyManager.updateActiveItem(-1);
    }

    this.changeDetectorRef.markForCheck();
  }

  private selectValue(value: any): SidebarOptionSelect | undefined {
    const correspondingOption = this.options.find((option: SidebarOptionSelect) => {
      try {
        return option.value != null && isEqual(option.value, value);
      } catch (error) {
        return false;
      }
    });

    if (correspondingOption) {
      this.selectionModel.select(correspondingOption);
    }

    return correspondingOption;
  }


  private onSelect(option: SidebarOptionSelect, isUserInput: boolean): void {
    const wasSelected = this.selectionModel.isSelected(option);

    if (option.value == null) {
      option.deselect();
      this.selectionModel.clear();

      if (this.value != null) {
        this.propagateChanges(option.value);
      }
    } else {
      if (wasSelected !== option.selected) {
        option.selected ? this.selectionModel.select(option) :
                          this.selectionModel.deselect(option);
      }

      if (isUserInput) {
        this.keyManager.setActiveItem(option);
      }
    }

    if (wasSelected !== this.selectionModel.isSelected(option)) {
      this.propagateChanges();
    }
  }

  getMaxHeight(panel) {
    const rect = panel.getBoundingClientRect();

    return `calc(100vh - ${rect.top + 15}px)`;
  }

  private propagateChanges(fallbackValue?: any): void {
    let valueToEmit: any = null;

    valueToEmit = this.selected ? (this.selected as SidebarOptionSelect).value : fallbackValue;

    this.value = valueToEmit;
    this.valueChange.emit(valueToEmit);
    this.onChange(valueToEmit);
    this.changeDetectorRef.markForCheck();
  }

  toggle(): void {
    this.panelOpen ? this.close() : this.open();
  }

  open(): void {
    if (this.canOpen()) {
      this.panelOpen = true;
      this.changeDetectorRef.markForCheck();
    }
  }

  close(): void {
    if (this.panelOpen) {
      this.panelOpen = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  isSingleLineBorder(value) {
    return ['solid', 'dotted', 'dashed'].includes(value);
  }

  get selected(): SidebarOptionSelect {
    return this.selectionModel.selected[0];
  }

  get triggerValue() {
    if (this.empty) {
      return '';
    }

    return this.selectionModel.selected[0].viewValue;
  }

  get empty(): boolean {
    return !this.selectionModel || this.selectionModel.isEmpty();
  }
}
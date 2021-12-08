import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, InjectionToken, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

export class SidebarOptionSelectSelectionChange {
  constructor(
    public source: SidebarOptionSelect,
    public isUserInput = false,
  ) { }
}

export interface SidebarOptionSelectParentComponent {
  disableRipple?: boolean;
  multiple?: boolean;
}

export const SIDEBAR_SELECT_OPTION_PARENT_COMPONENT =
    new InjectionToken<SidebarOptionSelectParentComponent>('MAT_OPTION_PARENT_COMPONENT');

@Component({
  selector: 'peb-editor-select-option',
  templateUrl: 'select.option.html',
  host: {
    '(click)': 'select()',
  },
  styleUrls: ['select.option.scss'],
})
export class SidebarOptionSelect {

  @Input() value: any;
  @Input()
  get disabled() { return this._disabled; }
  set disabled(value: any) { this._disabled = coerceBooleanProperty(value); }

  @Output() readonly onSelectionChange = new EventEmitter<SidebarOptionSelectSelectionChange>();

  readonly stateChanges = new Subject<void>();

  active = false;
  selected = false;
  _disabled = false;

  constructor(
    private element: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  getHostElement(): HTMLElement {
    return this.element.nativeElement;
  }

  get viewValue(): string {
    return (this.getHostElement().textContent || '').trim();
  }

  selectViaInteraction(): void {
    if (!this.disabled) {
      this.selected = !this.selected ?? true;
      this.changeDetectorRef.markForCheck();
      this.emitSelectionChangeEvent(true);
    }
  }

  select(): void {
    if (!this.selected) {
      this.selected = true;
      this.changeDetectorRef.markForCheck();
      this.emitSelectionChangeEvent();
    }
  }

  deselect(): void {
    if (this.selected) {
      this.selected = false;
      this.changeDetectorRef.markForCheck();
      this.emitSelectionChangeEvent();
    }
  }

  setInactiveStyles(): void {
    if (this.active) {
      this.active = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  private emitSelectionChangeEvent(isUserInput = false): void {
    this.onSelectionChange.emit(new SidebarOptionSelectSelectionChange(this, isUserInput));
  }
}

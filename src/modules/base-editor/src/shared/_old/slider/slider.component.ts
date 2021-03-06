import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { merge, of, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';

import { AbstractComponent } from '../../../misc/abstract.component';

@Component({
  selector: 'peb-editor-sidebar-slider',
  templateUrl: 'slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class PebEditorSliderComponent extends AbstractComponent implements OnInit {
  @Input() control: FormControl;
  @Input() min = 0;
  @Input() max = 100;
  @Input() unit: string;

  inputSubject$ = new Subject<any>();

  ngOnInit() {
    merge(
      this.inputSubject$.pipe(map((event: Event) => (event.target as HTMLInputElement).value)),
      of(this.control.value),
    ).pipe(
      filter((value: any) => value !== undefined && value !== null && !isNaN(value)),
      tap((value: number) => {
        this.control.patchValue(value);
      }),
      takeUntil(this.destroyed$),
    )
    .subscribe();
  }

  get width(): number {
    return Math.min(this.max - this.min, this.control.value - this.min) / (this.max - this.min) * 100;
  }
}

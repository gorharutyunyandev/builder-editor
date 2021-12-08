import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { PebGuideline } from '../../plugins/guidelines';

@Component({
  selector: 'peb-editor-controls-guidelines',
  templateUrl: 'guidelines.control.html',
  styleUrls:['guidelines.control.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebEditorGuidelinesControl {

  @Input()
  set guidelines(value: PebGuideline[]) {
    this.guidelinesSubject$.next(value);
  }

  @Input()
  scale: number;

  @Input()
  @HostBinding('style.top.px')
  top = 40;

  @Input()
  @HostBinding('style.left.px')
  left = 40;

  @Input()
  @HostBinding('style.width.px')
  width = 1280;

  @Input()
  @HostBinding('style.height.px')
  height = 0;

  @Input()
  set spaceWidth(value: number) {
    this.spaceWidthSubject$.next(value);
  }

  private readonly guidelinesSubject$ = new BehaviorSubject<PebGuideline[]>([]);
  readonly guidelines$ = this.guidelinesSubject$.asObservable();

  private readonly spaceWidthSubject$ = new BehaviorSubject<number>(0);
  readonly spaceWidth$ = this.spaceWidthSubject$.asObservable();

  private readonly scaleSubject$ = new BehaviorSubject<number>(0);
  readonly scale$ = this.scaleSubject$.asObservable();
}

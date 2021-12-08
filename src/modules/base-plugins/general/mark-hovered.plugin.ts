import { Inject, Injectable } from '@angular/core';
import { combineLatest, EMPTY, merge, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  finalize,
  map,
  repeat,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { isEqual } from 'lodash';

import {
  AfterGlobalInit,
  fromResizeObserver,
  PebEditorAccessorService,
  PebEditorElementAddSectionControl,
  PebEditorElementEdgesControl,
  PebEditorEvents,
  PebEditorRenderer,
  PebEditorState,
  PEB_EDITOR_EVENTS,
  PEB_EDITOR_STATE,
} from '@pe/builder-editor';

@Injectable()
export class PebEditorMarkHoveredPlugin implements AfterGlobalInit {

  private get editor() {
    return this.editorAccessorService.editorComponent;
  }

  constructor(
    private editorAccessorService: PebEditorAccessorService,
    private renderer: PebEditorRenderer,
    @Inject(PEB_EDITOR_EVENTS) private events: PebEditorEvents,
    @Inject(PEB_EDITOR_STATE) private state: PebEditorState,
  ) {}

  afterGlobalInit(): Observable<any> {
    return merge(
      this.detectHoveredElement,
      this.showHoveredBorders,
    );
  }

  get detectHoveredElement(): Observable<any> {
    return merge(
      this.events.contentContainer.mousemove$.pipe(
        tap((evt: MouseEvent) => {
          const elementCmp = this.renderer.getElementComponentAtEventPoint(evt);
          const newHoveredId = elementCmp ? elementCmp.definition.id : null;

          if (this.state.hoveredElement !== newHoveredId) {
            this.state.hoveredElement = newHoveredId;
          }
        }),
      ),
    ).pipe(
      finalize(() => this.state.hoveredElement = null),
    );
  }

  get showHoveredBorders(): Observable<any> {
    return combineLatest([
      this.state.hoveredElement$.pipe(filter(v => Boolean(v))),
      this.state.selectedElements$,
    ]).pipe(
      filter(([hovId, selIds]) => !selIds.includes(hovId)),
      switchMap(([hoveredId]) => {
        const hoveredCmp = this.renderer.getElementComponent(hoveredId);
        if (!hoveredCmp) {
          // TODO: At certain point this thrown an error. Should be investigated.
          // debugger;
          return EMPTY;
        }

        const hoveredNode = hoveredCmp.nativeElement;

        const addSectionControl = PebEditorElementAddSectionControl.construct(this.editor, hoveredCmp);
        const bordersControl = PebEditorElementEdgesControl.construct(this.editor, hoveredCmp);

        return fromResizeObserver(hoveredNode).pipe(
          startWith(null as object),
          map(() => hoveredNode.getBoundingClientRect()),
          distinctUntilChanged(isEqual),
          tap(() => {
            bordersControl.instance.detectChanges();
            addSectionControl.instance.detectChanges();
          }),
          takeUntil(merge(
            this.state.selectedElements$.pipe(filter(selIds => selIds.includes(hoveredId))),
            this.state.hoveredElement$.pipe(filter(id => id !== hoveredId)),
          )),
          finalize(() => {
            if (hoveredCmp.controls.edges === bordersControl) {
              hoveredCmp.controls.edges = null;
            }
            bordersControl.destroy();
            if (hoveredCmp.controls.addsection === addSectionControl) {
              hoveredCmp.controls.addsection = null;
            }
            addSectionControl.destroy();
          }),
        );
      }),
      repeat(),
    );
  }
}

import { Inject, Injectable } from '@angular/core';
import { isEqual } from 'lodash';
import { BehaviorSubject, combineLatest, EMPTY, merge, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  finalize,
  map,
  repeat,
  retry,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { pebCreateLogger, PebElementId, PebElementType } from '@pe/builder-core';
import {
  AfterGlobalInit,
  fromResizeObserver,
  PebEditorAccessorService,
  PebEditorElementAnchorsControl,
  PebEditorElementEdgesControl,
  PebEditorEvents,
  PebEditorRenderer,
  PebEditorSectionLabelsControl,
  PebEditorState,
  PEB_EDITOR_EVENTS,
  PEB_EDITOR_STATE,
} from '@pe/builder-editor';

const log = pebCreateLogger('editor:plugins:mark-selected');

@Injectable()
export class PebEditorMarkSelectedPlugin implements AfterGlobalInit {

  get editor() {
    return this.editorAccessorService.editorComponent;
  }

  constructor(
    private editorAccessorService: PebEditorAccessorService,
    @Inject(PEB_EDITOR_STATE) protected state: PebEditorState,
    private renderer: PebEditorRenderer,
    @Inject(PEB_EDITOR_EVENTS) private events: PebEditorEvents,
  ) {}

  private readonly behaviorSelectedElements$ = new BehaviorSubject<PebElementId[]>([]);

  afterGlobalInit(): Observable<any> {
    return merge(
      this.detectSelectedElement,
      this.showSelectedBorders,
      this.behaviorSelectedElements$.pipe(
        tap((ids) => {
          // TODO: Remove after the performance problem is solved
          setTimeout(() => {
            this.state.selectedElements = ids;
          });
        }),
      ),
    );
  }

  get detectSelectedElement(): Observable<MouseEvent> {
    return merge(
      this.events.contentContainer.mousedown$.pipe(
        tap((evt: MouseEvent) => {
          const selectedCmp = this.renderer.getElementComponentAtEventPoint(evt);
          const newSelectedIds = selectedCmp ? [selectedCmp.definition.id] : [];
          const newSelectedElementsIds = [...newSelectedIds];

          log('set selected', newSelectedElementsIds);
          if (evt.shiftKey || evt.metaKey || evt.ctrlKey) {
            newSelectedElementsIds.push(...this.behaviorSelectedElements$.value);
          }

          /** TODO:
           * For some reason it takes 300-500 milliseconds, probably due to the fact that there are many subscribers.
           * We need to figure it out.
           */
          setTimeout(() => {
            this.behaviorSelectedElements$.next(newSelectedElementsIds);
          });
        }),
      )
        .pipe(
          finalize(() => this.state.hoveredElement = null),
          retry(1),
        ),
    );
  }

  get showSelectedBorders(): Observable<Array<Partial<DOMRectReadOnly>>> {
    return this.state.selectedElements$.pipe(
      filter(selectedIds => selectedIds.length > 0),
      switchMap((selectedIds) => {


        const fromResizeObservers = selectedIds.map((selectedId) => {
          const elementCmp = this.renderer.getElementComponent(selectedId);

          if (!elementCmp) {
            // TODO: Check this
            // The element or parent of element has display: none style
            this.state.selectedElements = [];
            return EMPTY;
          }

          const elementNode = elementCmp.nativeElement;

          if (elementCmp.definition.type === PebElementType.Text) {
            return EMPTY;
          }

          const resizableElement = ![
            PebElementType.ProductCatalog,
            PebElementType.ProductDetails,
            PebElementType.Products,
          ].find(type => elementCmp.definition.type === type);

          const edgesRef = PebEditorElementEdgesControl.construct(this.editor, elementCmp);
          const anchorsRef = resizableElement
            ? PebEditorElementAnchorsControl.construct(this.editor, elementCmp)
            : null;
          const labelsRef = PebEditorSectionLabelsControl.construct(this.editor, elementCmp);

          // edgesRef.instance.type = 'selected';
          // edgesRef.instance.detectChanges();

          return fromResizeObserver(elementNode).pipe(
            startWith(null as object),
            map(() => elementNode.getBoundingClientRect()),
            distinctUntilChanged(isEqual),
            tap(() => {
              edgesRef?.instance.detectChanges();
              anchorsRef?.instance.detectChanges();
              labelsRef?.instance.detectChanges();
            }),
            takeUntil(
              this.state.selectedElements$.pipe(filter(ids => !ids.length)),
            ),
            finalize(() => {
              if (elementCmp.controls.edges === edgesRef) {
                elementCmp.controls.edges = null;
              }
              if (elementCmp.controls.anchors === anchorsRef) {
                elementCmp.controls.anchors = null;
              }
              if (elementCmp.controls.labels === labelsRef) {
                elementCmp.controls.labels = null;
              }

              edgesRef?.destroy();
              anchorsRef?.destroy();
              labelsRef?.destroy();
            }),
          );
        });

        return combineLatest(fromResizeObservers);
      }),
      repeat(),
    );
  }

}

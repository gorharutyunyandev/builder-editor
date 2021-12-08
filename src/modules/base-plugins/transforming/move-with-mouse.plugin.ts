/* tslint:disable:member-ordering */
import { ComponentRef, Inject, Injectable, Optional } from '@angular/core';
import { EMPTY, merge, Observable } from 'rxjs';
import { filter, map, repeat, skip, skipWhile, switchMap, take, takeLast, takeUntil, tap } from 'rxjs/operators';

import { pebCreateLogger, PebElementType, PebScreen, PEB_DESKTOP_CONTENT_WIDTH } from '@pe/builder-core';
import {
  AfterGlobalInit,
  calculateGrid,
  filterNot,
  getGuidelines,
  getMagnetizedGuidelines,
  getParentSectionsForGuidelines,
  MouseKey,
  Movement,
  movingTransformations,
  onlyMouseKeyFilter,
  PebDOMRect,
  PebEditorAccessorService,
  PebEditorElement,
  PebEditorElementAnchorsControl,
  PebEditorElementCoordsControl,
  PebEditorElementEdgesControl,
  PebEditorElementAddSectionControl,
  PebEditorEvents,
  PebEditorGuidelinesControl,
  PebEditorRenderer,
  PebEditorSlot,
  PebEditorState,
  PebEditorStore,
  PebGuideline,
  PEB_EDITOR_EVENTS,
  PEB_EDITOR_STATE,
} from '@pe/builder-editor';

interface MoveTick {
  state: {
    initialCoords: PebDOMRect,
    movingElement: PebEditorElement;
    nextParent: PebEditorElement;
    nextSiblings: PebEditorElement[];
    invalidPosition: boolean;
    movingBordersCmpRef: ComponentRef<PebEditorElementEdgesControl>;
    movingAddSectioinCmpRef: ComponentRef<PebEditorElementAddSectionControl>;
    movingAnchorsCmpRef: ComponentRef<PebEditorElementAnchorsControl>;
    movingCoordsCtrlRef: ComponentRef<PebEditorElementCoordsControl>;
    guidelinesCtrlRef: ComponentRef<PebEditorGuidelinesControl>;
    guidelines: { [key: string /** sectionID */]: PebGuideline[] },
  };
  startEvent: MouseEvent;
  moveEvent: MouseEvent;
}

const log = pebCreateLogger('editor:plugins:move-with-mouse');

@Injectable({ providedIn: 'any' })
export class PebEditorMoveWithMousePlugin implements AfterGlobalInit {

  get editor() {
    return this.editorAccessorService.editorComponent;
  }

  constructor(
    private editorAccessorService: PebEditorAccessorService,
    @Inject(PEB_EDITOR_STATE) protected state: PebEditorState,
    private renderer: PebEditorRenderer,
    private store: PebEditorStore,
    @Inject(PEB_EDITOR_EVENTS) private events: PebEditorEvents,
  ) { }

  afterGlobalInit(): Observable<any> {
    return this.events.renderer.mousedown$.pipe(
      filter(onlyMouseKeyFilter(MouseKey.Primary)),
      switchMap((startEvent) => {
        const movingElement = this.renderer.getElementComponentAtEventPoint(startEvent);

        const state : any = {
          movingElement,
          guidelines: getGuidelines(this.renderer, movingElement.definition.id),
          guidelinesCtrlRef : this.editor.insertToSlot(PebEditorGuidelinesControl, PebEditorSlot.contentContainer),
        };

        const move$ = this.events.contentContainer.mousemove$.pipe(
          filter(() => state.movingElement.definition.type !== PebElementType.Section),
          /** Wait for Text Maker component selection initialized */
          filter(() => !!state.movingElement.controls.edges),
          skipWhile((moveEvent) => {
            const movement = {
              dx: Math.ceil(moveEvent.pageX - startEvent.pageX),
              dy: Math.ceil(moveEvent.pageY - startEvent.pageY),
            };
            return Math.sqrt(Math.pow(movement.dx, 2) + Math.pow(movement.dy, 2)) < 4;
          }),
          map(moveEvent => ({ state, startEvent, moveEvent })),
          takeUntil(merge(
            this.events.contentContainer.mouseup$,
            this.events.contentContainer.mouseleave$,
            this.events.contentContainer.mousedown$.pipe(
              filter(filterNot(onlyMouseKeyFilter(MouseKey.Primary))),
            ),
          )),
        );

        return merge(
          move$.pipe(
            take(1), // `first` doesn't allow empty sequence
            tap(this.moveInitHandler),
            tap(this.moveInProgressHandler),
          ),
          move$.pipe(
            skip(1),
            tap(this.moveInProgressHandler),
          ),
          move$.pipe(
            takeLast(1),
            switchMap(this.moveCompleteHandler),
          ),
        );
      }),
      repeat(),
    );
  }

  private moveInitHandler = (tick: MoveTick) => {

    const rendererNode = this.renderer.nativeElement;
    const rendererRect = rendererNode.getBoundingClientRect();

    Object.assign(tick.state.guidelinesCtrlRef.instance, {
      // guidelines: Object.values(tick.state.guidelines).reduce((acc, curr) => ([...acc, ...curr]), []),
      guidelines: [],
      left: this.editor.contentPadding.horizontal,
      top: this.editor.contentPadding.vertical,
      width: rendererRect.width,
      height: rendererRect.height,
      spaceWidth: this.renderer.options.screen === PebScreen.Desktop
        ? (rendererRect.width - PEB_DESKTOP_CONTENT_WIDTH * this.state.scale) / 2
        : 0,
      scale: this.state.scale,
    });

    tick.state.guidelinesCtrlRef.changeDetectorRef.detectChanges();
    tick.state.movingElement.controls.guidelinesCtrlRef = tick.state.guidelinesCtrlRef;

    const movingElementCmp = tick.state.movingElement;
    const movingElementNode = movingElementCmp.nativeElement;

    const movingBordersCmpRef = movingElementCmp.controls.edges;
    const movingAddSectioinCmpRef = movingElementCmp.controls.addsection;
    const movingAnchorsCmpRef = movingElementCmp.controls.anchors;

    PebEditorElementCoordsControl.construct(this.editor, movingElementCmp);

    movingElementNode.style.zIndex = '1000';
    movingBordersCmpRef.instance.nativeElement.style.zIndex = '1001';

    if (movingAnchorsCmpRef) {
      movingAnchorsCmpRef.instance.variant = 'hidden';
      movingAnchorsCmpRef.instance.detectChanges();
    }

    if (movingAddSectioinCmpRef) {
      movingAddSectioinCmpRef.instance.variant = 'hidden';
      movingAddSectioinCmpRef.instance.detectChanges();
    }

    tick.state.initialCoords = movingElementCmp.getAbsoluteElementRect();
    tick.state.movingElement = movingElementCmp;
    tick.state.movingBordersCmpRef = movingBordersCmpRef;
    tick.state.movingAddSectioinCmpRef = movingAddSectioinCmpRef;
    tick.state.movingAnchorsCmpRef = movingAnchorsCmpRef;
  }

  private moveInProgressHandler = (tick: MoveTick) => {
    const { movingElement, initialCoords } = tick.state;
    const scale = this.state.scale;

    const movement: Movement = {
      dx: Math.ceil(tick.moveEvent.pageX - tick.startEvent.pageX),
      dy: Math.ceil(tick.moveEvent.pageY - tick.startEvent.pageY),
    };

    const nextPosition = {
      x: Math.round(initialCoords.left + movement.dx / scale),
      y: Math.round(initialCoords.top + movement.dy / scale),
    };

    const guidelineSections = getParentSectionsForGuidelines(movingElement, this.renderer);

    const magnetizedGuidelines = getMagnetizedGuidelines(
      tick.state.guidelines,
      { dx: movement.dx / scale, dy: movement.dy / scale },
      initialCoords,
      guidelineSections,
      this.state.scale,
    );

    movement.dx = magnetizedGuidelines.left ? magnetizedGuidelines.left.dx * scale : movement.dx;
    movement.dy = magnetizedGuidelines.top ? magnetizedGuidelines.top.dy * scale : movement.dy;

    this.drawGuidelines(tick, Object.values(magnetizedGuidelines).filter(Boolean));

    movingElement.position?.form.setValue(
      nextPosition,
      {
        onlySelf: true,
        emitEvent: false,
      },
    );

    tick.state.nextParent = this.renderer.getBehindElementComponentAtEventPoint(tick.moveEvent);
    tick.state.nextSiblings = this.getPotentialSiblings(tick.state.nextParent, movingElement);
    tick.state.invalidPosition = !this.validatePosition(tick);

    this.setTransformValue(movingElement.nativeElement, movement);

    movingElement.controls.edges.instance.valid = !tick.state.invalidPosition;
    movingElement.controls.edges.instance.detectChanges();

    movingElement.controls.coords.instance.detectChanges();
  }

  private moveCompleteHandler = (tick: MoveTick): Observable<any> => {
    const { movingElement, invalidPosition, nextParent, nextSiblings, guidelinesCtrlRef } = tick.state;

    log('Completion');
    // log('ParentId: ', nextParent.definition.id);

    guidelinesCtrlRef.hostView.destroy();
    movingElement.controls.coords.hostView.destroy();
    movingElement.controls.coords = null;

    if (invalidPosition) {
      log('Invalid move');
      this.resetBehaviorStyles(tick);
      return EMPTY;
    }

    //  Moving into new parent
    if (nextParent.definition.id !== movingElement.parent.definition.id) {
      const prevParent = movingElement.parent;
      const prevParentChildren = this.getPotentialSiblings(prevParent, movingElement);
      const prevElementsChanges = calculateGrid(prevParent, prevParentChildren);

      const nextParentId = nextParent.definition.id;
      const nextParentChildren = [movingElement, ...nextSiblings];
      const nextElementChanges = calculateGrid(nextParent, nextParentChildren);

      if (prevElementsChanges[nextParentId]) {
        Object.assign(nextElementChanges[nextParentId], prevElementsChanges[nextParentId]);
        delete prevElementsChanges[nextParentId];
      }

      const nextParentTransformation = nextParent.potentialContainer
        && movingTransformations[nextParent.definition.type](
          nextParent.definition, nextParent.styles,
        );

      return this.store.relocateElement(
        movingElement.definition.id,
        nextParent.definition.id,
        { ...prevElementsChanges, ...nextElementChanges },
        this.state.screen,
        nextParentTransformation,
      ).pipe(
        tap(() => {
          this.resetBehaviorStyles(tick);
          movingElement.position?.update();
          movingElement.dimensions?.update();
          movingElement.proportionDimensions?.update();
        }),
      );
    }

    // Moving inside previous parent
    const children = [movingElement, ...nextSiblings];
    const changes = calculateGrid(nextParent, children);

    return this.store.updateStyles(this.state.screen, changes).pipe(
      tap(() => {
        const newElementCmp = this.renderer.getElementComponent(movingElement.definition.id);
        tick.state.movingBordersCmpRef.instance.component = newElementCmp;

        if (tick.state.movingAnchorsCmpRef) {
          tick.state.movingAnchorsCmpRef.instance.component = newElementCmp;
          tick.state.movingAnchorsCmpRef.instance.detectChanges();
        }

        if (tick.state.movingAddSectioinCmpRef) {
          tick.state.movingAddSectioinCmpRef.instance.component = newElementCmp;
          tick.state.movingAddSectioinCmpRef.instance.detectChanges();
        }

        this.resetBehaviorStyles(tick);

        tick.state.movingBordersCmpRef.instance.detectChanges();
        movingElement.position?.update();
        movingElement.dimensions?.update();
        movingElement.proportionDimensions?.update();
      }),
    );
  }

  private getPotentialSiblings(parentCmp: PebEditorElement, elementCmp: PebEditorElement) {
    if (!parentCmp) {
      return null;
    }

    const allChildren = parentCmp.definition.children?.map(elDef => this.renderer.getElementComponent(elDef.id));

    return allChildren?.filter(siblingCmp => siblingCmp !== elementCmp) || [];
  }

  private resetBehaviorStyles(tick: MoveTick) {
    const element = tick.state.movingElement;

    if (tick.state.movingAnchorsCmpRef) {
      tick.state.movingAnchorsCmpRef.instance.variant = 'default';
      tick.state.movingAnchorsCmpRef.instance.nativeElement.style.transform = null;
    }

    tick.state.movingBordersCmpRef.instance.valid = true;

    element.nativeElement.style.zIndex = null;
    element.nativeElement.style.boxShadow = null;
    element.nativeElement.style.transform = null;

    tick.state.movingBordersCmpRef.instance.nativeElement.style.transform = null;
  }

  private validatePosition(tick: MoveTick): boolean {
    const { nextParent, nextSiblings, movingElement } = tick.state;

    if (!nextParent || !nextSiblings) {
      return null;
    }

    const intersectWithNextSiblings = nextSiblings.some(
      sibling => this.renderer.elementIntersect(movingElement, sibling),
    );

    const fullIncludedToNextParent = this.renderer.elementInclude(movingElement, nextParent);

    const elementInsideContentContainer = this.renderer.elementInsideContentContainer(movingElement, nextParent)
      || this.renderer.elementMatchesInsideContentContainer(movingElement, nextParent);

    return fullIncludedToNextParent && !intersectWithNextSiblings && elementInsideContentContainer;
  }

  private setTransformValue(element: HTMLElement, movement: Movement) {
    element.style.transform = `translate(${movement.dx}px, ${movement.dy}px)`;
  }

  private drawGuidelines(tick: MoveTick, guidelines: PebGuideline[]) {
    Object.assign(tick.state.guidelinesCtrlRef.instance, {
      guidelines,
    });
    tick.state.guidelinesCtrlRef.changeDetectorRef.detectChanges();
  }
}

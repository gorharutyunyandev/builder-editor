import { Inject, Injectable } from '@angular/core';
import { combineLatest, EMPTY, merge, Observable, of } from 'rxjs';
import { filter, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { cloneDeep, forEach } from 'lodash';

import {
  PebElementDef,
  PebElementId,
  PebElementStyles,
  PebElementType,
  pebGenerateId,
  pebTraverseElementDeep,
} from '@pe/builder-core';
import {
  AfterGlobalInit,
  calculateGrid,
  ElementManipulation,
  getNextParentElement,
  isSectionElement,
  PebEditorAccessorService,
  PebEditorElement,
  PebEditorRenderer,
  PebEditorState,
  PebEditorStore,
  PebElementKit,
  PebPasteElement,
  PEB_EDITOR_STATE,
  SectionManipulation,
} from '@pe/builder-editor';

export const STRUCTURAL_ELEMENTS: PebElementType[] = [
  PebElementType.Document,
  PebElementType.Section,
];

@Injectable()
export class PebEditorElementManipulationPlugin implements AfterGlobalInit {

  private get editor() {
    return this.editorAccessorService.editorComponent;
  }

  constructor(
    private editorAccessorService: PebEditorAccessorService,
    private renderer: PebEditorRenderer,
    private store: PebEditorStore,
    @Inject(PEB_EDITOR_STATE) private state: PebEditorState,
  ) {
  }

  afterGlobalInit(): Observable<any> {
    return merge(
      this.deleteElement(),
      this.copyElement(),
      this.pasteElement(),
      this.changeSectionPosition(),
      this.removeElementAfterMove(),
      this.selectMovedSection(),
    );
  }

  deleteElement(): Observable<any> {
    return this.editor.manipulateElement$.pipe(
      filter(({ type }) => type === 'delete'),
      switchMap(({ selectedElements, screen }) => combineLatest(
        selectedElements.map((id: PebElementId) => this.getSelectedElement(id)),
      ).pipe(
        map(elements => ({ screen, selectedElements: elements })),
      )),
      map(({ selectedElements, screen }) => ({
        screen,
        deletableElements: selectedElements.filter(
          el => (!el.element.meta || el.element.meta.deletable) && el.element.type !== PebElementType.Document,
        ),
      })),
      filter(({ deletableElements }) => !!deletableElements.length),
      map(({ deletableElements, screen }) => {
        const components = deletableElements.map(e => this.renderer.getElementComponent(e.element.id));

        this.state.selectedElements = [];
        const parentChanges = components.reduce(
          (acc, component) => {
            component.nativeElement.style.display = 'none';
            const changes = calculateGrid(component.parent, component.parent.children.filter(
              c => !deletableElements.find(e => e.element.id === c.definition.id),
            ));
            return { ...acc, ...changes };
          },
          {},
        );

        return { deletableElements, screen, parentChanges };
      }),
      switchMap(({ deletableElements, screen, parentChanges }) =>
        this.store.deleteElement(deletableElements, parentChanges, screen),
      ),
    );
  }


  copyElement() {
    return this.editor.manipulateElement$.pipe(
      filter(({ type }) => type === 'copy'),
      switchMap(({ selectedElements }) => {
        const elements = selectedElements.map((id: PebElementId) => this.getSelectedElement(id));
        return combineLatest(elements);
      }),
      filter(elementKit => !!elementKit),
      tap((elements: PebElementKit[]) => {
        const copiedElements = elements.map((element) => {
          const copiedElement = cloneDeep(element) as PebElementKit;

          const flatElementsIds = [];
          pebTraverseElementDeep(element.element, (el: PebElementDef) => flatElementsIds.push(el.id));

          copiedElement.styles = this.getElementStyles(flatElementsIds);
          return copiedElement;
        });

        this.store.copiedElementsSubject$.next(copiedElements);
      }),
    );
  }

  pasteElement() {
    return combineLatest([
      this.editor.manipulateElement$,
      this.store.copiedElements$,
    ]).pipe(
      filter(([event, copiedElements]: [ElementManipulation, PebElementKit[]]) => event.type === 'paste'),
      filter(([event, copiedElements]: [ElementManipulation, PebElementKit[]]) => !!copiedElements),
      mergeMap(([event, copiedElements]: [ElementManipulation, PebElementKit[]]) =>
        getNextParentElement(
          this.state,
          this.renderer,
          this.editor,
        ).pipe(
          map(parentElement => ({ copiedElements, parentElement, event })),
        )),
      switchMap(({ parentElement, copiedElements, event }) => {
        if (!parentElement || !parentElement.definition) {
          return;
        }
        const pasteElements: PebPasteElement[] = copiedElements.map(copiedElement => copiedElement.element.type !== 'section'
          ? this.pasteBasicElement(copiedElement, parentElement)
          : this.pasteSectionElement(copiedElement, parentElement));

        return this.store.pasteElement(pasteElements, event.screen);
      }),
      tap(() => this.editor.manipulateElementSubject$.next({ type: null })),
    );
  }

  changeSectionPosition() {
    return combineLatest([
      this.editor.manipulateSection$,
      this.store.copiedElements$,
    ]).pipe(
      filter(([event, copiedElements]: [SectionManipulation, PebElementKit[]]) =>
        event.type === 'moveUp' || event.type === 'moveDown'),
      mergeMap(([event, copiedElements]: [SectionManipulation, PebElementKit[]]) =>
        getNextParentElement(
          this.state,
          this.renderer,
          this.editor,
        ).pipe(
          map(parentElement => ({ copiedElements, parentElement, event })),
        )),
      map(({ parentElement, copiedElements, event }) => {
        if (!parentElement || !parentElement.definition) {
          return EMPTY;
        }

        const pasteElements: PebPasteElement[] = copiedElements.map((copiedElement) => {
          const isStructuralElement = STRUCTURAL_ELEMENTS.findIndex(type => type === copiedElement.element.type) > -1;
          const parentId = isStructuralElement ? this.renderer.element.id : parentElement.definition.id;

          const pageContextId = this.store.snapshot.pages[this.store.activePageId].contextId;
          const copyContextSchema = this.store.snapshot.contextSchemas[pageContextId][copiedElement.element.id];

          const beforeId = this.getElementToPasteBefore(parentElement, event.type);
          const childIds = [];
          pebTraverseElementDeep(copiedElement.element, (el: PebElementDef) => childIds.push(el.id));
          return {
            childIds,
            beforeId,
            parentId,
            elementDef: {
              prevId: copiedElement.element.id,
              element: {
                ...copiedElement.element,
                id: pebGenerateId(),
              },
              styles: copiedElement.styles,
              contextSchema: copyContextSchema,
            },
          };
        });

        this.store.pasteElement(pasteElements, event.screen);
        return pasteElements[0].elementDef.element.id;
      }),
      tap((lastMovedSection: PebElementId) => {
        this.editor.manipulateSectionSubject$.next({
          lastMovedSection,
          selectedElements: this.state.selectedElements,
          type: 'removeSectionAfterMove',
        });
      }),
    );
  }

  // TODO: 'removeSectionAfterMove' shouldnt be in manipulateSection
  removeElementAfterMove(): Observable<any> {
    return this.editor.manipulateSection$.pipe(
      filter(({ type }) => type === 'removeSectionAfterMove'),
      switchMap(({ selectedElements }) => combineLatest(
        selectedElements.map((id: PebElementId) => this.getSelectedElement(id)),
      )),
      map(selectedElements => selectedElements.filter(
        el => el.element.type !== PebElementType.Document,
      )),
      filter(deletableElements => !!deletableElements.length),
      tap(() => {
        this.state.selectedElements = [];
      }),
      map((deletableElements) => {
        const components = deletableElements.map(e => this.renderer.getElementComponent(e.element.id));

        this.state.selectedElements = [];
        const parentChanges = components.reduce(
          (acc, component) => {
            component.nativeElement.style.display = 'none';
            const changes = calculateGrid(component.parent, component.parent.children.filter(
              c => !deletableElements.find(e => e.element.id === c.definition.id),
            ));
            return { ...acc, ...changes };
          },
          {},
        );

        return { deletableElements, parentChanges };
      }),
      map(({ deletableElements, parentChanges }) => {
        this.store.deleteElement(deletableElements, parentChanges, this.state.screen);
      }),
      withLatestFrom(this.editor.manipulateSection$),
      tap(([event, manipulatedSection]) => {
        this.editor.manipulateSectionSubject$.next({
          selectedElements: this.state.selectedElements,
          type: 'markMovedSection',
          lastMovedSection: manipulatedSection.lastMovedSection,
        });
      }),
    );
  }

  selectMovedSection(): Observable<any> {
    return this.editor.manipulateSection$.pipe(
      filter(({ type }) =>
        type === 'markMovedSection'),
      map(({ lastMovedSection }) => {
        this.store.activatePage(this.store.activePageId);
        this.state.selectedElements = [lastMovedSection];
      }),
    );
  }


  private pasteBasicElement(copiedElement: PebElementKit, parentElement: PebEditorElement) {
    const isStructuralElement = STRUCTURAL_ELEMENTS.findIndex(type => type === copiedElement.element.type) > -1;
    const parentId = isStructuralElement ? this.renderer.element.id : parentElement.definition.id;
    const beforeId = isStructuralElement ? parentElement.definition.id : null;

    const pageContextId = this.store.snapshot.pages[this.store.activePageId].contextId;
    const copyContextSchema = this.store.snapshot.contextSchemas[pageContextId][copiedElement.element.id];

    const childIds = [];
    const childStyles = {
      [this.state.screen]: {},
    };
    pebTraverseElementDeep(copiedElement.element, (el: PebElementDef) => {
      childIds.push(el.id);

      if (copiedElement.element.id !== el.id) {
        childStyles[this.state.screen][el.id] = (el as any).styles;
      }
    });

    return {
      parentId,
      childIds,
      beforeId,
      elementDef: {
        prevId: copiedElement.element.id,
        element: {
          ...copiedElement.element,
          id: pebGenerateId(),
        },
        styles: {
          ...copiedElement.styles,
          // ...(Object.values(PebScreen).map(screen => ({
          //   [screen]: {
          //     ...copiedElement.styles[screen][copiedElement.element.id] as any, // TODO: check
          //     display: 'none',
          //   },
          // }))),
          [this.state.screen]: {
            ...childStyles[this.state.screen],
            [copiedElement.element.id]: {
              ...copiedElement.styles[this.state.screen][copiedElement.element.id] as any, // TODO: check
              gridArea: null,
              gridColumn: null,
              gridRow: null,
              margin: null,
              marginTop: null,
              marginLeft: null,
              position: 'absolute',
              top: 0,
              left: 0,
            },
          },
        },
        contextSchema: copyContextSchema,
      },
    };
  }

  private pasteSectionElement(copiedElement: PebElementKit, parentElement: PebEditorElement) {
    const isStructuralElement = STRUCTURAL_ELEMENTS.findIndex(type => type === copiedElement.element.type) > -1;
    const parentId = isStructuralElement ? this.renderer.element.id : parentElement.definition.id;
    const beforeId = isStructuralElement ? parentElement.definition.id : null;

    const pageContextId = this.store.snapshot.pages[this.store.activePageId].contextId;
    const copyContextSchema = this.store.snapshot.contextSchemas[pageContextId][copiedElement.element.id];

    const childIds = [];
    pebTraverseElementDeep(copiedElement.element, (el: PebElementDef) => childIds.push(el.id));

    // validate section element sticky styles
    const isSticky
      = Object.keys(copiedElement.styles).some(
        key => (copiedElement as any).styles[key][copiedElement.element.id].position === 'sticky',
      );
    const isParentOnTop = parentElement.target.parent.element.children
      .filter(el => el.type === 'section')
      .findIndex(el => el.id === parentElement.target.element.id) === 0;

    if (isSticky && !isParentOnTop) {
      Object.keys(copiedElement.styles).forEach((view) => {
        const viewStyles: any = copiedElement.styles[view][copiedElement.element.id];
        if (viewStyles.position) {
          viewStyles.position = 'relative';
          viewStyles.zIndex = null;
        }
      });
    }

    if (isParentOnTop && isSectionElement(parentElement)) {
      parentElement.section.form.get('sticky').patchValue(false);
    }

    return {
      parentId,
      childIds,
      beforeId,
      elementDef: {
        prevId: copiedElement.element.id,
        element: {
          ...copiedElement.element,
          id: pebGenerateId(),
        },
        styles: copiedElement.styles,
        contextSchema: copyContextSchema,
      },
    };
  }

  private getElementStyles(elementIds: PebElementId[]): { [screen: string]: PebElementStyles } {
    const elementStyles = {};
    elementIds.forEach((elementId) => {
      const pageStylesheetIds = this.store.snapshot.pages[this.store.activePageId].stylesheetIds;
      forEach(pageStylesheetIds, (styleId, key) => {
        if (!elementStyles[key]) {
          elementStyles[key] = {};
        }
        elementStyles[key][elementId] = this.store.snapshot.stylesheets[styleId]?.[elementId];
      });

    });
    return elementStyles;
  }

  private getSelectedElement(selectedElementId: PebElementId): Observable<PebElementKit> {
    const element = this.renderer.getElementComponent(selectedElementId);
    return element
      ? of({
        styles: null,
        element: element.definition,
        contextSchema: null,
      })
      : EMPTY;
  }

  private getElementToPasteBefore(parentElement: any, eventType: string): PebElementId {
    const pageSections = parentElement.parent.children;
    const selectedIndex = pageSections.findIndex((el) => {
      return el.definition.id === parentElement.definition.id;
    });
    const moveBeforeindex = eventType === 'moveUp' ? selectedIndex - 1 : selectedIndex + 2;
    if (moveBeforeindex < 0) {
      return pageSections[0].definition.id;
    }
    if (pageSections.length === moveBeforeindex) {
      return null; // will paste element as last section
    }

    return pageSections[moveBeforeindex].definition.id;
  }

}

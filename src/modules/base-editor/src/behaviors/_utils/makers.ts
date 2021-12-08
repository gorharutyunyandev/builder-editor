import { ComponentRef, Injector } from '@angular/core';
import { merge } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { PebAbstractElement } from '@pe/builder-renderer';

import { PebAbstractEditor } from '../../root/abstract-editor';
import { PebEditorElementAddSectionControl } from '../../controls/element-add-section/element-add-section.control';
import { PebEditorElementAnchorsControl } from '../../controls/element-anchors/element-anchors.control';
import { PebEditorElementEdgesControl } from '../../controls/element-edges/element-edges.control';
import { PebAbstractMaker } from '../../makers/abstract-maker';
import { Axis, PebEditorElement } from '../../renderer/editor-element';
import { PebEditorRenderer } from '../../renderer/editor-renderer';
import { fromResizeObserver } from './from-resize-observer';
import { PebEditorElementText } from '../../renderer/elements/editor-element-text';

export function replaceElementWithMaker(
  element: PebEditorElement,
  editor: PebAbstractEditor,
  renderer: PebEditorRenderer,
  makers: any,
  sidebar: any,
  scale: number,
): PebEditorElementText {

  if (!element?.textContent) {
    console.error(`
      There is no textContent getter in element
        id: ${element.definition.id}
        type: ${element.definition.type}
    `);
    return null;
  }

  const initialRect = element.textContent.getBoundingClientRect();

  const makerComponent = makers[element.definition.type];
  // TODO: FIX

  const cmpFactory = editor.cfr.resolveComponentFactory<PebAbstractElement>(makerComponent);
  const cmpInjector = Injector.create({
    // TODO: FIX

    parent: editor.injector,
    providers: [
      { provide: PebEditorRenderer, useValue: renderer },
    ],
  });

  const makerCmpRef = cmpFactory.create(cmpInjector) as ComponentRef<PebAbstractMaker | any>;

  makerCmpRef.instance.element = element.definition;
  // makerCmpRef.instance.sidebarRef = sidebar;
  makerCmpRef.instance.initialRect = initialRect;

  const horizontalPossibleDimensions = element.getMaxPossibleDimensions(Axis.Horizontal);
  const verticalPossibleDimensions = element.getMaxPossibleDimensions(Axis.Vertical);

  makerCmpRef.instance.limits = {
    width: (horizontalPossibleDimensions.size - horizontalPossibleDimensions.spaceStart) * scale,
    height: (verticalPossibleDimensions.size - verticalPossibleDimensions.spaceStart) * scale,
  };

  if (renderer.maker) {
    renderer.cleanMaker();
  }

  renderer.setMaker(makerCmpRef);

  const editorTextMakerElement = renderer.getElementComponent(makerCmpRef.instance.element.id);

  const addSectionControl = PebEditorElementAddSectionControl.construct(editor, editorTextMakerElement);

  const anchorsControl = PebEditorElementAnchorsControl.construct(editor, editorTextMakerElement);

  const edgesControl = PebEditorElementEdgesControl.construct(editor, editorTextMakerElement);

  // TODO: Change to observable
  merge(
    makerCmpRef.instance.changes,
    fromResizeObserver(editorTextMakerElement.nativeElement),
  ).pipe(
    tap(() => {
      addSectionControl.instance.detectChanges();
      anchorsControl.instance.detectChanges();
      edgesControl.instance.detectChanges();
    }),
    takeUntil((makerCmpRef as ComponentRef<PebAbstractMaker | PebAbstractElement>).instance.destroy$),
  ).subscribe();

  const nextMakerElement = renderer.getElementComponent(element.definition.id) as PebEditorElementText;

  makerCmpRef.instance.getLimits = () => {
    const horPossibleDimensions = nextMakerElement.getMaxPossibleDimensions(Axis.Horizontal);
    const verPossibleDimensions = nextMakerElement.getMaxPossibleDimensions(Axis.Vertical);

    return {
      width: (horPossibleDimensions.size - horPossibleDimensions.spaceStart) * scale,
      height: (verPossibleDimensions.size - verPossibleDimensions.spaceStart) * scale,
    };
  };


  return nextMakerElement;
}

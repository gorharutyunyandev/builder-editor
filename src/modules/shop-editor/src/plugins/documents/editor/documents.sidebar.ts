import { Component, Inject, Input, OnInit } from '@angular/core';
import { capitalize } from 'lodash';
import { Observable } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { PebElementDef, PebElementType, PebStylesheet } from '@pe/builder-core';
import {
  AbstractComponent,
  PebAbstractEditor,
  PebEditorRenderer,
  PebEditorState,
  PEB_EDITOR_STATE,
} from '@pe/builder-editor';

const nameOverrides = {
  'shop-cart': 'Cart',
  'shop-products': 'Product',
  'shop-product-details': 'Product Details',
};

@Component({
  selector: 'peb-shop-editor-documents-sidebar',
  templateUrl: 'documents.sidebar.html',
  styleUrls: [
    './documents.sidebar.scss',
    '../../../../../base-plugins/sidebars.scss',
  ],
})
export class PebEditorDocumentsSidebarComponent extends AbstractComponent implements OnInit {

  @Input() element: PebElementDef;
  @Input() stylesheet: PebStylesheet;
  @Input() editor: PebAbstractEditor;
  @Input() renderer: PebEditorRenderer;

  openedElements = {};

  constructor(
    @Inject(PEB_EDITOR_STATE) private state: PebEditorState,
  ) {
    super();
  }

  ngOnInit() {
    this.activeElement$.pipe(
      tap((id: string) => {
        this.openedElements = {};

        let parent = this.renderer.getElementComponent(id)?.parent;
        while (parent && parent?.definition?.type !== PebElementType.Document) {
          this.openedElements[parent.definition.id] = true;
          parent = this.renderer.getElementComponent(parent.definition.id)?.parent;
        }

        this.onOpenElement(id);
      }),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  get activeElement$(): Observable<string> {
    return this.state.selectedElements$.pipe(
      map(elements => elements[0]),
    );
  }

  onOpenElement(id: string) {
    this.openedElements[id] = !this.openedElements[id];
  }

  onSelectElement(element: PebElementDef) {
    const nextElement = this.renderer.getElementComponent(element.id);

    if (!nextElement) {
      return;
    }

    this.onOpenElement(element.id);
    this.state.selectedElements = [element.id];

    if (!this.isVisibleElement(nextElement?.nativeElement)) {
      nextElement?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getElementName(element: PebElementDef) {
    return nameOverrides[element.type] || capitalize(element.type);
  }

  checkElementIsVisible(element: PebElementDef): boolean {
    const styles = this.stylesheet[element.id];

    if (!styles) {
      return;
    }

    return styles?.display !== 'none';
  }

  toggleVisible(event: MouseEvent, element: PebElementDef) {
    event.stopPropagation();

    this.editor.commands$.next({
      type: 'changeElementVisible',
      params: {
        element,
        visible: !this.checkElementIsVisible(element),
      },
    });
  }

  private isVisibleElement(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;

    return (elemTop >= 0) && (elemBottom <= window.innerHeight);
  }
}

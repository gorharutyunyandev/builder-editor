import { Observable } from 'rxjs';
import { round as _round } from 'lodash';

import { ELEMENT_ID_ATTRIBUTE, PebAbstractElement, PebRenderer, PebRendererOptions, RenderMaker } from '@pe/builder-renderer';
import { PebElementDef, PebElementId, PebElementType, PEB_DESKTOP_CONTENT_WIDTH } from '@pe/builder-core';

import { PebEditorElementText } from './elements/editor-element-text';
import { PebEditorElement } from './editor-element';
import { PebDOMRect } from '../editor.typings';
import { PebEditorElementMenu } from './elements/editor-element-menu';
import { PebEditorElementVideo } from './elements/editor-element-video';
import { PebEditorElementLogo } from './elements/editor-element-logo';
import { PebEditorElementSection } from './elements/editor-element-section';
import { PebEditorElementCart } from './elements/editor-element-cart';

const round = (x: number) => _round(x, 2);

export const elementCache = new WeakMap<PebAbstractElement, PebEditorElement>();

/**
 * This class is a wrapper on _renderer that serves two purposes:
 *  expand _renderer's elements with methods that are needed only in editor
 *  deny direct access to properties and methods of _renderer that shouldn't be accessible
 */
export class PebEditorRenderer {

  readonly elementCache = elementCache;

  constructor(
    private renderer: PebRenderer,
  ) { }

  get options(): PebRendererOptions {
    return this.renderer.options;
  }

  get shadowRoot(): ShadowRoot {
    return this.renderer.shadowRoot;
  }

  get rendered(): Observable<void> {
    return this.renderer.rendered;
  }

  get nativeElement(): HTMLElement {
    return this.renderer.nativeElement;
  }

  renderDocument() {
    this.renderer.renderDocument();
  }

  get maker(): RenderMaker {
    return this.renderer.maker;
  }

  setRenderer(renderer: PebRenderer) {
    this.renderer = renderer;
  }

  setMaker(maker: RenderMaker): void {
    return this.renderer.setMaker(maker);
  }

  cleanMaker(): void {
    return this.renderer.cleanMaker();
  }

  get element(): PebElementDef {
    return this.renderer.element;
  }

  createEditorElement(target: PebAbstractElement) {
    if (this.elementCache.get(target)) {
      return this.elementCache.get(target);
    }

    let element: PebEditorElement;
    switch (target.element.type) {
      case PebElementType.Cart:
        element = new PebEditorElementCart(this, target);
        break;
      case PebElementType.Logo:
        element = new PebEditorElementLogo(this, target);
        break;
      case PebElementType.Menu:
        element = new PebEditorElementMenu(this, target);
        break;
      case PebElementType.Section:
        element = new PebEditorElementSection(this, target);
        break;
      case PebElementType.Video:
        element = new PebEditorElementVideo(this, target);
        break;
      case PebElementType.Text:
        element = new PebEditorElementText(this, target);
        break;
      default:
        element = new PebEditorElement(this, target);
    }

    this.elementCache.set(target, element);

    return element;
  }

  getElementComponent = (elementId: PebElementId) => {
    const element: PebAbstractElement = this.renderer.registry.get(elementId);

    if (!element) {
      return null;
    }

    return this.createEditorElement(element);
  }

  getElementComponentAtEventPoint = (evt: MouseEvent): PebEditorElement => {
    const elementNodesUnderClick = this.getElementNodesAtEventPoint(evt);
    const topNode = elementNodesUnderClick[0];

    if (!topNode) { return null; }

    const elementId = topNode.attributes[ELEMENT_ID_ATTRIBUTE].value;

    return this.getElementComponent(elementId);
  }

  getBehindElementComponentAtEventPoint = (evt: MouseEvent): PebEditorElement => {
    const elementNodesUnderClick = this.getElementNodesAtEventPoint(evt);
    const topNode = elementNodesUnderClick[1];

    if (!topNode) { return null; }

    const elementId = topNode.attributes[ELEMENT_ID_ATTRIBUTE].value;

    return this.getElementComponent(elementId);
  }

  getResizeAnchorTypeAndElementIdAtEventPoint = (evt: MouseEvent): Element => {
    const elementNodesUnderClick = this.getResizeAnchorsAtEventPoint(evt);
    const resizeAnchorNode = elementNodesUnderClick[0];

    if (!resizeAnchorNode) { return null; }
    return resizeAnchorNode;
  }

  queryElementAll(predicate: (el: PebAbstractElement) => boolean): PebEditorElement[] {
    return this.renderer.registry
      .queryAll(predicate)
      .filter(Boolean)
      .map(element => this.createEditorElement(element));
  }

  getAbsoluteElementRect(elementCmp: PebEditorElement) {
    const scale = this.renderer.options.scale;
    const rendererRect = this.nativeElement.getBoundingClientRect();
    const elementRect = elementCmp.nativeElement.getBoundingClientRect();

    const horizontalMargin = (rendererRect.width / scale - PEB_DESKTOP_CONTENT_WIDTH) / 2;

    return {
      left: round((elementRect.left - rendererRect.left) / scale - horizontalMargin),
      top: round((elementRect.top - rendererRect.top) / scale),
      width: round(elementRect.width / scale),
      height: round(elementRect.height / scale),
      right: round((elementRect.left - rendererRect.left + elementRect.width) / scale - horizontalMargin),
      bottom: round((elementRect.top - rendererRect.top + elementRect.height) / scale),
    } as PebDOMRect;
  }

  elementIntersect(a: PebEditorElement, b: PebEditorElement): boolean {
    const aRect = a.nativeElement.getBoundingClientRect();
    const bRect = b.nativeElement.getBoundingClientRect();

    return bRect.bottom > aRect.top
      && bRect.right > aRect.left
      && bRect.top < aRect.bottom
      && bRect.left < aRect.right;
  }

  elementInclude(a: PebEditorElement, b: PebEditorElement): boolean {
    const aRect = a.nativeElement.getBoundingClientRect();
    const bRect = b.nativeElement.getBoundingClientRect();

    return aRect.top >= bRect.top
      && aRect.bottom <= bRect.bottom
      && aRect.left >= bRect.left
      && aRect.right <= bRect.right;
  }

  elementInsideContentContainer(target: PebEditorElement, parent: PebEditorElement): boolean {
    if (!parent.contentContainer && !parent.potentialContainer) {
      console.warn(`There is no contentContainer in element with id: ${parent.definition.id}`);
      return false;
    }

    const targetRect = target.nativeElement.getBoundingClientRect();
    const parentRect = (parent.contentContainer || parent.potentialContainer).getBoundingClientRect();

    return targetRect.top >= parentRect.top
      && targetRect.bottom <= parentRect.bottom
      && targetRect.left >= parentRect.left
      && targetRect.right <= parentRect.right;
  }

  elementMatchesInsideContentContainer(target: PebEditorElement, parent: PebEditorElement): boolean {
    if (!parent?.contentContainer && !parent?.potentialContainer) {
      console.warn(`There is no contentContainer in element with id: ${parent.definition.id}`);
      return false;
    }
    const maxElementContainerDifference = 10;
    const maxMarginOfError = 19;

    const targetRect = target.nativeElement.getBoundingClientRect();
    const parentRect = (parent.contentContainer || parent.potentialContainer).getBoundingClientRect();

    const containerWidthDifference = parentRect.width - targetRect.width;
    const marginDifference = Math.abs(parentRect.left - targetRect.left);

    return containerWidthDifference < maxElementContainerDifference
      && marginDifference < maxMarginOfError;
  }

  private buildGuideRails(producingElements: PebEditorElement[]) {
    const rects = producingElements.map(el => el.getAbsoluteElementRect());

    const horizontal = [
      ...rects.map(rect => rect.top),
      ...rects.map(rect => rect.bottom),
    ].sort((a, b) => a - b);

    const vertical = [
      ...rects.map(rect => rect.left),
      ...rects.map(rect => rect.right),
    ].sort((a, b) => a - b);

    return { horizontal, vertical };
  }

  private getElementNodesAtEventPoint(evt: MouseEvent): Element[] {
    return this.shadowRoot
      .elementsFromPoint(evt.pageX, evt.pageY)
      .filter((el: HTMLElement) => el.tagName.toLowerCase().startsWith('peb-element-'));
  }

  private getResizeAnchorsAtEventPoint(evt: MouseEvent): Element[] {
    return this.shadowRoot
      .elementsFromPoint(evt.pageX, evt.pageY)
      .filter(
        (el: HTMLElement) =>
          (el.tagName.toLowerCase() === 'circle' ||
            el.tagName.toLowerCase() === 'svg') &&
          el.classList.contains('anchor'),
      );
  }
}

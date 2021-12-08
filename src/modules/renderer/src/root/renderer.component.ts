import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { isEqual, omit, pick } from 'lodash';

import {
  PebContext,
  PebElementContext,
  PebElementDef,
  PebElementId,
  PebElementStyles,
  PebElementType,
  PebScreen,
  PebStylesheet,
  pebTraverseElementDeep,
} from '@pe/builder-core';

import { PebRendererChildrenSlot } from '../shared/slots/children.slot';
import { PebAbstractElement } from '../elements/_abstract/abstract.element';
import { RENDERER_GET_PARENT_FUNCTION, RENDERER_INTERACTION_EMITTER } from '../renderer.tokens';
import { PebRendererOptions } from '../renderer.types';
import { PebDocumentElement } from '../elements/general/document/document.element';
import { ElementFactories, ELEMENT_FACTORIES } from '../renderer.constants';

import { diff } from 'deep-object-diff';

export interface PebRendererElementDef {
  id: PebElementId;
  type: PebElementType;
  styles: PebElementStyles;
  parent: {
    id: PebElementId,
    slot: string|number, // number??
    // order: number,
  };
  data?: {
    [key: string]: any;
  };
  meta?: {
    deletable: boolean;
  };
  context?: PebElementContext<any>;
  childrenRefs?: {
    [slotName: string]: Array<{ id: PebElementId, type: PebElementType }>;
  };
  children?: PebRendererElementDef[];
}

export type ElementsRegistry = Map<PebElementId, PebRendererElementDef>;

export type ComponentsRegistry = Map<PebElementId, ComponentRef<PebAbstractElement>>;

export type RenderMaker = ComponentRef<PebAbstractElement>;

@Component({
  selector: 'peb-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})

// tslint:disable-next-line: component-class-suffix
export class PebRenderer implements OnChanges, AfterViewInit, OnDestroy {
  @Input() element: PebElementDef;

  @Input() stylesheet: PebStylesheet;

  @Input() context: PebContext;

  @Input() options: PebRendererOptions = {
    screen: PebScreen.Desktop,
    scale: 1,
    locale: 'en',
    interactions: false,
  };

  @Input('options.scale')
  set optionsScale(scale: number) {
    this.options = { ...this.options, scale };
  }

  @Input('options.screen')
  set optionsScreen(screen: PebScreen) {
    this.options = { ...this.options, screen };
  }

  @Input('options.locale')
  set optionsLocale(locale: string) {
    this.options = { ...this.options, locale };
  }

  @Input('options.interactions')
  set optionsInteractions(interactions: boolean) {
    this.options = { ...this.options, interactions };
  }

  @Output() rendered = new EventEmitter<any>();
  @Output() interacted = new EventEmitter<any>();

  @ViewChild(PebRendererChildrenSlot, { read: ViewContainerRef })
  contentSlot: ViewContainerRef;

  destroyed$ = new Subject<boolean>();

  private nextMakerSubject$ = new BehaviorSubject<RenderMaker>(null);
  private renderedMakerSubject$ = new BehaviorSubject<RenderMaker>(null);

  private elementsRegistry: ElementsRegistry = new Map();
  private componentsRegistry: ComponentsRegistry = new Map();

  private factories = {
    document: PebDocumentElement,
  };

  constructor(
    private elementRef: ElementRef,
    private injector: Injector,
    private cfr: ComponentFactoryResolver,
    public cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    // skip first paint since view is not initiated yet
    if (this.contentSlot) {
      this.prepareElementsAndRenderDocument();
    }
  }

  ngAfterViewInit() {
    this.prepareElementsAndRenderDocument();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  get registry() {
    return {
      get: (id: string) => this.componentsRegistry.get(id)?.instance,
      queryAll: (predicate: (el: PebAbstractElement) => boolean) => {
        return Array.from(this.componentsRegistry).map(v => v[1].instance).filter(predicate);
      },
    };
  }

  get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  get shadowRoot(): ShadowRoot {
    return this.nativeElement.shadowRoot;
  }

  prepareFactories = async (document: PebElementDef) => {
    const factoriesConfig: ElementFactories = this.injector.get(ELEMENT_FACTORIES);

    this.factories = {
      ...this.factories,
      ...factoriesConfig.preloaded,
    };

    const loaders = [];
    pebTraverseElementDeep(document, (el) => {
      if (factoriesConfig.lazy && factoriesConfig.lazy[el.type]) {
        loaders.push([el.type, factoriesConfig.lazy[el.type]]);
      }
      return el;
    });

    await Promise.all(loaders.map(([type, loader]) => loader().then((cmpFactory) => {
      this.factories[type] = cmpFactory;
    })));
  }

  get maker() {
    return this.renderedMakerSubject$.value;
  }

  setMaker(maker) {
    // TODO: Replace component with maker without rerender
    this.nextMakerSubject$.next(maker);
    this.renderDocument();
  }

  cleanMaker() {
    // TODO: Replace maker with component without rerender
    this.nextMakerSubject$.next(null);
    this.maker?.destroy();
    this.renderDocument();

    this.renderedMakerSubject$.value?.destroy();
    this.renderedMakerSubject$.next(null);
  }

  private renderElement = (
    elementDef: PebRendererElementDef,
  ): ComponentRef<PebAbstractElement> => {
    const elementComponent = this.factories[elementDef.type];

    if (!elementComponent) {
      throw new Error(`
        "${elementDef.type}" element component was not found,
        make sure you add it to ELEMENT_FACTORIES in renderer.module.ts
      `);
    }

    const elViewFactory = this.cfr.resolveComponentFactory<PebAbstractElement>(elementComponent);
    const elViewInjector = this.createElementInjector();
    const elViewRef = elViewFactory.create(elViewInjector);

    Object.assign(elViewRef.instance, {
      element: this.elementNodeToElement(elementDef),
      styles: elementDef.styles || {},
      context: elementDef.context || null,
      options: this.options,
    });
    elViewRef.changeDetectorRef.detectChanges();

    return elViewRef;
  }

  prepareElementsAndRenderDocument = async () => {
    await this.prepareFactories(this.element);
    this.renderDocument();
  }

  renderDocument = () => {
    const newTree = this.createDocumentTree(this.element);
    const newElementsRegistry = this.createDocumentRegistry(newTree);
    const newComponentsRegistry: ComponentsRegistry = new Map();

    const changes = new Map<PebElementId, {
      previous: PebRendererElementDef,
      current: PebRendererElementDef,
      diff: Partial<PebRendererElementDef>,
    }>();

    Object.entries({
      previous: this.elementsRegistry,
      current: newElementsRegistry,
    }).forEach(([type, registry]) =>
      [...registry.entries()].forEach(([elId, elDef]) =>
        changes.set(elId, {
          previous: changes.get(elId)?.previous || null,
          current: changes.get(elId)?.current || null,
          [type]: elDef || null,
          diff: null,
        }),
      ),
    );

    [...changes.entries()].forEach(([elId, entry]) => {
      entry.diff = diff(
        omit(entry.previous || {}, ['children']),
        omit(entry.current || {}, ['children']),
      );
    });

    // Probably for repaints required by settings changes we could add another method
    // At least scale and locale doesn't affect components tree.
    const settingsChanged = !isEqual(this.componentsRegistry.get(this.element.id)?.instance.options, this.options);

    //
    //  Update components registry (create missing elements, destroy removed)
    //
    [...changes.entries()].forEach(([elId, elChanges]) => {
      // If text selected: change component to text-maker
      if (this.nextMakerSubject$.value?.instance.element.id === elId) {
        const elDef = newElementsRegistry.get(elId);
        const elCmpRef: ComponentRef<PebAbstractElement> = this.nextMakerSubject$.value;

        // TODO: check
        // this happens when text maker is open and we try to change screen.
        if (!elCmpRef || !elDef) {
          return;
        }

        elCmpRef.instance.styles = elDef.styles || {};
        elCmpRef.instance.context = elDef.context || null;
        elCmpRef.instance.options = this.options;
        elCmpRef.instance.element = elDef;
        elCmpRef.changeDetectorRef.detectChanges();
        elCmpRef.instance.applyStyles();
        newComponentsRegistry.set(elId, elCmpRef);

        this.renderedMakerSubject$.next(this.nextMakerSubject$.value);

        return;
      }

      if ((!elChanges.previous && elChanges.current)                // element wasn't present before
        || elChanges.diff.type                                      // type of the element has been changed
        // instead of element maker should be placed
        || (this.renderedMakerSubject$.value?.instance.element.id === elId && !this.nextMakerSubject$.value)
      ) {

        if (!elChanges?.current) {
          return;
        }

        const elDef = newElementsRegistry.get(elId);
        const elCmp = this.renderElement(elChanges.current);

        // WTF: why styles are not defined in "renderElement"?

        elCmp.instance.styles = elDef.styles || {};
        elCmp.instance.context = elDef.context || null;
        elCmp.instance.options = this.options;

        elCmp.changeDetectorRef.detectChanges();
        elCmp.instance.applyStyles();

        newComponentsRegistry.set(elId, elCmp);

        return;
      }

      if (elChanges.previous && !elChanges.current) {
        this.componentsRegistry.get(elId).destroy();
      }

      if (elChanges.previous && elChanges.current && !Object.keys(elChanges.diff).length && !settingsChanged) {
        newComponentsRegistry.set(elId, this.componentsRegistry.get(elId));
        return;
      }

      // element was before, but something in it has changed
      if (elChanges.previous && elChanges.current) {
        const elCmpRef: ComponentRef<PebAbstractElement> = this.componentsRegistry.get(elId);

        // apply changes
        elCmpRef.instance.styles = newElementsRegistry.get(elId).styles || {};
        elCmpRef.instance.context = newElementsRegistry.get(elId).context || null;
        elCmpRef.instance.options = this.options;
        elCmpRef.instance.element = newElementsRegistry.get(elId);

        if (elCmpRef.instance.cdr) {
          elCmpRef.instance.cdr.detectChanges();
        } else {
          elCmpRef.changeDetectorRef.detectChanges();
        }
        elCmpRef.instance.applyStyles();

        newComponentsRegistry.set(elId, elCmpRef);
        return;
      }
    });

    [...changes.entries()].forEach(([elId, elChanges]) => {
      const elDef = elChanges.current;
      const elCmpRef = newComponentsRegistry.get(elId);

      const childrenChanges = elChanges.diff?.childrenRefs;
      const childReplacedWithMaker = elChanges.current?.children?.find(
        el => el?.id === this.maker?.instance.element.id,
      );

      if (childrenChanges || childReplacedWithMaker) {
        const childrenRefs = elChanges.current?.childrenRefs;

        if (!Object.keys(childrenRefs).length) {
          // childrenRefs can be empty
          return;
        }

        Object.keys(childrenRefs).forEach((slotName: string) => {
          if (!elDef.childrenRefs[slotName]) {
            // slot is empty and doesn't need any childrens to be inserted
            return;
          }

          const slotDir = elCmpRef.instance.childSlots.find(
            childSlotDir => (childSlotDir.name || 'host') === slotName,
          );

          if (!slotDir) {
            // slotDir can be empty, need fix this
            return;
          }

          const slotView = slotDir?.viewRef;

          while (slotView.length) {
            slotView.detach(0);
          }

          elDef.childrenRefs[slotName].forEach((child) => {
            const childCmpRef = newComponentsRegistry.get(child.id);
            if (childCmpRef && !childCmpRef.hostView.destroyed) {
              slotDir.viewRef.insert(childCmpRef.hostView);
            }

            childCmpRef?.changeDetectorRef.detectChanges();
          });
        });
      }
    });

    const documentCmpRef = newComponentsRegistry.get(this.element.id);

    if (!(documentCmpRef.hostView as any)._viewContainerRef) {
      this.contentSlot.insert(documentCmpRef.hostView);
    }

    this.elementsRegistry = newElementsRegistry;
    this.componentsRegistry = newComponentsRegistry;

    this.rendered.emit(this.registry);
  }

  private getComponentParent = (component: PebAbstractElement): PebAbstractElement => {
    const elementDef = this.elementsRegistry.get(component.element.id);
    const parentId = elementDef.parent.id;

    return this.componentsRegistry.get(parentId).instance;
  }

  private createDocumentTree(
    element: PebElementDef,
    parent: PebRendererElementDef = null,
  ): PebRendererElementDef {
    // this.styleExistenceCheck_TMP(element);

    const elementStyles = (this.stylesheet[element.id] || {});

    if (!element.type) {
      return;
    }

    const elementComponent = this.factories[element.type] as any;

    if (!elementComponent) {
      throw new Error(`
        There is no element component for element
        id: ${element.id}
        type: ${element.type}
      `);
    }

    const elementContext = elementComponent.contextFetcher && elementComponent.contextFetcher(this.context)
      ? elementComponent.contextFetcher(this.context)
      : this.context[element.id];

    const childrenShown = element.children && element.children.filter(
      (child) => {
        const childStyles = this.stylesheet[child.id] || {};
        return childStyles.display !== 'none';
      },
    );

    const elementDef: PebRendererElementDef = {
      id: element.id,
      type: element.type,
      meta: element.meta,
      parent: parent ? {
        id: parent.id,
        slot: elementStyles.slot || 'host',
      } : null,
      styles: this.stylesheet[element.id],
      ...(element.data ? { data: element.data } : {}),
      ...(elementContext ? { context: elementContext } : {}),
    };

    if (childrenShown) {
      elementDef.childrenRefs = {};
      childrenShown.forEach((child) => {
        const childStyles = (this.stylesheet[child.id] || {});
        const childSlot = elementDef.childrenRefs[childStyles.slot || 'host'] || [];

        childSlot.push({ id: child.id, type: child.type });

        elementDef.childrenRefs[childStyles.slot || 'host'] = childSlot;
      });
      elementDef.children = childrenShown.map(
        child => this.createDocumentTree(child, elementDef),
      );
    }

    return elementDef;
  }

  private createDocumentRegistry(
    element: PebRendererElementDef,
    registry: ElementsRegistry = null,
  ): ElementsRegistry {
    const nextRegistry = registry || new Map();

    nextRegistry.set(element?.id, element);

    if (element?.children) {
      element.children.forEach(child => this.createDocumentRegistry(child, nextRegistry));
    }

    return nextRegistry;
  }

  private createElementInjector() {
    return Injector.create({
      providers: [
        {
          provide: RENDERER_GET_PARENT_FUNCTION,
          useValue: this.getComponentParent,
        },
        {
          provide: RENDERER_INTERACTION_EMITTER,
          useValue: this.interacted,
        },
      ],
      parent: this.injector,
    });
  }

  private elementNodeToElement(elementNode: PebRendererElementDef): PebRendererElementDef {
    return pick(elementNode, ['id', 'type', 'data', 'meta', 'children']) as PebRendererElementDef;
  }

  private styleExistenceCheck_TMP(element: PebElementDef) {
    if (!this.stylesheet[element.id]) {
      console.log(
        `Element "${element.type}:${element.id}" doesn't have stylesheet.
        If it's not intended to be hidden, then this soon would be an error`,
      );
    }
  }
}

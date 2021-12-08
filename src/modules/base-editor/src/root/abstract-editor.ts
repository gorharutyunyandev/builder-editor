import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Injector,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SafeStyle } from '@angular/platform-browser';

import { PebContext, PebElementDef, PebPageId, PebPageType, PebPageVariant, PebStylesheet, PebTemplate } from '@pe/builder-core';

import { ElementManipulation, PebEditorCommand, SectionManipulation } from '../index';


export interface PageSnapshot {
  id: PebPageId;
  name: string;
  variant: PebPageVariant;
  type: PebPageType;
  data: {
    url?: string;
    mark?: string;
    preview?: string;
  };
  template: PebTemplate;
  stylesheet: PebStylesheet;
  context: PebContext;
}

export interface PebContentPaddings {
  vertical: number;
  horizontal: number;
}

export enum PebEditorSlot {
  sidebar = 'sidebarSlot',
  contentContainer = 'contentContainer',
}

export abstract class PebAbstractEditor {

  commands$: Subject<PebEditorCommand>;

  abstract contentPadding: PebContentPaddings;

  abstract get contentPadding$(): Observable<SafeStyle>;

  contentContainer: ElementRef;

  /** @deprecated SHOULD BE PRIVATE */
  contentContainerSlot: ViewContainerRef;

  /** @deprecated SHOULD BE PRIVATE */
  sidebarSlot: ViewContainerRef;

  readonly cdr: ChangeDetectorRef;

  /** @deprecated */
  readonly cfr: ComponentFactoryResolver;

  /** @deprecated */
  readonly injector: Injector;

  readonly abstract activePageSnapshot$: Observable<PageSnapshot>;

  readonly manipulateElementSubject$: Subject<ElementManipulation>;
  readonly manipulateElement$: Observable<ElementManipulation>;

  readonly manipulateSectionSubject$: Subject<SectionManipulation>;
  readonly manipulateSection$: Observable<SectionManipulation>;

  abstract get nativeElement(): HTMLElement;

  abstract refreshContext(): void;

  abstract getNewElementParent(): PebElementDef;

  abstract insertToSlot<T>(component: Type<T>, slot: PebEditorSlot): ComponentRef<T>;

  /** @deprecated use insertToSlot with PebEditorSlot.sidebar argument */
  abstract openSidebar<T>(cmpClass: Type<T>): ComponentRef<T>;

  abstract initAdditionalLeftSidebar<T>(cmpClass: Type<T>): ComponentRef<T>;

  abstract createControl<T>(controlCmp: Type<T>): ComponentRef<T>;

  /** @deprecated should be implemented in the products plugin */
  abstract openProductsDialog(selectedProducts: string[]): Observable<string[]>;

  /** @deprecated should be implemented in the categories plugin */
  abstract openCategoriesDialog(categories, selectedCategories: string[]): Observable<string[]>;
}

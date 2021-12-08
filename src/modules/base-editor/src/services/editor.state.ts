import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, take } from 'rxjs/operators';
import { xor } from 'lodash';

import { PebElementId, PebElementType, PebPageType, PebScreen } from '@pe/builder-core';

const PEB_EDITOR_STATE_STORAGE_KEYS = {
  scale: 'PEB_EDITOR_STATE_SCALE',
  screen: 'PEB_EDITOR_STATE_SCREEN',
  sidebarsActivity: 'PEB_EDITOR_STATE_SIDEBARS_ACTIVITY',
};

export enum EditorSidebarTypes {
  Navigator = 'navigator',
  Inspector = 'inspector',
  Layers = 'layers',
}

export interface PebEditorStateElement {
  id: PebElementId;
  type: PebElementType;
}

export interface PebEditorStateType {
  scale: number;
  screen: PebScreen;
  locale: 'en' | 'de';
  hoveredElement: PebElementId;
  selectedElements: PebElementId[];
  sidebarType: PebElementType;
  pagesView: PebPageType;
  sidebarsActivity: {
    [EditorSidebarTypes.Navigator]: boolean,
    [EditorSidebarTypes.Inspector]: boolean,
    [EditorSidebarTypes.Layers]: boolean,
  };
}

const INITIAL_STATE: PebEditorStateType = {
  scale: getValueFromStorage('scale') || 1,
  screen: getValueFromStorage('screen') || PebScreen.Desktop,
  locale: 'en',
  hoveredElement: null,
  selectedElements: [],
  sidebarType: null,
  pagesView: PebPageType.Replica,
  sidebarsActivity: getValueFromStorage('sidebarsActivity') || {
    [EditorSidebarTypes.Navigator]: true,
    [EditorSidebarTypes.Inspector]: true,
    [EditorSidebarTypes.Layers]: false,
  },
};

function saveValueToStorage<T>(key: string, value: T): void {
  if (!PEB_EDITOR_STATE_STORAGE_KEYS[key]) {
    throw new Error(`There is no key: ${key} in PEB_EDITOR_STATE_STORAGE_KEYS`);
  }

  localStorage.setItem(PEB_EDITOR_STATE_STORAGE_KEYS[key], JSON.stringify(value));
}

function getValueFromStorage<T>(key: string): T {
  if (!PEB_EDITOR_STATE_STORAGE_KEYS[key]) {
    throw new Error(`There is no key: ${key} in PEB_EDITOR_STATE_STORAGE_KEYS`);
  }

  return JSON.parse(localStorage.getItem(PEB_EDITOR_STATE_STORAGE_KEYS[key]));
}

@Injectable()
export class PebEditorState {

  /**
   * Scale
   */
  private readonly scaleSubject$ = new BehaviorSubject<number>(INITIAL_STATE.scale);
  readonly scale$ = this.scaleSubject$.asObservable();

  set scale(val: number) {
    saveValueToStorage('scale', val);
    this.scaleSubject$.next(val);
  }

  get scale() {
    return this.scaleSubject$.value;
  }

  /**
   * Screen
   */
  private readonly screenSubject$ = new BehaviorSubject<PebScreen>(INITIAL_STATE.screen);
  readonly screen$ = this.screenSubject$.asObservable();

  set screen(val: PebScreen) {
    saveValueToStorage('screen', val);
    this.screenSubject$.next(val);
  }

  get screen() {
    return this.screenSubject$.value;
  }

  get screenChanged$() {
    const prevScreen = this.screen;
    return this.screen$.pipe(
      filter(screen => screen !== prevScreen),
    );
  }

  /**
   * Hovered element
   */
  private readonly hoveredElementSubject$ = new BehaviorSubject<PebElementId>(INITIAL_STATE.hoveredElement);
  readonly hoveredElement$ = this.hoveredElementSubject$.asObservable();

  set hoveredElement(id: PebElementId) {
    this.hoveredElementSubject$.next(id);
  }

  get hoveredElement() {
    return this.hoveredElementSubject$.value;
  }

  /**
   * Sidebar type
   */
  private readonly sidebarTypeSubject$ = new BehaviorSubject<PebElementType>(INITIAL_STATE.sidebarType);
  readonly sidebarType$ = this.sidebarTypeSubject$.asObservable();

  set sidebarType(type: PebElementType) {
    this.sidebarTypeSubject$.next(type);
  }

  get sidebarType() {
    return this.sidebarTypeSubject$.value;
  }

  /**
   * Maker active
   */
  private readonly makerActiveSubject$ = new BehaviorSubject<boolean>(false);
  readonly makerActive$ = this.makerActiveSubject$.asObservable();

  set makerActive(val: boolean) {
    this.makerActiveSubject$.next(val);
  }

  get makerActive() {
    return this.makerActiveSubject$.value;
  }

  // snapshot$ = combineLatest(
  //   this.scale$,
  //   this.screen$,
  //   this.hoveredElement$,
  //   this.selectedElements$,
  // ).pipe(
  //   map(([ scale, screen, hoveredElement, selectedElements ]) => ({
  //     scale, screen, hoveredElement, selectedElements,
  //   })),
  // )

  /**
   * This is the place where behaviors/plugins could store some information that other plugins
   *    should be aware about.
   * Should be refactored properly when at least 5 keys would be defined here.
   */
  private readonly miscSubject$: BehaviorSubject<{ seoSidebarOpened?: boolean }> = new BehaviorSubject({});
  readonly misc$ = this.miscSubject$.asObservable();

  get misc() {
    return this.miscSubject$.value;
  }

  set misc(val: any) {
    this.miscSubject$.next({ ...this.misc, ...val });
  }

  /**
   * Pages view
   */
  private readonly pagesViewSubject$ = new BehaviorSubject<PebPageType>(INITIAL_STATE.pagesView);
  readonly pagesView$ = this.pagesViewSubject$.asObservable();

  set pagesView(type: PebPageType) {
    this.pagesViewSubject$.next(type);
  }

  get pagesView() {
    return this.pagesViewSubject$.value;
  }

  /**
   * Sidebars activity
   */
  private readonly sidebarsActivitySubject$ =
    new BehaviorSubject<{ [key: string]: boolean }>(INITIAL_STATE.sidebarsActivity);
  readonly sidebarsActivity$ = this.sidebarsActivitySubject$.asObservable();

  set sidebarsActivity(type: { [key: string]: boolean }) {
    saveValueToStorage('sidebarsActivity', type);
    this.sidebarsActivitySubject$.next(type);
  }

  get sidebarsActivity() {
    return this.sidebarsActivitySubject$.value;
  }

  /**
   * Selected elements
   */
  private readonly selectedElementsSubject$ = new BehaviorSubject<PebElementId[]>(INITIAL_STATE.selectedElements);
  readonly selectedElements$ = this.selectedElementsSubject$.asObservable();
  readonly singleSelectedElement$ = this.selectedElementsSubject$.pipe(
    map(selIds => selIds.length === 1 ? selIds[0] : null),
    distinctUntilChanged(),
    shareReplay(1),
  );

  set selectedElements(ids: PebElementId[]) {
    this.selectedElementsSubject$.next(ids);
  }

  get selectedElements() {
    return this.selectedElementsSubject$.value;
  }

  selectionChanged$ = (prevSelectedIds?: PebElementId[]): Observable<boolean> => {
    const prevIds = prevSelectedIds || this.selectedElements;

    return this.selectedElements$.pipe(
      filter(selIds => Boolean(xor(selIds, prevIds).length)),
      map(() => true),
      take(1),
      shareReplay(1),
    );
  }

  reset(): void {
    this.scale = INITIAL_STATE.scale;
    this.screen = INITIAL_STATE.screen;
    this.hoveredElement = INITIAL_STATE.hoveredElement;
    this.sidebarType = INITIAL_STATE.sidebarType;
    this.makerActive = false;
    this.misc = {};
    this.pagesView = INITIAL_STATE.pagesView;
    this.sidebarsActivity = INITIAL_STATE.sidebarsActivity;
    this.selectedElements = INITIAL_STATE.selectedElements;
  }
}

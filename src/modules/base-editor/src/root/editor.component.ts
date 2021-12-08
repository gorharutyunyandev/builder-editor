import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Injector,
  Input, OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, fromEvent, merge, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  switchMap,
  switchMapTo,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { find, isFunction } from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';
import { SafeStyle } from '@angular/platform-browser';

import {
  pebCreateLogger,
  PebElementType,
  PebPage,
  PebPageShort,
  PebPageType,
  PebPageVariant,
  PebShopThemeSnapshot,
  PebTheme,
} from '@pe/builder-core';
import { PebProductsApi } from '@pe/builder-api';
import { PebRenderer } from '@pe/builder-renderer';
import { PebProductCategoriesComponent, PebProductsComponent } from '@pe/builder-products';
import { FontLoaderService } from '@pe/builder-font-loader';

import { PebEditorState } from '../services/editor.state';
import { PebEditorStore } from '../services/editor.store';
import { AbstractComponent } from '../misc/abstract.component';
import { PebAbstractEditor, PebContentPaddings, PebEditorSlot } from './abstract-editor';
import { sidebarsAnimations } from './editor.animations';
import { PebEditorUtilsService } from '../services/editor-utils.service';
import { isTextMaker } from '../makers/text/text-maker.guard';
import { PebEditorThemeService } from '../services/theme.service';
import { BackgroundActivityService } from '../services/background-activity.service';
import { ElementManipulation, PebEditorCommand, SectionManipulation } from '../editor.typings';
import { ContextBuilder } from '../services/context.service';
import {
  EDITOR_CONFIG_UI,
  PEB_EDITOR_EVENTS,
  PEB_EDITOR_PLUGINS,
  PEB_EDITOR_STATE,
} from '../editor.constants';
import { PebEditorAbstractNavigation } from './abstract-navigation';
import { PebEditorAbstractToolbar } from './abstract-toolbar';
import { PebEditorAccessorService } from '../services/editor-accessor.service';
import { PebEditorBehaviors, PebEditorRenderer } from '..';

const logCommands = pebCreateLogger('editor:commands');

@Component({
  selector: 'peb-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [
    PebEditorUtilsService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    sidebarsAnimations,
  ],
})
// tslint:disable-next-line: component-class-suffix
export class PebEditor extends AbstractComponent implements PebAbstractEditor, OnInit, AfterViewInit, OnDestroy {
  @Input()
  set data(value: { theme: PebTheme, snapshot: PebShopThemeSnapshot }) {
    if (value) {
      const pageId = value.snapshot.pages[this.queryParams.pageId] ? this.queryParams.pageId : null;
      this.store.openTheme(value.theme, value.snapshot, pageId);
    }
  }

  @Output() changeLastSavingTime = new EventEmitter<string>();
  @Output() changeSavingStatus = new EventEmitter<string>();

  @ViewChild(PebRenderer)
  set renderer(val: PebRenderer) {
    this.editorAccessorService.rendererSubject$.next(val);
  }

  get renderer() {
    return this.editorAccessorService.rendererSubject$.value;
  }

  @ViewChild('contentContainer')
  contentContainer: ElementRef;

  @ViewChild('contentContainerSlot', { read: ViewContainerRef })
  contentContainerSlot: ViewContainerRef;

  @ViewChild('toolbarSlot', { read: ViewContainerRef, static: true })
  public toolbarSlot: ViewContainerRef;

  @ViewChild('leftSidebarSlot', { read: ViewContainerRef, static: true })
  public leftSidebarSlot: ViewContainerRef;

  @ViewChild('additionalLeftSidebarSlot', { read: ViewContainerRef, static: true })
  public additionalLeftSidebarSlot: ViewContainerRef;

  @ViewChild('rightSidebarSlot', { read: ViewContainerRef, static: true })
  public rightSidebarSlot: ViewContainerRef;

  /** deprecated */
  get sidebarSlot() { return this.rightSidebarSlot; }

  readonly commands$ = new Subject<PebEditorCommand>();
  readonly renderer$ = this.editorAccessorService.rendererSubject$.pipe(distinctUntilChanged());

  readonly manipulateElementSubject$: Subject<ElementManipulation> = new Subject();
  readonly manipulateElement$ = this.manipulateElementSubject$.asObservable();

  readonly manipulateSectionSubject$: Subject<SectionManipulation> = new Subject();
  readonly manipulateSection$ = this.manipulateSectionSubject$.asObservable();

  // TODO: replace with subject that can have null value
  readonly pages$: Observable<PebPageShort[]> = this.store.snapshot$.pipe(filter(Boolean)).pipe(
    map(snapshot => Object.values((snapshot as any).pages)),
  );

  readonly activePageSnapshotSubject$ = new BehaviorSubject(null);

  readonly activePageSnapshot$ = this.activePageSnapshotSubject$.asObservable();

  get activePageSnapshot() {
    return this.activePageSnapshotSubject$.value;
  }

  get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  PebElementType = PebElementType;

  set contentPadding(padding: PebContentPaddings) {
    this.contentPaddingSubject$.next(padding);
  }

  get contentPadding(): PebContentPaddings {
    return this.contentPaddingSubject$.value;
  }

  get contentPadding$(): Observable<SafeStyle> {
    return this.contentPaddingSubject$.pipe(
      map(padding =>
        padding.vertical && padding.horizontal ? `${padding.vertical}px ${padding.horizontal}px` : '10px auto'));
  }

  private readonly refreshContextSubject$ = new BehaviorSubject<null>(null);
  private readonly contentPaddingSubject$ = new BehaviorSubject<PebContentPaddings>({
    vertical: 0,
    horizontal: 0,
  });

  constructor(
    private store: PebEditorStore,
    @Inject(PEB_EDITOR_STATE) public state: PebEditorState,
    private contextManager: ContextBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private editorUtilsService: PebEditorUtilsService,
    public injector: Injector,                // TODO: Should be private
    public cdr: ChangeDetectorRef,
    public cfr: ComponentFactoryResolver,     // TODO: Should be private
    private dialog: MatDialog,
    private productsApi: PebProductsApi,
    private elementRef: ElementRef,
    private fontLoaderService: FontLoaderService,
    private backgroundActivityService: BackgroundActivityService,
    private themeService: PebEditorThemeService,
    @Inject(PLATFORM_ID) private platformId: any,
    private editorAccessorService: PebEditorAccessorService,
  ) {
    super();

    this.editorAccessorService.editorComponent = this;
    this.state.reset();

    this.fontLoaderService.renderFontLoader();
    this.editorUtilsService.constructPageSnapshot(
      this.store.snapshot$,
      this.store.activePageId$,
      this.state.screen$,
      this.refreshContextSubject$,
    ).pipe(
      tap(this.activePageSnapshotSubject$),
      takeUntil(this.destroyed$),
    ).subscribe();

    this.store.snapshot$.pipe(
      switchMapTo(this.editorAccessorService.rendererSubject$),
      filter(renderer => !!renderer),
      switchMap(renderer => renderer.rendered),
      withLatestFrom(this.editorAccessorService.rendererSubject$, this.state.selectedElements$),
      takeUntil(this.destroyed$),
    )
    .subscribe(([, renderer, selectedElements]) => {
      const elementsFound = selectedElements.filter(id => renderer.registry.get(id));
      if (elementsFound.length < selectedElements.length) {
        this.state.selectedElements = elementsFound;
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      fromEvent(window, 'beforeunload').pipe(
        withLatestFrom(this.backgroundActivityService.hasActiveTasks$),
        tap(([event, hasTasks]) => {
          if (hasTasks) {
            event.returnValue = true;
          }
        }),
        takeUntil(this.destroyed$),
      ).subscribe();
    }

    (window as any).pebEditor = this;
  }

  get queryParams() {
    return (this.activeRoute.queryParams as any).value;
  }

  ngOnInit() {
    merge(
      this.trackActivePageIdInQuery(),
      this.initCommandsInvoker(),
      this.trackActivePageType(),
    ).pipe(
      takeUntil(this.destroyed$),
    ).subscribe();

    this.themeService.getLastThemeUpdate().pipe(
      takeUntil(this.destroyed$),
    ).subscribe((value) => {
      this.changeLastSavingTime.emit(value);
    });

    this.themeService.getSavingStatus().pipe(
      takeUntil(this.destroyed$),
    ).subscribe((value) => {
      this.changeSavingStatus.emit(value);
    });
  }

  ngAfterViewInit() {
    this.initUI();
    this.renderer$.pipe(
      filter(Boolean),
      tap((renderer: PebRenderer) => {
        this.initRenderer(renderer);
        this.initPlugins();
      }),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.contextManager.clearCache();
  }

  initRenderer(renderer: PebRenderer): void {
    const behaviors = this.injector.get(PebEditorBehaviors);
    const eventsInit = behaviors.initEvents(this.editorAccessorService.editorComponent, renderer);
    const events = this.injector.get(PEB_EDITOR_EVENTS);
    events.contentContainer = eventsInit.contentContainer;
    events.controls = eventsInit.controls;
    events.renderer = eventsInit.renderer;
    events.window = eventsInit.window;
    const editorRenderer = this.injector.get(PebEditorRenderer);
    editorRenderer.setRenderer(renderer);
  }

  initUI() {
    const uiConfig = this.injector.get(EDITOR_CONFIG_UI);

    if (!uiConfig) {
      return;
    }

    const toolbarCmp = uiConfig.toolbar;
    if (toolbarCmp) {
      const toolbarFac = this.cfr.resolveComponentFactory(uiConfig.toolbar);
      const toolbarCmpRef = toolbarFac.create(this.injector) as ComponentRef<PebEditorAbstractToolbar>;

      merge(
        toolbarCmpRef.instance.execCommand.pipe(
          tap(command => this.commands$.next(command)),
        ),
        this.activePageSnapshot$.pipe(
          tap(snapshot => toolbarCmpRef.instance.loading = !snapshot),
        ),
      ).pipe(
        takeUntil(this.destroyed$),
      ).subscribe();
      this.toolbarSlot.insert(toolbarCmpRef.hostView);
    }

    const navigationCmp = uiConfig.navigation;
    if (navigationCmp) {
      const navigationFac = this.cfr.resolveComponentFactory(uiConfig.navigation);
      const navigationCmpRef = navigationFac.create(this.injector) as ComponentRef<PebEditorAbstractNavigation>;
      const navigationInstance = navigationCmpRef.instance;

      merge(
        combineLatest([
          this.pages$,
          this.state.pagesView$,
        ]).pipe(
          tap(([pages, pagesView]) => {
            navigationInstance.pages = pages.filter(page => page.type === pagesView);
            navigationInstance.cdr.detectChanges();
          }),
        ),
        this.activePageSnapshot$.pipe(
          tap((activePageSnapshot) => {
            navigationInstance.activePageSnapshot = activePageSnapshot;
            navigationCmpRef.instance.loading = !activePageSnapshot;
            navigationInstance.cdr.detectChanges();
          }),
        ),
        navigationInstance.execCommand.pipe(
          tap(type => this.commands$.next(type)),
        ),
      ).pipe(
        takeUntil(this.destroyed$),
      ).subscribe();

      this.leftSidebarSlot.insert(navigationCmpRef.hostView);
    }
  }

  initCommandsInvoker = () => {
    const onCommand$ = (commandName: string) => this.commands$.pipe(
      filter(command => command.type === commandName),
    );

    return merge(
      // logger
      this.commands$.pipe(
        tap(command => logCommands(...[command.type, command.params].filter(Boolean))),
      ),

      // handlers
      onCommand$('undo').pipe(
        tap(() => this.store.undoAction()),
      ),
      onCommand$('redo').pipe(
        tap(() => this.store.redoAction()),
      ),
      onCommand$('activatePage').pipe(
        tap((command) => {
          this.onActivatePage(command.params);
        }),
      ),
      onCommand$('createPage').pipe(
        tap((command) => {
          this.onCreatePage(command.params);
        }),
      ),
      onCommand$('duplicatePage').pipe(
        tap((command) => {
          this.onDuplicatePage(command.params);
        }),
      ),
      onCommand$('deletePage').pipe(
        tap((command) => {
          this.onDeletePage(command.params);
        }),
      ),
      onCommand$('changeElementVisible').pipe(
        tap((command) => {
          this.onChangeElementVisible(command.params);
        }),
      ),
    ).pipe(
      catchError((err) => {
        console.log('Command handler error: ', err);
        return of(null);
      }),
      finalize(() => {
        console.log('command invoker completed');
      }),
    );
  }

  refreshContext() {
    this.refreshContextSubject$.next(null);
  }

  trackActivePageIdInQuery() {
    return combineLatest([
      this.store.snapshot$,
      this.store.activePageId$,
    ]).pipe(
      filter(([snapshot, activePageId]) => !!snapshot && !!activePageId),
      tap(([snapshot, activePageId]) => {
        const activatePage = find(snapshot.pages, page => page.variant === PebPageVariant.Front);
        const pageId = activatePage && activatePage.id !== activePageId ? activePageId : null;

        this.router.navigate(['./'], {
          relativeTo: this.activeRoute,
          queryParamsHandling: 'merge',
          queryParams: { pageId },
        }).then();
      }),
    );
  }

  initPlugins() {
    const pluginInstances = this.injector.get(PEB_EDITOR_PLUGINS).map(
      pluginCtor => this.injector.get(pluginCtor),
    );

    const global = pluginInstances
      .filter(pluginInst => isFunction(pluginInst.afterGlobalInit));

    const pluginsGlobalInit$ = merge(
      ...global.map(pluginInst => pluginInst.afterGlobalInit()),
    );

    // TODO: fix plugins AfterPageInit
    const pluginsPageInit$ = combineLatest([
      this.renderer$.pipe(filter(r => Boolean(r))),
      this.store.activePageId$.pipe(distinctUntilChanged()),
    ]).pipe(
      switchMapTo(merge(
        ...pluginInstances
          .filter(pluginInst => isFunction(pluginInst.afterPageInit))
          .map(pluginInst => pluginInst.afterPageInit()),
      )),
      takeUntil(
        combineLatest([
          this.store.snapshot$,
          this.store.activePageId$,
        ]).pipe(
          filter(([snapshot, activePageId]) =>
            !snapshot || !activePageId,
          ),
        ),
      ),
    );

    merge(
      pluginsGlobalInit$,
      pluginsPageInit$,
    ).pipe(
      finalize(() => console.log('finalizer')),
      takeUntil(this.destroyed$.pipe(tap(() => console.log('destroy2')))),
    ).subscribe();
  }

  trackActivePageType() {
    return combineLatest([
      this.state.pagesView$.pipe(distinctUntilChanged()),
      this.store.snapshot$.pipe(filter(v => Boolean(v))),
      this.store.activePageId$.pipe(filter(v => Boolean(v))),
    ]).pipe(
      filter(([activePageType, snapshot, activePageId]) =>
        snapshot.pages[activePageId] && snapshot.pages[activePageId].type !== activePageType,
      ),
      tap(() => {
        this.state.hoveredElement = null;
        this.state.selectedElements = [];
      }),
      switchMap(([activePageType]) => {
        return this.store.activateLastPageByView(activePageType);
      }),
    );
  }

  onActivatePage(page: PebPage | PebPageShort) {
    this.state.hoveredElement = null;
    this.state.selectedElements = [];
    this.store.activatePage(page.id).subscribe();
  }

  onCreatePage(input: { type, masterId }) {
    this.state.hoveredElement = null;
    this.state.selectedElements = [];
    this.sidebarSlot.clear();

    const masterPage = this.store.snapshot.pages[input.masterId];
    const name = this.generatePageNameNumber(
      input.type === PebPageType.Master
        ? 'Master Page'
        : masterPage?.name
          ? `Fork ${masterPage.name}`
          : 'Page',
      Object.values(this.store.snapshot.pages).filter(p => p.type === input.type),
    );

    this.store.createPage({
      name,
      variant: PebPageVariant.Default,
      type: input.type,
      masterId: input.masterId,
    }).subscribe();
  }

  onDuplicatePage(page: PebPageShort) {
    const name = `${page.name} (Duplicate)`;
    this.store.duplicatePage({
      name,
      pageId: page.id,
      pageVariant: page.variant,
    }).subscribe();
  }

  onDeletePage(page: any) {
    this.state.hoveredElement = null;
    this.state.selectedElements = [];
    this.sidebarSlot.clear();
    this.store.deletePage(page, this.state.pagesView).subscribe();
    const firstPageId = Object.keys(this.store.snapshot.pages)[0];
    this.onActivatePage(this.store.snapshot.pages[firstPageId]);
  }

  getNewElementParent() {
    const selIds = this.state.selectedElements;

    // if no element has been selected we append to first section
    if (!selIds.length) {
      return this.activePageSnapshot.template.children[0];
    }

    if (selIds.length > 1) {
      alert('You should have only one selected element to insert new element');
      return null;
    }

    // TODO: Do it without traversing through renderer.elements
    let parentCmp = this.renderer.registry.get(selIds[0]);
    while ((parentCmp.potentialContainer === parentCmp.nativeElement || !parentCmp.potentialContainer)
      && !parentCmp.isParent
      ) {
      parentCmp = parentCmp.parent;
    }

    return parentCmp.element;
  }

  openSidebar<T>(cmpClass: Type<T>): ComponentRef<T> {
    // TODO: Find a way to destroy from behaviour
    const prevSidebar = this.sidebarSlot.get(0);
    if (prevSidebar && !prevSidebar.destroyed) {
      prevSidebar.destroy();
    }

    this.sidebarSlot.clear();
    const sidebarFactory = this.cfr.resolveComponentFactory(cmpClass);
    const sidebarRef = sidebarFactory.create(this.injector);
    this.sidebarSlot.insert(sidebarRef.hostView);

    return sidebarRef;
  }

  initAdditionalLeftSidebar<T>(cmpClass: Type<T>): ComponentRef<T> {
    // TODO: Find a way to destroy from behaviour
    const prevSidebar = this.additionalLeftSidebarSlot.get(0);
    if (prevSidebar && !prevSidebar.destroyed) {
      prevSidebar.destroy();
    }

    this.additionalLeftSidebarSlot.clear();
    const sidebarFactory = this.cfr.resolveComponentFactory(cmpClass);
    const sidebarRef = sidebarFactory.create(this.injector);
    this.additionalLeftSidebarSlot.insert(sidebarRef.hostView);

    return sidebarRef;
  }

  createControl<T>(controlClass: Type<T>): ComponentRef<T> {
    const injector = Injector.create({
      name: 'Controls injector',
      parent: this.injector,
      providers: [
        { provide: PebAbstractEditor, useValue: this },
      ],
    });

    return this.cfr
      .resolveComponentFactory(controlClass)
      .create(injector);
  }

  // TODO: move to products behaviour
  openProductsDialog(selectedProducts: string[]) {
    return this.productsApi.getProducts().pipe(
      // TODO: add Product interface
      map(products =>
        products.map(product => ({
          ...product,
          image: product.images[0] || '',
          subtitle: `${product.currency} ${product.price}`,
          description: 'In Stock',
        })),
      ),
      switchMap((products) => {
        const dialog = this.dialog.open(PebProductsComponent, {
          position: {
            top: '0',
            left: '0',
          },
          height: '100vh',
          maxWidth: '100vw',
          width: '100vw',
          panelClass: 'products-dialog',
          data: {
            products,
            selectedProducts,
          },
        });
        return dialog.afterClosed().pipe(takeUntil(this.destroyed$));
      }),
    );
  }

  openCategoriesDialog(categories, selectedCategories: string[]): Observable<string[]> {
    const dialog = this.dialog.open(PebProductCategoriesComponent, {
      position: {
        top: '0',
        left: '0',
      },
      height: '100vh',
      maxWidth: '100vw',
      width: '100vw',
      panelClass: 'products-dialog',
      data: {
        categories,
        selectedCategories,
      },
    });
    return dialog.afterClosed();
  }

  onChangeElementVisible({ element, visible }) {
    const display = visible
      ? element.children?.length
        ? 'grid'
        : 'flex'
      : 'none';

    return this.store.updateStyles(this.state.screen, {
      [element.id]: { display },
    });
  }

  insertToSlot<T>(componentClass: Type<T>, slotType: PebEditorSlot): ComponentRef<T> {
    const componentFactory = this.cfr.resolveComponentFactory(componentClass);
    const componentRef = componentFactory.create(this.injector);

    const slot = slotType === PebEditorSlot.sidebar
      ? this.sidebarSlot
      : slotType === PebEditorSlot.contentContainer
        ? this.contentContainerSlot
        : null;

    if (!slot) {
      return null;
    }

    if (slotType === PebEditorSlot.sidebar) {
      slot.clear();
    }
    slot.insert(componentRef.hostView);

    return componentRef;
  }

  // TODO: Move all hotkeys to plugin
  @HostListener('window:keydown.alt.Escape')
  onClosePage() {
    this.state.hoveredElement = null;
    this.state.selectedElements = [];
    this.store.activatePage(null).subscribe();
  }

  @HostListener('window:keydown.control.z')
  @HostListener('window:keydown.meta.z')
  onUndo() {
    if (this.editMode || ['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
      return;
    }
    this.store.undoAction();
  }

  @HostListener('window:keydown.control.shift.z')
  @HostListener('window:keydown.meta.shift.z')
  onRedo() {
    if (this.editMode || ['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
      return;
    }
    this.store.redoAction();
  }

  // TODO: This should be placed inside element-manipulation.behavior
  @HostListener('window:keydown.backspace')
  @HostListener('window:keydown.delete')
  deleteElement() {
    if (this.editMode || ['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
      return;
    }
    this.manipulateElementSubject$.next({
      selectedElements: this.state.selectedElements,
      type: 'delete',
      screen: this.state.screen,
    });
  }

  @HostListener('window:keydown.control.c')
  @HostListener('window:keydown.meta.c')
  copyElement() {
    if (this.editMode || ['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
      return;
    }

    // Save element in store
    this.manipulateElementSubject$.next({
      selectedElements: this.state.selectedElements,
      type: 'copy',
    });
  }

  @HostListener('window:keydown.control.v')
  @HostListener('window:keydown.meta.v')
  pasteElement() {
    if (this.editMode || ['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
      return;
    }

    // Paste element in active element
    this.manipulateElementSubject$.next({
      type: 'paste',
      screen: this.state.screen,
    });
  }

  private get editMode(): boolean {
    if (isTextMaker(this.renderer.maker?.instance)) {
      return this.renderer.maker.instance.active;
    }

    return false;
  }

  private generatePageNameNumber(name: string, pages: PebPageShort[]): string {
    const originalPageNumberMatches = name.match(/\d+/g);
    const originalPageNumber = originalPageNumberMatches?.length ? parseInt(originalPageNumberMatches[0], 10) : 0;

    return pages.reduce(
      (acc, page) => {
        if (page.name.replace(/\s|[0-9]/g, '') !== name.replace(/\s|[0-9]/g, '')) {
          console.log(page.name.replace(/\s|[0-9]/g, ''), name.replace(/\s|[0-9]/g, ''));
          return acc;
        }

        const prevPageNumberMatches = acc.match(/\d+/g);
        const currPageNumberMatches = page.name.match(/\d+/g);
        const prevPageNumber = prevPageNumberMatches?.length ? parseInt(prevPageNumberMatches[0], 10) : 0;
        const currPageNumber = currPageNumberMatches?.length ? parseInt(currPageNumberMatches[0], 10) : 0;

        return `${name.replace(` ${originalPageNumber}`, '')} ${Math.max(prevPageNumber, currPageNumber + 1)}`;
      },
      name,
    );
  }
}

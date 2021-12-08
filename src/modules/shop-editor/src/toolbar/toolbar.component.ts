import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Injector,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, pluck, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { PebElementType, PebPageType, PebScreen } from '@pe/builder-core';
import {
  EditorSidebarTypes,
  OVERLAY_POSITIONS,
  PebEditorAbstractToolbar, PebEditorCommand,
  PebEditorState,
  PebEditorStore,
} from '@pe/builder-editor';
import { PebViewerPreviewDialog } from '@pe/builder-viewer';

import {
  ObjectCategory,
  PebEditorCodeDialogComponent,
  PebEditorMediaDialogComponent,
  PebEditorObjectsDialogComponent,
  PebEditorProductDialogComponent,
  PebEditorPublishDialogComponent,
  PebEditorScreenDialogComponent,
  PebEditorViewDialogComponent,
  PebEditorZoomDialogComponent,
} from './dialogs';
import { OverlayData, OverlayDataValue, OVERLAY_DATA } from './overlay.data';
import { ShopEditorSidebarTypes } from '../shop-editor.state';

enum ToolsDialogType {
  Media = 'media',
  Objects = 'objects',
  Product = 'product',
  Publish = 'publish',
  Screen = 'screen',
  Seo = 'seo',
  View = 'view',
  Zoom = 'zoom',
}

@Component({
  selector: 'peb-shop-editor-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebEditorShopToolbarComponent implements PebEditorAbstractToolbar {
  @Output() execCommand = new EventEmitter<PebEditorCommand>();

  // TODO: set this variable from editor.component if it useful in new toolbar injecting process
  loading = false;

  scales = [33, 50, 75, 100, 150, 200, 300];
  screens = Object.values(PebScreen);

  public store = this.injector.get(PebEditorStore);
  public state = this.injector.get(PebEditorState);
  public editorState = this.injector.get(PebEditorState);
  public cdr = this.injector.get(ChangeDetectorRef);
  private overlay = this.injector.get(Overlay);
  private dialog = this.injector.get(MatDialog);
  private elementRef = this.injector.get(ElementRef);

  ToolsDialogType = ToolsDialogType;
  private overlayRef: OverlayRef;

  seoDialogOpened$ = this.state.misc$.pipe(
    pluck('seoSidebarOpened'),
    distinctUntilChanged(),
  );

  constructor(private injector: Injector) {}

  @HostBinding('class.skeleton')
  get hostSkeletonClass(): boolean {
    return this.loading;
  }

  get nativeElement() {
    return this.elementRef.nativeElement;
  }

  openView(element: HTMLElement) {
    const overlay: Observable<OverlayDataValue> = this.openOverlay(
      PebEditorViewDialogComponent,
      element,
      this.editorState,
    );

    overlay.pipe(
      first(),
      filter(Boolean),
      tap((selectedView: EditorSidebarTypes | ShopEditorSidebarTypes) => {
        if (selectedView === ShopEditorSidebarTypes.EditMasterPages) {
          this.editorState.pagesView = this.editorState.pagesView === PebPageType.Replica
            ? PebPageType.Master
            : PebPageType.Replica;
        }
        if (
          selectedView === EditorSidebarTypes.Navigator
          || selectedView === EditorSidebarTypes.Inspector
          || selectedView === EditorSidebarTypes.Layers
        ) {
          this.editorState.sidebarsActivity = {
            ...this.editorState.sidebarsActivity,
            [selectedView]: !this.editorState.sidebarsActivity[selectedView],
          };
        }
      }),
      tap(() => this.detachOverlay()),
    ).subscribe();
  }

  openMedia(element: HTMLElement) {
    const overlay: Observable<OverlayDataValue> = this.openOverlay(
      PebEditorMediaDialogComponent,
      element,
      null,
      'dialog-media-panel',
    );
    this.createElementAfterClose(overlay);
  }

  openObjects(element: HTMLElement) {
    const overlay: Observable<OverlayDataValue> = this.openOverlay(
      PebEditorObjectsDialogComponent,
      element,
      null,
      'dialog-objects-panel',
    );
    this.createElementAfterClose(overlay);
  }

  openProduct(element: HTMLElement) {
    const overlay: Observable<OverlayDataValue> = this.openOverlay(
      PebEditorProductDialogComponent,
      element,
      null,
      'dialog-objects-panel',
    );
    this.createElementAfterClose(overlay);
    // this.editorComponent.appendProductElement();
    // const dialog = this.openOverlay(event, PebEditorProductDialogComponent);
  }

  openPreview() {
    this.dialog.open(PebViewerPreviewDialog, {
      position: {
        top: '0',
        left: '0',
      },
      height: '100vh',
      maxWidth: '100vw',
      width: '100vw',
      panelClass: 'themes-preview-dialog',
      data: {
        themeSnapshot: this.store.snapshot,
        screen: this.state.screen,
      },
    });
  }

  openPublish(element: HTMLElement) {
    this.openOverlay(PebEditorPublishDialogComponent, element, this.store, 'dialog-publish-versions-panel');
  }

  openScreen(element: HTMLElement) {
    const overlay: Observable<OverlayDataValue> = this.openOverlay(
      PebEditorScreenDialogComponent,
      element,
      { screen: this.editorState.screen },
      'screen-panel',
    );
    overlay.pipe(
      first(),
      filter(screen => !!screen),
      tap((screen: PebScreen) => this.editorState.screen = screen),
      tap(() => this.detachOverlay()),
    ).subscribe();
  }

  openZoom(element: HTMLElement) {
    if (this.editorState.makerActive) {
      return;
    }

    const overlay: Observable<OverlayDataValue> = this.openOverlay(
      PebEditorZoomDialogComponent,
      element,
      this.editorState.scale,
    );
    overlay.pipe(
      first(),
      filter(scale => !!scale),
      tap(() => this.detachOverlay()),
    ).subscribe((scale: number) => this.editorState.scale = scale / 100);
  }

  openCodeDropdown(element: HTMLElement) {
    const overlay: Observable<OverlayDataValue> = this.openOverlay(PebEditorCodeDialogComponent, element, null, 'dialog-objects-panel');
    this.createElementAfterClose(overlay);
  }

  createTextElement(): void {
    this.execCommand.emit({
      type: 'createElement', params: {
        type: PebElementType.Text,
        data: { text: '<span>Your text</span>' },
        style: { width: '100%' },
      },
    });
  }

  private openOverlay<T>(
    component: ComponentType<T>,
    element: HTMLElement,
    data?: any,
    panelClass?: string,
  ): Observable<OverlayDataValue> {
    if (this.hasOverlayAttached()) {
      return;
    }

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(element)
        .withFlexibleDimensions(false)
        .withViewportMargin(10)
        .withPositions(OVERLAY_POSITIONS),
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: panelClass ? panelClass : 'dialog-publish-panel',
      disposeOnNavigation: true,
    });
    const emitter: Subject<ObjectCategory | PebScreen | number> = new Subject();
    const emitter$: Observable<ObjectCategory | PebScreen | number> = emitter.asObservable();
    const injector = this.createInjector({
      emitter,
      data,
    });
    const portal = new ComponentPortal(component, null, injector);
    this.overlayRef.attach(portal);
    this.overlayRef.backdropClick().pipe(tap(() => this.detachOverlay())).subscribe();
    return emitter$;
  }

  private createElementAfterClose(overlay: Observable<OverlayDataValue>): void {
    overlay.pipe(
      tap(() => this.detachOverlay()),
    ).subscribe((element: ObjectCategory) => {
      if (element.type) {
        this.execCommand.emit({ type: 'createElement', params: element });
      }
    });
  }

  private createInjector(injectData: OverlayData): PortalInjector {
    const injectionTokens = new WeakMap();
    injectionTokens.set(OVERLAY_DATA, injectData);
    return new PortalInjector(this.injector, injectionTokens);
  }

  private detachOverlay(): void {
    if (this.hasOverlayAttached()) {
      this.overlayRef.detach();
    }
  }

  private hasOverlayAttached(): boolean {
    return this.overlayRef && this.overlayRef.hasAttached();
  }
}

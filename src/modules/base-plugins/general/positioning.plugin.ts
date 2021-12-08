import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { filter, finalize, map, switchMap, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';

import { PebElementType, PebScreen, pebScreenWidthList, PEB_DESKTOP_CONTENT_WIDTH } from '@pe/builder-core';
import {
  AfterGlobalInit,
  fromResizeObserver,
  PebEditorAccessorService,
  PebEditorRenderer,
  PebEditorSectionBordersControl,
  PebEditorState,
  PEB_EDITOR_STATE,
} from '@pe/builder-editor';

const PADDING_MINIMAL = 40;

@Injectable()
export class PebEditorPositioningPlugin implements AfterGlobalInit {
  // TODO: Probably such info should be set on editor's level
  paddingSet$ = new Subject<void>();

  get editor() {
    return this.editorAccessorService.editorComponent;
  }

  constructor(
    private renderer: PebEditorRenderer,
    private editorAccessorService: PebEditorAccessorService,
    @Inject(PEB_EDITOR_STATE) protected state: PebEditorState,
  ) {}

  afterGlobalInit(): Observable<any> {
    return merge(
      this.setContentAreaPaddings,
      this.setRendererWidthOnScreenChange,
      this.placeSectionBorders,
    );
  }

  get setContentAreaPaddings() {
    const contentContainerElement = this.editor.contentContainer.nativeElement;

    return combineLatest([
      fromResizeObserver(contentContainerElement),
      fromResizeObserver(this.renderer.nativeElement),
    ]).pipe(
      throttleTime(0, animationFrame),
      tap(([contentContainerRect, rendererRect]) => {
        this.editor.contentPadding = {
          vertical: Math.max(PADDING_MINIMAL, (contentContainerRect.height - rendererRect.height) / 2),
          horizontal: Math.max(PADDING_MINIMAL, (contentContainerRect.width - rendererRect.width) / 2),
        };

        this.paddingSet$.next();
        this.editor.cdr.detectChanges();
      }),
    );
  }

  get setRendererWidthOnScreenChange() {
    return combineLatest([
      this.state.screen$,
      this.state.scale$,
    ]).pipe(
      tap(([screen, scale]) => {
        this.renderer.nativeElement.style.width = `${pebScreenWidthList[screen] * scale}px`;
        this.renderer.nativeElement.style.maxWidth = `${pebScreenWidthList[screen] * scale}px`;
      }),
    );
  }

  get placeSectionBorders() {
    return combineLatest([
      this.state.screen$.pipe(filter(s => s === PebScreen.Desktop)),
      this.paddingSet$,
    ]).pipe(
      switchMap(() => {
        // TODO: fix

        const bordersRef = this.editor.cfr
          .resolveComponentFactory(PebEditorSectionBordersControl)
          .create(this.editor.injector);

        this.editor.contentContainerSlot.insert(bordersRef.hostView);

        const rendererNode = this.renderer.nativeElement;

        return fromResizeObserver(rendererNode).pipe(
          map(() => rendererNode.getBoundingClientRect()),
          tap((rendererRect) => {
            Object.assign(bordersRef.instance, {
              left: this.editor.contentPadding.horizontal,
              top: this.editor.contentPadding.vertical,
              width: rendererRect.width,
              height: rendererRect.height,
              spaceWidth: (rendererRect.width - PEB_DESKTOP_CONTENT_WIDTH * this.state.scale) / 2,
              sectionHeights: this.getSectionHeights(),
            });
            bordersRef.changeDetectorRef.detectChanges();
          }),
          takeUntil(
            this.state.screen$.pipe(filter(s => s !== PebScreen.Desktop)),
          ),
          finalize(() => {
            bordersRef.destroy();
          }),
        );
      }),
    );
  }

  private getSectionHeights(): number[] {
    const sectionElements = this.renderer.queryElementAll(el => el.element.type === PebElementType.Section)
      .sort((a, b) => a.nativeElement.getBoundingClientRect().y - b.nativeElement.getBoundingClientRect().y);

    const sectionHeights = sectionElements.reduce((acc, el, index) => {
      const prevHeight = acc[index - 1] ?? 0;
      const currHeight = el.nativeElement.getBoundingClientRect().height - 1;
      return [...acc, prevHeight + currHeight];
    },                                            []);

    sectionHeights.pop();
    return sectionHeights;
  }
}

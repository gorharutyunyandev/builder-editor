import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { debounceTime, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { pebCreateLogger, PebElementDef, PebElementType } from '@pe/builder-core';
import {
  AbstractEditElementPlugin,
  AfterGlobalInit,
  onlyOneElementSelected,
  PebEditorElement,
} from '@pe/builder-editor';

import { PebEditorCarouselSidebarComponent } from './carousel.sidebar';
// TODO: create shared interface
import { PebCarouselElement } from '../client';

const log = pebCreateLogger('editor:plugin:carousel');

@Injectable()
export class PebEditorCarouselPlugin
  extends AbstractEditElementPlugin<PebEditorCarouselSidebarComponent>
  implements AfterGlobalInit
{
  sidebarComponent = PebEditorCarouselSidebarComponent;

  logger = { log };

  afterGlobalInit(): Observable<any> {
    const carouselFocused$ = this.state.singleSelectedElement$.pipe(
      filter(Boolean),
      map(this.renderer.getElementComponent),
      filter(elCmp => elCmp?.definition.type === PebElementType.Carousel),
    );

    return carouselFocused$.pipe(
      filter(Boolean),
      switchMap((element: PebEditorElement) => {
        const sidebarCmpRef = this.editor.openSidebar(PebEditorCarouselSidebarComponent);
        sidebarCmpRef.instance.element = element.definition;
        sidebarCmpRef.instance.styles = element.styles;
        sidebarCmpRef.changeDetectorRef.detectChanges();

        return this.editFlow(element, sidebarCmpRef.instance, element.target as PebCarouselElement).pipe(
          takeUntil(
            merge(
              carouselFocused$.pipe(filter(v => !v)),
              onlyOneElementSelected(this.state),
            ),
          ),
          finalize(() => {
            sidebarCmpRef.destroy();
          }),
        );
      }),
    );
  }

  editFlow(
    element: PebEditorElement,
    sidebar: PebEditorCarouselSidebarComponent,
    widget: PebCarouselElement,
  ): Observable<any> {
    return merge(
      sidebar.changeStyles.pipe(
        tap((styles) => {
          element.styles = {
            ...element.styles,
            ...styles,
          };
          element.applyStyles();
        }),
        debounceTime(500),
        switchMap(styles => this.store.updateStyles(this.state.screen, {
          [element.definition.id]: styles,
        })),
      ),
      sidebar.changeData.pipe(
        switchMap((data) => {
          const newElementDef: PebElementDef = {
            ...element.definition,
            data: {
              ...element.definition.data,
              ...data,
            },
          };

          element.detectChanges();
          return this.store.updateElement(newElementDef);
        }),
      ),
      sidebar.changeSlide.pipe(
        tap((slideIndex) => {
          widget.currentSlide = slideIndex;
          widget.cdr.detectChanges();
        }),
      ),
    );
  }
}

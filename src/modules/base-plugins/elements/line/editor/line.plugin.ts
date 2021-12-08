import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { debounceTime, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { pebCreateLogger, PebElementType } from '@pe/builder-core';
import { AbstractEditElementPlugin, AfterGlobalInit, onlyOneElementSelected, PebEditorElement } from '@pe/builder-editor';

import { PebEditorLineSidebarComponent } from './line.sidebar';

const log = pebCreateLogger('editor:plugin:menu');

@Injectable()
export class PebEditorLinePlugin
  extends AbstractEditElementPlugin<PebEditorLineSidebarComponent>
  implements AfterGlobalInit
{
  sidebarComponent = PebEditorLineSidebarComponent;

  logger = { log };

  afterGlobalInit(): Observable<any> {
    const lineFocused$ = this.state.singleSelectedElement$.pipe(
      filter(Boolean),
      map(this.renderer.getElementComponent),
      filter(elCmp => elCmp?.definition.type === PebElementType.Line),
    );

    return lineFocused$.pipe(
      filter(Boolean),
      switchMap((element: PebEditorElement) => {

        const sidebarCmpRef = this.editor.openSidebar(PebEditorLineSidebarComponent);
        sidebarCmpRef.instance.element = element.definition;
        sidebarCmpRef.instance.styles = element.styles;
        sidebarCmpRef.changeDetectorRef.detectChanges();

        return this.editFlow(element, sidebarCmpRef.instance).pipe(
          takeUntil(
            merge(
              lineFocused$.pipe(filter(v => !v)),
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

  editFlow(element: PebEditorElement, sidebar: PebEditorLineSidebarComponent): Observable<any> {
    return merge(
      sidebar.changeStyle.pipe(
        tap((styles) => {
          element.styles = { ...element.styles, ...styles };
        }),
        debounceTime(500),
        switchMap(() => {
          return this.store.updateStyles(this.state.screen, {
            [element.definition.id]: element.styles,
          });
        }),
      ),
      sidebar.changeStroking.pipe(
        switchMap(() => {
          element.styles.stroking = element.styles.stroking ? 0 : 1;

          return this.store.updateStyles(this.state.screen, {
            [element.definition.id]: { ...element.styles },
          });
        }),
      ),
      sidebar.changeShadowing.pipe(
        switchMap(() => {
          element.styles.shadowing = element.styles.shadowing ? 0 : 1;

          return this.store.updateStyles(this.state.screen, {
            [element.definition.id]: { ...element.styles },
          });
        }),
      ),
    );
  }
}

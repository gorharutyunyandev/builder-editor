import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { debounceTime, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { cloneDeep, merge as lodashMerge } from 'lodash';

import { pebCreateLogger, PebElementType } from '@pe/builder-core';
import { AbstractEditElementPlugin, AfterGlobalInit, PebEditorElement, showImageSpinner } from '@pe/builder-editor';

import { PebEditorShapeSidebarComponent } from './shape.sidebar';

const log = pebCreateLogger('editor:plugins:edit-block');

const styleDefaults = {
  opacity: 1,
};

@Injectable()
export class PebEditorShapePlugin extends AbstractEditElementPlugin<PebEditorShapeSidebarComponent>
  implements AfterGlobalInit {
  static elementTypes = [PebElementType.Shape, PebElementType.Block];

  sidebarComponent = PebEditorShapeSidebarComponent;

  logger = { log };

  afterGlobalInit(): Observable<any> {
    return this.singleElementOfTypeSelected().pipe(
      switchMap((elCmp) => {
        this.initPositionForm(elCmp);
        this.initDimensionsForm(elCmp);
        this.initBackgroundForm(elCmp);

        const sidebarRef = this.initSidebar(elCmp);

        this.initAlignmentForm(sidebarRef);

        return merge(
          this.handleAlignmentForm(elCmp, sidebarRef),
          this.handlePositionForm(elCmp),
          this.handleDimensionsForm(elCmp),
          this.handleBackgroundForm(elCmp, sidebarRef),
          this.editFlow(elCmp, sidebarRef.instance),
        ).pipe(
          takeUntil(this.state.selectionChanged$()),
          finalize(() => sidebarRef.destroy()),
        );
      }),
    );
  }

  //
  //  Old code
  //

  editFlow(element: PebEditorElement, sidebar: PebEditorShapeSidebarComponent): Observable<any> {
    const initialState = {
      definition: cloneDeep(element.definition),
      styles: lodashMerge({}, styleDefaults, element.styles),
    };

    return merge(
      sidebar.changeStyle.pipe(
        map(styles => this.updateStyles(element, styles)),
        debounceTime(500),
        switchMap(() => {
          return this.store.updateStyles(this.state.screen, {
            [element.definition.id]: element.styles,
          }).pipe(
            tap(() => showImageSpinner(false, element)),
          );
        }),
        tap(() => element.detectChanges()),
      ),
      // TODO: Return this then changeStyleFinal works
      // sidebar.changeStyleFinal.pipe(
      //   filter(() => !!Object.keys(diff(initialState.styles, element.styles)).length),
      //   switchMap(() => {
      //     return this.store.updateStyles(this.state.screen, {
      //       [element.definition.id]: element.styles,
      //     }).pipe(
      //       tap(() => showImageSpinner(false, element)),
      //     );
      //   }),
      // ),
    );
  }
}

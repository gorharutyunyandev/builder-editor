import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { filter, finalize, map, switchMap, takeUntil } from 'rxjs/operators';

import { pebCreateLogger, PebElementDef, PebElementType } from '@pe/builder-core';
import { AbstractEditElementPlugin, AfterGlobalInit, onlyOneElementSelected, PebEditorElement } from '@pe/builder-editor';

import { PebEditorCodeSidebarComponent } from './code.sidebar';

const log = pebCreateLogger('editor:plugin:code');

@Injectable()
export class PebEditorCodePlugin
  extends AbstractEditElementPlugin<PebEditorCodeSidebarComponent>
  implements AfterGlobalInit
{
  sidebarComponent = PebEditorCodeSidebarComponent;

  logger = { log };

  afterGlobalInit(): Observable<any> {
    const codeFocused$ = this.state.singleSelectedElement$.pipe(
      filter(Boolean),
      map(this.renderer.getElementComponent),
      filter(elCmp => elCmp?.definition.type === PebElementType.Script),
    );

    return codeFocused$.pipe(
      filter(Boolean),
      switchMap((element: PebEditorElement) => {

        const sidebarCmpRef = this.editor.openSidebar(PebEditorCodeSidebarComponent);
        sidebarCmpRef.instance.element = element.definition;
        sidebarCmpRef.instance.styles = { some: 'foo' };
        sidebarCmpRef.changeDetectorRef.detectChanges();

        return this.editFlow(element, sidebarCmpRef.instance).pipe(
          takeUntil(
            merge(
              codeFocused$.pipe(filter(v => !v)),
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

  editFlow(element: PebEditorElement, sidebar: PebEditorCodeSidebarComponent): Observable<any> {
    return merge(
      sidebar.changeCode.pipe(
        switchMap((definition: PebElementDef) => {
          const code = definition.type === PebElementType.Html
            ? definition.data.innerHTML
            : definition.data.script;
          const data = definition.type === PebElementType.Html
            ? { ...element.definition.data, innerHTML: code }
            : { ...element.definition.data, script: code };
          const newElementDef: PebElementDef = {
            ...element.definition,
            data,
          };

          return this.store.updateElement(newElementDef);
        }),
      ),
    );
  }
}

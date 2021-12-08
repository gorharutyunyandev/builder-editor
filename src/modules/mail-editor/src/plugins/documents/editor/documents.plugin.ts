import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, tap } from 'rxjs/operators';

import { AbstractEditElementPlugin, AfterGlobalInit } from '@pe/builder-editor';
import { pebCreateLogger } from '@pe/builder-core';

import { PebEditorDocumentsSidebarComponent } from './documents.sidebar';

const log = pebCreateLogger('editor:plugin:document');

@Injectable()
export class PebEditorMailDocumentsPlugin
  extends AbstractEditElementPlugin<PebEditorDocumentsSidebarComponent>
  implements AfterGlobalInit
{
  sidebarComponent = PebEditorDocumentsSidebarComponent;

  logger = { log };

  afterGlobalInit(): Observable<any> {
    const sidebarCmpRef = this.editor.initAdditionalLeftSidebar(PebEditorDocumentsSidebarComponent);
    sidebarCmpRef.instance.renderer = this.renderer;
    sidebarCmpRef.instance.editor = this.editor;

    return combineLatest([
      this.store.snapshot$.pipe(filter(s => Boolean(s))),
      this.store.activePageId$.pipe(filter(Boolean)),
      this.state.screen$,
    ]).pipe(
      tap(([snapshot, activePageId, screen]) => {
        const page = snapshot.pages[activePageId];
        if (page) {
          sidebarCmpRef.instance.element = snapshot.templates[page.templateId];
          sidebarCmpRef.instance.stylesheet = snapshot.stylesheets[page.stylesheetIds[screen]];
        }
      }),
    );
  }
}

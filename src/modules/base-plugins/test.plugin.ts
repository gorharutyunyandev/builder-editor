// import { Inject, Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { finalize, tap } from 'rxjs/operators';
//
// import { pebCreateLogger } from '@pe/builder-core';
// import { PebAbstractPlugin, PebEditorEvents, PEB_EDITOR_EVENTS } from '@pe/builder-editor';
//
// const log = pebCreateLogger('editor:plugins:test-plugin');
//
// @Injectable({ providedIn: 'any' })
// export class PebEditorPluginTest implements PebAbstractPlugin {
//   constructor(
//     @Inject(PEB_EDITOR_EVENTS) private events: PebEditorEvents,
//   ) {}
//
//   afterPageInit(): Observable<any> {
//     log('page: init');
//     return this.events.renderer.click$.pipe(
//       tap(() => log('click from renderer')),
//       finalize(() => log('page: shutdown')),
//     );
//   }
// }

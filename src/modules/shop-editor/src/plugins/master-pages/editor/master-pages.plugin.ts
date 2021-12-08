import { Inject, Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AfterGlobalInit, AfterPageInit, PebEditorStore, PEB_EDITOR_STATE } from '@pe/builder-editor';
import { pebCreateLogger } from '@pe/builder-core';

import { PebShopEditorState } from '../../../shop-editor.state';

const log = pebCreateLogger('editor:plugins:master-pages');

@Injectable()
export class PebEditorShopMasterPagesPlugin implements AfterPageInit, AfterGlobalInit {

  logger = { log };

  constructor(private store: PebEditorStore,
              @Inject(PEB_EDITOR_STATE) private state: PebShopEditorState) {
  }

  afterGlobalInit(): Observable<any> {
    this.logger.log('global: init');

    return EMPTY.pipe(
      finalize(() => log('global: shutdown')),
    );
  }

  afterPageInit(): Observable<any> {
    this.logger.log('page: init');

    return EMPTY.pipe(
      finalize(() => log('page: shutdown')),
    );
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { PebEditorState } from '@pe/builder-editor';

export enum ShopEditorSidebarTypes {
  EditMasterPages = 'edit-master-pages',
}

export interface PebShopEditorStateType {
  seoSidebarOpened: boolean;
}

const INITIAL_STATE: PebShopEditorStateType = {
  seoSidebarOpened: false,
};

@Injectable()
export class PebShopEditorState extends PebEditorState {

  /**
   * SeoSidebarOpened
   */
  private readonly seoSidebarOpenedSubject$ = new BehaviorSubject<boolean>(INITIAL_STATE.seoSidebarOpened);
  readonly seoSidebarOpened$ = this.seoSidebarOpenedSubject$.asObservable();

  set seoSidebarOpened(val: boolean) {
    this.seoSidebarOpenedSubject$.next(val);
  }

  get seoSidebarOpened() {
    return this.seoSidebarOpenedSubject$.value;
  }
}

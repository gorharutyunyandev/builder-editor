import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, concat, interval, merge, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
  map,
  retry,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { PebAction, pebActionHandler, pebCompileActions, pebCreateLogger, PebShopThemeSnapshot, PebTheme } from '@pe/builder-core';
import { PebEditorApi } from '@pe/builder-api';

import { SnackbarErrorService } from './snackbar-error.service';


export enum PebStateActionType {
  Undo,
  Redo,
}

export enum PebApiActionType {
  Add = 'add',
  Delete = 'delete',
}

enum ThemeSaveStatus {
  Saved = 'saved',
  Saving = 'saving',
  NotSaved = 'not saved',
}

export interface PebSnapshotItem {
  action: PebAction;
  snapshot: PebShopThemeSnapshot;
}

export interface PebSnapshotState {
  state: PebSnapshotItem[];
  redo: PebSnapshotItem[];
}

export interface UndoRedoState {
  canUndo: boolean;
  canRedo: boolean;
}

const log = pebCreateLogger('editor:actions');

@Injectable()
export class PebEditorThemeService implements OnDestroy {

  logger = { log };

  themeUpdateTimerId: number = null;

  lastRemovedRequest: { id: string, request: Observable<any> };

  private readonly destroyedSubject$ = new Subject();

  readonly destroyed$ = this.destroyedSubject$.asObservable();

  private readonly themeSubject$ = new BehaviorSubject<PebTheme>(null);

  private readonly savingChangesSubject = new BehaviorSubject<string>(ThemeSaveStatus.Saved);

  get theme$(): Observable<PebTheme> {
    return this.themeSubject$.asObservable();
  }

  get theme(): PebTheme {
    return this.themeSubject$.value;
  }

  private readonly snapshotSubject$ = new BehaviorSubject<PebShopThemeSnapshot>(null);

  get snapshot$(): Observable<PebShopThemeSnapshot> {
    return this.snapshotSubject$.asObservable();
  }

  set snapshot(snapshot: PebShopThemeSnapshot) {
    this.snapshotSubject$.next(snapshot);
  }

  get snapshot(): PebShopThemeSnapshot {
    return this.snapshotSubject$.value;
  }

  private readonly actionsSubject$ = new BehaviorSubject<PebAction[]>([]);

  get actions(): PebAction[] {
    return this.actionsSubject$.value;
  }

  private readonly canceledActionsSubject$ = new BehaviorSubject<PebAction[]>([]);

  get canUndo$(): Observable<boolean> {
    return this.actionsSubject$.asObservable().pipe(map(actions => actions.length > 1));
  }

  get canRedo$(): Observable<boolean> {
    return this.canceledActionsSubject$.asObservable().pipe(map(actions => !!actions.length));
  }

  private get canUndo(): boolean {
    return this.actionsSubject$.value.length > 1;
  }

  private get canRedo(): boolean {
    return !!this.canceledActionsSubject$.value.length;
  }

  /**
   * We need a queue because this solves the problem of cancelling multiple requests by Google Chrome.
   * The problem will need to be solved later with web sockets.
   */
  private readonly requestsQueueSubject$ = new BehaviorSubject<Array<{ id: string, request: Observable<any> }>>([]);

  private addRequestToQueue(id: string, request: Observable<any>) {
    this.requestsQueueSubject$.next([
      ...this.requestsQueueSubject$.value,
      { id, request },
    ]);
  }

  private removeRequestFromQueue(id: string) {
    this.lastRemovedRequest = this.requestsQueueSubject$.value.find(r => r.id === id);
    this.requestsQueueSubject$.next([
      ...this.requestsQueueSubject$.value.filter(r => r.id !== id),
    ]);
  }

  constructor(
    private api: PebEditorApi,
    private snackbarErrorService: SnackbarErrorService,
  ) {
    this.requestsQueueSubject$.pipe(
      distinctUntilChanged(),
      debounceTime(100),
      filter(requests => !!requests?.length),
      tap(requests => requests.forEach(r => this.removeRequestFromQueue(r.id))),
      concatMap(requests => concat(...requests.map(r => r.request))),
      catchError((error, data) => {
        this.savingChangesSubject.next(ThemeSaveStatus.NotSaved);
        this.snackbarErrorService.openSnackbarError({
          retryAction: () => this.addRequestToQueue(this.lastRemovedRequest.id, this.lastRemovedRequest.request),
          reloadOnHide: error?.status === 403,
        });
        return data;
      }),
      takeUntil(this.destroyed$),
    ).subscribe(() => {
      this.savingChangesSubject.next(ThemeSaveStatus.Saved);
    });
  }

  ngOnDestroy() {
    this.destroyedSubject$.next(true);
    this.destroyedSubject$.complete();
  }

  openTheme(theme: PebTheme, snapshot: PebShopThemeSnapshot): void {

    this.themeSubject$.next(theme);
    this.snapshot = snapshot;

    this.api.getActions(theme.id).pipe(
      first(),
      tap(actions => this.actionsSubject$.next(actions)),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  commitAction(action: PebAction): Observable<null> {
    this.logger.log(action);
    // TODO: Add hash comparing
    this.savingChangesSubject.next(ThemeSaveStatus.Saving);
    this.snapshot = pebActionHandler(this.snapshot, action);
    this.actionsSubject$.next([...this.actionsSubject$.value, action]);

    this.addRequestToQueue(
      action.id,
      this.api.addAction(this.theme.id, action).pipe(
        retry(3),
      ),
    );
    this.canceledActionsSubject$.next([]);
    return of(null);
  }

  undo(): Observable<void> {

    if (!this.canUndo) {
      return;
    }

    const actions = this.actionsSubject$.value;
    const action = actions.pop();

    this.savingChangesSubject.next(ThemeSaveStatus.Saving);
    this.snapshot = pebCompileActions(actions);

    this.actionsSubject$.next(actions);
    this.canceledActionsSubject$.next([...this.canceledActionsSubject$.value, action]);

    this.addRequestToQueue(
      action.id,
      this.api.undoAction(this.theme.id, action.id),
    );

    return of(null);
  }

  redo(): Observable<void> {

    if (!this.canRedo) {
      return;
    }

    this.savingChangesSubject.next(ThemeSaveStatus.Saving);
    const canceledActions = this.canceledActionsSubject$.value;
    const action = canceledActions.pop();

    this.snapshot = pebActionHandler(this.snapshot, action);

    this.actionsSubject$.next([...this.actionsSubject$.value, action]);
    this.canceledActionsSubject$.next(canceledActions);

    this.addRequestToQueue(
      action.id,
      this.api.addAction(this.theme.id, action),
    );

    return of(null);
  }

  updatePreview(previewURL: string): Observable<void> {
    return this.api.updateShopThemePreview(this.theme.id, previewURL).pipe(
      tap(() => this.themeSubject$.next({
        ...this.theme,
        picture: previewURL,
      })),
    );
  }

  updatePagePreview(pageId: string, previewUrl: string, actionId: string): Observable<void> {
    const previews = {
      ...this.theme.source.previews,
      [pageId]: {
        previewUrl,
        actionId,
      },
    };

    return this.api.updateThemeSourcePagePreviews(this.theme.id, this.theme.source.id, previews).pipe(
      tap(() => this.themeSubject$.next({
        ...this.theme,
        source: {
          ...this.theme.source,
          previews,
        },
      })),
    );
  }

  updateThemeName(name: string): Observable<void> {
    return this.api.updateShopThemeName(this.theme.id, name).pipe(
      tap(() => this.themeSubject$.next({
        ...this.theme,
        name,
      })),
    );
  }

  getLastThemeUpdate(): Observable<string> {
    return merge(
      this.snapshot$.pipe(
        map(() => {
          return this.getUpdateGap(this.snapshotSubject$.value?.updatedAt);
        }),
      ),
      interval(15000).pipe(
        map(() => {
          return this.getUpdateGap(this.snapshotSubject$.value?.updatedAt);
        }),
      ),
    );
  }

  private getUpdateGap(dateString: string): string {
    const gap = Date.now() - Date.parse(dateString).valueOf();
    let gapString: string;

    if (gap < 60 * 1000) {
      gapString = 'seconds';
    } else if (gap < 2 * 60 * 1000) {
      gapString = 'one minute';
    } else if (gap < 60 * 60 * 1000) {
      gapString = `${Math.floor(gap / 60000)} minutes`;
    } else if (gap < 2 * 60 * 60 * 1000) {
      gapString = 'one hour';
    } else if (gap < 24 * 60 * 60 * 1000) {
      gapString = `${Math.floor(gap / (60 * 60 * 1000))} hours`;
    } else if (gap < 2 * 24 * 60 * 60 * 1000) {
      gapString = 'one day';
    } else if (gap < 30 * 24 * 60 * 60 * 1000) {
      gapString = `${Math.floor(gap / (24 * 60 * 60 * 1000))} hours`;
    } else if (gap < 2 * 30 * 24 * 60 * 60 * 1000) {
      gapString = 'one month';
    } else if (gap < 12 * 30 * 24 * 60 * 60 * 1000) {
      gapString = `${Math.floor(gap / (30 * 24 * 60 * 60 * 1000))} monthes`;
    } else if (gap < 2 * 12 * 30 * 24 * 60 * 60 * 1000) {
      gapString = 'one year';
    } else {
      gapString = `${Math.floor(gap / (12 * 30 * 24 * 60 * 60 * 1000))} years`;
    }

    return `Last edit was ${gapString} ago`;
  }

  getSavingStatus(): Observable<string> {
    return this.savingChangesSubject.asObservable();
  }
}

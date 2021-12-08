import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, scan, shareReplay } from 'rxjs/operators';

@Injectable()
export class BackgroundActivityService {

  private readonly activeRequestCount$ = new BehaviorSubject<number>(0);

  readonly hasActiveTasks$ = this.activeRequestCount$.pipe(
    scan((acc, val) => acc + val, 0),
    map(val => val !== 0),
    shareReplay(1),
  );

  addTask(): void {
    this.activeRequestCount$.next(1);
  }

  removeTask(): void {
    this.activeRequestCount$.next(-1);
  }

  constructor() {
  }
}

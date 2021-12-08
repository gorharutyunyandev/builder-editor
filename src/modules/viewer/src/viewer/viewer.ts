import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Injectable,
  Input,
  OnChanges,
  Output,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { HashLocationStrategy, isPlatformBrowser, Location, LocationStrategy } from '@angular/common';
import { BehaviorSubject, combineLatest, EMPTY, of, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { PebShop, PebShopThemeSnapshot, snapshotToSourceConverter } from '@pe/builder-core';

import { fromLocationUrlChange, fromResizeObserver, getThemePageByLocation } from '../viewer.utils';
import { SCREEN_FROM_WIDTH } from '../viewer.constants';
import { ContextBuilder } from '../services/context.service';

@Injectable()
export class ViewerLocationStrategy extends HashLocationStrategy {
  prepareExternalUrl(internal: string): string {
    return `${(this as any)._platformLocation.location.pathname}#${internal}`;
  }
}


@Component({
  selector: 'peb-viewer',
  templateUrl: './viewer.html',
  styleUrls: ['./viewer.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    Location,
    {
      provide: LocationStrategy,
      useClass: ViewerLocationStrategy,
    },
  ],
})
export class PebViewer implements OnChanges, AfterViewInit {
  @Input()
  themeSnapshot: PebShopThemeSnapshot;

  @Input()
  themeCompiled: PebShop;

  @Input()
  locale = 'en';

  @Output() interacted = new EventEmitter();

  readonly viewInit$ = new Subject<void>();

  readonly theme$ = new BehaviorSubject<PebShop>(null);

  readonly screen$ = this.viewInit$.pipe(
    switchMap(() => fromResizeObserver(this.elementRef.nativeElement)),
    map(hostDss => this.screenFromWidth(hostDss.width)),
    distinctUntilChanged(),
    shareReplay(1),
  );

  readonly location$ = fromLocationUrlChange(this.location).pipe(
    startWith(null as object),
    map(() => (isPlatformBrowser(this.platformId) ? window.location.hash.replace(/^#/, '') : '')),
  );

  readonly pageSnapshot$ = combineLatest([this.theme$, this.contextBuilder.state$]).pipe(
    filter(([theme]) => !!theme),
    switchMap(([theme, state]: [PebShop, any]) => combineLatest([of(theme), of(state), this.location$])),
    switchMap(([theme, state, location]) => {
      const href = isPlatformBrowser(this.platformId) ? window.location.href : '';
      const url = new URL(href);
      const pageId = url.searchParams.get('pageId');
      // TODO: refactor using activatedRoute
      if (pageId) {
        const route = theme.routing.find(r => r.pageId === pageId);
        // tslint:disable-next-line: no-parameter-reassignment
        location = route.url ?? location;
      }
      const page = getThemePageByLocation(theme, location || '/');
      if (!page) {
        this.location.go('/');
        return EMPTY;
      }
      this.location.go(location);
      return of({ theme, page, state });
    }),
    switchMap(snap =>
      combineLatest([
        of(snap.theme),
        of(snap.page),
        of(snap.state),
        this.screen$,
        this.contextBuilder.buildSchema(snap.page.context) || of(null),
        this.contextBuilder.buildSchema(snap.theme.context) || of(null),
      ]),
    ),
    map(([theme, page, state, screen, pageSchema, themeSchema]) => {
      return {
        screen,
        template: page.template,
        stylesheet: page.stylesheets[screen] || {},
        context: { ...state, ...themeSchema, ...(pageSchema as any) },
      };
    }),
    shareReplay(1),
  );

  constructor(
    @Inject(SCREEN_FROM_WIDTH) private screenFromWidth: any,
    @Inject(PLATFORM_ID) private platformId: string,
    private contextBuilder: ContextBuilder,
    private location: Location,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.themeSnapshot && this.themeCompiled) {
      throw new Error('Viewer accepts either snapshot or compiled theme. You should not provide both');
    }

    if (changes.themeSnapshot || changes.themeCompiled) {
      this.theme$.next(this.themeCompiled || snapshotToSourceConverter(this.themeSnapshot));
    }
  }

  ngAfterViewInit() {
    this.viewInit$.next();

    this.cdr.markForCheck();
  }

  onRendererInteraction(evt) {
    if (evt.type === 'navigate.internal-page') {
      this.location.go(evt.path);
    } else {
      this.interacted.emit(evt);
    }
  }
}

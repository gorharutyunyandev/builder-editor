import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { skip, takeUntil, tap } from 'rxjs/operators';

import {
  PebElementStyles,
  pebResetScaleText,
  pebScaleText,
  PEB_DEFAULT_FONT_SIZE,
  transformStyleProperty,
} from '@pe/builder-core';
import { FontLoaderService } from '@pe/builder-font-loader';

import { PebTextEditorService } from './text-editor.service';

const observeTextMutation = (
  target: HTMLElement,
  config = { characterData: true, attributes: true, childList: true, subtree: true },
): Observable<MutationRecord[]> => {
  return new Observable((observer) => {
    const mutation = new MutationObserver((mutations, _) => {
      observer.next(mutations);
    });
    mutation.observe(target, config);

    return () => {
      mutation.disconnect();
    };
  });
};

@Component({
  selector: 'peb-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: component-class-suffix
export class PebTextEditor implements AfterViewInit, OnDestroy {

  @Input() scale = 1;
  @Input() styles: PebElementStyles;
  @Input() minWidth: 'unset' | '100%' = 'unset';
  @Input() skipFirst = false;
  @Input() set text(text: string) {
    this.text$.next(pebScaleText(text, this.scale));
  }
  @Input() set initialDimensions(dimensions: DOMRect) {
    this.scaledDimensions$.next(dimensions);
  }
  @Input() limits: {
    width: number,
    height: number,
  };

  @Output() textChanged = new EventEmitter<string>();
  @Output() dimensionsChanged = new EventEmitter<Partial<DOMRect>>();
  @Output() focused = new EventEmitter<null>();

  @ViewChild('iframeRef') iframeRef: ElementRef;

  private readonly iframeLoaded$ = new ReplaySubject<void>(1);
  private readonly destroyed$ = new Subject<boolean>();

  readonly scaledDimensions$ = new BehaviorSubject<Partial<DOMRect>>({ width: 0, height: 0 });

  readonly text$ = new BehaviorSubject<string>('');

  document = document;

  constructor(
    private renderer: Renderer2,
    private textEditorService: PebTextEditorService,
    private fontLoaderService: FontLoaderService,
  ) {}

  ngAfterViewInit() {
    this.iframeLoaded$.pipe(
      tap(() => {
        this.initIframe();
      }),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  get iframeDocument(): Document {
    return this.iframeRef?.nativeElement.contentDocument;
  }

  get iframeBody(): HTMLElement {
    return this.iframeRef?.nativeElement.contentDocument.body;
  }

  // TODO: deprecated?
  public selectContent(): void {
    const range = this.iframeRef?.nativeElement.contentDocument.createRange();
    range.selectNodeContents(this.iframeBody);
    const selection = this.iframeDocument.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  onIframeLoad() {
    this.iframeLoaded$.next();
  }

  private initIframe(): void {
    this.textEditorService.scale = this.scale;
    this.textEditorService.iframeDocument = this.iframeDocument;
    this.iframeBody.contentEditable = 'true';

    this.loadFonts();
    this.setInitialStyles();
    this.emitChanges().pipe(
      takeUntil(this.destroyed$),
    ).subscribe();

    this.text$.pipe(
      tap((text) => {
        this.iframeBody.innerHTML = text;
        this.moveCaretToEnd(this.iframeBody);
      }),
      takeUntil(this.destroyed$),
    ).subscribe();

    /** Reset pasted text html styles */
    fromEvent(this.iframeBody, 'paste').pipe(
      tap((e: any) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        this.iframeDocument.execCommand('insertHTML', false, text);
      }),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  private loadFonts() {
    const style = this.renderer.createElement('style');
    style.textContent = `
      .wf-loading body {
        color: transparent !important;
      }
      a, a:visited, a:hover, a:active {
        color: inherit;
        text-decoration: none;
      }
    `;
    this.iframeDocument.head.appendChild(style);
    this.fontLoaderService.renderFontLoader(this.iframeRef.nativeElement.contentWindow);
  }

  private setInitialStyles() {
    const textEditorStyles = {
      display: 'block',

      margin: '0',
      marginTop: '0',
      marginRight: this.styles.textAlign === 'center' ? 'auto' : '0',
      marginBottom: '0',
      marginLeft: this.styles.textAlign === 'center' ? 'auto' : '0',

      padding: '0',
      border: 'none',
      background: 'transparent',

      // TODO: temporary fix:
      //  max-content width prevents justify to work, but minWidth prevents to shrink on deleting text
      //  should be `unset` for buttons
      minWidth: this.minWidth,
      minHeight: 'unset',
      maxWidth: this.limits.width,

      width: 'max-content',
      height: 'max-content',
      fontSize: `${PEB_DEFAULT_FONT_SIZE}px`,
      overflow: 'hidden',
    };

    const noTransformProps = ['fontWeight'];

    Object.entries({ ...this.styles, ...textEditorStyles }).forEach(([key, value]) => {
      this.iframeBody.style[key] = noTransformProps.includes(key) ? value : transformStyleProperty(value, this.scale);
    });
  }

  private moveCaretToEnd(el: HTMLElement) {
    setTimeout(() => el.focus()); // TODO: check

    const range = this.textEditorService.iframeDocument.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = this.textEditorService.iframeDocument.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    this.focused.emit(null);
  }

  private emitChanges(): Observable<MutationRecord[] | Event> {
    return merge(
      observeTextMutation(this.iframeDocument.body).pipe(
        /** Skip initial text value */
        skip(this.skipFirst ? 1 : 0),
        tap(() => {
          const rect = this.iframeDocument.body.getBoundingClientRect();

          const nextWidth = Math.ceil(rect.width);
          const minWidth = Math.ceil(20 * this.scale);
          const maxWidth = Math.ceil(this.limits.width * this.scale);

          const nextHeight = Math.ceil(rect.height);
          const minHeight = Math.ceil(parseInt(this.styles.fontSize as string, 10));
          const maxHeight = Math.ceil(this.limits.height * this.scale);

          const scaledDimensions: Partial<DOMRect> = {
            width: Math.max(minWidth, Math.min(nextWidth, maxWidth)),
            height: Math.max(minHeight, Math.min(nextHeight, maxHeight)),
          };

          if (JSON.stringify(this.scaledDimensions$.value) !== scaledDimensions) {
            const dimensionsWithoutScale = {
              width: scaledDimensions.width / this.scale,
              height: scaledDimensions.height / this.scale,
            };

            this.scaledDimensions$.next(scaledDimensions);
            this.dimensionsChanged.emit(dimensionsWithoutScale);
          }

          if (this.text$.value !== this.iframeDocument.body.innerHTML) {
            this.textChanged.emit(pebResetScaleText(this.iframeDocument.body.innerHTML, this.scale));
          }

        }),
      ),
    );
  }
}

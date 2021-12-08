import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SafeHtml } from '@angular/platform-browser';
import { shareReplay } from 'rxjs/operators';

import { PEB_DEFAULT_FONT_FAMILY, PEB_DEFAULT_FONT_SIZE, scaleTextInnerFonts, transformStyleProperty } from '@pe/builder-core';
import { getBackgroundImage, PebAbstractElement, PebRendererOptions } from '@pe/builder-renderer';

import { PebEditorRenderer } from '../../renderer/editor-renderer';

@Component({
  selector: 'peb-element-text-maker',
  templateUrl: './text.maker.html',
  styleUrls: ['./text.maker.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebEditorTextMaker extends PebAbstractElement implements OnInit {

  private rendererOptions: PebRendererOptions;
  @Input() set options(options: PebRendererOptions) {
    this.rendererOptions = options;
    const scale = options.scale;
    const content = scale === 1 ? this.rawText : scaleTextInnerFonts(this.renderer, this.rawText, scale);
    this.sanitizedText$.next(this.sanitizer.bypassSecurityTrustHtml(content));
  }

  get options(): PebRendererOptions {
    return this.rendererOptions;
  }

  @Output() changes = new EventEmitter<boolean>();

  @ViewChild('iframeRef', { static: true }) iframeRef: ElementRef;
  @ViewChild('textEditorRef', { static: true }) textEditorRef: ElementRef;

  private editorRenderer = this.injector.get(PebEditorRenderer);

  content: string;

  limits: {
    width: number,
    height: number,
  };

  getLimits: () => { width: number, height: number };

  private readonly activeSubject$ = new BehaviorSubject<boolean>(false);

  get active$(): Observable<boolean> {
    return this.activeSubject$.pipe(shareReplay(1));
  }

  get active(): boolean {
    return this.activeSubject$.value;
  }

  set active(value: boolean) {
    this.activeSubject$.next(value);
  }

  get parent() {
    return this.editorRenderer.getElementComponent((this.element as any).parent.id)?.target;
  }

  get initialRect() {
    return this.nativeElement.getBoundingClientRect();
  }

  set initialRect(val) {
    // noop
  }

  sanitizedText$ = new BehaviorSubject<SafeHtml>(this.sanitizer.bypassSecurityTrustHtml(this.rawText));

  ngOnInit() {
    super.ngOnInit();
    this.content = this.element.data?.text ?? this.styles?.content;
  }

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();

    this.active = true;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.active || ['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
      return;
    }

    const isAlphanumeric = !event.metaKey
      && !event.ctrlKey
      && event.key.length === 1
      && new RegExp(/^[0-9a-zA-Z]+$/).test(event.key);

    if (!isAlphanumeric) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.styles.content = event.key;
    this.active = true;
  }

  get rawText(): string {
    return this.element?.data?.text ?? this.styles?.content;
  }

  onTextFocused() {
    // noop
  }

  onTextChanged(text: string) {
    this.content = text;
  }

  onDimensionsChanged(dimensions: Partial<DOMRect>) {
    this.styles = {
      ...this.styles,
      width: dimensions.width,
      height: dimensions.height,
    };

    this.nativeElement.style.width = `${dimensions.width * this.rendererOptions.scale}px`;
    this.nativeElement.style.height = `${dimensions.height * this.rendererOptions.scale}px`;
  }

  get elements(): { [key: string]: HTMLElement } {
    return {
      host: this.nativeElement,
    };
  }

  // TODO: Should be somehow shared with text element styles because it's 100% the same
  get mappedStyles() {
    const styles = this.styles as any;
    const { scale } = this.rendererOptions;

    return  {
      host: {
        position: styles.position ?? 'relative',
        display: styles.display ? styles.display : 'inline-block',
        color: styles.color,
        /**
         * To set global text font-size use <font style="size: ..."> wrapper
         *  otherwise will have a problem with line-height
         */
        fontSize: transformStyleProperty(PEB_DEFAULT_FONT_SIZE, scale),
        fontWeight: styles.fontWeight,
        justifyContent: styles.justifyContent || 'center',
        transform: styles.transform || null,
        background: styles.background ? styles.background : null,
        fontFamily: styles.fontFamily || PEB_DEFAULT_FONT_FAMILY,
        textDecoration: styles.textDecoration || null,
        boxShadow: styles.boxShadow || null,
        textShadow: styles.textShadow ? styles.textShadow : null,
        border: styles.border ? styles.border : null,
        alignItems: styles.alignItems ? styles.alignItems : null,
        backgroundImage: getBackgroundImage(styles.backgroundImage as string),

        ...('gridArea' in styles && { gridArea: styles.gridArea }),
        ...('gridRow' in styles && { gridRow: styles.gridRow }),
        ...('gridColumn' in styles && { gridColumn: styles.gridColumn }),
        ...('top' in styles && { top: transformStyleProperty(styles.top, scale) }),
        ...('left' in styles && { left: transformStyleProperty(styles.left, scale) }),
        ...('margin' in styles && { margin: transformStyleProperty(styles.margin, scale) }),
        ...('marginTop' in styles && { marginTop: transformStyleProperty(styles.marginTop, scale) }),
        ...('marginRight' in styles && { marginRight: transformStyleProperty(styles.marginRight, scale) }),
        ...('marginBottom' in styles && { marginBottom: transformStyleProperty(styles.marginBottom, scale) }),
        ...('marginLeft' in styles && { marginLeft: transformStyleProperty(styles.marginLeft, scale) }),
        ...('backgroundColor' in styles && { backgroundColor: styles.backgroundColor }),
        ...('backgroundRepeat' in styles && { backgroundRepeat: styles.backgroundRepeat }),
        ...('backgroundPosition' in styles && { backgroundPosition: styles.backgroundPosition }),

        padding: styles.padding ? transformStyleProperty(styles.padding, scale) : null,
        width: styles.width ? transformStyleProperty(styles.width, scale) : 'max-content',
        height: styles.height ? transformStyleProperty(styles.height, scale) : 'max-content',
        overflowWrap: styles.overflowWrap || null,


        textAlign: 'textAlign' in styles ? styles.textAlign : 'left',
        ...('fontStyle' in styles && { fontStyle: styles.fontStyle }),
        ...('textDecoration' in styles && { textDecoration: styles.textDecoration }),

        minWidth: styles.minWidth ? transformStyleProperty(styles.minWidth, scale) : 'initial',
        // SHOULD BE MIN WIDTH, BECAUSE OF EXPANDABLE CONTENT
        maxWidth: styles.minWidth ? transformStyleProperty(styles.minWidth, scale) : 'initial',

        minHeight: styles.minHeight ? transformStyleProperty(styles.minHeight, scale) : 'initial',
      },
    };
  }
}

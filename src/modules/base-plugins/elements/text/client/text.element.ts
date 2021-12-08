import { Component, ElementRef, HostBinding, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import {
  PebElementContext,
  PebElementDef,
  pebInteractionCreator,
  PebInteractionType,
  pebLinkDatasetLink,
  PEB_DEFAULT_FONT_FAMILY,
  PEB_DEFAULT_FONT_SIZE,
  scaleTextInnerFonts,
  transformStyleProperty,
} from '@pe/builder-core';
import { getBackgroundImage, PebAbstractElement, PebRendererOptions } from '@pe/builder-renderer';


@Component({
  selector: 'peb-element-text',
  templateUrl: './text.element.html',
  styleUrls: [
    '../../../../renderer/src/elements/_abstract/abstract.element.scss',
    './text.element.scss',
  ],
})
export class PebTextElement extends PebAbstractElement implements OnInit {
  @ViewChild('textContentRef') textContentRef: ElementRef;

  @Input() element: PebElementDef;
  @Input() context: PebElementContext<any>;

  private rendererOptions: PebRendererOptions;
  @Input() set options(options: PebRendererOptions) {
    this.rendererOptions = options;
    this.rendererOptionsChanged$.next();
  }

  get options() {
    return this.rendererOptions;
  }

  private rendererOptionsChanged$ = new ReplaySubject<void>(1);

  sanitizedText$ = new ReplaySubject<SafeHtml>(1);

  ngOnInit() {
    super.ngOnInit();
    this.rendererOptionsChanged$.pipe(
      tap(() => {
        const scale = this.options.scale;
        const content = scale === 1 ? this.rawText : scaleTextInnerFonts(this.renderer, this.rawText, scale);
        this.sanitizedText$.next(this.sanitizer.bypassSecurityTrustHtml(content));
      }),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  // TODO: check typings MouseEvent doesn't work with ssr
  @HostListener('click', ['$event'])
  onClick(e: any) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.options.interactions) {
      return;
    }

    const path = e.composedPath() as HTMLElement[];
    const linkNode = path.find(
      node => node.hasAttribute(pebLinkDatasetLink.type) && node.hasAttribute(pebLinkDatasetLink.payload),
    );

    if (linkNode) {
      const type = linkNode.getAttribute(pebLinkDatasetLink.type) as PebInteractionType;
      const payload = linkNode.getAttribute(pebLinkDatasetLink.payload);

      const interaction =
        type === PebInteractionType.NavigateInternal
          ? pebInteractionCreator.navigate.internal(payload)
          : type === PebInteractionType.NavigateExternal
            ? pebInteractionCreator.navigate.external(payload)
            : null;

      if (!interaction) {
        console.warn('There is no interaction creator for: ', this.element.data);
        return;
      }

      this.interact(interaction);
    }
  }

  @HostBinding('class.interactions')
  get classFrontPage(): boolean {
    return this.options.interactions;
  }

  private get rawText(): string {
    return this.element.data?.text ?? this.styles?.content;
  }

  get sanitizedText(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.rawText);
  }

  get potentialContainer() {
    return this.nativeElement;
  }

  get elements() {
    return {
      host: this.nativeElement,
    };
  }

  get textContent(): HTMLElement {
    return this.textContentRef.nativeElement;
  }

  // TODO: Should be somehow shared with text maker styles because it's 100% the same
  get mappedStyles() {
    const styles = this.styles as any;
    const { scale } = this.options;

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

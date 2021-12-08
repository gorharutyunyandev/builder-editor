import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { skip, takeUntil, tap } from 'rxjs/operators';

import {
  PebElementContext,
  PebElementDef,
  PebElementStyles,
  PEB_DEFAULT_FONT_COLOR,
  PEB_DEFAULT_FONT_SIZE,
  transformStyleProperty,
} from '@pe/builder-core';
import { PebAbstractMaker, PebEditorElement, PebTextMakerSidebarComponent } from '@pe/builder-editor';
import { PebRendererOptions } from '@pe/builder-renderer';

@Component({
  selector: 'peb-button-maker',
  templateUrl: './button.maker.html',
  styleUrls: ['./button.maker.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebEditorButtonMaker extends PebAbstractMaker implements OnInit {
  @Input() element: PebElementDef;
  @Input() context: PebElementContext<any>;
  @Input() options: PebRendererOptions;
  @Input() styles: PebElementStyles;

  @Input() initialRect: DOMRect;
  @Input() sidebarRef: ComponentRef<PebTextMakerSidebarComponent>;

  @Output() changes = new EventEmitter<any>();

  @ViewChild('iframeRef', { static: true }) iframeRef: ElementRef;
  @ViewChild('textEditorRef', { static: true }) textEditorRef: PebEditorElement;
  @ViewChild('CONTROLS', { static: true, read: ViewContainerRef }) controlsSlot: ViewContainerRef;

  dimensionsChanged$ = new Subject<Partial<DOMRect>>();

  ngOnInit() {
    this.dimensionsChanged$.pipe(
      skip(1),
      tap(value => this.updateDimensions(value)),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  get editorStyles() {
    return {
      ...this.mappedStyles.host,
      background: null,
      borderStyle: null,
      borderRadius: null,
      borderWidth: null,
    };
  }

  onTextChanged(text) {
    this.changes.emit(true);
    this.element.data.text = text;
  }

  private toInt(value: any): number | undefined {
    if (typeof value === 'string') {
      const int = parseInt(value, 10);
      return isNaN(int) ? undefined : int;
    }
    if (typeof value === 'number') {
      return value;
    }

    return undefined;
  }

  onDimensionsChanged(dimensions: Partial<DOMRect>): void {
    this.dimensionsChanged$.next(dimensions);
  }

  updateDimensions(dimensions: Partial<DOMRect>): void {
    let minWidth = this.toInt(this.styles.minWidth);
    let minHeight = this.toInt(this.styles.minHeight);

    if (!minWidth) {
      minWidth = this.toInt(this.styles.width) ?? 0;
      this.styles.minWidth = minWidth;
    }
    if (!minHeight) {
      minHeight = this.toInt(this.styles.height) ?? 0;
      this.styles.minHeight = minHeight;
    }

    const width = Math.max(dimensions.width, minWidth);
    const height = Math.max(dimensions.height, minHeight);

    this.styles = {
      ...this.styles,
      width: width / this.options.scale,
      height: height / this.options.scale,
    };

    this.nativeElement.style.width = `${width}px`;
    this.nativeElement.style.height = `${height}px`;
  }

  get elements(): { [key: string]: HTMLElement } {
    return {
      host: this.nativeElement,
    };
  }

  // TODO: Should be somehow reused from original button styles because it's 100% the same
  get mappedStyles(): any {
    const styles = this.styles;
    const { scale } = this.options;
    return  {
      host: {
        position: styles.position ?? 'relative',
        display: styles.display ?? 'inline-flex',
        textAlign: styles.textAlign ?? 'center',
        fontWeight: styles.fontWeight ?? 'normal',
        fontFamily: styles.fontFamily ?? 'Roboto',
        color: styles.color ?? '#FFF',
        justifyContent: styles.justifyContent ?? 'center',
        alignItems: styles.alignItems ?? 'center',
        cursor: this.options.interactions ? 'pointer' : 'normal',
        fontSize: transformStyleProperty(styles.fontSize || PEB_DEFAULT_FONT_SIZE, scale),
        width: styles.width ? transformStyleProperty(styles.width, scale) : 'max-content',
        height: styles.height ? transformStyleProperty(styles.height, scale) : 'max-content',
        backgroundColor: 'backgroundColor' in styles
          ? styles.backgroundColor
          : 'background' in styles
            ? styles.background
            : PEB_DEFAULT_FONT_COLOR,
        minWidth: styles.minWidth ? transformStyleProperty(styles.minWidth, scale) : 'initial',
        maxWidth: styles.maxWidth ? transformStyleProperty(styles.maxWidth, scale) : 'initial',
        minHeight: styles.minHeight ? transformStyleProperty(styles.minHeight, scale) : 'initial',
        ...('zIndex' in styles && { zIndex: styles.zIndex }),
        ...('lineHeight' in styles && { lineHeight: styles.lineHeight }),
        ...('textDecoration' in styles && { textDecoration: styles.textDecoration }),
        ...('fontStyle' in styles && { fontStyle: styles.fontStyle }),
        ...('borderRadius' in styles && { borderRadius: transformStyleProperty(styles.borderRadius, scale) }),
        ...('top' in styles && { top: transformStyleProperty(styles.top, scale) }),
        ...('left' in styles && { left: transformStyleProperty(styles.left, scale) }),
        ...('transform' in styles && { transform: styles.transform }),
        ...('margin' in styles && { margin: transformStyleProperty(styles.margin, scale) }),
        ...('overflow' in styles && { overflow: styles.overflow }),
        ...('whiteSpace' in styles && { whiteSpace: styles.whiteSpace }),
        ...('textOverflow' in styles && { textOverflow: styles.textOverflow }),
        ...('gridArea' in styles && { gridArea: styles.gridArea }),
        ...('gridRow' in styles && { gridRow: styles.gridRow }),
        ...('gridColumn' in styles && { gridColumn: styles.gridColumn }),
        ...('boxShadow' in styles && { boxShadow: transformStyleProperty(styles.boxShadow, scale) }),
        ...('margin' in styles && { margin: transformStyleProperty(styles.margin, scale) }),
        ...('marginTop' in styles && { marginTop: transformStyleProperty(styles.marginTop, scale) }),
        ...('marginRight' in styles && { marginRight: transformStyleProperty(styles.marginRight, scale) }),
        ...('marginBottom' in styles && { marginBottom: transformStyleProperty(styles.marginBottom, scale) }),
        ...('marginLeft' in styles && { marginLeft: transformStyleProperty(styles.marginLeft, scale) }),
        ...('padding' in styles && { padding: transformStyleProperty(styles.padding, scale) }),
        // Rob asked to remove temporary borders from button element
        // borderStyle: styles.borderStyle ? styles.borderStyle : null ,
        // borderColor: styles.borderColor || null,
        // borderWidth: styles.borderWidth ? (+styles.borderWidth * scale + 'px') : null,
      },
    };
  }
}

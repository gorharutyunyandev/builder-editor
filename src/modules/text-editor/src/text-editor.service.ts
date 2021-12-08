import { delay, filter, map, retryWhen, shareReplay, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { PebInteractionWithPayload } from '@pe/builder-core';

import { boldTransform } from './transforms/bold.transform';
import { linkTransform } from './transforms/link.transform';
import { fontFamilyTransform } from './transforms/font-family.transform';
import { TextJustify } from './text-editor.interface';
import { colorTransform } from './transforms/color.transform';
import { italicTransform } from './transforms/italic.transform';
import { underlineTransform } from './transforms/underline.transform';
import { strikeThroughTransform } from './transforms/strike-through.transform';
import { fontSizeTransform } from './transforms/font-size.transform';
import { justifyTransform } from './transforms/justify.transform';

export interface PebTextEditorStyles {
  link: PebInteractionWithPayload<string>;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeThrough: boolean;
  fontSize: number;
  justify: TextJustify;
}

@Injectable({ providedIn: 'root' })
export class PebTextEditorService {

  private readonly scaleSubject$ = new BehaviorSubject<number>(1);

  get scale$(): Observable<number> {
    return this.scaleSubject$.asObservable();
  }

  get scale(): number {
    return this.scaleSubject$.value;
  }

  set scale(scale: number) {
    this.scaleSubject$.next(scale);
  }

  private readonly iframeDocumentSubject$ = new BehaviorSubject<Document>(null);

  get iframeDocument$(): Observable<Document> {
    return this.iframeDocumentSubject$.asObservable();
  }

  get iframeDocument(): Document {
    return this.iframeDocumentSubject$.value;
  }

  set iframeDocument(doc: Document) {
    this.iframeDocumentSubject$.next(doc);
  }

  get selection$(): Observable<Selection> {
    return this.iframeDocument$.pipe(
      filter(doc => !!doc),
      switchMap(doc =>
        fromEvent(doc, 'selectionchange').pipe(
          map(_ => doc.getSelection()),
        ),
      ),
    );
  }

  get styles$(): Observable<PebTextEditorStyles> {
    return this.selection$.pipe(
      shareReplay(1),
      /** Wait for parent styles to propagate to selection */
      map<Selection, PebTextEditorStyles>(() => {
        const selectionStyles: PebTextEditorStyles = this.styles;

        // TODO: Fix utils.transform rgbToHex
        if (selectionStyles.color === '#NaN0000') {
          throw new Error();
        }

        return selectionStyles;
      }),
      retryWhen(errors => errors.pipe(delay(100), take(3))),
      shareReplay(1),
    );
  }

  get styles(): PebTextEditorStyles {
    return {
      link: this.link,
      fontFamily: this.fontFamily,
      color: this.color,
      bold: this.bold,
      italic: this.italic,
      underline: this.underline,
      strikeThrough: this.strikeThrough,
      fontSize: this.fontSize,
      justify: this.justify,
    };
  }

  private get link(): PebInteractionWithPayload<string> {
    return linkTransform.get(this.iframeDocument);
  }

  changeLink(value: PebInteractionWithPayload<string>) {
    linkTransform.change(this.iframeDocument, value);
  }

  private get fontFamily(): string {
    return fontFamilyTransform.get(this.iframeDocument);
  }

  changeFontFamily(value: string) {
    fontFamilyTransform.change(this.iframeDocument, value);
  }

  private get color(): string {
    return colorTransform.get(this.iframeDocument);
  }

  changeColor(value: string) {
    colorTransform.change(this.iframeDocument, value);
  }

  private get bold(): boolean {
    return boldTransform.get(this.iframeDocument);
  }

  toggleBold(): void {
    boldTransform.toggle(this.iframeDocument);
  }

  private get italic(): boolean {
    return italicTransform.get(this.iframeDocument);
  }

  toggleItalic(): void {
    italicTransform.toggle(this.iframeDocument);
  }

  private get underline(): boolean {
    return underlineTransform.get(this.iframeDocument);
  }

  toggleUnderline(): void {
    underlineTransform.toggle(this.iframeDocument);
  }

  private get strikeThrough(): boolean {
    return strikeThroughTransform.get(this.iframeDocument);
  }

  toggleStrikeThrough(): void {
    strikeThroughTransform.toggle(this.iframeDocument);
  }

  private get fontSize(): number {
    return Math.ceil(fontSizeTransform.get(this.iframeDocument) / this.scale);
  }

  changeFontSize(value: number) {
    fontSizeTransform.change(this.iframeDocument, value * this.scale);
  }

  private get justify(): TextJustify {
    return justifyTransform.get(this.iframeDocument);
  }

  changeJustify(value: TextJustify): void {
    justifyTransform.change(this.iframeDocument, value);
  }

}


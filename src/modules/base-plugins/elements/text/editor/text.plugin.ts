import { Inject, Injectable, Injector } from '@angular/core';
import { EMPTY, merge, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  finalize,
  map,
  pluck,
  skipWhile,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { AbstractControl, Validators } from '@angular/forms';
import { isEmpty, isEqual, isObject, transform } from 'lodash';

import { pebCreateLogger, PebElementType, pebFontFamilies, PebInteractionType, PebPageType } from '@pe/builder-core';
import { PebTextEditorService, PebTextEditorStyles } from '@pe/builder-text-editor';
import {
  AbstractEditElementPlugin,
  AfterGlobalInit,
  EDITOR_ENABLED_MAKERS,
  PebEditorElementText,
  PebEditorTextMaker,
  replaceElementWithMaker,
  TextJustifyValue,
} from '@pe/builder-editor';

import { PebEditorTextSidebarComponent } from './text.sidebar';

const log = pebCreateLogger('editor:plugins:edit-logo');

@Injectable()
export class PebEditorTextPlugin extends AbstractEditElementPlugin<PebEditorTextSidebarComponent>
  implements AfterGlobalInit {
  static elementTypes = [PebElementType.Text];

  sidebarComponent = PebEditorTextSidebarComponent;

  logger = { log };

  constructor(
    injector: Injector,
    @Inject(EDITOR_ENABLED_MAKERS) private makers: any, // TODO: add type
    private textEditorService: PebTextEditorService,
  ) {
    super(injector);
  }

  afterGlobalInit(): Observable<any> {
    return this.singleElementOfTypeSelected().pipe(
      switchMap((elCmp: PebEditorElementText) => {
        const maker = this.replaceElementWithMaker(elCmp);

        this.initPositionForm(maker);
        this.initDimensionsForm(maker);
        this.initLinksForm(maker);
        this.initMakerFontForm(maker);
        this.initBackgroundForm(maker);

        const sidebarRef = this.initSidebar(maker);

        this.initAlignmentForm(sidebarRef);

        const rendererMaker: PebEditorTextMaker = (this.renderer?.maker as any)?.instance;

        return merge(
          rendererMaker.active$.pipe(tap((active: boolean) => this.state.makerActive = active)),
          this.handleAlignmentForm(maker, sidebarRef),
          this.handlePositionForm(maker),
          this.handleDimensionsForm(maker),
          this.handleMakerFontForm(maker),
          this.handleBackgroundForm(maker, sidebarRef),
          this.handleMakerLinksForm(maker),
        ).pipe(
          takeUntil(merge(
            this.state.selectionChanged$(),
            this.state.screenChanged$,
          )),
          finalize(() => {
            const actualComponent = this.renderer.getElementComponent(elCmp.definition.id);
            const prevDefinition = actualComponent.definition;
            const prevStyles = actualComponent.styles;

            const nextDefinition = {
              ...maker.definition,
              data: {
                ...maker.definition.data,
                text: (maker.target as PebEditorTextMaker).content,
              },
            };
            const nextStyles = maker.styles;

            const diffDefinition = this.difference(prevDefinition, nextDefinition);
            const diffStyles = this.difference(prevStyles, nextStyles);

            if (!isEmpty(diffDefinition) || !isEmpty(diffStyles)) {
              elCmp.definition.data.text = (maker.target as PebEditorTextMaker).content;

              this.store.updateElementKit(
                this.state.screen,
                nextDefinition,
                { [elCmp.definition.id]: nextStyles },
              );
            }

            if (this.renderer.maker?.instance?.element?.id === elCmp.definition.id) {
              this.destroyMaker();
            }

            sidebarRef.destroy();
          }),
        );
      }),
    );
  }

  protected initLinksForm(elementCmp: PebEditorElementText) {
    const initialValue = {
      type: null,
      payload: null,
    };

    const snapshot = this.store.snapshot;

    elementCmp.links = {
      initialValue,
      options: {
        linkTypes: [
          { label: 'None', value: 'none' },
          { label: 'Page', value: PebInteractionType.NavigateInternal },
          { label: 'Custom Link', value: PebInteractionType.NavigateExternal },
        ],
        [PebInteractionType.NavigateInternal]: snapshot.shop.routing.reduce(
          (acc, route) => {
            if (snapshot.pages[route?.pageId]?.type !== PebPageType.Master) {
              acc.push({ label: route.url, value: route.routeId });
            }
            return acc;
          },
          [],
        ),
      },
      form: this.formBuilder.group({
        type: initialValue.type,
        payload: initialValue.payload,
      }),
      update: null,
      submit: new Subject<void>(),
    };
  }

  protected initMakerFontForm(elementCmp: PebEditorElementText) {
    const initialValue = {
      fontFamily: null,
      fontWeight: null,
      fontStyle: null,
      textDecoration: null,
      fontSize: null,
      color: null,
      justify: TextJustifyValue.Left,
    };

    elementCmp.font = {
      initialValue,
      options: {
        fontFamilies: pebFontFamilies,
      },
      form: this.formBuilder.group({
        fontFamily: [initialValue.fontFamily],
        fontWeight: [initialValue.fontWeight],
        fontStyle: [initialValue.fontStyle],
        textDecoration: [initialValue.textDecoration],
        fontSize: [initialValue.fontSize, [Validators.min(1), Validators.max(100)]],
        color: [initialValue.color],
        justify: [initialValue.justify],
      }),
      update: null,
      submit: new Subject<void>(),
    };
  }

  private handleMakerLinksForm(maker: PebEditorElementText): Observable<any> {
    if (!maker.links?.form) {
      return EMPTY;
    }

    return merge(
      this.textEditorService.styles$.pipe(
        pluck('link'),
        tap((value) => {
          const link = value ?? { type: 'none', payload: null };
          (maker.links.form as AbstractControl).patchValue(link, { emitViewToModelChange: true });
        }),
      ),
      maker.links.form.valueChanges.pipe(
        map(value => ({
          type: value && value.type !== 'none' ? value.type : 'none',
          payload: value && (value.payload as string) !== 'null' ? value.payload : null,
        })),
        tap((nextValue) => {
          const link = this.textEditorService.styles.link;
          if (link && link.type !== nextValue.type && link.payload !== nextValue.payload) {
            (maker.links.form as AbstractControl).patchValue({ payload: null }, { emitViewToModelChange: false });
          } else if (!nextValue.type || (nextValue.type && nextValue.payload)) {
            const value = nextValue.type !== 'none' ? (nextValue.payload ? nextValue : null) : null;
            this.textEditorService.changeLink(value);
          }
        }),
      ),
    );
  }

  private handleMakerFontForm(maker: PebEditorElementText): Observable<PebTextEditorStyles | never> {
    if (!maker.font?.form) {
      return EMPTY;
    }

    return merge(
      this.textEditorService.styles$.pipe(
        tap((selectionStyles) => {
          (maker.font.form as AbstractControl).patchValue(
            {
              fontFamily: selectionStyles.fontFamily,
              fontSize: selectionStyles.fontSize,
              color: selectionStyles.color,
              fontWeight: selectionStyles.bold ? 'bold' : 'normal',
              fontStyle: selectionStyles.italic ? 'italic' : 'normal',
              textDecoration: `${selectionStyles.underline ? 'underline ' : ''}${selectionStyles.strikeThrough ? 'line-through ' : ''}`,
              justify: selectionStyles.justify,
            },
            { emitViewToModelChange: false },
          );
        })),
      maker.font.form.valueChanges.pipe(
        filter(() => !maker.font.form.invalid),
        tap((value) => {
          const currentStyles = this.textEditorService.styles;
          const textDecoration = (value.textDecoration as string).split(' ');
          const nextStyles: Partial<PebTextEditorStyles> = {
            fontFamily: value.fontFamily,
            fontSize: value.fontSize,
            color: value.color,
            bold: value.fontWeight === 'bold',
            italic: value.fontStyle === 'italic',
            underline: !!textDecoration.find(decoration => decoration === 'underline'),
            strikeThrough: !!textDecoration.find(decoration => decoration === 'line-through'),
            justify: value.justify,
          };

          if (nextStyles.fontFamily !== currentStyles?.fontFamily) {
            this.textEditorService.changeFontFamily(nextStyles.fontFamily);
          }

          if (nextStyles.color !== currentStyles.color) {
            this.textEditorService.changeColor(nextStyles.color);
          }

          if (nextStyles.fontSize !== currentStyles.fontSize) {
            this.textEditorService.changeFontSize(nextStyles.fontSize);
          }

          if (nextStyles.bold !== currentStyles.bold) {
            this.textEditorService.toggleBold();
          }

          if (nextStyles.italic !== currentStyles.italic) {
            this.textEditorService.toggleItalic();
          }

          if (nextStyles.underline !== currentStyles.underline) {
            this.textEditorService.toggleUnderline();
          }

          if (nextStyles.strikeThrough !== currentStyles.strikeThrough) {
            this.textEditorService.toggleStrikeThrough();
          }

          if (nextStyles.justify !== currentStyles.justify) {
            this.textEditorService.changeJustify(nextStyles.justify);
          }
        }),
      ),
    );
  }

  private replaceElementWithMaker(elCmp: PebEditorElementText): PebEditorElementText {
    return replaceElementWithMaker(
      elCmp,
      this.editor,
      this.renderer,
      this.makers,
      null,
      this.state.scale,
    );
  }

  private destroyMaker(): void {
    this.renderer.cleanMaker();
    this.state.makerActive = false;
  }

  private difference(object, base) {
    // tslint:disable-next-line:no-shadowed-variable
    function changes(object, base) {
      return transform(object, (result, value, key) => {
        if (!isEqual(value, base[key])) {
          result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
        }
      });
    }
    return changes(object, base);
  }
}

import { Inject, Injectable } from '@angular/core';
import { merge, Observable, of } from 'rxjs';
import { filter, first, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { ContextService, PebElementType, pebGenerateId, PebScreen, PEB_DEFAULT_FONT_SIZE } from '@pe/builder-core';
import {
  AfterGlobalInit,
  getNextParentElement,
  movingTransformations,
  PebAbstractEditor,
  PebActionResponse,
  PebEditorAccessorService,
  PebEditorCommand,
  PebEditorRenderer,
  PebEditorState,
  PebEditorStore,
  PebElementKit,
  PEB_EDITOR_STATE,
} from '@pe/builder-editor';

const OBJECT_COLOR = '#d4d4d4';
const BG_COLOR = '#ffffff';

const DEFAULT_STYLES = {
  [PebElementType.Products]: {
    height: 280,
    width: 220,
    productTemplateColumns: 1,
    productTemplateRows: 1,
  },
};

interface SetStyle {
  text?: string;
  width?: number;
  height?: number;
}

const CONTEXT_COMPANY_METHODS = {
  [PebElementType.Logo]: 'getLogo',
};

const CONTEXT_COMPANY_PARAMS = {
  [PebElementType.Logo]: [],
};

@Injectable()
export class PebEditorAddElementPlugin implements AfterGlobalInit {

  get editor(): PebAbstractEditor {
    return this.editorAccessorService.editorComponent;
  }

  private get createElement$() {
    return this.editor.commands$.pipe(
      filter((command: PebEditorCommand) => command.type === 'createElement'),
      map((command: PebEditorCommand) => command.params),
    );
  }

  constructor(
    private editorAccessorService: PebEditorAccessorService,
    @Inject(PEB_EDITOR_STATE) protected state: PebEditorState,
    private renderer: PebEditorRenderer,
    private store: PebEditorStore,
  ) {
  }

  afterGlobalInit(): Observable<any> {
    return merge(
      this.addSimpleElement(),
      // TODO: Fix

      this.addMenuElement(),
      // TODO: Fix

      this.addCarouselElement(),
      this.addButton(),
      this.addProductCategoriesAndDetails(),
      this.addText(),
      this.addProducts(),
      this.addLogo(),
    );
  }

  private addSimpleElement(): Observable<void> {
    return this.createElement$.pipe(
      filter(
        elType => elType.type === PebElementType.Shape
          || elType.type === PebElementType.Line
          || elType.type === PebElementType.Script
          || elType.type === PebElementType.Html
          || elType.type === PebElementType.Video
          || elType.type === PebElementType.Image
          || elType.type === PebElementType.Cart
          || elType.type === PebElementType.SocialIcon,
      ),
      switchMap((element) => {
        const parentDef = this.editor.getNewElementParent();
        const parentCmp = this.renderer.getElementComponent(parentDef.id);

        const parentTransforms = parentCmp.potentialContainer && movingTransformations[parentDef.type](
          parentCmp.definition, parentCmp.styles,
        );

        const newElementKit = {
          ...this.createElement(
            element.type,
            element.variant,
            {
              ...element.style,
              backgroundColor: OBJECT_COLOR,
              // TODO: Remove after properly tracking margins
              margin: '0 0 0 0',
              content: 'Text content',
            },
            {
              ...element.data,
            },
          ),
          contextSchema: null,
        };

        return this.store.appendElement(parentDef.id, newElementKit, parentTransforms).pipe(
          switchMap(() => this.renderer.rendered),
          first(),
          tap(() => {
            this.state.selectedElements = [newElementKit.element.id];
          }),
        );
      }),
    );
  }

  // TODO: Adapt this
  /** @deprecated */
  addMenuElement() {
    return this.createElement$.pipe(
      filter(elType => elType.type === PebElementType.Menu),
      mergeMap(element =>
        getNextParentElement(
          this.state,
          this.renderer,
          this.editor,
        ).pipe(
          map(parentElement => ({ ...element, parentElement })),
        ),
      ),
      switchMap(({ parentElement, type, variant, style }) => {
        const parentNode = parentElement.nativeElement;
        const parentRect = parentNode.getBoundingClientRect();

        return this.store.appendElement(parentElement.definition.id, {
          ...this.createElement(
            type,
            variant,
            {
              ...style,
              width: this.state.screen === PebScreen.Desktop ? 400 : 40,
              height: 40,
              fontSize: 16,
              fontFamily: 'Roboto',
              backgroundColor: 'transparent',
            },
            {
              routes: [{
                title: 'Page',
              }],
            },
          ),
          contextSchema: null,
        });
      }),
    );
  }

  // TODO: Adapt this
  /** @deprecated */
  addCarouselElement() {
    return this.createElement$.pipe(
      filter(elType => elType.type === PebElementType.Carousel),
      mergeMap(element =>
        getNextParentElement(
          this.state,
          this.renderer,
          this.editor,
        ).pipe(
          map(parentElement => ({ ...element, parentElement }))),
      ),
      switchMap(({ parentElement, type, variant, style }) => {
        const parentNode = parentElement.nativeElement;
        const parentRect = parentNode.getBoundingClientRect();

        return this.store.appendElement(parentElement.definition.id, {
          ...this.createElement(
            type,
            variant, {
              ...style,
              width: 0.6 * parentRect.width / this.state.scale,
              height: 0.6 * parentRect.height / this.state.scale,
            },
            {
              images: [],
            },
          ),
          contextSchema: null,
        });
      }),
    );
  }

  addButton() {
    return this.createElement$.pipe(
      filter(elType => elType.type === PebElementType.Button),
      switchMap((element) => {
        const parentDef = this.editor.getNewElementParent();
        const parentCmp = this.renderer.getElementComponent(parentDef.id);

        const parentTransforms = parentCmp.potentialContainer && movingTransformations[parentDef.type](
          parentCmp.definition, parentCmp.styles,
        );

        const newElementKit = {
          ...this.createElement(
            element.type,
            element.variant,
            {
              ...element.style,
              width: 80,
              height: 20,
              // padding: 10,
              backgroundColor: OBJECT_COLOR,
              // TODO: Remove after properly tracking margins
              margin: '0 0 0 0',
            },
            { text: 'Button text' },
          ),
          contextSchema: null,
        };

        return this.store.appendElement(parentDef.id, newElementKit, parentTransforms).pipe(
          switchMap(() => this.renderer.rendered),
          first(),
          tap(() => {
            this.state.selectedElements = [newElementKit.element.id];
          }),
        );
      }),
    );
  }

  addText() {
    return this.createElement$.pipe(
      filter(elType => elType.type === PebElementType.Text),
      switchMap((element) => {
        const parentDef = this.editor.getNewElementParent();
        const parentCmp = this.renderer.getElementComponent(parentDef.id);

        const parentTransforms = parentCmp.potentialContainer && movingTransformations[parentDef.type](
          parentCmp.definition, parentCmp.styles,
        );

        const newElementKit = {
          ...this.createElement(
            element.type,
            element.variant,
            {
              ...element.style,
              width: 32,
              height: 18,
              fontSize: PEB_DEFAULT_FONT_SIZE,
              fontWeight: 'bold',
              // TODO: Remove after properly tracking margins
              margin: '0 0 0 0',
            },
            {
              text: 'Text',
              sync: false,
            },
          ),
          contextSchema: null,
        };

        Object.values(newElementKit.styles).forEach((styles) => {
          delete (styles as any).backgroundColor;
        });

        return this.store.appendElement(parentDef.id, newElementKit, parentTransforms).pipe(
          switchMap(() => this.renderer.rendered),
          first(),
          tap(() => {
            this.state.selectedElements = [newElementKit.element.id];
          }),
        );
      }),
    );
  }

  public addSection(newElement: any): Observable<PebActionResponse> {
    return of(newElement).pipe(
      switchMap(({ type, variant, style, setAfter }) => {
        const documentId = this.renderer.element.id;

        let selectedIds = this.state.selectedElements;
        if (!selectedIds.length) {
          // Get id of first children element
          const children = this.renderer.element.children;
          selectedIds = children && children.length ? [this.renderer.element.children[0].id] : [];
        }


        const setAfterWidget = this.renderer.getElementComponent(documentId);
        const parentNode = setAfterWidget.nativeElement;
        const parentRect = parentNode.getBoundingClientRect();
        const section = {
          element: {
            id: pebGenerateId('element'),
            type: PebElementType.Section,
            data: { name: 'Section' },
            meta: { deletable: true },
            children: [],
          },
          styles: {
            ...this.createStyles(PebElementType.Section, style),
            width: 0.6 * parentRect.width / this.state.scale,
            height: 0.6 * parentRect.height / this.state.scale,
          },
        };
        return this.store.setBeforeElement(
          documentId,
          {
            ...section,
            contextSchema: null,
          },
          setAfter ? null : selectedIds[0],
        );
      }),
    );
  }

  addProducts() {
    return this.createElement$.pipe(
      filter(
        elType => elType.type === PebElementType.Products,
      ),
      mergeMap(element =>
        getNextParentElement(
          this.state,
          this.renderer,
          this.editor,
        ).pipe(
          map(parentElement => ({ ...element, parentElement }))),
      ),
      switchMap(({ parentElement, type, variant, data }) => {

        if (!parentElement || !parentElement.definition) {
          return;
        }

        return this.store.appendElement(parentElement.definition.id, {
          ...this.createElement(
            type,
            variant,
            {
              ...(DEFAULT_STYLES[type]),
            },
            data,
          ),
          contextSchema: {},
        });
      }),
    );
  }

  addLogo() {
    return this.createElement$.pipe(
      filter(
        elType => elType.type === PebElementType.Logo,
      ),
      switchMap((element) => {
        const parentDef = this.editor.getNewElementParent();
        const parentCmp = this.renderer.getElementComponent(parentDef.id);

        const parentTransforms = parentCmp.potentialContainer && movingTransformations[parentDef.type](
          parentCmp.definition, parentCmp.styles,
        );

        const shopContextSchema = this.store.snapshot.contextSchemas[this.store.snapshot.shop.contextId];
        const usedBy: string[] = shopContextSchema['#logo']?.usedBy ?? [];

        const nextElement = this.createElement(
          element.type,
          element.variant,
          {
            ...element.style,
            backgroundColor: OBJECT_COLOR,
            margin: '0 0 0 0',
          },
          element.data,
        );

        const newElementKit: PebElementKit = {
          ...nextElement,
          contextSchema: {
            service: ContextService.Company,
            method: CONTEXT_COMPANY_METHODS[PebElementType.Logo],
            params: CONTEXT_COMPANY_PARAMS[PebElementType.Logo],
            usedBy: [...usedBy, nextElement.element.id],
          },
          rootContextKey: '#logo',
        };

        return this.store.appendElement(parentDef.id, newElementKit, parentTransforms).pipe(
          switchMap(() => this.renderer.rendered),
          first(),
          tap(() => this.state.selectedElements = [newElementKit.element.id]),
        );
      }),
    );
  }

  addProductCategoriesAndDetails() {
    return this.createElement$.pipe(
      filter(
        elType => elType.type === PebElementType.ProductDetails
          || elType.type === PebElementType.ProductCatalog,
      ),
      mergeMap(element =>
        getNextParentElement(
          this.state,
          this.renderer,
          this.editor,
        ).pipe(
          map(parentElement => ({ ...element, parentElement }),
        )),
      ),
      switchMap(({ parentElement, type, variant, style, data }) => {
        if (!parentElement || !parentElement.definition) {
          return;
        }

        return this.store.appendElement(parentElement.definition.id, {
          ...this.createElement(type, variant, style, data),
          contextSchema: null,
        });
      }),
    );
  }

  private createElement(type: PebElementType, objectType?: string, style?: SetStyle, data?) {
    return {
      element: {
        type,
        id: pebGenerateId(),
        data: {
          variant: objectType,
          ...data,
          text: data?.text || '',
        },
        children: [],
      },
      styles: this.createStyles(type, style),
    };
  }

  private createStyles(type: PebElementType, style?: SetStyle) {
    const screens: PebScreen[] = [this.state.screen];

    // TODO: Fix
    // tslint:disable-next-line: no-use-before-declare
    if (type in initialElementStyles) {
      return {
        [PebScreen.Desktop]: { display: 'none' },
        [PebScreen.Tablet]: { display: 'none' },
        [PebScreen.Mobile]: { display: 'none' },
        ...screens.reduce((acc, screen: PebScreen) => {
          // tslint:disable-next-line: no-use-before-declare
          acc[screen] = { ...initialElementStyles[type] };
          return acc;
        },                {}),
      };
    }

    // TODO: Fix
    // tslint:disable-next-line: no-parameter-reassignment
    style = type === PebElementType.Cart ? { ...style, width: 125 } : style;

    return {
      [PebScreen.Desktop]: { display: 'none' },
      [PebScreen.Tablet]: { display: 'none' },
      [PebScreen.Mobile]: { display: 'none' },
      ...screens.reduce((acc, screen: PebScreen) => {
        acc[screen] = {
          ...(type !== PebElementType.Section && { backgroundColor: BG_COLOR }),
          width: style?.width ?? 100,
          height: style?.height ?? 100,
          ...style,
        };
        return acc;
      },                {}),
    };
  }
}

const initialElementStyles = {
  [PebElementType.Line]: screen => ({
    [PebScreen.Desktop]: { display: 'none' },
    [PebScreen.Tablet]: { display: 'none' },
    [PebScreen.Mobile]: { display: 'none' },
    [screen]: {
      backgroundColor: BG_COLOR,
      width: 100,
      height: 1,
    },
  }),
};

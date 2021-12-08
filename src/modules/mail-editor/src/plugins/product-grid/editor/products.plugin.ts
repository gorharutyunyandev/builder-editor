import { ComponentRef, Injectable, Injector } from '@angular/core';
import { BehaviorSubject, EMPTY, merge, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  pairwise,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { isEqual } from 'lodash';
import { FormGroup, Validators } from '@angular/forms';

import { pebCreateLogger, PebElementStyles, PebElementType, PEB_DEFAULT_FONT_FAMILY } from '@pe/builder-core';
import {
  AbstractEditElementPlugin,
  AfterGlobalInit,
  Axis,
  DimensionsFormValues,
  PebEditorElement,
  SidebarSelectOption,
} from '@pe/builder-editor';

import { PebEditorProductsSidebarComponent } from './products.sidebar';
import { ProductsDimensionsBehavior } from './products-dimensions.behavior';
import { ProductUtils } from './products.utils';

const log = pebCreateLogger('shop-editor:plugins:edit-products');

const DEFAULT_TITLE_COLOR = '#000';
const DEFAULT_PRICE_COLOR = '#a5a5a5';
const DEFAULT_TITLE_FONT_WEIGHT = 'bold';
const DEFAULT_PRICE_FONT_WEIGHT = 'normal';
const DEFAULT_FONT_SIZE = 13;

enum ProductsFontTypes {
  Title = 'title',
  Price = 'price',
}

const DEFAULT_COLORS = {
  [ProductsFontTypes.Title]: DEFAULT_TITLE_COLOR,
  [ProductsFontTypes.Price]: DEFAULT_PRICE_COLOR,
};

const DEFAULT_FONT_WEIGHTS = {
  [ProductsFontTypes.Title]: DEFAULT_TITLE_FONT_WEIGHT,
  [ProductsFontTypes.Price]: DEFAULT_PRICE_FONT_WEIGHT,
};

export interface Font {
  initialValue: {
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
    fontSize: number;
    color: string;
  };
  form: FormGroup;
  options: {
    fontFamilies: SidebarSelectOption[];
    type: ProductsFontTypes;
  };
  update: () => void;
  submit: Subject<any>;
}

export interface ProductDimensions {
  initialValue: { width: number; height: number };
  form: FormGroup;
  limits: {
    width: BehaviorSubject<{ min: number; max: number }>;
    height: BehaviorSubject<{ min: number; max: number }>;
  };
  activate: () => void;
  update: () => void;
  submit: Subject<any>;
}

const PRODUCTS_MARGIN = 15;

@Injectable()
export class PebEditorMailProductsPlugin extends AbstractEditElementPlugin<PebEditorProductsSidebarComponent>
  implements AfterGlobalInit {
  static elementTypes = [PebElementType.Products];

  sidebarComponent = PebEditorProductsSidebarComponent;

  logger = { log };

  behaviourState: {
    sidebarRef: ComponentRef<PebEditorProductsSidebarComponent>;
    activeElement: PebEditorElement;
  } = {
    sidebarRef: null,
    activeElement: null,
  };

  constructor(
    private productsDimensionsBehavior: ProductsDimensionsBehavior,
    private productUtils: ProductUtils,
    injector: Injector,
  ) {
    super(injector);
  }

  afterGlobalInit(): Observable<any> {
    return this.singleElementOfTypeSelected().pipe(
      switchMap((elCmp) => {
        const sidebarRef = this.initSidebar(elCmp) as ComponentRef<PebEditorProductsSidebarComponent>;
        const sidebar = sidebarRef.instance;
        sidebar.context = elCmp.context;
        this.initShadowForm(elCmp);
        this.initPositionForm(elCmp);
        this.initDimensionsForm(elCmp);
        this.productsDimensionsBehavior.initDimensionsForm(elCmp);

        sidebar.priceFont = this.initProductFontForm(elCmp.styles, ProductsFontTypes.Price);
        sidebar.titleFont = this.initProductFontForm(elCmp.styles, ProductsFontTypes.Title);

        this.initAlignmentForm(sidebarRef);

        return merge(
          this.handleAlignmentForm(elCmp, sidebarRef),
          this.productsGridFlow(elCmp, sidebar),
          this.handleShadowForm(elCmp),
          this.handleProductsStyleChanges(elCmp, sidebar),
          this.handleProductFontForm(elCmp, sidebar.priceFont),
          this.handleProductFontForm(elCmp, sidebar.titleFont),
          this.handlePositionForm(elCmp),
          this.handleProductsDimensionsForm(elCmp),
          this.productsDimensionsBehavior.handleDimensionsForm(elCmp),
          this.handleDeleteProducts(elCmp, sidebar),
        ).pipe(
          takeUntil(this.state.selectionChanged$()),
          finalize(() => sidebarRef.destroy()),
        );
      }),
    );
  }

  private handleProductsDimensionsForm(elCmp: PebEditorElement): Observable<any> {
    const elDef = elCmp.definition;
    const dimensions = elCmp.dimensions;

    if (!dimensions) {
      return EMPTY;
    }

    return merge(
      dimensions.form.valueChanges.pipe(
        startWith(null as DimensionsFormValues),
        distinctUntilChanged(isEqual),
        pairwise(),
        tap(([_, value]: DimensionsFormValues[]) => {
          this.logger.log('Dimensions: Change: Valid ', dimensions.form.value);
          elCmp.styles.width = value.width;
          elCmp.styles.height = value.height;

          elCmp.applyStyles();
        }),
      ),
      dimensions.submit.pipe(
        filter(() => dimensions.form.valid && !isEqual(dimensions.initialValue, dimensions.form.value)),
        switchMap(() => {
          this.logger.log('Dimensions: Submit ', dimensions.form.value);
          elCmp.dimensions.update();
          return this.store.updateStyles(this.state.screen, {
            [elDef.id]: { ...dimensions.form.value },
          });
        }),
      ),
    );
  }

  private handleDeleteProducts(
    elCmp: PebEditorElement,
    sidebar: PebEditorProductsSidebarComponent,
  ) {
    return sidebar.removeProductHandler.pipe(
      filter(product => !!product),
      map((product: any) =>
        elCmp.context.data
          .filter(({ id }) => id !== product.id)
          .map(({ id }) => id),
      ),
      switchMap((productsIds) => {
        const columns = Number(elCmp.styles.productTemplateColumns || 1);
        const rows = Number(elCmp.styles.productTemplateRows || 1);

        const nextColumns = productsIds.length
          ? columns > productsIds.length
            ? productsIds.length
            : columns
          : columns;

        const nextRows = productsIds.length
          ? Math.ceil(productsIds.length / nextColumns)
          : rows;

        const nextStyles = {
          ...elCmp.styles,
          productTemplateColumns: nextColumns,
          productTemplateRows: nextRows,
        };

        return this.store
          .updateContext(elCmp.definition.id, {
            service: 'products',
            method: 'getByIds',
            params: [productsIds],
          })
          .pipe(
            switchMap(() =>
              this.store.updateStyles(this.state.screen, {
                [elCmp.definition.id]: nextStyles,
              }),
            ),
            debounceTime(100),
            tap(() => {
              sidebar.context = elCmp.context;
              elCmp.productDimensions.activate();
              elCmp.productDimensions.submit.next();
            }),
          );
      }),
    );
  }

  private productsGridFlow(
    elCmp: PebEditorElement,
    sidebar: PebEditorProductsSidebarComponent,
  ): Observable<any> {
    return sidebar.openProductsGrid.pipe(
      switchMap(() =>
        this.editor

          .openProductsDialog(
            elCmp.context?.data?.length
              ? elCmp.context.data?.map(p => p.id)
              : [],
          )
          .pipe(map(productsIds => ({ elCmp, productsIds }))),
      ),
      filter(({ productsIds }) => !!productsIds),
      // tslint:disable-next-line: no-shadowed-variable
      switchMap(({ elCmp, productsIds }) => {
        const columns = Number(elCmp.styles.productTemplateColumns || 1);
        const rows = Number(elCmp.styles.productTemplateRows || 1);

        const nextColumns = productsIds.length
          ? columns > productsIds.length
            ? productsIds.length
            : columns
          : columns;

        const nextRows = productsIds.length
          ? Math.ceil(productsIds.length / nextColumns)
          : rows;

        const nextStyles = {
          ...elCmp.styles,
          productTemplateColumns: nextColumns,
          productTemplateRows: nextRows,
        };

        return this.store
          .updateContext(elCmp.definition.id, {
            service: 'products',
            method: 'getByIds',
            params: [productsIds],
          })
          .pipe(
            switchMap(() =>
              this.store.updateStyles(this.state.screen, {
                [elCmp.definition.id]: nextStyles,
              }),
            ),
            debounceTime(100),
            tap(() => {
              sidebar.context = elCmp.context;
              elCmp.productDimensions.activate();
              elCmp.productDimensions.submit.next();
            }),
          );
      }),
    );
  }

  private handleProductsStyleChanges(
    elCmp: PebEditorElement,
    sidebar: PebEditorProductsSidebarComponent,
  ): Observable<any> {
    return sidebar.changes.pipe(
      map(changes => ({
        ...elCmp.styles,
        ...changes.styles,
      })),
      switchMap(styles =>
        this.store.updateStyles(this.state.screen, {
          [elCmp.definition.id]: styles,
        }),
      ),
    );
  }

  private mapFontStyles(
    styles: PebElementStyles,
    prefix: string,
  ): PebElementStyles {
    return {
      fontFamily: styles[`${prefix}FontFamily`] as string,
      fontWeight: styles[`${prefix}FontWeight`] as string,
      fontStyle: styles[`${prefix}FontStyle`] as string,
      textDecoration: styles[`${prefix}TextDecoration`] as string,
      fontSize: styles[`${prefix}FontSize`] as number,
      color: styles[`${prefix}Color`] as string,
    };
  }

  private mapFontStylesForElement(
    styles: PebElementStyles,
    prefix: string,
  ): PebElementStyles {
    return {
      [`${prefix}FontFamily`]: styles.fontFamily as string,
      [`${prefix}FontWeight`]: styles.fontWeight as string,
      [`${prefix}FontStyle`]: styles.fontStyle as string,
      [`${prefix}TextDecoration`]: styles.textDecoration as string,
      [`${prefix}FontSize`]: styles.fontSize as number,
      [`${prefix}Color`]: styles.color as string,
    };
  }

  private initProductFontForm(
    styles: PebElementStyles,
    type: ProductsFontTypes,
  ): Font {
    const mappedStyles = this.mapFontStyles(styles, type);
    const initialValue = {
      fontFamily:
        (mappedStyles.fontFamily as string) ?? PEB_DEFAULT_FONT_FAMILY,
      fontWeight:
        (mappedStyles.fontWeight as string) ?? DEFAULT_FONT_WEIGHTS[type],
      fontStyle: mappedStyles.fontStyle as string,
      textDecoration: mappedStyles.textDecoration as string,
      fontSize: (mappedStyles.fontSize as number) ?? DEFAULT_FONT_SIZE,
      color: (mappedStyles.color as string) ?? DEFAULT_COLORS[type],
    };

    return {
      initialValue,
      options: {
        // TODO: create a constant
        type,
        fontFamilies: [
          { label: 'Roboto', value: 'Roboto' },
          { label: 'Montserrat', value: 'Montserrat' },
          { label: 'PT Sans', value: 'PT Sans' },
          { label: 'Lato', value: 'Lato' },
          { label: 'Space Mono', value: 'Space Mono' },
          { label: 'Work Sans', value: 'Work Sans' },
          { label: 'Rubik', value: 'Rubik' },
        ],
      },
      form: this.formBuilder.group({
        fontFamily: [initialValue.fontFamily],
        fontWeight: [initialValue.fontWeight],
        fontStyle: [initialValue.fontStyle],
        textDecoration: [initialValue.fontStyle],
        fontSize: [
          initialValue.fontSize,
          [Validators.min(1), Validators.max(100)],
        ],
        color: [initialValue.color],
      }),
      update: null,
      submit: new Subject<any>(),
    };
  }

  private handleProductFontForm(
    elementCmp: PebEditorElement,
    font: Font,
  ): Observable<any> {
    const elDef = elementCmp.definition;

    return merge(
      font.form.valueChanges.pipe(
        tap((changes) => {
          const mappedFontElementStyles = this.mapFontStylesForElement(
            changes,
            font.options.type,
          );

          if (font.form.invalid) {
            this.logger.log('Font: Change: Invalid');
            return;
          }

          this.logger.log('Font: Change: Valid ', mappedFontElementStyles);

          elementCmp.styles = {
            ...elementCmp.styles,
            ...mappedFontElementStyles,
          };

          elementCmp.detectChanges();
          elementCmp.applyStyles();
        }),
      ),
      font.submit.pipe(
        switchMap(() => {
          const mappedFontElementStyles = this.mapFontStylesForElement(
            font.form.value,
            font.options.type,
          );
          if (
            font.form.invalid ||
            isEqual(font.initialValue, mappedFontElementStyles)
          ) {
            return EMPTY;
          }

          this.logger.log('Font: Submit ', mappedFontElementStyles);

          return this.store.updateStyles(this.state.screen, {
            [elDef.id]: mappedFontElementStyles,
          });
        }),
      ),
    );
  }

  protected getDimensionsLimits(elementCmp: PebEditorElement) {
    const widthMaxDimensions = elementCmp.getMaxPossibleDimensions(
      Axis.Horizontal,
    );
    const heightMaxDimensions = elementCmp.getMaxPossibleDimensions(
      Axis.Vertical,
    );

    if (!widthMaxDimensions || !heightMaxDimensions) {
      return;
    }

    const {
      productTemplateColumns,
      productTemplateRows,
    } = this.productUtils.getColumnsAndRows(elementCmp);
    const itemWidth =
      elementCmp.productDimensions?.form.value.width ??
      elementCmp.styles.itemWidth ??
      220;
    const itemHeight =
      elementCmp.productDimensions?.form.value.height ??
      elementCmp.styles.itemHeight ??
      280;
    const elementWidthMinDimensions =
      itemWidth * productTemplateColumns +
      (PRODUCTS_MARGIN * productTemplateColumns - 1);

    const elementHeightMinDimensions = itemHeight * productTemplateRows;

    return {
      width: {
        min: Math.max(
          elementWidthMinDimensions,
          elementCmp.getMinPossibleDimensions(Axis.Horizontal),
        ),
        max: widthMaxDimensions.size - widthMaxDimensions.spaceStart,
      },
      height: {
        min: Math.max(
          elementHeightMinDimensions,
          elementCmp.getMinPossibleDimensions(Axis.Vertical),
        ),
        max: heightMaxDimensions.size - heightMaxDimensions.spaceStart,
      },
    };
  }

  // calcGridSize(elCmp: PebEditorElement, columns?: number) {
  //   const {
  //     productTemplateColumns,
  //     productTemplateRows,
  //   } = this.productUtils.getColumnsAndRows(elCmp);
  //   columns = columns ?? productTemplateColumns;

  //   elCmp.productDimensions.update();
  //   elCmp.dimensions.update();
  //   elCmp.dimensions.form.patchValue({
  //     width: Math.max(
  //       elCmp.getMinPossibleDimensions(Axis.Horizontal),
  //       elCmp.productDimensions.form.value.width * columns + (columns - 1) * 15,
  //     ),
  //     height: elCmp.productDimensions.form.value.height * productTemplateRows,
  //   });
  //   elCmp.productDimensions.submit.next();
  // }
}

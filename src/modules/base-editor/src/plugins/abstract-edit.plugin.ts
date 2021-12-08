import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentRef, Injectable, Injector, Type } from '@angular/core';
import { BehaviorSubject, EMPTY, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { isEqual } from 'lodash';

import { PebEditorApi, PEB_STORAGE_PATH } from '@pe/builder-api';
import {
  PebElementContextState,
  pebFontFamilies,
  pebGenerateId,
  PebMediaService,
  PebScreen,
  PebShopContainer,
  PebStylesheet,
} from '@pe/builder-core';

import { PEB_EDITOR_EVENTS, PEB_EDITOR_STATE } from '../editor.constants';
import { PebEditorSlot } from '../root/abstract-editor';
import { PebEditorRenderer } from '../renderer/editor-renderer';
import { PebEditorStore } from '../services/editor.store';
import { Axis, PebEditorElement } from '../renderer/editor-element';
import { hexToRgb, isBackgroundGradient, rgbToHex, toBase64 } from '../utils';
import { ShadowStyles } from '../shared/forms/shadow/shadow.interfaces';
import {
  AlignType,
  BgGradient,
  FillType,
  getBgScale,
  getFillType,
  getGradientProperties,
  getSelectedOption,
  ImageSize,
  ImageSizes,
  initFillType,
  PageSidebarDefaultOptions,
} from '../behaviors/sidebars/_deprecated-sidebars/sidebar.utils';
import { showImageSpinner } from '../behaviors/_utils/sidebar.common';
import { SelectOption } from '../shared/_old/select/select.component';
import { SidebarBasic } from '../behaviors/sidebars/_deprecated-sidebars/sidebar.basic';
import { PebAbstractSidebar } from '../behaviors/sidebars/sidebar.abstract';
import { PebBorderStyles, PebEditorElementPropertyBorder } from '../renderer/interfaces';
import { CategoryType, CategoryTypeOptions } from '../shared/forms/categories/categories.form.constants';
import { calculateGrid } from './calculate-grid';
import { PebEditorAccessorService } from '../services/editor-accessor.service';

export interface DimensionsFormValues {
  width: number;
  height: number;
  keepRation: boolean;
}

export interface ProportionDimensionsFormValues {
  width: number;
  height: number;
  constrainProportions?: boolean;
  proportionRatio?: number;
}

export interface ShadowValues {
  blur: number;
  offset: number;
  color: string;
  opacity: number;
  angle: number;
}

export interface FilterValues {
  brightness?: number;
  saturate?: number;
}

@Injectable({ providedIn: 'any' })
// TODO: Remove SidebarBasic

export abstract class AbstractEditElementPlugin<T extends SidebarBasic | PebAbstractSidebar> {
  abstract logger: { log: (...args: any) => void };
  protected abstract sidebarComponent: Type<T>;

  protected set editor(editor) {
  }
  protected get editor() {
    return this.editorAccessorService.editorComponent;
  }
  protected editorAccessorService = this.injector.get(PebEditorAccessorService);
  protected state = this.injector.get(PEB_EDITOR_STATE);
  protected renderer = this.injector.get(PebEditorRenderer);
  protected store = this.injector.get(PebEditorStore);
  protected formBuilder = this.injector.get(FormBuilder);
  protected events = this.injector.get(PEB_EDITOR_EVENTS);

  protected editorApi = this.injector.get(PebEditorApi);
  protected mediaService = this.injector.get(PebMediaService);

  readonly ImageSizes: typeof ImageSizes = ImageSizes;

  protected constructor(private injector: Injector) {
  }

  /**
   *  General
   */
  protected singleElementOfTypeSelected(): Observable<PebEditorElement> {
    return this.state.singleSelectedElement$.pipe(
      filter(Boolean),
      map(this.renderer.getElementComponent),
      filter(elCmp =>
        (this.constructor as any).elementTypes.includes(elCmp?.definition.type),
      ),
    );
  }

  protected initSidebar<P extends PebEditorElement>(elementCmp: P, instanceProps?: Partial<T>): ComponentRef<T> {
    const sidebarCmpRef = this.editor.insertToSlot(this.sidebarComponent, PebEditorSlot.sidebar);

    Object.assign(
      sidebarCmpRef.instance,
      {
        element: elementCmp.definition,
        styles: elementCmp.styles,
        component: elementCmp,
      },
      instanceProps,
    );

    sidebarCmpRef.changeDetectorRef.detectChanges();

    return sidebarCmpRef;
  }

  /**
   * Alignment
   */

  protected initAlignmentForm(sidebarRef: ComponentRef<any>) {
    sidebarRef.instance.alignment = {
      form: this.formBuilder.group({
        align: [],
      }),
      submit: new Subject<any>(),
    };
  }

  protected handleAlignmentForm(elementCmp: PebEditorElement, sidebarRef: ComponentRef<any>) {
    const alignment = sidebarRef.instance.alignment;

    return merge(
      alignment.form.get('align').valueChanges.pipe(
        tap((align: AlignType) => {
          const { nextPosition, translate } = this.getNextAlignmentPosition(elementCmp.parent, elementCmp, align);

          elementCmp.nativeElement.style.transform = `translate(${translate.x}px, ${translate.y}px)`;

          alignment.form.get('align').patchValue('', { emitEvent: false });

          const edges = elementCmp.controls.edges?.instance;
          const anchors = elementCmp.controls.anchors?.instance;

          const intersectWithNextSiblings = elementCmp.siblings.some(
            sibling => this.renderer.elementIntersect(elementCmp, sibling),
          );

          if (intersectWithNextSiblings) {
            elementCmp.nativeElement.style.transform = `translate(0, 0)`;

            edges.valid = false;
            edges.detectChanges();

            if (anchors && anchors.variant !== 'hidden') {
              anchors.variant = 'invalid';
              anchors.detectChanges();
            }

            return;
          }

          if (!edges.valid || anchors?.variant === 'invalid') {
            edges.valid = true;
            edges.detectChanges();

            if (anchors) {
              anchors.variant = 'default';
              anchors.detectChanges();
            }
          }

          elementCmp.position?.form.setValue(nextPosition, { emitEvent: false });
        }),
        tap(() => alignment.submit.next()),
      ),
      alignment.submit.pipe(
        switchMap(() => {
          if (alignment.form.invalid || isEqual(elementCmp.position?.form.value, elementCmp.getAbsoluteElementRect())) {
            return EMPTY;
          }

          const children = [elementCmp, ...elementCmp.siblings];
          const changes = calculateGrid(elementCmp.parent, children);

          this.logger.log('Align: Submit ', alignment.form.value);

          return this.store.updateStyles(this.state.screen, changes);
        }),
      ),
    );
  }

  /**
   *  Position
   */
  protected initPositionForm(elementCmp: PebEditorElement) {
    const elementDs = elementCmp.getAbsoluteElementRect();
    const initialValue = {
      x: elementDs.left,
      y: elementDs.top,
    };

    elementCmp.position = {
      initialValue,
      form: this.formBuilder.group({
        x: [{ value: initialValue.x, disabled: true }],
        y: [{ value: initialValue.y, disabled: true }],
      }),
      limits: {
        x: new BehaviorSubject({
          min: 0,
          max: 500,
        }),
        y: new BehaviorSubject({
          min: 0,
          max: 500,
        }),
      },
      update: () => {},
      submit: new Subject<any>(),
    };
  }

  protected handlePositionForm(elCmp: PebEditorElement): Observable<any> {
    return merge(
      elCmp.position.form.valueChanges.pipe(
        tap(evt => this.logger.log('valuesChanges', evt)),
      ),
      elCmp.position.form.statusChanges.pipe(
        tap(evt => this.logger.log('statusChanges', evt)),
      ),
    );
  }

  /**
   *  Dimensions
   */
  protected initDimensionsForm(elementCmp: PebEditorElement) {
    const elementDs = elementCmp.getAbsoluteElementRect();

    const initialValue = {
      width: elementDs.width,
      height: elementDs.height,
    };

    const dimensionsLimits = this.getDimensionsLimits(elementCmp);

    if (!dimensionsLimits) {
      return;
    }

    elementCmp.dimensions = {
      initialValue,
      form: this.formBuilder.group({
        width: [
          initialValue.width,
          [Validators.min(dimensionsLimits.width.min), Validators.max(dimensionsLimits.width.max)],
        ],
        height: [
          initialValue.height,
          [Validators.min(dimensionsLimits.height.min), Validators.max(dimensionsLimits.height.max)],
        ],
      }),
      limits: {
        width: new BehaviorSubject(dimensionsLimits.width),
        height: new BehaviorSubject(dimensionsLimits.height),
      },
      activate: this.activateDimensionsForm(elementCmp),
      update: this.updateDimensionsForm(elementCmp),
      submit: new Subject<any>(),
    };
  }

  protected activateDimensionsForm = (elementCmp: PebEditorElement) => () => {
    const elementDs = elementCmp.getAbsoluteElementRect();
    const dssLimits = {
      width: elementCmp.dimensions.limits.width.value,
      height: elementCmp.dimensions.limits.height.value,
    };

    if (elementDs.width > dssLimits.width.max || elementDs.height > dssLimits.height.max) {
      elementCmp.dimensions.form.setValue(
        {
          width: Math.min(elementDs.width, dssLimits.width.max),
          height: Math.min(elementDs.height, dssLimits.height.max),
        },
        { emitEvent: false },
      );
    }
  }

  protected updateDimensionsForm = (elementCmp: PebEditorElement) => () => {
    const elDef = elementCmp.definition;
    const dimensionsLimits = this.getDimensionsLimits(elementCmp);
    const dssForm: FormGroup = elementCmp.dimensions.form;

    const proportionRatio = dssForm.value.width / dssForm.value.height;

    dssForm.patchValue({ proportionRatio });

    if (!dimensionsLimits) {
      return;
    }

    dssForm.controls.width.setValidators([
      Validators.min(dimensionsLimits.width.min),
      Validators.max(dimensionsLimits.width.max),
    ]);
    dssForm.controls.height.setValidators([
      Validators.min(dimensionsLimits.height.min),
      Validators.max(dimensionsLimits.height.max),
    ]);

    elementCmp.dimensions.limits.width.next(dimensionsLimits.width);
    elementCmp.dimensions.limits.height.next(dimensionsLimits.height);
  }

  protected getDimensionsLimits(elementCmp: PebEditorElement) {
    const widthMaxDimensions = elementCmp.getMaxPossibleDimensions(Axis.Horizontal);
    const heightMaxDimensions = elementCmp.getMaxPossibleDimensions(Axis.Vertical);

    if (!widthMaxDimensions || !heightMaxDimensions) {
      return;
    }

    return {
      width: {
        min: elementCmp.getMinPossibleDimensions(Axis.Horizontal),
        max: widthMaxDimensions.size,
      },
      height: {
        min: elementCmp.getMinPossibleDimensions(Axis.Vertical),
        max: heightMaxDimensions.size - heightMaxDimensions.spaceStart,
      },
    };
  }

  protected handleDimensionsForm(elCmp: PebEditorElement): Observable<any> {
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
          if (dimensions.form.invalid) {
            this.logger.log('Dimensions: Change: Invalid');
            return;
          }

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

  /**
   *  Proportion Dimensions
   */
  protected initProportionDimensionsForm(elementCmp: PebEditorElement) {
    const elDef = elementCmp.definition;
    const elementDs = elementCmp.getAbsoluteElementRect();

    const initialValue = {
      width: elementDs.width,
      height: elementDs.height,
      constrainProportions: elDef.data?.constrainProportions ? elDef.data.constrainProportions : null,
      proportionRation: elDef.data?.proportionRation ? elDef.data.proportionRation : null,
    };

    const pDimensionsLimits = this.getProportionDimensionsLimits(elementCmp);

    if (!pDimensionsLimits) {
      return;
    }

    elementCmp.proportionDimensions = {
      initialValue,
      form: this.formBuilder.group({
        width: [
          initialValue.width,
          [Validators.min(pDimensionsLimits.width.min), Validators.max(pDimensionsLimits.width.max)],
        ],
        height: [
          initialValue.height,
          [Validators.min(pDimensionsLimits.height.min), Validators.max(pDimensionsLimits.height.max)],
        ],
        constrainProportions: [
          initialValue.constrainProportions,
        ],
        proportionRatio: [
          initialValue.proportionRation,
        ],
      }),
      limits: {
        width: new BehaviorSubject(pDimensionsLimits.width),
        height: new BehaviorSubject(pDimensionsLimits.height),
      },
      activate: this.activateProportionDimensionsForm(elementCmp),
      update: this.updateProportionDimensionsForm(elementCmp),
      submit: new Subject<any>(),
    };
  }

  protected activateProportionDimensionsForm = (elementCmp: PebEditorElement) => () => {
    const elementDs = elementCmp.getAbsoluteElementRect();
    const dssLimits = {
      width: elementCmp.proportionDimensions.limits.width.value,
      height: elementCmp.proportionDimensions.limits.height.value,
    };

    if (elementDs.width > dssLimits.width.max || elementDs.height > dssLimits.height.max) {
      elementCmp.proportionDimensions.form.setValue(
        {
          width: Math.min(elementDs.width, dssLimits.width.max),
          height: Math.min(elementDs.height, dssLimits.height.max),
        },
        { emitEvent: false },
      );
    }
  }

  protected updateProportionDimensionsForm = (elementCmp: PebEditorElement) => () => {
    const elDef = elementCmp.definition;
    const pDimensionsLimits = this.getProportionDimensionsLimits(elementCmp);
    const pDssForm: FormGroup = elementCmp.proportionDimensions.form;

    const proportionRatio = pDssForm.value.width / pDssForm.value.height;

    pDssForm.patchValue({ proportionRatio });

    if (!pDimensionsLimits) {
      return;
    }

    pDssForm.controls.width.setValidators([
      Validators.min(pDimensionsLimits.width.min),
      Validators.max(pDimensionsLimits.width.max),
    ]);
    pDssForm.controls.height.setValidators([
      Validators.min(pDimensionsLimits.height.min),
      Validators.max(pDimensionsLimits.height.max),
    ]);

    elementCmp.proportionDimensions.limits.width.next(pDimensionsLimits.width);
    elementCmp.proportionDimensions.limits.height.next(pDimensionsLimits.height);
  }

  protected getProportionDimensionsLimits(elementCmp: PebEditorElement) {
    const widthMaxDimensions = elementCmp.getMaxPossibleDimensions(Axis.Horizontal);
    const heightMaxDimensions = elementCmp.getMaxPossibleDimensions(Axis.Vertical);

    if (!widthMaxDimensions || !heightMaxDimensions) {
      return;
    }

    return {
      width: {
        min: elementCmp.getMinPossibleDimensions(Axis.Horizontal),
        max: widthMaxDimensions.size,
      },
      height: {
        min: elementCmp.getMinPossibleDimensions(Axis.Vertical),
        max: heightMaxDimensions.size - heightMaxDimensions.spaceStart,
      },
    };
  }

  protected handleProportionDimensionsForm(elCmp: PebEditorElement): Observable<any> {
    const elDef = elCmp.definition;
    const proportionDimensions = elCmp.proportionDimensions;

    if (!proportionDimensions) {
      return EMPTY;
    }

    return merge(
      proportionDimensions.form.valueChanges.pipe(
        startWith(null as ProportionDimensionsFormValues),
        distinctUntilChanged(isEqual),
        pairwise(),
        tap(([prevValue, value]: ProportionDimensionsFormValues[]) => {
          if (proportionDimensions.form.invalid) {
            this.logger.log('Proportion Dimensions: Change: Invalid');
            return;
          }

          this.logger.log('Proportion Dimensions: Change: Valid ', proportionDimensions.form.value);
          elCmp.styles.width = value.width;
          elCmp.styles.height = value.height;

          elCmp.applyStyles();
        }),
      ),
      proportionDimensions.form.get('width').valueChanges.pipe(
        tap((width) => {
          if (proportionDimensions.form.value.constrainProportions) {
            const height = Math.round(width / this.calculateRatioProportion(proportionDimensions));
            if (height !== proportionDimensions.form.get('height').value) {
              proportionDimensions.form.patchValue({ height });
            }
          }
        }),
      ),
      proportionDimensions.form.get('height').valueChanges.pipe(
        tap((height) => {
          if (proportionDimensions.form.value.constrainProportions) {
            const width = Math.round(height * this.calculateRatioProportion(proportionDimensions));
            if (width !== proportionDimensions.form.get('width').value) {
              proportionDimensions.form.patchValue({ width });
            }
          }
        }),
      ),
      proportionDimensions.submit.pipe(
        filter(() => proportionDimensions.form.valid &&
                     !isEqual(proportionDimensions.initialValue, proportionDimensions.form.value)),
        switchMap(() => {
          this.logger.log('Proportion Dimensions: Submit ', proportionDimensions.form.value);

          elCmp.proportionDimensions.update();

          const newStyles = {
            [elDef.id]: { ...proportionDimensions.form.value },
          };

          const nextElement = {
            ...elDef,
            data: {
              ...elDef.data,
              constrainProportions: proportionDimensions.form.value.constrainProportions,
              proportionRatio: proportionDimensions.form.value.proportionRatio,
            },
          };

          return this.store.updateElementKit(this.state.screen, nextElement, newStyles);
        }),
      ),
    );
  }

  calculateRatioProportion(proportionDimensions): number {
    return proportionDimensions.form.value.height <= 0 ? 1
      : proportionDimensions.form.value.width / proportionDimensions.form.value.height;
  }



  /**
   *  Opacity
   */
  protected initOpacityForm(elementCmp: PebEditorElement) {
    const initialValue = {
      opacity: isNaN(elementCmp.styles.opacity as number)
        ? 100
        : Math.ceil(elementCmp.styles.opacity as number * 100),
    };

    elementCmp.opacity = {
      initialValue,
      form: this.formBuilder.group({
        opacity: [
          initialValue.opacity,
          [Validators.min(0), Validators.max(100)],
        ],
      }),
      update: null,
      submit: new Subject<any>(),
    };
  }

  protected handleOpacityForm(elementCmp: PebEditorElement): Observable<any> {
    const elDef = elementCmp.definition;
    const opacity = elementCmp.opacity;

    return merge(
      opacity.form.valueChanges.pipe(
        tap((value) => {
          if (opacity.form.invalid) {
            this.logger.log('Opacity: Change: Invalid');
            return;
          }

          this.logger.log('Opacity: Change: Valid ', opacity.form.value);
          elementCmp.styles.opacity = value.opacity / 100;

          elementCmp.applyStyles();
        }),
      ),
      opacity.submit.pipe(
        switchMap(() => {
          if (opacity.form.invalid || isEqual(opacity.initialValue, opacity.form.value)) {
            return EMPTY;
          }

          this.logger.log('Opacity: Submit ', opacity.form.value);
          return this.store.updateStyles(this.state.screen, {
            [elDef.id]: { opacity: opacity.form.value.opacity / 100 },
          });
        }),
      ),
    );
  }

  /**
   * Image adjustment
   */
  protected initImageAdjustment(elementCmp: PebEditorElement): void {
    const { imageSaturation, imageExposure } = elementCmp.styles;
    const initialValue = {
      saturation: (imageSaturation ?? 0) as number,
      exposure: (imageExposure ?? 0) as number,
    };
    elementCmp.imageAdjustment = {
      initialValue,
      form: this.formBuilder.group({
        exposure: [initialValue.exposure, [Validators.min(-100), Validators.max(100)]],
        saturation: [initialValue.saturation, [Validators.min(-100), Validators.max(100)]],
      }),
      update: null,
      submit: null,
    };
  }

  protected handleImageAdjustment(elementCmp: PebEditorElement): Observable<any> {
    const imageAdjustment = elementCmp.imageAdjustment;
    return merge(
      imageAdjustment.form.valueChanges.pipe(
        tap((adjustment) => {
          if (imageAdjustment.form.invalid) {
            this.logger.log('Image adjustment: Change: Invalid');
            return;
          }
          this.logger.log('Image adjustment: Change: Valid', adjustment);

          const changes = {
            imageSaturation: adjustment.saturation,
            imageExposure: adjustment.exposure,
          };

          // TODO: exposure
          elementCmp.styles = {
            ...elementCmp.styles,
            imageFilter: this.getImageFilterString(changes),
          };
          elementCmp.applyStyles();
        }),
      ),
      imageAdjustment.form.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((adjustment) => {
          if (imageAdjustment.form.invalid) {
            this.logger.log('Image adjustment: Change: Invalid');
            return EMPTY;
          }
          const changes = {
            imageSaturation: adjustment.saturation,
            imageExposure: adjustment.exposure,
          };

          this.logger.log('Image adjustment: Submit ', changes);

          return this.store.updateStylesByScreen(Object.values(PebScreen).reduce(
            (acc: { [screen: string]: PebStylesheet }, screen: PebScreen) => ({
              ...acc,
              [screen]: {
                [elementCmp.definition.id]: {
                  imageFilter: this.getImageFilterString(changes),
                },
              },
            }),
            {},
          ));
        }),
      ),
    );
  }

  protected getImageFilterString(styles): string {
    const imageFilter = [''];
    if (styles.imageSaturation != null) {
      imageFilter.push(`saturate(${+styles.imageSaturation + 100}%)`);
    }
    if (styles.imageExposure != null) {
      imageFilter.push(`brightness(${+styles.imageExposure + 100}%)`);
      if (+styles.imageExposure > 0) {
        imageFilter.push(`contrast(${+styles.imageExposure + 100}%)`);
      }
    }
    return imageFilter.join(' ');
  }

  /**
   * Description
   */
  protected initDescriptionForm(elementCmp: PebEditorElement): void {
    const initialValue = {
      description: elementCmp.definition.data?.description ?? '',
    };
    elementCmp.description = {
      initialValue,
      form: this.formBuilder.group({
        description: [initialValue.description],
      }),
      update: null,
      submit: new Subject(),
    };
  }

  protected handleDescriptionForm(elementCmp: PebEditorElement): Observable<any> {
    const description = elementCmp.description;
    return merge(
      description.submit.pipe(
        switchMap(() => {
          if (description.form.invalid) {
            this.logger.log('Description: Change: Invalid');
            return EMPTY;
          }
          const changes = {
            description: description.form.value.description,
          };
          this.logger.log('Description: Submit ', changes);
          return this.store.updateElement({
            ...elementCmp.definition,
            data: {
              ...elementCmp.definition.data,
              ...changes,
            },
          });
        }),
      ),
    );
  }

  /**
   *  Font
   */
  protected initFontForm(elementCmp: PebEditorElement) {
    const initialValue = {
      fontFamily: elementCmp.styles.fontFamily as string,
      fontWeight: elementCmp.styles.fontWeight as string,
      fontStyle: elementCmp.styles.fontStyle as string,
      textDecoration: elementCmp.styles.textDecoration as string,
      fontSize: elementCmp.styles.fontSize as number,
      color: elementCmp.styles.color as string,
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
      }),
      update: null,
      submit: new Subject<any>(),
    };
  }

  protected handleFontForm(elementCmp: PebEditorElement): Observable<any> {
    const elDef = elementCmp.definition;
    const font = elementCmp.font;

    return merge(
      font.form.valueChanges.pipe(
        tap((changes) => {
          if (font.form.invalid) {
            this.logger.log('Font: Change: Invalid');
            return;
          }

          this.logger.log('Opacity: Change: Valid ', font.form.value);

          elementCmp.styles = {
            ...elementCmp.styles,
            ...changes,
          };
          elementCmp.applyStyles();
        }),
      ),
      font.submit.pipe(
        switchMap(() => {
          if (font.form.invalid || isEqual(font.initialValue, font.form.value)) {
            return EMPTY;
          }

          this.logger.log('Opacity: Submit ', font.form.value);

          return this.store.updateStyles(this.state.screen, {
            [elDef.id]: font.form.value,
          });
        }),
      ),
    );
  }

  /**
   *  Proportions
   */
  protected initProportionsForm(elementCmp: PebEditorElement) {
    const initialValue = {
      objectFit: elementCmp.styles.objectFit as string ?? 'contain',
    };

    elementCmp.proportions = {
      initialValue,
      form: this.formBuilder.group({
        objectFit: [initialValue.objectFit],
      }),
      update: null,
      submit: new Subject<any>(),
    };
  }

  protected handleProportionsForm(elementCmp: PebEditorElement): Observable<any> {
    const elDef = elementCmp.definition;
    const proportions = elementCmp.proportions;

    return merge(
      proportions.form.valueChanges.pipe(
        tap((changes) => {
          if (proportions.form.invalid) {
            this.logger.log('Proportions: Change: Invalid');
            return;
          }

          this.logger.log('Proportions: Change: Valid ', proportions.form.value);

          elementCmp.styles = {
            ...elementCmp.styles,
            ...changes,
          };
          elementCmp.applyStyles();
        }),
      ),
      proportions.submit.pipe(
        switchMap(() => {
          if (proportions.form.invalid || isEqual(proportions.initialValue, proportions.form.value)) {
            return EMPTY;
          }

          this.logger.log('Proportions: Submit ', proportions.form.value);

          return this.store.updateStyles(this.state.screen, {
            [elDef.id]: proportions.form.value,
          });
        }),
      ),
    );
  }

  /**
   * Image Filter
   */
  protected initImageFilterForm(elementCmp: PebEditorElement) {
    const filterValues = this.getFilterValuesFromString(elementCmp.styles.filter as string);
    const initialValue = {
      brightness: filterValues.brightness ?? 0,
      saturate: filterValues.saturate ?? 0,
    };

    elementCmp.filter = {
      initialValue,
      form: this.formBuilder.group({
        brightness: [initialValue.brightness, [Validators.min(-100), Validators.max(100)]],
        saturate: [initialValue.saturate, [Validators.min(-100), Validators.max(100)]],
      }),
      update: null,
      submit: new Subject<any>(),
    };
  }

  /**
   * Link
   */
  protected initLinkForm(elementCmp: PebEditorElement): void {
    const initialValue = {
      link: elementCmp.definition.data?.link ?? '',
      newTab: elementCmp.definition.data?.newTab ?? true,
    };
    elementCmp.link = {
      initialValue,
      form: this.formBuilder.group({
        link: [initialValue.link],
        newTab: [initialValue.newTab],
      }),
      update: null,
      submit: new Subject<any>(),
    };
  }

  protected handleImageFilterForm(elementCmp: PebEditorElement): Observable<any> {
    const elDef = elementCmp.definition;
    const filter = elementCmp.filter;

    return merge(
      filter.form.valueChanges.pipe(
        tap(() => {
          if (filter.form.invalid) {
            this.logger.log('Filter: Change: Invalid');
            return;
          }

          this.logger.log('Filter: Change: Valid ', filter.form.value);
          elementCmp.styles = {
            ...elementCmp.styles,
            filter: this.getFilterString(filter.form.value),
          };
          elementCmp.applyStyles();
        }),
      ),
      filter.submit.pipe(
        switchMap(() => {
          if (filter.form.invalid || isEqual(filter.initialValue, filter.form.value)) {
            return EMPTY;
          }

          this.logger.log('Filter: Submit ', filter.form.value);

          return this.store.updateStyles(this.state.screen, {
            [elDef.id]: { filter: this.getFilterString(filter.form.value) },
          });
        }),
      ),
    );
  }

  protected handleLinkForm(elementCmp: PebEditorElement): Observable<any> {
    return elementCmp.link.submit.pipe(
      switchMap(() => {
        const { link, newTab } = elementCmp.link.form.value;
        return this.store.updateElement({
          ...elementCmp.definition,
          data: {
            ...elementCmp.definition.data,
            link,
            newTab,
          },
        });
      }),
    );
  }

  /**
   *  Shadow
   */
  protected initShadowForm(elementCmp: PebEditorElement, shadowType: 'boxShadow'|'filter' = 'boxShadow') {
    const shadowValues = shadowType === 'filter' ?
      this.getShadowFilterValuesFromString(elementCmp.styles.filter as string) :
      this.getShadowValuesFromString(elementCmp.styles.boxShadow as string);
    const initialValue = {
      hasShadow: !!elementCmp.styles[shadowType] && elementCmp.styles[shadowType] !== 'inherit',
      shadowBlur: shadowValues.blur ?? 5,
      shadowColor: shadowValues.color ?? '#000000',
      shadowOffset: shadowValues.offset ?? 20,
      shadowOpacity:
        shadowValues.opacity ?? 100,
      shadowAngle: shadowValues.angle ?? 315,
    };

    elementCmp.shadow = {
      initialValue,
      form: this.formBuilder.group({
        hasShadow: [initialValue.hasShadow],
        shadowColor: [initialValue.shadowColor],
        shadowOffset: [initialValue.shadowOffset],
        shadowBlur: [initialValue.shadowBlur, [Validators.min(0), Validators.max(100)]],
        shadowOpacity: [initialValue.shadowOpacity, [Validators.min(0), Validators.max(100)]],
        shadowAngle: [initialValue.shadowAngle, [Validators.min(0), Validators.max(360)]],
      }),
      update: null,
      submit: new Subject<any>(),
    };
  }

  protected handleShadowForm(elementCmp: PebEditorElement): Observable<any> {
    const elDef = elementCmp.definition;
    const shadow = elementCmp.shadow;

    return merge(
      shadow.form.valueChanges.pipe(
        tap(() => {
          if (shadow.form.invalid) {
            this.logger.log('Shadow: Change: Invalid');
            return;
          }

          this.logger.log('Shadow: Change: Valid ', shadow.form.value);
          elementCmp.styles = {
            ...elementCmp.styles,
            boxShadow: this.getShadowString(shadow.form.value),
          };
          elementCmp.applyStyles();
        }),
      ),
      shadow.submit.pipe(
        switchMap(() => {
          if (shadow.form.invalid || isEqual(shadow.initialValue, shadow.form.value)) {
            return EMPTY;
          }

          this.logger.log('Shadow: Submit ', shadow.form.value);

          return this.store.updateStyles(this.state.screen, {
            [elDef.id]: {
              boxShadow: this.getShadowString(shadow.form.value),
            },
          });
        }),
      ),
    );
  }

  /**
   *  Background
   */
  protected initBackgroundForm(elementCmp: PebEditorElement) {
    const bgGradient: BgGradient = getGradientProperties(elementCmp.styles);

    const initialValue = {
      bgColor: elementCmp.styles.backgroundColor?.toString() || '',
      bgColorGradientAngle: bgGradient.angle,
      bgColorGradientStart: bgGradient.startColor,
      bgColorGradientStop: bgGradient.endColor,
      file: null,
      bgImage: elementCmp.styles.backgroundImage?.toString() || '',
      fillType: initFillType(elementCmp.styles),
      imageSize: getSelectedOption(
        this.ImageSizes,
        elementCmp.styles.backgroundSize,
        PageSidebarDefaultOptions.ImageSize,
      ),
      imageScale: getBgScale(elementCmp.styles),
    };

    elementCmp.background = {
      initialValue,
      form: this.formBuilder.group({
        bgColor: [initialValue.bgColor],
        bgColorGradientAngle: [initialValue.bgColorGradientAngle],
        bgColorGradientStart: [initialValue.bgColorGradientStart],
        bgColorGradientStop: [initialValue.bgColorGradientStop],
        file: [initialValue.file],
        bgImage: [initialValue.bgImage],
        fillType: [initialValue.fillType],
        imageSize: [initialValue.imageSize],
        imageScale: [initialValue.imageScale],
      }),
      update: null,
      submit: new Subject<any>(),
    };
  }

  protected handleBackgroundForm(elementCmp: PebEditorElement, sidebarRef: ComponentRef<any>): Observable<any> {
    const sectionBackground = elementCmp.background;

    return merge(
      sectionBackground.form.get('bgColor').valueChanges.pipe(
        tap((value) => {
          elementCmp.styles = {
            ...elementCmp.styles,
            backgroundColor: value,
            backgroundImage: '',
          };
          elementCmp.applyStyles();
          elementCmp.detectChanges();

          if (value && sectionBackground.form.get('fillType').value.name !== FillType.ColorFill) {
            const fillType = getFillType(FillType.ColorFill);
            sectionBackground.form.get('fillType').patchValue(fillType);
          }

          sidebarRef.changeDetectorRef.detectChanges();
        }),
        debounceTime(300),
        tap(() => sectionBackground.submit.next()),
      ),

      sectionBackground.form.get('bgColorGradientAngle').valueChanges.pipe(
        tap((value: number) => {
          if (value || value === 0) {
            const gradient = this.getBackgroundGradient(value, null, null, sectionBackground.form);
            this.updateGradientBackground(gradient, sectionBackground.form);
          }
        }),
      ),

      sectionBackground.form.get('bgColorGradientStart').valueChanges.pipe(
        tap((value: string) => {
          if (value ?? value) {
            const gradient = this.getBackgroundGradient(null, value, null, sectionBackground.form);
            this.updateGradientBackground(gradient, sectionBackground.form);
          }
        }),
      ),

      sectionBackground.form.get('bgColorGradientStop').valueChanges.pipe(
        tap((value: string) => {
          if (value ?? value) {
            const gradient = this.getBackgroundGradient(null, null, value, sectionBackground.form);
            this.updateGradientBackground(gradient, sectionBackground.form);
          }
        }),
      ),

      sectionBackground.form.get('bgImage').valueChanges.pipe(
        tap((value: string) => {
          elementCmp.styles.backgroundColor = value ? '' : elementCmp.styles.backgroundColor;
          elementCmp.styles.backgroundImage = value;
          sectionBackground.form.get('imageSize').updateValueAndValidity();
          elementCmp.applyStyles();
          elementCmp.detectChanges();

          this.updateImageScaleFieldSetting(sectionBackground.form);
          sidebarRef.changeDetectorRef.detectChanges();
        }),
        debounceTime(300),
        switchMap((value: string) => {
          return this.store.updateStyles(this.state.screen, {
            [elementCmp.definition.id]: { backgroundImage: value, backgroundColor: '' },
          }).pipe(
            tap(() => showImageSpinner(false, elementCmp)),
          );
        }),
      ),

      sectionBackground.form.get('file').valueChanges.pipe(
        switchMap((file: File) => {
          const blobName = pebGenerateId(PebShopContainer.Builder);
          const storagePath = this.injector.get(PEB_STORAGE_PATH);
          const url = `${storagePath}/${PebShopContainer.Builder}/${blobName}`;
          const uploadDone$ = new ReplaySubject<void>(1);

          new Promise(async (resolve, reject) => {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
              if (event.data.error) {
                reject(event.data.error);
              } else {
                resolve(event.data);
              }
            };
            this.mediaService.uploadImage(file, PebShopContainer.Builder, blobName).pipe(
              tap(() => uploadDone$.next()),
            ).subscribe();
            const data = await toBase64(file);
            /** Store blob in service worker cache until we got uploaded image */
            navigator.serviceWorker.controller.postMessage(
              { url, data, action: 'UPLOAD' },
              [messageChannel.port2]);
          }).then(() => {
            elementCmp.styles.backgroundImage = url;
            elementCmp.applyStyles();
            sectionBackground.form.controls.bgImage.patchValue(url, { emitEven: false });
            this.store.updateStyles(this.state.screen, {
              [elementCmp.definition.id]: { backgroundImage: url },
            }).pipe(take(1)).subscribe();
          });

          return uploadDone$;
        }),
      ),

      sectionBackground.form.get('imageSize').valueChanges.pipe(
        tap((option: SelectOption) => {
          const data: any = {};
          let backgroundSize = option.value;
          data.backgroundPosition = (option.value === ImageSize.Initial || option.value === ImageSize.OriginalSize)
            ? 'center'
            : 'initial';
          data.backgroundRepeat = 'no-repeat';

          if (option.value === 'initial' || option.value === 'auto') {
            backgroundSize = Number(elementCmp.styles.backgroundSize?.toString().slice(0, -1)) ?? 100;
          }

          if (option.value === ImageSize.Initial) {
            data.backgroundRepeat = 'space';
          }

          if (option.value === ImageSize.Initial || option.value === ImageSize.OriginalSize) {
            sectionBackground.form.get('imageScale').patchValue(backgroundSize);
          } else {
            this.updateStyles(elementCmp, { backgroundSize });
          }
          elementCmp.styles = { ...elementCmp.styles, ...data };
          elementCmp.applyStyles();
          this.updateImageScaleFieldSetting(sectionBackground.form);
          sectionBackground.submit.next();
        }),
      ),

      sectionBackground.form.get('fillType').valueChanges.pipe(
        tap((option: SelectOption) => {
          const data: any = {};

          switch (option.name) {
            case FillType.ColorFill:
              data.backgroundColor = elementCmp.styles.backgroundColor || PageSidebarDefaultOptions.BgColor;
              data.backgroundImage = '';
              break;
            case FillType.ImageFill:
              const control = sectionBackground.form.get('bgImage');
              data.backgroundColor = '';
              data.backgroundImage = isBackgroundGradient(control.value, sectionBackground.form)
                ? control.setValue('', { emitEvent: false })
                : control.value;
              break;
            case FillType.GradientFill:
              data.backgroundColor = '';
              data.backgroundImage = this.getBackgroundGradient(null, null, null, sectionBackground.form);
              break;
            case FillType.None:
              data.backgroundColor = '';
              data.backgroundImage = '';
              break;
          }

          // Drop data for gradient in form
          if (option.name !== FillType.GradientFill) {
            sectionBackground.form.get('bgColorGradientAngle').patchValue('', { emitEvent: false });
            sectionBackground.form.get('bgColorGradientStart').patchValue('', { emitEvent: false });
            sectionBackground.form.get('bgColorGradientStop').patchValue('', { emitEvent: false });
          }

          sectionBackground.form.get('bgColor').patchValue(data.backgroundColor);
          sectionBackground.form.get('bgImage').patchValue(data.backgroundImage, { emitEvent: false });

          this.updateImageScaleFieldSetting(sectionBackground.form);
        }),
      ),

      sectionBackground.form.get('imageScale').valueChanges.pipe(
        map((value: number) => Number(value) ? `${value}%` : value),
        filter((value: string) => (
          elementCmp.styles.backgroundSize !== value
          && (
            sectionBackground.form.get('imageSize').value.value === ImageSize.Initial
            || sectionBackground.form.get('imageSize').value.value === ImageSize.OriginalSize
          )
        )),
        tap((value) => {
          this.updateStyles(elementCmp, { backgroundSize: value });
        }),
        debounceTime(300),
        tap(() => sectionBackground.submit.next()),
      ),

      sectionBackground.submit.pipe(
        switchMap(() => {
          if (sectionBackground.form.invalid || isEqual(sectionBackground.initialValue, sectionBackground.form.value)) {
            return EMPTY;
          }

          this.logger.log('Background: Submit ', sectionBackground.form.value);
          const screen = elementCmp.target.element.data?.sync ? Object.values(PebScreen) : this.state.screen;
          return this.store.updateStyles(screen, {
            [elementCmp.definition.id]: elementCmp.styles,
          });
        }),
      ),
    );
  }

  /**
   * categories
   */
  protected initCategoriesForm(elCmp: PebEditorElement, categories: any[]) {
    const initialValue = {
      categories,
      type: elCmp.definition.data?.categoryType
        ?? CategoryTypeOptions.find(option => option.value === CategoryType.none),
    };
    const categoryIds = elCmp.definition.data?.categoryIds;
    if (categoryIds) {
      const categoriesDict = {};
      categories.forEach(category => categoriesDict[category.id] = category);
      initialValue.categories = categoryIds.map(id => categoriesDict[id]);
    }

    elCmp.categories = {
      initialValue,
      form: this.formBuilder.group({
        type: [initialValue.type],
        categories: [initialValue.categories],
      }),
      update: null,
      submit: new Subject<any>(),
    };
  }

  protected handleCategoriesForm(elementCmp: PebEditorElement) {
    const elCategories = elementCmp.categories;
    return merge(
      elCategories.submit.pipe(
        switchMap(() => {
          const { type, categories } = elCategories.form.value;
          let method: string;
          switch (type.value) {
            case CategoryType.none:
            case CategoryType.custom:
              method = 'getProductCategoriesByIds';
              break;
            case CategoryType.all:
              method = 'getProductsCategories';
              break;
          }
          return this.store.updateElement({
            ...elementCmp.definition,
            data: {
              ...elementCmp.definition.data || {},
              categoryType: type,
              categoryIds: categories.map(category => category.id),
            },
          });
        }),
      ),
    );
  }

  // TODO: “propertyName” now used for styles such as cart.styles.badgeBorder,
  // will need to be removed after the implementation of the pseudo elements (cart.styles:badge.border).
  protected initBorderForm(elementCmp: PebEditorElement, properyName = 'border') {
    const { styles } = elementCmp;
    const initialValue: PebBorderStyles = {
      borderWidth: styles[`${properyName}Width`] as number ?? 0,
      borderStyle: styles[`${properyName}Style`] as string ?? 'solid',
      borderColor: styles[`${properyName}Color`] as string ?? '#000',
      hasBorder: !!styles[`${properyName}Width`],
    };

    elementCmp[properyName] = {
      initialValue,
      form: this.formBuilder.group({
        hasBorder: [initialValue.hasBorder],
        borderColor: [initialValue.borderColor],
        borderStyle: [initialValue.borderStyle],
        borderWidth: [initialValue.borderWidth, [Validators.min(0), Validators.max(100)]],
      }),
      update: null,
      submit: new Subject<any>(),
    };
  }

  protected handleBorderForm(elementCmp: PebEditorElement, properyName = 'border'): Observable<any> {
    const elDef = elementCmp.definition;
    const border: PebEditorElementPropertyBorder = elementCmp[properyName];

    return merge(
      border.form.valueChanges.pipe(
        tap((changes) => {
          if (border.form.invalid) {
            this.logger.log('Border: Change: Invalid');
            return;
          }

          this.logger.log('Border: Change: Valid ', changes);

          const { borderWidth, borderColor, borderStyle } = changes;

          const newStyles = {
            [`${properyName}Width`]: borderWidth,
            [`${properyName}Color`]: borderColor,
            [`${properyName}Style`]: borderStyle,
          };

          elementCmp.styles = {
            ...elementCmp.styles,
            ...newStyles,
          };
          elementCmp.applyStyles();
        }),
      ),
      border.submit.pipe(
        switchMap(() => {
          if (border.form.invalid || isEqual(border.initialValue, border.form.value)) {
            return EMPTY;
          }
          this.logger.log('Border: Submit ', border.form.value);
          const { borderWidth, borderColor, borderStyle } = border.form.value;
          const newStyles = {
            ...elementCmp.target.styles,
            [`${properyName}Width`]: borderWidth,
            [`${properyName}Color`]: borderColor,
            [`${properyName}Style`]: borderStyle,
          };
          return this.store.updateStyles(this.state.screen, { [elDef.id]: newStyles });
        }),
      ),
    );
  }

  private getFilterValuesFromString(filterString: string): FilterValues {
    const filterValues: FilterValues = {};
    if (
      !filterString || filterString === 'inherit'
      || !(filterString.includes('brightness') || filterString.includes('saturate'))
    ) {
      return filterValues;
    }

    const filterValuesArray = filterString.split(' ');

    filterValuesArray.reduce((previousValue: FilterValues, currentValue: string) => {
      if (currentValue.includes('brightness')) {
        previousValue.brightness = parseInt(currentValue.substring(11)) - 100;
      }

      if (currentValue.includes('saturate')) {
        previousValue.saturate = parseInt(currentValue.substring(9)) - 100;
      }
      return previousValue;
    }, filterValues);

    return filterValues;
  }

  public getFilterString(values: FilterValues): string {
    if (!values.saturate && !values.brightness) {
      return 'inherit';
    }

    const resultArray = [];
    if (values.brightness) {
      resultArray.push(`brightness(${values.brightness + 100}%)`);
    }

    if (values.saturate) {
      resultArray.push(`saturate(${values.saturate + 100}%)`);
    }
    return resultArray.join(' ');
  }

  private getNextAlignmentPosition(parent: PebEditorElement, children: PebEditorElement, align: AlignType): {
    nextPosition: { x: number, y: number },
    translate: { x: number, y: number },
  } {
    const scale = this.state.scale;

    const parentRect = parent.getContentContainerRect();
    const initialCoords = children.getAbsoluteElementRect();

    const nextPosition = { x: initialCoords.left, y: initialCoords.top };
    const translate = { x: 0, y: 0 };

    if (align === AlignType.Left) {
      nextPosition.x = parentRect.left;
      translate.x = Math.ceil((parentRect.left - initialCoords.left) * scale);

      // TODO: When calculateGrid is executed, the value is transferred negatively to startArea.
      if ((initialCoords.left + (parentRect.left / scale)) < 1) {
        translate.x = parentRect.left + 1;
      }
    }

    if (align === AlignType.Center) {
      nextPosition.x = Math.round(parentRect.left + (parentRect.width - initialCoords.width) / 2);
      translate.x = Math.ceil((nextPosition.x - initialCoords.left) * scale);
    }

    if (align === AlignType.Right) {
      nextPosition.x = Math.round(parentRect.left + parentRect.width - initialCoords.width);
      translate.x = Math.ceil(
        ((parentRect.left + parentRect.width - initialCoords.width - initialCoords.left) * scale),
      );
    }

    if (align === AlignType.Top) {
      nextPosition.y = parentRect.top;
      translate.y = Math.ceil((parentRect.top - initialCoords.top) * scale);
    }

    if (align === AlignType.Middle) {
      nextPosition.y = Math.round(parentRect.top + ((parentRect.height - initialCoords.height) / 2));
      translate.y = Math.ceil((nextPosition.y - initialCoords.top) * scale);
    }

    if (align === AlignType.Bottom) {
      nextPosition.y = Math.round(parentRect.top + (parentRect.height - initialCoords.height));
      translate.y = Math.ceil(
        ((parentRect.height + parentRect.top - initialCoords.height - initialCoords.top) * scale),
      );
    }

    return {
      nextPosition,
      translate,
    };
  }

  private getShadowValuesFromString(shadowString: string): ShadowValues {
    if (!shadowString || shadowString === 'inherit') {
      return {} as ShadowValues;
    }

    const nextShadowString = shadowString.replace(')', '');
    const shadowValuesArray = nextShadowString.split(' ');
    const shadowValuesColors = shadowValuesArray[4].replace('rgba(', '').split(',');
    const offsetX = +shadowValuesArray[0].replace('pt', '');
    const offsetY = +shadowValuesArray[1].replace('pt', '');
    const angle = Math.round(Math.atan2(-offsetY, offsetX) * (180 / Math.PI));
    return {
      blur: +shadowValuesArray[2].replace('pt', ''),
      offset: Math.round(Math.sqrt(offsetX * offsetX + offsetY * offsetY)),
      color: rgbToHex(+shadowValuesColors[0], +shadowValuesColors[1], +shadowValuesColors[2]),
      opacity: Math.round(+shadowValuesColors[3] * 100),
      angle: angle >= 0 ? angle : angle + 360,
    };
  }

  public getShadowString(values: ShadowStyles): string {
    if (!values.hasShadow) {
      return 'inherit';
    }

    const blur = `${values.shadowBlur}pt`;
    const color = hexToRgb(values.shadowColor);
    const offset = values.shadowOffset;
    const angle = values.shadowAngle;
    const offsetX = `${offset * Math.cos(angle * Math.PI / 180)}pt`;
    const offsetY = `${offset * -Math.sin(angle * Math.PI / 180)}pt`;
    const opacity = values.shadowOpacity / 100;
    return  `${offsetX} ${offsetY} ${blur} 0 rgba(${color.r},${color.g},${color.b},${opacity})`;
  }

  private getShadowFilterValuesFromString(shadowString: string): ShadowValues {
    if (!shadowString) {
      return {} as ShadowValues;
    }
    const nextShadowString = shadowString.replace('drop-shadow(', '').replace('))', '');
    const shadowValuesArray = nextShadowString.split(' ');
    const shadowValuesColors = shadowValuesArray[3].replace('rgba(', '').split(',');
    const offsetX = +shadowValuesArray[0].replace('pt', '');
    const offsetY = +shadowValuesArray[1].replace('pt', '');
    const angle = Math.round(Math.atan2(-offsetY, offsetX) * (180 / Math.PI));
    return {
      blur: +shadowValuesArray[2].replace('pt', ''),
      offset: Math.round(Math.sqrt(offsetX * offsetX + offsetY * offsetY)),
      color: rgbToHex(+shadowValuesColors[0], +shadowValuesColors[1], +shadowValuesColors[2]),
      opacity: Math.round(+(shadowValuesColors[3]) * 100),
      angle: angle >= 0 ? angle : angle + 360,
    };
  }

  private getBackgroundGradient(deg?: number, start?: string, end?: string, form?: FormGroup): string {
    let degrees = '90deg';
    if (deg || form.get('bgColorGradientAngle').value) {
      degrees = deg ? `${deg}deg` : `${form.get('bgColorGradientAngle').value}deg`;
    }
    const startGradient = start || form.get('bgColorGradientStart').value || 'white';
    const endGradient = end || form.get('bgColorGradientStop').value || 'white';

    return `linear-gradient(${degrees}, ${startGradient}, ${endGradient})`;
  }

  private updateGradientBackground(gradient: string, form: FormGroup): void {
    form.get('bgColor').patchValue('', { emitEvent: false });
    form.get('bgImage').patchValue(gradient);
  }

  private updateImageScaleFieldSetting(form: FormGroup) {
    const imageSize: ImageSize = form.get('imageSize').value.value;
    if (
      form.get('fillType').value.name === FillType.ImageFill &&
      (imageSize === ImageSize.Initial ||
        imageSize === ImageSize.OriginalSize) &&
      !!form.get('bgImage').value
    ) {
      form.get('imageScale').enable({ emitEvent: false });
    } else {
      form.get('imageScale').disable({ emitEvent: false });
    }
  }

  public updateStyles(element, styles) {
    if (styles.backgroundColor || styles.backgroundColor === '') {
      element.styles.backgroundColor = styles.backgroundColor;
    }
    if (styles.backgroundImage || styles.backgroundImage === '') {
      element.styles.backgroundImage = styles.backgroundImage;
    }

    if (styles?.height) {
      element.styles.height = styles.height;
    }

    element.styles = { ...element.styles, ...styles };
    element.applyStyles();

    return styles;
  }
}


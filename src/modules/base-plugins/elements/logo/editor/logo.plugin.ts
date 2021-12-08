import { ComponentRef, Injectable } from '@angular/core';
import {
  EMPTY,
  merge,
  Observable,
  Subject,
} from 'rxjs';
import {
  finalize,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { isEqual } from 'lodash';

import { pebCreateLogger, PebElementContextState, PebElementType, PebShopContainer } from '@pe/builder-core';
import {
  AbstractEditElementPlugin,
  AfterGlobalInit,
  PebEditorElement,
  PebEditorElementLogo,
  requiredFileType,
  toBase64,
} from '@pe/builder-editor';

import { PebEditorLogoSidebarComponent } from './logo.sidebar';

import ResizeObserver from 'resize-observer-polyfill';

const log = pebCreateLogger('editor:plugins:edit-logo');

export function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

@Injectable({ providedIn: 'any' })
export class PebEditorLogoPlugin extends AbstractEditElementPlugin<PebEditorLogoSidebarComponent> {
  static elementTypes = [PebElementType.Logo];

  sidebarComponent = PebEditorLogoSidebarComponent;

  logger = { log };

  resizeObserver: ResizeObserver;

  afterGlobalInit(): Observable<any> {
    return this.singleElementOfTypeSelected().pipe(
      switchMap((elCmp: PebEditorElementLogo) => {
        this.initPositionForm(elCmp);
        this.initDimensionsForm(elCmp);
        this.initLogoForm(elCmp);
        this.initOpacityForm(elCmp);
        this.initProportionsForm(elCmp);
        this.initImageFilterForm(elCmp);
        this.initBorderForm(elCmp);
        this.initShadowForm(elCmp);

        const entriesMap = new WeakMap();
        this.resizeObserver = new ResizeObserver((entries) => {

          // this.getImageDimensions(elCmp);

          const imageDimentions = this.getImageDimentions(
            entries[0].contentRect.width,
            entries[0].contentRect.height,
            elCmp,
          );

          elCmp.styles = {
            ...elCmp.styles,
            ...imageDimentions,
          };
          // console.log(imageDimentions);
          elCmp.applyStyles();
          this.editor.refreshContext();
        });
        const target = elCmp.nativeElement;
        entriesMap.set(target, this);
        this.resizeObserver.observe(target);

        const sidebarRef = this.initSidebar(elCmp);

        this.initAlignmentForm(sidebarRef);

        return merge(
          this.handleAlignmentForm(elCmp, sidebarRef),
          this.handlePositionForm(elCmp),
          this.handleDimensionsForm(elCmp),
          this.handleLogoForm(elCmp, sidebarRef),
          this.handleOpacityForm(elCmp),
          this.handleProportionsForm(elCmp),
          this.handleImageFilterForm(elCmp),
          this.handleBorderForm(elCmp),
          this.handleShadowForm(elCmp),
        ).pipe(
          tap(() => {
            elCmp.detectChanges();
          }),
          takeUntil(this.state.selectionChanged$()),
          finalize(() => {
            sidebarRef.destroy();
            this.resizeObserver.unobserve(target);
          }),
        );
      }),
    );
  }

  getImageDimensions(elCmp) {
    if (elCmp.context?.data?.src) {
      const img = new Image();
      img.src = elCmp.context?.data?.src;
      elCmp.definition.data = {
        width: img.width,
        height: img.height,
      };
    }
  }

  protected handleBorderForm(elementCmp: PebEditorElement): Observable<any> {
    const elDef = elementCmp.definition;
    const border = elementCmp.border;

    return merge(
      border.form.valueChanges.pipe(
        tap((changes) => {
          if (border.form.invalid) {
            this.logger.log('Border: Change: Invalid');
            return;
          }

          this.logger.log('Border: Change: Valid ', border.form.value);

          const { borderWidth, borderColor, borderStyle } = border.form.value;
          const shadow = elementCmp.shadow;
          const dropShadow = this.getCmpDropShadow(this.getShadowString(shadow.form.value));
          const filter = this.getCmpFilters(elementCmp, this.getShadowString(shadow.form.value));

          elementCmp.styles = {
            ...elementCmp.styles,
            dropShadow,
            filter,
            borderWidth,
            borderColor,
            borderStyle,
            boxShadow: this.getShadowString(shadow.form.value),
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
          const shadow = elementCmp.shadow;
          const dropShadow = this.getCmpDropShadow(this.getShadowString(shadow.form.value));
          const filter = this.getCmpFilters(elementCmp, this.getShadowString(shadow.form.value));
          const newStyles = {
            ...elementCmp.styles,
            dropShadow,
            filter,
            borderWidth,
            borderColor,
            borderStyle,
            boxShadow: this.getShadowString(shadow.form.value),
          };

          return this.store.updateStyles(this.state.screen, {
            [elDef.id]: newStyles,
          });
        }),
      ),
    );
  }

  getImageDimentions(elementWidth, elementHeight, elCmp: PebEditorElementLogo) {
    const imageWidthToHeightRatio = elCmp.definition.data?.width / elCmp.definition.data?.height;
    const imageHeightToWidthRatio = elCmp.definition.data?.height / elCmp.definition.data?.width;

    const elementWidthToHeightRatio =
      (+elementWidth - (elCmp.styles.border ? +elCmp.styles.borderSize * 2 : 0))
      / (+elementHeight - (elCmp.styles.border ? +elCmp.styles.borderSize * 2 : 0));

    const elementHeightToWidthRatio =
      (+elementHeight - (elCmp.styles.border ? +elCmp.styles.borderSize * 2 : 0))
      / (+elementWidth - (elCmp.styles.border ? +elCmp.styles.borderSize * 2 : 0));

    const curWidth = `${(+elementWidth) * imageWidthToHeightRatio / elementWidthToHeightRatio}px`;
    const imageWidth = elementHeightToWidthRatio > imageHeightToWidthRatio ? '100%' : curWidth;

    const curHeight = `${(+elementHeight) * imageHeightToWidthRatio / elementHeightToWidthRatio}px`;
    const imageHeight = elementHeightToWidthRatio < imageHeightToWidthRatio ? '100%' : curHeight;

    return { imageWidth, imageHeight };
  }

  private initLogoForm(elementCmp: PebEditorElementLogo) {
    const styles = elementCmp.target.styles;

    const initialValue = {
      file: null,
      src: elementCmp.context?.data?.src,
    };

    elementCmp.logo = {
      initialValue,
      form: this.formBuilder.group({
        file: [
          initialValue.file,
          [requiredFileType(['png', 'jpg', 'jpeg'])],
        ],
        src: [
          initialValue.src,
        ],
      }),
      update: null,
      submit: new Subject<any>(),
    };
  }

  protected handleImageFilterForm(elementCmp: PebEditorElement): Observable<any> {
    const elDef = elementCmp.definition;
    const filter = elementCmp.filter;
    const shadow = elementCmp.shadow;

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
            filter: this.getCmpFilters(elementCmp, this.getShadowString(shadow.form.value)),
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
          const shadowCmp = elementCmp.shadow;

          return this.store.updateStyles(this.state.screen, {
            [elDef.id]: { filter: this.getCmpFilters(elementCmp, this.getShadowString(shadowCmp.form.value)) },
          });
        }),
      ),
    );
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

          const dropShadow = this.getCmpDropShadow(this.getShadowString(shadow.form.value));
          const filter = this.getCmpFilters(elementCmp, this.getShadowString(shadow.form.value));

          this.logger.log('Shadow: Change: Valid ', shadow.form.value);
          elementCmp.styles = {
            ...elementCmp.styles,
            dropShadow,
            filter,
            boxShadow: this.getShadowString(shadow.form.value),
          };

          console.log(elementCmp.styles);

          elementCmp.applyStyles();
          elementCmp.detectChanges();
        }),
      ),
      shadow.submit.pipe(
        switchMap(() => {
          if (shadow.form.invalid || isEqual(shadow.initialValue, shadow.form.value)) {
            return EMPTY;
          }

          this.logger.log('Shadow: Submit ', shadow.form.value);
          const dropShadow = this.getCmpDropShadow(this.getShadowString(shadow.form.value));
          const filter = this.getCmpFilters(elementCmp, this.getShadowString(shadow.form.value));

          return this.store.updateStyles(this.state.screen, {
            [elDef.id]: { filter, dropShadow, boxShadow: this.getShadowString(shadow.form.value) },
          });
        }),
      ),
    );
  }

  private getBackgroundImage(elementCmp: PebEditorElementLogo) {
    const logo = elementCmp.logo;
    return toBase64(logo.form.value.file);
  }

  private handleLogoForm(elementCmp: PebEditorElementLogo, sidebarRef: ComponentRef<any>): Observable<any> {
    const logo = elementCmp.logo;
    const elDef = elementCmp.definition;

    return merge(
      logo.form.valueChanges.pipe(
        switchMap(async () => {
          if (logo.form.value.file) {
            const backgroundImage = await this.getBackgroundImage(elementCmp) as string;

            if (logo.form.controls.src.value === backgroundImage) {
              return;
            }

            logo.form.controls.src.patchValue(backgroundImage, { emitEvent: false });

            elementCmp.context.state = PebElementContextState.Ready;
            elementCmp.context.data = { src: backgroundImage };

            elementCmp.applyStyles();
            sidebarRef.changeDetectorRef.detectChanges();
            this.editor.refreshContext();
          }
        }),
      ),
      logo.submit.pipe(
        switchMap(() => {
          if (logo.form.invalid || !logo.form.value.file || isEqual(logo.initialValue, logo.form.value)) {
            console.warn('Invalid form: ', logo.form);
            return EMPTY;
          }

          return this.editorApi.uploadImage(PebShopContainer.Builder, logo.form.value.file).pipe(

            switchMap((result: any) => this.editorApi.updateShop({ picture: result.blobName })),
            tap(() => {
              this.editor.refreshContext();
              // elementCmp.applyStyles();
            }),
          );
        }),
      ),
    );
  }

  private getCmpDropShadow(boxShadow: string) {
    const parts = boxShadow?.toString().split(' ');
    if (!parts || boxShadow === 'inherit') {
      return 'inherit';
    }
    delete parts[3];
    return `drop-shadow(${parts.join(' ')})`;
  }

  getCmpFilters(elCmp: PebEditorElement, boxShadow: string) {
    return `${ this.getFilterString(elCmp.filter.form.value) !== 'inherit'
      ? this.getFilterString(elCmp.filter.form.value)
      : ''} ${(boxShadow !== 'inherit'
      ? ` ${this.getCmpDropShadow(boxShadow)}`
      : 'inherit')}`;
  }
}

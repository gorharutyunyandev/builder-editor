import { Injectable } from '@angular/core';
import { EMPTY, merge, Observable } from 'rxjs';
import { finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { isEqual } from 'lodash';

import { pebCreateLogger, PebElementType } from '@pe/builder-core';
import {
  AbstractEditElementPlugin,
  AfterGlobalInit,
  hexToRgb,
  PebEditorElement,
} from '@pe/builder-editor';

import { PebEditorSocialIconSidebarComponent } from './social-icon.sidebar';

const log = pebCreateLogger('editor:plugins:edit-icon');

const styleDefaults = {
  opacity: 1,
};

@Injectable({ providedIn: 'any' })
export class PebEditorSocialIconPlugin extends AbstractEditElementPlugin<PebEditorSocialIconSidebarComponent>
  implements AfterGlobalInit {

  static elementTypes = [PebElementType.SocialIcon];
  logger = { log };
  sidebarComponent = PebEditorSocialIconSidebarComponent;

  afterGlobalInit(): Observable<any> {
    return this.singleElementOfTypeSelected().pipe(
      switchMap((elCmp: PebEditorElement) => {
        this.initPositionForm(elCmp);
        this.initDimensionsForm(elCmp);
        this.initOpacityForm(elCmp);
        this.initProportionsForm(elCmp);
        this.initBackgroundForm(elCmp);
        this.initShadowForm(elCmp, 'filter');
        this.initBorderForm(elCmp);
        this.initLinkForm(elCmp);

        const sidebarRef = this.initSidebar(elCmp);

        this.initAlignmentForm(sidebarRef);

        return merge(
          this.handleAlignmentForm(elCmp, sidebarRef),
          this.handleBorderForm(elCmp),
          this.handleShadowForm(elCmp),
          this.handlePositionForm(elCmp),
          this.handleDimensionsForm(elCmp),
          this.handleOpacityForm(elCmp),
          this.handleProportionsForm(elCmp),
          this.handleBackgroundForm(elCmp, sidebarRef),
          this.handleLinkForm(elCmp),
        ).pipe(
          takeUntil(this.state.selectionChanged$()),
          finalize(() => sidebarRef.destroy()),
        );
      }),
    );
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

          elementCmp.styles = {
            ...elementCmp.styles,
            stroke: borderColor,
            strokeWidth: borderWidth,
            strokeDasharray: this.getDashedArray(borderStyle),
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
          return this.store.updateStyles(this.state.screen, {
            [elDef.id]: {
              stroke: borderColor,
              strokeWidth: borderWidth,
              strokeDasharray: this.getDashedArray(borderStyle),
            },
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

          this.logger.log('Shadow: Change: Valid ', shadow.form.value);
          elementCmp.styles = {
            ...elementCmp.styles,
            filter: this.getShadowString(shadow.form.value),
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
              filter  : this.getShadowString(shadow.form.value),
            },
          });
        }),
      ),
    );
  }

  getShadowString(values): string {
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
    return `drop-shadow(${offsetX} ${offsetY} ${blur} rgba(${color.r},${color.g},${color.b},${opacity}))`;
  }

  private getDashedArray(borderStyle): string {
    switch (borderStyle) {
      case 'shortdashed':
        return '1, 1';
      case 'dashed':
        return '2, 2';
      case 'longdashed':
        return '6, 6';
      case 'dotted':
        return '.3, .3';
      default:
        return '';
    }
  }
}

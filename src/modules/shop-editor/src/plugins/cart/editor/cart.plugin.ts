import { Injectable } from '@angular/core';
import { EMPTY, merge, Observable, Subject } from 'rxjs';
import { finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { isEqual } from 'lodash';

import { pebCreateLogger, PebElementType, PebScreen } from '@pe/builder-core';
import { AbstractEditElementPlugin, AfterGlobalInit, PebEditorElement, PebEditorElementCart } from '@pe/builder-editor';

import { PebEditorCartSidebarComponent } from './cart.sidebar';

const log = pebCreateLogger('shop-editor:plugins:edit-section');

@Injectable()
export class PebEditorShopCartPlugin extends AbstractEditElementPlugin<PebEditorCartSidebarComponent>
  implements AfterGlobalInit {
  static elementTypes = [PebElementType.Cart];

  sidebarComponent = PebEditorCartSidebarComponent;

  logger = { log };

  afterGlobalInit(): Observable<any> {
    return merge(
      this.singleElementOfTypeSelected().pipe(
        switchMap((elCmp: PebEditorElement) => {
          this.initProportionDimensionsForm(elCmp);
          this.initBackgroundForm(elCmp);
          this.initBorderForm(elCmp, 'border');
          this.initBorderForm(elCmp, 'stroke');
          this.initBadgeForm(elCmp);
          this.initBorderForm(elCmp, 'badgeBorder');
          this.initShadowForm(elCmp);
          this.initRotationForm(elCmp);
          this.initOpacityForm(elCmp);

          const sidebarRef = this.initSidebar(elCmp);

          this.initAlignmentForm(sidebarRef);

          return merge(
            this.handleAlignmentForm(elCmp, sidebarRef),
            this.handleProportionDimensionsForm(elCmp),
            this.handleBackgroundForm(elCmp, sidebarRef).pipe(
              tap(() => {
                const gradient = this.getCmpBackgroundGradient(elCmp);
                if (gradient) {
                  elCmp.target.styles = {
                    ...elCmp.target.styles,
                    ...gradient,
                  };
                }
              }),
            ),
            this.handleBorderForm(elCmp, 'border'),
            this.handleBorderForm(elCmp, 'stroke'),
            this.handleBadgeForm(elCmp),
            this.handleBorderForm(elCmp, 'badgeBorder'),
            this.handleShadowForm(elCmp).pipe(
              tap(() => {
                const dropShadow = this.getCmpDropShadow(elCmp);
                if (dropShadow) {
                  elCmp.target.styles = {
                    ...elCmp.target.styles,
                    filter: dropShadow,
                  };
                }
                elCmp.detectChanges();
              }),
            ),
            this.handleOpacityForm(elCmp),
            this.handleRotationForm(elCmp),
          ).pipe(
            tap(() => {
              elCmp.detectChanges();
            }),
            takeUntil(this.state.selectionChanged$()),
            finalize(() => sidebarRef.destroy()),
          );
        }),
      ),
    );
  }

  private initBadgeForm(elementCmp: PebEditorElementCart) {
    const initialValue = {
      background: elementCmp.styles.badgeBackground?.toString() || 'red',
      color: elementCmp.styles.badgeColor?.toString() || 'white',
    };

    elementCmp.badge = {
      initialValue,
      form: this.formBuilder.group({
        badgeBackground: [initialValue.background],
        badgeColor: [initialValue.color],
      }),
      update: null,
      submit: new Subject<any>(),
    };
  }

  private initRotationForm(elementCmp: PebEditorElementCart) {
    const { styles } = elementCmp;
    const angle = +styles.transform?.toString().match(/\d/g).join('');

    const initialValue = {
      angle: angle ? +angle : 0,
    };

    elementCmp.rotation = {
      initialValue,
      form: this.formBuilder.group({
        angle: [initialValue.angle],
      }),
      update: null,
      submit: new Subject<any>(),
    };
  }

  private handleRotationForm(elementCmp: PebEditorElementCart): Observable<any> {
    const elDef = elementCmp.definition;
    const rotation = elementCmp.rotation;
    return merge(
      rotation.form.valueChanges.pipe(
        tap((changes: any) => {
          if (rotation.form.invalid) {
            this.logger.log('Border: Change: Invalid');
            return;
          }

          this.logger.log('Border: Change: Valid ', changes);

          const { angle } = changes;

          const newStyles = {
            transform: `rotate(${angle}deg)`,
          };

          elementCmp.styles = {
            ...elementCmp.styles,
            ...newStyles,
          };
          elementCmp.applyStyles();
        }),
        switchMap(() => {
          if (rotation.form.invalid || isEqual(rotation.initialValue, rotation.form.value)) {
            return EMPTY;
          }
          this.logger.log('Border: Submit ', rotation.form.value);
          const { angle } = rotation.form.value;
          const newStyles = {
            ...elementCmp.target.styles,
            transform: `rotate(${angle}deg)`,
          };
          return this.store.updateStyles(this.state.screen, { [elDef.id]: newStyles });
        }),
      ),
    );
  }

  private handleBadgeForm(elementCmp: PebEditorElementCart): Observable<any> {
    const badge = elementCmp.badge;

    return merge(
      badge.form.valueChanges.pipe(
        tap((changes) => {
          if (badge.form.invalid) {
            this.logger.log('Badge border: Change: Invalid');
            return;
          }
          this.logger.log('Badge border: Change: Valid ', badge.form.value);

          const newStyles = badge.form.value;

          elementCmp.styles = {
            ...elementCmp.styles,
            ...newStyles,
          };

          elementCmp.applyStyles();
          elementCmp.detectChanges();
        }),
        tap(() => badge.submit.next()),
      ),
      badge.submit.pipe(
        switchMap(() => {
          if (badge.form.invalid || isEqual(badge.initialValue, badge.form.value)) {
            return EMPTY;
          }

          this.logger.log('Badge background: Submit ', badge.form.value);
          const screen = elementCmp.target.element.data?.sync ? Object.values(PebScreen) : this.state.screen;
          return this.store.updateStyles(screen, {
            [elementCmp.definition.id]: elementCmp.styles,
          });
        }),
      ),
    );
  }

  private getCmpBackgroundGradient(elCmp: PebEditorElement): any {
    if (!elCmp.target.styles.backgroundImage) {
      return '';
    }
    const parts = elCmp.target.styles.backgroundImage.split(/[(|)]/)[1];
    const values = parts.split(', ');
    const gradient = {
      gradientAngle: values[0].split('deg')[0],
      firstGradientColor: values[1],
      secondGradientColor: values[2],
    };
    return gradient;
  }

  private getCmpDropShadow(elCmp: PebEditorElement) {
    const parts = elCmp.target.styles.boxShadow?.toString().split(' ');
    if (!parts) {
      return;
    }
    delete parts[3];
    return `drop-shadow(${parts.join(' ')})`;
  }
}

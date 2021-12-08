import { Injectable } from '@angular/core';
import { forkJoin, merge, Observable, of } from 'rxjs';
import { debounceTime, filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Validators } from '@angular/forms';

import {
  pebCreateLogger,
  PebElementDef,
  PebElementStyles,
  PebElementType,
  PebScreen,
  pebScreenWidthList,
} from '@pe/builder-core';
import { AbstractEditElementPlugin, AfterGlobalInit, PebEditorElement } from '@pe/builder-editor';

import { PebEditorImageSidebarComponent } from './image.sidebar';

const log = pebCreateLogger('editor:plugins:edit-image');

@Injectable()
export class PebEditorImagePlugin extends AbstractEditElementPlugin<PebEditorImageSidebarComponent>
  implements AfterGlobalInit {
  static elementTypes = [PebElementType.Image];

  sidebarComponent = PebEditorImageSidebarComponent;

  logger = { log };

  afterGlobalInit(): Observable<any> {
    return this.singleElementOfTypeSelected().pipe(
      switchMap((elCmp: PebEditorElement) => {
        this.initPositionForm(elCmp);
        this.initDimensionsForm(elCmp);
        this.initProportionsForm(elCmp);
        this.initImageAdjustment(elCmp);
        this.initDescriptionForm(elCmp);

        const sidebarRef = this.initSidebar(elCmp, {
          imgSrc: elCmp?.styles?.background?.[this.state.screen] || elCmp?.styles?.background
            || elCmp.context?.styles?.backgrounds?.[this.state.screen] || elCmp.context?.styles?.background,
        });
        // debugger

        this.initAlignmentForm(sidebarRef);

        return merge(
          this.handleAlignmentForm(elCmp, sidebarRef),
          this.handlePositionForm(elCmp),
          this.handleDimensionsForm(elCmp),
          this.handleProportionsForm(elCmp),
          this.handleImageAdjustment(elCmp),
          this.handleDescriptionForm(elCmp),
          this.editFlow(elCmp, sidebarRef.instance),
          this.handleScreenChange(elCmp, sidebarRef.instance),
        ).pipe(
          takeUntil(this.state.selectionChanged$()),
          finalize(() => sidebarRef.destroy()),
        );
      }),
    );
  }

  private handleScreenChange(
    el: PebEditorElement,
    sidebar: PebEditorImageSidebarComponent,
  ): Observable<any> {
    // sync styles on change screen
    return this.state.screen$.pipe(
      filter(() => !el.definition.data?.sync), // when sync === true styles of all screens are the same
      tap((screen: PebScreen) => {
        // update form with styles of new screen
        const snapshot = this.store.snapshot;
        const stylesheetIds = snapshot.pages[this.store.activePageId].stylesheetIds;
        if (stylesheetIds) {
          const stylesheetId = stylesheetIds[screen];
          if (stylesheetId) {
            const styles = snapshot.stylesheets[stylesheetId][el.definition.id];
            sidebar.patchForm(styles);
          }
        }
      }),
    );
  }

  protected initImageAdjustment(elementCmp: PebEditorElement): void {
    const { imageFilter } = elementCmp.styles;

    const imageFilters = this.calculateImageFilters(imageFilter);
    const initialValue = {
      saturation: (imageFilters.saturate ?? 0) as number,
      exposure: (imageFilters.brightness ?? 0) as number,
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

  private calculateImageFilters(imageFilter) {
    const filters = imageFilter ? imageFilter.toString().split(' ') : [];
    if (filters.length < 3) {
      return { saturate: 0, brightness: 0 };
    }
    const saturate = filters[1].match(/\d/g).join('') - 100;
    const brightness = filters[2].match(/\d/g).join('') - 100;
    return { saturate, brightness };
  }

  private updateImageOnOtherScreens(element, styles: PebElementStyles) {
    const screenStyles = Object.values(PebScreen).reduce((acc, screen: PebScreen) => {
      const stylesheet = {
        ...element.target.styles,
        ...styles,
      };
      if (screen !== this.state.screen) {
        // don't change position for other screens
        stylesheet.width = this.calcElementLeftWidthByScreen(element, screen);
        const newStyles = Object.keys(stylesheet)
          .filter(prop => !(/^margin|gridArea$|gridColumn$/.test(prop)))
          .reduce((result, prop) => (result[prop] = stylesheet[prop], result), {});
        acc[screen] = { [element.definition.id]: newStyles };
      } else {
        acc[screen] = { [element.definition.id]: stylesheet };
      }
      return acc;
    },                                                   {});
    return this.store.updateStylesByScreen(screenStyles);
  }

  calcElementLeftWidthByScreen(element, screen: PebScreen) {
    const page = this.store.snapshot.pages[this.store.activePageId];
    const stylesheetId = page.stylesheetIds[screen];
    const styleSheets = this.store.snapshot.stylesheets[stylesheetId];
    const oldStyles = styleSheets[element.target.element.id];
    const oldMarginLeft = oldStyles.marginLeft as number;
    const calcPossibleWidth = pebScreenWidthList[screen] - (oldMarginLeft + element.target.styles.width);
    return calcPossibleWidth < 0 ? pebScreenWidthList[screen] - oldMarginLeft : element.target.styles.width;
  }

  //
  //  Old code
  //
  editFlow(element: PebEditorElement, sidebar: PebEditorImageSidebarComponent): Observable<any> {
    return merge(
      sidebar.changeStyle.pipe(
        tap((styles) => {
          element.styles = { ...element.styles, ...styles };
          element.applyStyles();
        }),
      ),
      sidebar.changeStyleFinal.pipe(
        tap((styles) => {
          element.styles = { ...element.styles, ...styles };
        }),
        debounceTime(500),
        switchMap((styles) => {
          const sync = element.definition.data?.sync;
          if (sync) {
            return this.updateImageOnOtherScreens(element, styles);
          }
          return this.store.updateStyles(this.state.screen, {
            [element.definition.id]: styles,
          });
        }),
      ),
      sidebar.changeData.pipe(
        switchMap((data) => {
          if (element.definition.type === PebElementType.Logo) {
            return of(data.src);
          }
          const elementData = {
            ...element.definition.data,
            sync: data.sync ?? element.definition.data.sync,
          };

          const newElementDef: PebElementDef = {
            ...element.definition,
            data: elementData,
          };
          element.definition.data = newElementDef.data;

          const screens = elementData.sync ? Object.values(PebScreen) : [element.target.options.screen];
          const updateStylesObservables = [];
          if (data.srcScreens) {
            screens.forEach((screen: PebScreen) => {
              const page = this.store.snapshot.pages[this.store.activePageId];
              const stylesheetId = page.stylesheetIds[screen];
              const stylesheet = this.store.snapshot.stylesheets[stylesheetId];
              stylesheet[element.definition.id].background = data.srcScreens[this.state.screen];
              element.styles.background = data.srcScreens[this.state.screen];
              element.applyStyles();
              updateStylesObservables.push(
                this.store.updateStyles(screen, stylesheet, element.target.options.screen).pipe(
                  tap(() => element.detectChanges()),
                ),
              );
            });
          }

          // widget.cdr.detectChanges();
          // TODO: create more efficient way to detect changes in image element
          return forkJoin([
            this.store.updateElement(newElementDef).pipe(
              tap(() => element.detectChanges()),
            ),
            updateStylesObservables,
          ]);
        }),
      ),
    );
  }
}

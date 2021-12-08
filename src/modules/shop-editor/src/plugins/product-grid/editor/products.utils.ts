import { Injectable } from '@angular/core';

import { Axis, PebEditorElement } from '@pe/builder-editor';
import { PebElementType } from '@pe/builder-core';
export const PEB_DEFAULT_PRODUCTS_GAP = 15;

export const getValidGap = (gap: string | number): number => {
  const result = isNaN(Number(gap)) || gap === ''
    ? PEB_DEFAULT_PRODUCTS_GAP : Number(gap);
  return result;
};
@Injectable({ providedIn: 'any' })
export class ProductUtils {
  getColumnsAndRows(elCmp: PebEditorElement) {
    const columns = Number(elCmp.styles.productTemplateColumns || 2);
    const rows = Number(elCmp.styles.productTemplateRows || 1);
    const productTemplateColumns = elCmp.context?.data?.length
      ? columns > elCmp.context.data.length
        ? elCmp.context.data.length
        : columns
      : 1;

    const productTemplateRows = elCmp.context?.data?.length
      ? Math.ceil(elCmp.context?.data?.length / productTemplateColumns)
      : 1;

    return { productTemplateColumns, productTemplateRows };
  }
  getGapsFromStyles(elCmp: PebEditorElement) {
    const productTemplateColumnGap = getValidGap(elCmp.styles.columnGap);
    const productTemplateRowGap = getValidGap(elCmp.styles.rowGap);

    return { productTemplateColumnGap, productTemplateRowGap };
  }

  updateDimensions(component, columns) {
    const {
      productTemplateColumns,
      productTemplateRows,
    } = this.getColumnsAndRows(component);

    const {
      productTemplateColumnGap,
      productTemplateRowGap,
    } = this.getGapsFromStyles(component);

    const styles : any = {
      width: Math.max(
        component.getMinPossibleDimensions(Axis.Horizontal),
        ((component.productDimensions.form.value.width
          + component.productGaps?.form.value.columnGap) * columns)
          + (productTemplateColumnGap * (columns - 1)),
      ),
      height: ((component.productDimensions.form.value.height
        + component.productGaps?.form.value.rowGap) * productTemplateRows)
        + (productTemplateRowGap * (productTemplateRows - 1)),

    };

    component.dimensions.form.patchValue(styles);

  }
  public availableSpace(elCmp: any, nextStyles?: any) {
    let res = true;
    elCmp.parent.children.map((ch) => {
      if (
        ch.definition.id != elCmp.definition.id &&
        ch.definition.type != PebElementType.Block &&
        (ch.nativeElement.offsetLeft) < ((elCmp.nativeElement.offsetLeft)
        + (nextStyles?.width ? nextStyles.width : elCmp.nativeElement.clientWidth)) &&
        (ch.nativeElement.offsetTop) < ((elCmp.nativeElement.offsetTop)
        + (nextStyles?.height ? nextStyles.height : elCmp.nativeElement.clientHeight))
      ) {
        res = false;
      }
    });

    return res;
  }

}

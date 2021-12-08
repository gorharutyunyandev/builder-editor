import { Injectable } from '@angular/core';

import { PebEditorElement } from '@pe/builder-editor';

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
}

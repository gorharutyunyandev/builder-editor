import { ChangeDetectorRef } from '@angular/core';
import { AsyncValidatorFn, FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { PebShopsApi } from '@pe/builder-api';


export function shopNameAsyncValidator(
  api: PebShopsApi,
  cdr: ChangeDetectorRef,
  currentName?: string,
): AsyncValidatorFn {
  return (control: FormControl) => {
    return of(control.value).pipe(
      switchMap((name) => {
        if (name === currentName) {
          return of(null);
        }
        return api.validateShopName(name).pipe(
          map(({ result }) => {
            cdr.markForCheck();
            return result ? null : { unique: true };
          }),
        );
      }),
    );
  };
}

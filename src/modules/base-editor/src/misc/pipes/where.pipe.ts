import { Pipe, PipeTransform } from '@angular/core';
import { get, isArray, isFunction } from 'lodash';

@Pipe({ name: 'where' })
export class WherePipe implements PipeTransform {
  transform(input: any, fn: any): any {
    if (!isArray(input)) {
      return input;
    }

    if (isFunction(fn)) {
      return input.filter(fn);
    }  if (isArray(fn)) {
      const [key, value] = fn;
      return input.filter((item: any) => get(item, key) === value);
    }  if (fn) {
      return input.filter((item: any) => item === fn);
    }
    return input;

  }
}

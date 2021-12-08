import { isArray, isFunction, merge } from 'lodash';

import { PebTemplate } from '../models/client';
import { PebElementDef, PebElementId, PebElementWithParent } from '../models/element';

export function pebMapElementDeep(
  element: PebElementDef,
  handler: (el: PebElementDef) => PebElementDef,
): PebElementDef {
  const { children, ...elementProps } = handler(element);

  return {
    ...elementProps,
    children:
      children ? (children.length ? children.map(child => pebMapElementDeep(child, handler)) : []) : element.children,
  };
}

export function pebFindElementDeep(
  element: PebElementDef,
  handler: (el: PebElementDef) => boolean,
): PebElementDef {
  return element.children?.reduce(
    (acc, el) => acc ? acc : handler(el) ? el : pebFindElementDeep(el, handler),
    undefined,
  );
}

export function pebFilterElementsDeep(
  element: PebElementDef,
  handler: (el: PebElementDef) => boolean = el => !!el,
): PebElementDef[] {
  return element.children?.reduce(
    (acc, el) => {

      if (handler(el)) {
        acc.push(el);
      }

      return el.children ? [...acc, ...pebFilterElementsDeep(el, handler)] : acc;
    },
    [],
  );
}

/** @deperecated use pebFindElementDeep instead */
export function pebFilterElementDeep(
  element: PebElementDef,
  handler: (el: PebElementDef) => boolean,
): PebTemplate | PebElementDef {
  const nextChildren = element.children?.filter(handler);

  return {
    ...merge({}, element),
    children: nextChildren?.map(child => pebFilterElementDeep(child, handler)),
  };
}

/** @deperecated use pebFilterElementsDeep instead */
export function pebTraverseElementDeep(
  element: PebElementDef,
  handler: (el: PebElementDef) => any,
): void {
  handler(merge({}, element));

  if (isArray(element.children)) {
    element.children.forEach(el => pebTraverseElementDeep(el, handler));
  }
}

/** @deperecated */
export function pebFindElementParents(document: PebElementDef, id: PebElementId): PebElementDef[] {
  const stack = [{ node: document, i: 0 }];
  while (stack.length) {
    let current = stack[stack.length - 1];
    while (current.i < current.node.children.length) {
      const node = current.node.children[current.i];

      if (node.id === id) {
        return stack
          .filter(el => el.node.id !== document.id)
          .map(el => el.node);
      }

      stack.push({ node, i: 0 });
      current.i = current.i + 1;
      current = stack[stack.length - 1];
    }

    stack.pop();
  }

  return null;
}

/** @deperecated */
export function pebFindElementChildren(
  element: PebElementDef,
  predicate?: ((e: PebElementDef) => boolean),
): PebElementDef[] {
  if (predicate && !isFunction(predicate)) {
    throw new Error('Unsupported selector');
  }

  predicate = predicate || (() => true); // tslint:disable-line

  const result = [];

  pebTraverseElementDeep(element, (el) => {
    if (predicate(el)) {
      result.push(el);
    }
  });

  return result;
}

/** @deperecated */
export function pebTraverseElementDeepWithParent(
  element: PebElementDef,
  handler: (el: any) => any,
  parentId: null | string = null,
  priority: any = -1,
): void {
  const nextPriority = parseInt(priority, 10) + 1;
  handler({ ...element, parentId, priority: nextPriority });

  if (isArray(element?.children)) {
    element.children.forEach(el => pebTraverseElementDeepWithParent(el, handler, element.id, nextPriority));
  }
}

/** @deperecated */
export function pebFindElementChildrenWithParent(
  element: PebElementDef,
  predicate: ((e: PebElementDef) => boolean) = (() => true),
): PebElementWithParent[] {
  if (predicate && !isFunction(predicate)) {
    throw new Error('Unsupported selector');
  }

  const result = [];

  pebTraverseElementDeepWithParent(element, (el) => {
    if (predicate(el)) {
      result.push(el);
    }
  });

  return result;
}

/**
 * Transform multiple style considering scale
 * Example:
 *   10 5 auto 0 => 10px 5px auto 0px
 *   3fr => 3fr
 *   10 => 10px
 *   50% => 50%
 *   auto => auto
 */
export const transformStyleProperty = (properties: string | number, scale: number) => String(properties)
  .split(' ')
  .map(property =>
    (property).toString().includes('%')
    || (property).toString().includes('fr')
    || isNaN(parseInt(property as string, 10))
      ? property
      : `${parseInt(property, 10) * scale}px`,
  ).join(' ');

export const pebScaleText = (text: string, scale: number): string => {
  return text.replace(/(font-size: )(.*?)px/g, (match) => {
    return match.replace(/\d+/g, m => String(Math.ceil((parseInt(m, 10) * scale))));
  });
};

export const pebResetScaleText = (text: string, scale: number): string => {
  return text.replace(/(font-size: )(.*?)px/g, (match) => {
    return match.replace(/\d+/g, m => String(Math.ceil((parseInt(m, 10) / scale))));
  });
};

/** @deprecated use pebScaleText instead */
export const scaleTextInnerFonts = (renderer: any, text: string, scale: number): string => {
  return pebScaleText(text, scale);
};

// import { PebElementDef, PebElementType, pebMapElementDeep } from '..';
// import { pebFilterElementDeep, pebFindElementChildren, pebFindElementChildrenWithParent,
// pebFindElementDeep, pebFindElementParents, pebFindElementsDeep, pebTraverseElementDeep,
// pebTraverseElementDeepWithParent, scaleTextInnerFonts, transformStyleProperty } from './element-utils';

// describe('element-utils', () => {

//   let element: PebElementDef;

//   beforeEach(() => {

//       const elementMock = {
//           id: 'button',
//           type: PebElementType.Button,
//           children: [
//                 { id: 'line', type: PebElementType.Line },
//                 { id: 'line2', type: PebElementType.Line },
//             ],
//           data: {},
//           meta: {},
//         };

//       element = elementMock as any;

//     });

//   it('should pebMapElementDeep', () => {

//       expect(pebMapElementDeep(element, (element) => element)).toBeTruthy();

//     });

//   it('shoud pebFindElementDeep', () => {

//       expect(pebFindElementDeep(element, (element) => element.id === element.id)).toBeTruthy();
//       expect(pebFindElementDeep(element, (element) => element.id !== element.id)).toBeUndefined();

//       element.children = undefined;

//       expect(pebFindElementDeep(element, (element) => element.id === element.id)).toBeUndefined();

//     });

//   it('should pebFindElementsDeep', () => {

//       expect(pebFindElementsDeep(element, (element) => element.id === element.id)).toBeTruthy();
//         // expect(pebFindElementsDeep(element, (element) => element.id === '3')).toBeUndefined();

//       element.children = undefined;

//       expect(pebFindElementsDeep(element, (element) => element.id === element.id)).toBeUndefined();

//     });

//   it('should pebFilterElementDeep', () => {

//       expect(pebFilterElementDeep(element, (element) => element.id === element.id)).toBeTruthy();

//     });

//   it('should pebTraverseElementDeep', () => {

//       expect(pebTraverseElementDeep(element, (element) => element.id === element.id)).toBeUndefined();

//     });

//   it('should pebFindElementParents', () => {

//       const document = {
//           id: 'doc',
//           children: [
//               element,
//             ],
//         };

//       expect(pebFindElementParents(document as any, element.id)).toBeTruthy();

//     });

//   it('should pebFindElementChildren', () => {

//       expect(pebFindElementChildren(element, (element) => true)).toBeTruthy();
//       expect(pebFindElementChildren(element, (element) => false)).toBeTruthy();
//       expect(pebFindElementChildren(element, undefined)).toBeTruthy();
//       expect(() => {
//           pebFindElementChildren(element, element as any);
//         }).toThrowError();

//     });

//   it('should pebTraverseElementDeepWithParent', () => {

//       expect(pebTraverseElementDeepWithParent(element, (element) => true, 'parent', '1')).toBeUndefined();
//       expect(pebTraverseElementDeepWithParent(element, (element) => true, undefined, undefined)).toBeUndefined();
//       expect(pebTraverseElementDeepWithParent(undefined, (element) => true, 'parent', '1')).toBeUndefined();

//     });

//   it('should pebFindElementChildrenWithParent', () => {

//       expect(pebFindElementChildrenWithParent(element, (element) => true)).toBeTruthy();
//       expect(pebFindElementChildrenWithParent(element, (element) => false)).toBeTruthy();
//       expect(pebFindElementChildrenWithParent(element, undefined)).toBeTruthy();
//       expect(() => {
//           pebFindElementChildrenWithParent(element, element as any);
//         }).toThrowError();

//     });

//   it('should transformStyleProperty', () => {

//       let properties = 'display: none';

//       expect(transformStyleProperty(properties, 1)).toEqual(properties);

//       properties = 'width: 500';

//       expect(transformStyleProperty(properties, 1)).toEqual(properties + 'px');

//     });

//   it('should scaleTextInnerFonts', () => {
//       const createdElement = {
//           innerHTML: '',
//           children: [],
//           style: {} as CSSStyleDeclaration,
//           tagName: 'FONT',
//           hasAttribute() {
//               return false;
//             },
//           getAttribute() {
//               return 16;
//             },
//         };
//       const renderer = {
//           createElement() {
//               return createdElement;
//             },
//         };
//       const text = 'dummy text';

//       scaleTextInnerFonts(renderer as any, text, 1);

//       createdElement.style.fontSize = '16px';
//       element.children = {
//           ...element.children,
//           item() {
//               return {
//                   children: [],
//                 };
//             },
//           length: 2,
//         } as any;
//       createdElement.children = element.children;

//       scaleTextInnerFonts(renderer as any, text, 1);

//       createdElement.style.fontSize = '1rem';

//       scaleTextInnerFonts(renderer as any, text, 1);

//       createdElement.hasAttribute = () => {
//           return true;
//         };

//       expect(scaleTextInnerFonts(renderer as any, text, 1)).toEqual(text);

//     });

// });

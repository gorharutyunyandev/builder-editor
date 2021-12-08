// import { PebEffectTarget, PebTemplateEffect } from '../../models/action';
// import { pebLayoutAppendElementHandler, pebLayoutCreateUpdateElementEffect,
// pebLayoutDeleteElementHandler, pebLayoutDestroyHandler, pebLayoutInitHandler,
// pebLayoutRelocateElementHandler, pebLayoutUpdateElementHandler } from './template.effects';

// describe('template.effects', () => {

//   let payload: any,
//       prevLayout: any;

//   beforeEach(() => {

//       const payloadMock = {
//           name: 'payload',
//           variant: 'variant',
//           data: {
//               id: '000',
//             },
//         };

//       const prevLayoutMock = {
//           name: 'prevShop',
//           variant: 'prevVariant',
//           data: {
//               id: '001',
//             },
//         };

//       payload = payloadMock;
//       prevLayout = prevLayoutMock;

//     });

//   it('should pebLayoutInitHandler', () => {

//       expect(pebLayoutInitHandler(prevLayout, payload)).toEqual(payload);

//     });

//   it('should pebLayoutDestroyHandler', () => {

//       expect(pebLayoutDestroyHandler(prevLayout)).toBeNull();

//     });

//   it('should pebLayoutAppendElementHandler', () => {

//       payload.before = 'child001';
//       payload.to = '001';
//       payload.element = {};

//       prevLayout.id = '000';
//       prevLayout.children = [
//             { id: 'child001', children: [] },
//         ];

//       expect(pebLayoutAppendElementHandler(prevLayout, payload)).toBeTruthy();

//       payload.to = 'child001';

//       expect(pebLayoutAppendElementHandler(prevLayout, payload)).toBeTruthy();

//     });

//   it('should pebLayoutCreateUpdateElementEffect', () => {

//       const templateId = 'template001';
//       const element = {};
//       const expected = {
//           type: PebTemplateEffect.UpdateElement,
//           target: `${PebEffectTarget.Templates}:${templateId}`,
//           payload: element,
//         };

//       expect(pebLayoutCreateUpdateElementEffect(templateId, element as any)).toEqual(expected);

//     });

//   it('should pebLayoutUpdateElementHandler', () => {

//       payload = {
//           ...payload,
//           children: [],
//         };

//       expect(pebLayoutUpdateElementHandler(prevLayout, payload)).toEqual(payload);

//       payload.id = undefined;
//       prevLayout = {
//           id: '000',
//           ...prevLayout,
//           children: [],
//         };

//       expect(pebLayoutUpdateElementHandler(prevLayout, payload)).toEqual(prevLayout);

//     });

//   it('should pebLayoutRelocateElementHandler', () => {

//       expect(() => {
//           pebLayoutRelocateElementHandler(prevLayout, payload);
//         }).toThrowError();

//       payload.elementId = '000';
//       prevLayout.children = [
//             { id: '000' },
//             { id: '002', children: [] },
//         ];

//       expect(pebLayoutRelocateElementHandler(prevLayout, payload)).toBeTruthy();

//       payload.nextParentId = '002';

//       expect(pebLayoutRelocateElementHandler(prevLayout, payload)).toBeTruthy();

//     });

//   it('should pebLayoutDeleteElementHandler', () => {

//       const payloadId = '000';
//       prevLayout.children = [
//             { id: '000' },
//             { id: '002', children: [] },
//         ];

//       expect(pebLayoutDeleteElementHandler(prevLayout, payloadId)).toBeTruthy();

//     });

// });

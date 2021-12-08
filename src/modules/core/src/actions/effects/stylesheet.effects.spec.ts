// import { merge, omit } from 'lodash';

// import { pebStylesheetDeleteHandler, pebStylesheetInitHandler,
// pebStylesheetReplaceHandler, pebStylesheetUpdateHandler } from './stylesheet.effects';

// describe('stylesheets.effects', () => {

//   let payload: any,
//       prevState: any;

//   beforeEach(() => {

//       const payloadMock = {
//           name: 'payload',
//           variant: 'variant',
//           data: {
//               id: '000',
//             },
//         };

//       const prevStateMock = {
//           name: 'prevShop',
//           variant: 'prevVariant',
//           data: {
//               id: '001',
//             },
//         };

//       payload = payloadMock;
//       prevState = prevStateMock;

//     });

//   it('should pebStylesheetInitHandler', () => {

//       expect(pebStylesheetInitHandler(prevState, payload)).toEqual(payload);

//     });

//   it('should pebStylesheetUpdateHandler', () => {

//       const expected = merge(
//             {},
//             prevState,
//             payload,
//         );

//       expect(pebStylesheetUpdateHandler(prevState, payload)).toEqual(expected);

//     });

//   it('should pebStylesheetReplaceHandler', () => {

//       payload.selector = 'block';
//       payload.styles = {
//           width: 10,
//         };

//       prevState.block = {};

//       const expected = {
//           ...(omit(prevState, [payload.selector])),
//           [payload.selector]: payload.styles,
//         };

//       expect(pebStylesheetReplaceHandler(prevState, payload)).toEqual(expected);

//     });

//   it('should pebStylesheetDeleteHandler', () => {

//       const stylesheetId = 'block';

//       expect(pebStylesheetDeleteHandler(prevState, stylesheetId)).toEqual(prevState);

//       prevState.block = {};

//       expect(pebStylesheetDeleteHandler(prevState, stylesheetId)).toEqual({
//           name: 'prevShop' as any,
//           variant: 'prevVariant' as any,
//           data: {
//               id: '001',
//             },
//         });

//     });

// });

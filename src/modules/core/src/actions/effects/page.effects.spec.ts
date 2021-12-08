// import { pebPageEffectCreateHandler, pebPageEffectDeleteHandler, pebPageEffectUpdateHandler } from './page.effects';

// describe('page.effects', () => {

//   let payload: any,
//       prevPage: any;

//   beforeEach(() => {

//       const payloadMock = {
//           name: 'payload',
//           variant: 'variant',
//           data: {
//               id: '000',
//             },
//         };

//       const prevPageMock = {
//           name: 'prevPage',
//           variant: 'prevVariant',
//           data: {
//               id: '001',
//             },
//         };

//       payload = payloadMock;
//       prevPage = prevPageMock;

//     });

//   it('should pebPageEffectCreateHandler', () => {

//       expect(pebPageEffectCreateHandler(null, payload)).toEqual(payload);

//     });

//   it('should pebPageEffectUpdateHandler', () => {

//       expect(pebPageEffectUpdateHandler(prevPage, payload)).toEqual(payload);

//       payload.name = undefined;
//       payload.variant = undefined;

//       const expected = {
//           ...prevPage,
//           name: prevPage.name,
//           variant: prevPage.variant,
//           data: {
//               ...prevPage.data,
//               ...payload.data,
//             },
//         };

//       expect(pebPageEffectUpdateHandler(prevPage, payload)).toEqual(expected);

//     });

//   it('should pebPageEffectDeleteHandler', () => {

//       expect(pebPageEffectDeleteHandler(prevPage, payload)).toBeNull();

//     });


// });

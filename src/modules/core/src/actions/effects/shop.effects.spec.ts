// import { pebShopEffectAppendPagesHandler, pebShopEffectCreateHandler,
// pebShopEffectDeletePagesHandler, pebShopEffectUpdateDataHandler,
// pebShopEffectUpdatePagesHandler, pebShopEffectUpdateRoutingHandler } from './shop.effects';

// describe('shop.effects', () => {

//   let payload: any,
//       prevShop: any;

//   beforeEach(() => {

//       const payloadMock = {
//           name: 'payload',
//           variant: 'variant',
//           data: {
//               id: '000',
//             },
//         };

//       const prevShopMock = {
//           name: 'prevShop',
//           variant: 'prevVariant',
//           data: {
//               id: '001',
//             },
//         };

//       payload = payloadMock;
//       prevShop = prevShopMock;

//     });

//   it('should pebShopEffectCreateHandler', () => {

//       expect(pebShopEffectCreateHandler(prevShop, payload)).toEqual(payload);

//     });

//   it('should pebShopEffectUpdateDataHandler', () => {

//       const expected = {
//           ...prevShop,
//           data: {
//               ...prevShop.data,
//               ...payload,
//             },
//         };

//       expect(pebShopEffectUpdateDataHandler(prevShop, payload)).toEqual(expected);

//     });

//   it('should pebShopEffectUpdateRoutingHandler', () => {

//       const routing = [
//             { id: 'route001' },
//         ];

//       const expected = {
//           ...prevShop,
//           routing,
//         };

//       expect(pebShopEffectUpdateRoutingHandler(prevShop, routing as any)).toEqual(expected);

//     });

//   it('should pebShopEffectUpdatePagesHandler', () => {

//       const pageIds = [
//           'page001',
//           'page002',
//         ];

//       const expected = {
//           ...prevShop,
//           pageIds,
//         };

//       expect(pebShopEffectUpdatePagesHandler(prevShop, pageIds as any)).toEqual(expected);

//     });

//   it('should pebShopEffectAppendPagesHandler', () => {

//       const pageId = 'page000';

//       prevShop.pageIds = [
//           'page001',
//         ];

//       const expected = {
//           ...prevShop,
//           pageIds: [...prevShop.pageIds, pageId],
//         };

//       expect(pebShopEffectAppendPagesHandler(prevShop, pageId)).toEqual(expected);

//     });

//   it('should pebShopEffectDeletePagesHandler', () => {

//       const pageId = 'page000';

//       prevShop.pageIds = [
//           'page000',
//           'page001',
//         ];

//       const expected = {
//           ...prevShop,
//           pageIds: ['page001'],
//         };

//       expect(pebShopEffectDeletePagesHandler(prevShop, pageId)).toEqual(expected);

//     });

// });

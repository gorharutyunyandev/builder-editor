// import { pebCloneShopTheme, PebElementType } from '..';
// import { PebScreen } from '../constants';
// import { PebPageType, PebPageVariant, PebShop } from '../models/client';

// describe('clone-shop', () => {

//   let proto: PebShop;

//   beforeEach(() => {

//       const protoMock = {
//           id: 'proto',
//           data: {},
//           routing: [
//               {
//                 pageId: 'proto',
//               },
//             ],
//           context: {
//               '#logo': {},
//             },
//           pages: [
//               {
//                 id: 'page01',
//                 name: 'page01',
//                 variant: PebPageVariant.Front,
//                 type: PebPageType.Master,
//                 master: null,
//                 data: {},
//                 template: {
//                       id: '001',
//                       children: [
//                             { type: PebElementType.Logo },
//                         ],
//                     },
//                 stylesheets: {
//                       [PebScreen.Desktop]: {
//                           '001': {},
//                         },
//                       [PebScreen.Tablet]: {
//                           '001': {},
//                         },
//                       [PebScreen.Mobile]: {
//                           '001': {},
//                         },
//                     },
//                 context: {
//                       '001': {},
//                     },
//               },
//               {
//                 id: 'page02',
//                 name: 'page02',
//                 variant: PebPageVariant.Front,
//                 type: PebPageType.Master,
//                 master: null,
//                 data: {},
//                 template: {
//                       id: '001',
//                     },
//                 stylesheets: {
//                       [PebScreen.Desktop]: {
//                           '001': {},
//                         },
//                       [PebScreen.Tablet]: {
//                           '001': {},
//                         },
//                       [PebScreen.Mobile]: {
//                           '001': {},
//                         },
//                     },
//                 context: {
//                       '001': {},
//                     },
//               },
//             ],
//         } as any;

//       proto = protoMock;

//     });

//   it('should pebCloneShopTheme', () => {

//       expect(pebCloneShopTheme(proto).id).toEqual(proto.id);

//       proto.context = {
//           '@mobile-menu': {},
//         };

//       expect(pebCloneShopTheme(proto).id).toEqual(proto.id);

//     });

// });

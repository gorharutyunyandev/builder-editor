// import {
//   pebCreatePageInitEffects,
//   pebCreateShopInitAction,
//   PebPage,
//   PebPageType,
//   PebPageVariant,
//   PebScreen,
//   PebShopThemeSnapshot,
// } from '..';

// describe('create-shop-init-action', () => {

//   let snapshot: PebShopThemeSnapshot;
//   let page: PebPage;

//   beforeEach(() => {

//     const snapshotMock = {
//       id: '001',
//       hash: 'hash-001',
//       shop: {} as any,
//       pages: {
//         page01: {
//           id: 'page01',
//           name: 'name01',
//           variant: PebPageVariant.Default,
//           type: PebPageType.Master,
//           data: {} as any,
//           templateId: 'temp01',
//           stylesheetIds: {
//             [PebScreen.Desktop]: 'style01-desktop',
//             [PebScreen.Tablet]: 'style01-table',
//             [PebScreen.Mobile]: 'style01-mobile',
//           },
//           stylesheets: {
//             'style01-desktop': {},
//             'style01-table': {},
//             'style01-mobile': {},
//           },
//           contextId: 'context01',
//         } as any,
//       },
//       emplates: {
//         temp01: {} as any,
//       },
//       stylesheets: {
//         'style01-desktop': {},
//         'style01-table': {},
//         'style01-mobile': {},
//       },
//       contextSchemas: {
//         context01: {},
//       },
//     };

//     snapshot = snapshotMock;
//     page = snapshotMock.pages.page01;

//   });

//   it('should pebCreatePageInitEffects', () => {

//     expect(pebCreatePageInitEffects(page)).toBeTruthy();

//   });

//   it('should pebCreateShopInitAction', () => {

//     const shop = {
//       pages: [
//         page,
//       ],
//       data: {},
//       routing: {},
//     };

//     shop.pages[0].variant = PebPageVariant.Front;

//     expect(pebCreateShopInitAction(shop as any)).toBeTruthy();

//   });

// });

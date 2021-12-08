// import { PebScreen } from './constants';
// import { PebPageType, PebPageVariant } from './models/client';
// import { snapshotToSourceConverter } from './snapshot-to-source.converter';

// describe('snapshotToSourceConverter', () => {

//   it('should covert snapshot to source', () => {

//       const snapshot = {
//           id: '001',
//           hash: 'hash-001',
//           shop: {},
//           pages: {
//               page01: {
//                   id: '01',
//                   name: 'name01',
//                   variant: PebPageVariant.Default,
//                   type: PebPageType.Master,
//                   data: {},
//                   templateId: 'temp01',
//                   stylesheetIds: {
//                       [PebScreen.Desktop]: 'style01-desktop',
//                       [PebScreen.Tablet]: 'style01-table',
//                       [PebScreen.Mobile]: 'style01-mobile',
//                     },
//                   contextId: 'context01',
//                 },
//             },
//           templates: {
//               temp01: {},
//             },
//           stylesheets: {
//               'style01-desktop': {},
//               'style01-table': {},
//               'style01-mobile': {},
//             },
//           contextSchemas: {
//               context01: {},
//             },
//         };

//       expect(snapshotToSourceConverter(snapshot as any)).toBeTruthy();

//     });

// });

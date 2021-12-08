// import { pebContextSchemaEffectDeleteHandler, pebContextSchemaEffectInitHandler,
// pebContextSchemaEffectUpdateHandler } from './context-schema.effects';

// describe('context=schema.effects', () => {

//   let payload: any;

//   beforeEach(() => {

//       const payloadMock = {
//           data: {
//               id: '000',
//             },
//         };

//       payload = payloadMock;

//     });

//   it('should pebContextSchemaEffectInitHandler', () => {

//       expect(pebContextSchemaEffectInitHandler(null, payload)).toEqual(payload);

//     });

//   it('should pebContextSchemaEffectUpdateHandler', () => {

//       expect(pebContextSchemaEffectUpdateHandler({}, payload)).toEqual(payload);

//     });

//   it('should pebContextSchemaEffectDeleteHandler', () => {

//       expect(pebContextSchemaEffectDeleteHandler({}, 'payload')).toEqual({});
//       expect(pebContextSchemaEffectDeleteHandler({ payload: payload }, 'payload')).toEqual({});

//     });

// });

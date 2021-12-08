// import { fontFamilyTransform } from './font-family.transform';

// describe('fontFamilyTransform', () => {

//   let transform: any,
//     execCommandSpy: any,
//     queryCommandValueSpy: any,
//     doc: any,
//     value: any,
//     replace_with: string;
//   replace_with = 'tntntn';

//   beforeEach(() => {

//     transform = fontFamilyTransform;
//     doc = {
//       execCommand() {
//         return;
//       },
//       queryCommandValue() {
//         return;
//       },

//     };

//     execCommandSpy = spyOn(doc, 'execCommand').and.callThrough();
//     queryCommandValueSpy = spyOn(doc, 'queryCommandValue').and.returnValue(replace_with);

//   });

//   it('should call queryCommandValue', () => {
//     const font = transform.get(doc);
//     expect(queryCommandValueSpy).toHaveBeenCalled();
//     expect(font).toEqual(replace_with);
//   });

//   it('should call execCommand', () => {
//     transform.change(doc);
//     expect(execCommandSpy).toHaveBeenCalled();

//   });

// });

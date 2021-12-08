// import { underlineTransform } from './underline.transform';
// import { getParentElementByTag } from './utils.transform';
// import { unsetLink } from './link.transform';

// describe('underlineTransform', () => {

//   let transform: any,
//     execCommandSpy: any,
//     queryCommandStateSpy: any,
//     doc: any,
//     parentUnderline: string;

//   parentUnderline = 'jjj';

//   beforeEach(() => {

//     transform = underlineTransform;

//     doc = {
//       execCommand() {
//         return;
//       },
//       queryCommandState() {
//         return;
//       },
//       getSelection() {
//         return;
//       },

//     };

//     execCommandSpy = spyOn(doc, 'execCommand').and.returnValue(parentUnderline);
//     queryCommandStateSpy = spyOn(doc, 'queryCommandState').and.callThrough();

//   });

//   it('should call execCommand', () => {

//     const font = transform.toggle(doc);
//     expect(execCommandSpy).toHaveBeenCalled();
//     expect(font).toEqual(parentUnderline);

//   });

//   it('should call queryCommandState', () => {

//     transform.get(doc);
//     expect(queryCommandStateSpy).toHaveBeenCalled();

//   });

// });

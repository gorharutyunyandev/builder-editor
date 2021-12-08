// import { style } from '@angular/animations';

// import { PEB_FONT_SIZE_ATTRIBUTE } from '@pe/builder-core';

// import { fontSizeTransform } from './font-size.transform';
// import { getParentElementByTag } from './utils.transform';

// describe('fontSizeTransform', () => {

//   let transform: any,
//     execCommandSpy: any,
//     queryCommandStateSpy: any,
//     doc: any,
//     style: any;

//   beforeEach(() => {

//     transform = fontSizeTransform;

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

//     execCommandSpy = spyOn(doc, 'execCommand').and.callThrough();
//     queryCommandStateSpy = spyOn(doc, 'queryCommandState').and.returnValue(style);

//   });

//   it('should call execCommand', () => {
//     const result = jasmine.createSpyObj('doc', [
//       'getSelection',
//     ]);
//     transform.change(doc);
//     expect(execCommandSpy).toHaveBeenCalled();
//     expect(execCommandSpy).toEqual('BODY');
//   });

//   it('should call queryCommandState', () => {
//     transform.get(doc);
//     expect(doc.body.style.font.size).toEqual(10);
//   });

// });

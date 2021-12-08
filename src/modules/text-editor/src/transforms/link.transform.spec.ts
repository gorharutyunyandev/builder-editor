// import { PebInteractionType } from '@pe/builder-core';

// import { LinkTransform } from './link.transform';
// import { unsetLink } from './link.transform';
// import { getParentElementByTag } from './utils.transform';
// describe('LinkTransform', () => {

//   let transform: any,
//     execCommandSpy: any,
//     queryCommandStateSpy: any,
//     doc: any,
//     function_one: any;

//   beforeEach(() => {

//     transform = LinkTransform;
//     function_one: unsetLink;

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
//     queryCommandStateSpy = spyOn(doc, 'queryCommandState').and.callThrough();

//   });

//   it('should call setLink on change of LinkTransform', () => {
//     const unsetLinkSpy = jasmine.createSpy('unsetLink', unsetLink).and.returnValue();
//     const value = {
//       payload: '',
//       type: 'test',
//     };
//     transform.change(doc, value);
//     expect(unsetLinkSpy).not.toHaveBeenCalled();
//   });

//   it('should call unset function', () => {
//     expect(function_one).toHaveBeenCalled();
//   });

//   it('should call queryCommandState', () => {
//     transform.get(doc);
//     expect(queryCommandStateSpy).toHaveBeenCalled();
//   });

// });

// import { boldTransform } from './bold.transform';

// describe('boldTransform', () => {

//   let transform: any,
//     execCommandSpy: any,
//     queryCommandStateSpy: any,
//     doc: any;

//   beforeEach(() => {

//     transform = boldTransform;
//     doc = {
//       execCommand() {
//         return;
//       },
//       queryCommandState() {
//         return;
//       },
//     };
//     execCommandSpy = spyOn(doc, 'execCommand').and.callThrough();
//     queryCommandStateSpy = spyOn(doc, 'queryCommandState').and.callThrough();
//   });

//   it('should call execCommand', () => {
//     transform.toggle(doc);
//     expect(execCommandSpy).toHaveBeenCalled();
//   });

//   it('should call queryCommandState', () => {
//     transform.get(doc);
//     expect(queryCommandStateSpy).toHaveBeenCalled();
//   });
// });

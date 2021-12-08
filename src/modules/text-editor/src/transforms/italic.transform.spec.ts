// import { italicTransform } from './italic.transform';

// describe('italicTransform', () => {

//   let transform: any,
//     execCommandSpy: any,
//     queryCommandStateSpy: any,
//     doc: any;

//   beforeEach(() => {

//     transform = italicTransform;

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

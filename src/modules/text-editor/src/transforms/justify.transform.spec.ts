// import { ExecCommand, TextJustify } from '../text-editor.interface';
// import { justifyTransform } from './justify.transform';

// const JustifyLeft = {};

// describe('justifyTransform', () => {
//   let transform: any,
//     execCommandSpy: any,
//     queryCommandStateSpy: any,
//     doc: any,
//     value: TextJustify,
//     replace_with: string,
//     value_one: TextJustify.Left,
//     rep: any,
//     exec_one: any;

//   rep = 'TestJuftify.Left';

//   beforeEach(() => {

//     transform = justifyTransform;
//     doc = {
//       textJustify: {
//         left: false,
//         right: false,
//         center: false,
//         full: false,
//       },
//       execCommand($value = '') {
//         switch ($value) {
//           case ExecCommand.JustifyLeft:
//             this.textJustify.left = true;
//             break;
//           case ExecCommand.JustifyRight:
//             this.textJustify.right = true;
//             break;
//           case ExecCommand.JustifyCenter:
//             this.textJustify.center = true;
//             break;
//           case ExecCommand.JustifyFull:
//             this.textJustify.full = true;
//             break;
//         }
//         return;
//       },
//       queryCommandState($value = '') {
//         let result = $value;

//         switch ($value) {
//           case ExecCommand.JustifyLeft:
//             result = this.textJustify.left;
//             break;
//           case ExecCommand.JustifyRight:
//             result = this.textJustify.right;
//             break;
//           case ExecCommand.JustifyCenter:
//             result = this.textJustify.center;
//             break;
//           case ExecCommand.JustifyFull:
//             result = this.textJustify.full;
//             break;
//         }
//         return result;
//       },

//     };

//     execCommandSpy = spyOn(doc, 'execCommand').and.callThrough();
//     queryCommandStateSpy = spyOn(doc, 'queryCommandState').and.callThrough();

//   });

//   it('should call queryCommandValue justifyTransform', () => {
//     transform.get(doc);
//     expect(queryCommandStateSpy).toHaveBeenCalled();
//   });

//   it('should call execOne justifyTransform-Left', () => {
//     transform.change(doc, TextJustify.Left);
//     expect(doc.execCommand).toHaveBeenCalledWith(ExecCommand.JustifyLeft);
//     const result = transform.get(doc);
//     expect(doc.queryCommandState).toHaveBeenCalledWith(ExecCommand.JustifyLeft);
//     expect(result).toEqual(TextJustify.Left);
//   });

//   it('should call execOne justifyTransform-Right', () => {
//     transform.change(doc, TextJustify.Right);
//     expect(doc.execCommand).toHaveBeenCalledWith(ExecCommand.JustifyRight);
//     const results = transform.get(doc);
//     expect(doc.queryCommandState).toHaveBeenCalledWith(ExecCommand.JustifyRight);
//     expect(results).toEqual(TextJustify.Right);
//   });

//   it('should call execOne justifyTransform-Full', () => {
//     transform.change(doc, TextJustify.Full);
//     expect(doc.execCommand).toHaveBeenCalledWith(ExecCommand.JustifyFull);
//     const result_full = transform.get(doc);
//     expect(doc.queryCommandState).toHaveBeenCalledWith(ExecCommand.JustifyFull);
//     expect(result_full).toEqual(TextJustify.Full);
//   });

//   it('should call execOne justifyTransform-Center', () => {
//     transform.change(doc, TextJustify.Center);
//     expect(doc.execCommand).toHaveBeenCalledWith(ExecCommand.JustifyCenter);
//     const result_center = transform.get(doc);
//     expect(doc.queryCommandState).toHaveBeenCalledWith(ExecCommand.JustifyCenter);
//     expect(result_center).toEqual(TextJustify.Center);
//   });

//   it('should call queryCommandValue justifyTransform', () => {
//     transform.get(doc);
//     expect(execCommandSpy).toHaveBeenCalled();
//   });

//   it('should call execCommand justifyTransform', () => {
//     transform.change(doc, value);
//     expect(execCommandSpy).toHaveBeenCalled();
//   });

// });

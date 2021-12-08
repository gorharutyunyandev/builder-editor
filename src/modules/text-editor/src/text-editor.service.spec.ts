// mport; { PebTextEditorService; } from; './text-editor.service';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Renderer2 } from '@angular/core';
// import { DOCUMENT } from '@angular/common';

// import { FontLoaderService } from '@pe/builder-font-loader';
// import { PebInteractionType } from '@pe/builder-core';

// import { ExecCommand, TextJustify, TextLink } from './text-editor.interface';
// import { LinkTransform } from './transforms/link.transform';
// import { fontFamilyTransform } from './transforms/font-family.transform';
// import { strikeThroughTransform } from './transforms/strike-through.transform';
// import { colorTransform } from './transforms/color.transform';
// import { italicTransform } from './transforms/italic.transform';
// import { underlineTransform } from './transforms/underline.transform';
// import { fontSizeTransform } from './transforms/font-size.transform';
// import { justifyTransform } from './transforms/justify.transform';

// import { boldTransform } from 'src/modules/text-editor/src/transforms/bold.transform';

// class PebTextEditorServiceExtended extends PebTextEditorService {

//   get link() {
//     return super.link;
//   }

//   get fontFamily() {
//     return super.fontFamily;
//   }

//   get color() {
//     return super.color;
//   }

//   get bold() {
//     return super.bold;
//   }

//   get italic() {
//     return super.italic;
//   }

//   get underline() {
//     return super.underline;
//   }

//   get strikeThrough() {
//     return super.strikeThrough;
//   }

//   get fontSize() {
//     return super.fontSize;
//   }

//   get justify() {
//     return super.justify;
//   }

// }

// const LinkTransfromMock = {
//   execCommand() {
//     return;
//   },
//   change() {
//     return;
//   },
//   get() {
//     return;
//   },

// };

// describe('PebTextEditorService', () => {

//   let service: PebTextEditorServiceExtended;
//   let value: TextLink;
//   let valueFamily: string;
//   let valueOne: TextJustify;
//   let commandId: string;
//   let showUI: boolean;
//   let valuexex: any;
//   let iframeDocument: Document;
//   let transform: any;
//   let execCommandSpy;

//   beforeEach(() => {

//     transform = LinkTransform;
//     transform = {
//       execCommand() {
//         return;
//       },
//       change() {
//         return;
//       },
//       getSelection() {
//         return;
//       },
//     };

//     TestBed.configureTestingModule({
//       providers: [
//         PebTextEditorServiceExtended,
//       ],
//     });

//     execCommandSpy = spyOn(transform, 'execCommand').and.callThrough();
//     service = TestBed.get(PebTextEditorServiceExtended);

//   });

//   it('PebTextEditorService should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should get LinkTransform of iframdeDocument', () => {
//     const linkTransformGetSpy = spyOn(LinkTransform, 'get')
// .and.returnValue({ payload: '', type: PebInteractionType.CartClick });
//     const link = service.link;
//     expect(linkTransformGetSpy).toHaveBeenCalled();
//   });

//   it('should get fontFamilyTransform of iframeDocument', () => {
//     const fontFamilySpy = spyOn(fontFamilyTransform, 'get').and.returnValue('something');
//     const font = service.fontFamily;
//     expect(fontFamilySpy).toHaveBeenCalled();
//   });

//   it('should get colorTransform of iframeDocument', () => {
//     const colorSpy = spyOn(colorTransform, 'get').and.returnValue('red');
//     const color = service.color;
//     expect(colorSpy).toHaveBeenCalled();
//   });

//   it('should get boldTransform of iframeDocument', () => {
//     const boldSpy = spyOn(boldTransform, 'get').and.returnValue(true);
//     const bold = service.bold;
//     expect(boldSpy).toHaveBeenCalled();

//   });

//   it('should get italicTransform of iframeDocument', () => {
//     const italicSpy = spyOn(italicTransform, 'get').and.returnValue(true);
//     const italic = service.italic;
//     expect(italicSpy).toHaveBeenCalled();
//   });

//   it('should get underlineTransform of iframeDocument', () => {
//     const underlineSpy = spyOn(underlineTransform, 'get').and.returnValue(true);
//     const underline = service.underline;
//     expect(underlineSpy).toHaveBeenCalled();
//   });

//   it('should get StrikeThrough of iframeDocument', () => {
//     const strikeThroughSpy = spyOn(strikeThroughTransform, 'get').and.returnValue(true);
//     const strike = service.strikeThrough;
//     expect(strikeThroughSpy).toHaveBeenCalled();
//   });

//   it('should get fontSize of iframeDocument', () => {
//     const fontSizeSpy = spyOn(fontSizeTransform, 'get').and.returnValue(1);
//     const font_size = service.fontSize;
//     expect(fontSizeSpy).toHaveBeenCalled();
//   });

//   it('should get justify of iframeDocument', () => {
//     const justifySpy = spyOn(justifyTransform, 'get').and.returnValue(TextJustify.Full);
//     const justif = service.justify;
//     expect(justifySpy).toHaveBeenCalled();
//   });

//   it('should get styles', () => {
//     const stylesSpy = spyOnProperty(service, 'styles').and.callThrough();
//     const result = service.styles;
//     expect(result).toBeTruthy();
//     expect(stylesSpy).toHaveBeenCalled();
//   });


//   it('should print iframe document', () => {
//     expect(document).toHaveBeenCalled();
//   });

//   it('Should call changeLink method', () => {
//     const changeSpy = spyOn(LinkTransform, 'change').and.returnValue();
//     const value: TextLink = {
//       payload: '',
//       type: PebInteractionType.CartClick, // just mock does not matter
//     };

//     service.changeLink(value);
//     expect(changeSpy).toHaveBeenCalledWith(service.iframeDocument, value);
//   });

//   it('Should call changeFontFamily method', () => {
//     const changeSpy = spyOn(fontFamilyTransform, 'change').and.returnValue(true);
//     service.changeFontFamily(valueFamily);
//     expect(changeSpy).toHaveBeenCalledWith(service.iframeDocument, valueFamily);
//   });

//   it('Should call changeFontSize method', () => {
//     const spy = spyOn(service, 'changeFontSize').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     service.changeFontSize(3);
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   it('Should call changeJustify method', () => {
//     const spy = spyOn(service, 'changeJustify').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     service.changeJustify(valueOne);
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   it('Should call changeColor method', () => {
//     const spy = spyOn(service, 'changeColor').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     service.changeColor(valueOne);
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   it('Should call toggleBold method', () => {
//     const spy = spyOn(service, 'toggleBold').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     service.toggleBold();
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   it('Should call toggleItalic method', () => {
//     const spy = spyOn(service, 'toggleItalic').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     service.toggleItalic();
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   it('Should call toggleUnderline method', () => {
//     const spy = spyOn(service, 'toggleUnderline').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     service.toggleUnderline();
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   it('Should call fontSize method', () => {
//     const spy = spyOn(service, 'toggleUnderline').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     service.toggleUnderline();
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   it('Should call toggleUnderline method', () => {
//     const spy = spyOn(service, 'toggleUnderline').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     service.toggleUnderline();
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   it('Should call toggleStrikeThrough method', () => {
//     const changeSpy = spyOn(strikeThroughTransform, 'toggle').and.returnValue(true);
//     service.toggleStrikeThrough();
//     expect(changeSpy).toHaveBeenCalledWith(service.iframeDocument);
//   });

// });

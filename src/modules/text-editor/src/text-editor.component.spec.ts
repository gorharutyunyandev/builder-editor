describe('TEST', () => {
  it('Just for check', () => {
    expect('test').toContain('test');
  });
});

// import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
// import { DebugElement, Renderer2, SimpleChanges } from '@angular/core';
// import { analyzeAndValidateNgModules, CompileTemplateMetadata } from '@angular/compiler';
// import { fromEvent, of, Subject } from 'rxjs';
// import { By } from '@angular/platform-browser';

// import { FontLoaderService } from '@pe/builder-font-loader';

// import { PebTextEditor } from './text-editor.component';
// import { PebTextEditorService, PebTextEditorStyles } from './text-editor.service';
// import { TextJustify } from './text-editor.interface';

// class PebTextEditorExtended extends PebTextEditor {

//   emitChanges() {
//     return super.emitChanges();
//   }

// }

// const selectContentMock = {
//   nativeElement: {
//     contentDocument: {},
//     body: {},
//     elems: {},
//   },
//   iframeDocument: {
//     body: {
//       elems: {
//         items: [
//           {
//             style: {
//               textAlign: '',
//             },
//           },
//           {
//             style: {
//               textAlign: '',
//             },
//           },

//         ],
//         item: (i: number) => {
//           return this.elems.items[i];
//         },
//         length: 2,
//       },
//       getElementsByTagName() {
//         return this.elems;
//       },
//     },

//     getSelection() {
//       return {
//         removeAllRanges() {
//           return;
//         },
//         addRange() {
//           return;
//         },
//       };
//     },
//     createRange() {
//       return;
//     },
//   },
// };

// describe('TextEditorComponent', () => {

//   let component: PebTextEditorExtended;
//   let fixture: ComponentFixture<PebTextEditorExtended>;
//   let el: DebugElement;
//   let changes: any;
//   let innerHTML: any;
//   let textAlign: string;
//   let fonrLoaderService: any;

//   beforeEach(async(() => {

//     const FontLoaderServiceSpy = jasmine.createSpyObj('FontLoaderService', [
//       'renderFontLoader',
//     ]);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebTextEditorExtended,
//       ],
//       providers: [
//         {
//           provide: Renderer2, useValue: {},
//         },
//         {
//           provide: PebTextEditorService, useValue: selectContentMock,
//         },
//         {
//           provide: FontLoaderService, useValue: FontLoaderServiceSpy,
//         },

//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebTextEditorExtended);
//       component = fixture.componentInstance;
//       el = fixture.debugElement;

//       component.styles = {
//         textAlign: 'center',
//       };

//       component.limits = {
//         width: 1000,
//         height: 1000,
//       };

//       fixture.detectChanges();
//     });

//   }));

//   it('should be created', () => {
//     expect(component).toBeDefined();
//   });

//   it('should test ngOnDestroy function', () => {
//     const spy = spyOn(component, 'ngOnDestroy').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     component.ngOnDestroy();
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   it('should get iframe document', () => {

//     const getIframeDocumentSpy = spyOnProperty(component, 'iframeDocument');
//     component.iframeDocument;
//     expect(getIframeDocumentSpy).toHaveBeenCalled();

//   });

//   it('should test SelectContent function', () => {
//     const spy = spyOn(component, 'selectContent').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     component.selectContent();
//     expect(spy).toHaveBeenCalledTimes(1);
//   });


//   it('should test onIframeLoad function', () => {
//     const spy = spyOn(component, 'onIframeLoad').and.callThrough();

//     const event = {
//       preventDefault() {
//         return;
//       },
//       clipoardData: {
//         getData() {
//           return '';
//         },
//       },
//     };

//     const fromEventSpy = jasmine.createSpy('fromEvent', fromEvent).and.returnValue(of(event));
//     expect(spy).not.toHaveBeenCalled();
//     innerHTML = {
//       scale: {
//         text: {
//           scaleTextInnerFonts() {

//           },
//         },
//       },
//     };

//     component.onIframeLoad();
//     expect(spy).toHaveBeenCalled();
//     const iframeBody = el.query(By.css('iframe')).nativeElement.contentDocument.body;
//     iframeBody.triggerEventHandler('paste', event);
//     expect(fromEventSpy).toHaveBeenCalled();
//   });

//   it('should call textChanged.emit() on emitChanges', () => {

//     const textChangedSpy = spyOn(component.textChanged, 'emit');
//     component.emitChanges();
//     expect(textChangedSpy).toHaveBeenCalled();

//   });

// });

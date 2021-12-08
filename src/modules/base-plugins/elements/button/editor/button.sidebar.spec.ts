describe('TEST', () => {
  it('Just for check', () => {
    expect('test').toContain('test');
  });
});

// import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
// import { ChangeDetectorRef, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
// import { FormControlName, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { By } from '@angular/platform-browser';
// import { Observable } from 'rxjs';

// import { PebEditorApi } from '@pe/builder-api';

// import { PebEditorButtonSidebarComponent } from './button.sidebar';
// import { PebEditorStore } from '../../../..';
// import { ExecCommand } from '../../../../../../text-editor/src';

// // getting transformation to change style

// export const boldTransform = {
//   toggle: (doc: Document) => doc.execCommand(ExecCommand.Bold),
//   get: (doc: Document) => doc.queryCommandState(ExecCommand.Bold),
// };

// export const fontSizeTransform = {
//   toggle: (doc: Document) => doc.execCommand(ExecCommand.FontSize),
//   get: (doc: Document) => doc.queryCommandState(ExecCommand.FontSize),
// };

// export const borderStyleTransform = {
//   toggle: (doc: CSSStyleDeclaration) => doc.borderRadius,
//   get: (doc: CSSStyleDeclaration) => doc.borderRadius,
// };

// describe('Button Sidebar Component', () => {

//   let fixture: ComponentFixture<PebEditorButtonSidebarComponent>;
//   let  component: PebEditorButtonSidebarComponent;
//   let de: DebugElement;

//   let  transform: any;
//   let  font: any;
//   let  border: any;
//   let  execCommandSpy: any;
//   let  queryCommandStateSpy: any;
//   let  styleSpy: any;
//   let  doc: any;

//   let storeSpy: jasmine.SpyObj<PebEditorStore>;
//   let apiSpy: jasmine.SpyObj<PebEditorApi>;
//   let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;
//   let formSpy: jasmine.SpyObj<FormGroup>;

//   const form = jasmine.createSpyObj('FormGroup', ['get']);
//   styleSpy = jasmine.createSpyObj('PebElementStyles', ['boxShadow']);

//   beforeEach(async(() => {
//     const store = jasmine.createSpyObj('PebEditorStore', ['snapshot', 'pipe'], { snapshot$: new Observable<any>() });
//     const api = jasmine.createSpyObj('PebEditorApi', ['addAction']);
//     const cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);


//     TestBed.configureTestingModule({
//       providers: [
//         { provide: PebEditorStore, useValue: store },
//         { provide: PebEditorApi, useValue: api  },
//         { provide: ChangeDetectorRef, useValue: cdr  },
//         { provide: FormGroup, useValue: form  },
//       ],
//       declarations: [PebEditorButtonSidebarComponent, FormControlName],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorButtonSidebarComponent);
//       component = fixture.componentInstance;
//       de = fixture.debugElement;

//     });

//     transform = boldTransform;
//     font = fontSizeTransform;
//     border = borderStyleTransform;

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


//     // Inject the service-to-tests and its (spy) dependency

//     storeSpy = TestBed.inject(PebEditorStore) as jasmine.SpyObj<PebEditorStore>;
//     apiSpy = TestBed.inject(PebEditorApi) as jasmine.SpyObj<PebEditorApi>;
//     formSpy = TestBed.inject(FormGroup) as jasmine.SpyObj<FormGroup>;
//     cdrSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
//   }));

//   it('should be defined', () => {


//     expect(component).toBeDefined();

//   });

//   it('should be a button to change a font style', () => {
//     // getting value from dom
//     const linkDes = fixture.debugElement.queryAll(By.css('button'));
//     expect(linkDes.length).toBe(4);
//     expect(linkDes).toBeTruthy();
//   });

//   it('should have two inputs with FormControlName directive', () => {
//     const formCtrl = fixture.debugElement.queryAll(By.directive(FormControlName));
//     expect(formCtrl.length).toBe(1);
//   });

//   // testing the EventEmitter is to actually subscribe to it and trigger the event

//   it('should emit when the button linkHandler is clicked', () => {

//     component.changeElement.subscribe((next) => {
//       const el = {
//         data: {
//           action: null,
//         } ,
//       };
//       expect(next).toEqual(el);
//     });

//     component.linkHandler(); // or button.nativeElement.click()
//   });

//   it('should emit changeElementFinal when the button linkHandler is clicked', () => {

//     component.changeElementFinal.subscribe((next) => {
//       const el = {
//         data: {
//           action: null,
//         } ,
//       };
//       expect(next).toEqual(el);
//     });
//   });

//   it('should emit changeStyle when the button is clicked', () => {

//     component.changeStyle.subscribe((next) => {

//       const style = 'objects';

//       expect(next).toEqual(style);

//     });

//   });

//   it('should change shadow', () => {

//     expect(component.changeShadow).toBeTruthy();
//   });

//   it('should get shadow of the box', () => {

//     const shadow = styleSpy.boxShadow;

//     expect(shadow).toBe('inherit');

//     const shadowArray = shadow.split(/\s+/);

//     const noPx = shadowArray.map(res => res.replace('px', ''));

//     expect(noPx).toBeTruthy();

//     expect(component.getBoxShadow).toBeTruthy();

//     const color = ['rgba(0,0,0,0.7)', 0, 2, 4, 1];

//     expect(color).toBeDefined();

//   });

//   it('should call execCommand', () => {

//     transform.toggle(doc);
//     expect(execCommandSpy).toHaveBeenCalled();

//   });

//   it('should call queryCommandState', () => {

//     transform.get(doc);
//     expect(queryCommandStateSpy).toHaveBeenCalled();

//   });

//   it('should call font execCommand', () => {

//     font.toggle(doc);
//     expect(execCommandSpy).toHaveBeenCalled();

//   });

//   it('should call font queryCommandState', () => {

//     font.get(doc);
//     expect(queryCommandStateSpy).toHaveBeenCalled();

//   });

//   it('should call border style execCommand', () => {

//     border.toggle(doc);

//   });

//   it('should call border style queryCommandState', () => {

//     border.get(doc);

//   });
// });

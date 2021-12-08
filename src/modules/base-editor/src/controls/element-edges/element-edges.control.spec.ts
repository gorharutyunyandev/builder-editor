// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ChangeDetectorRef, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebEditorElementEdgesControl } from './element-edges.control';
// import { PebAbstractEditor } from '../../root/abstract-editor';


// describe('Element Edges Control', () => {

//   let fixture: ComponentFixture<PebEditorElementEdgesControl>;
//   let component: PebEditorElementEdgesControl;

//   let elSpy: jasmine.SpyObj<ElementRef>;
//   let editorSpy: jasmine.SpyObj<PebAbstractEditor>;
//   let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;


//   beforeEach(async(() => {

//     const editor = jasmine.createSpyObj('PebAbstractEditor', ['detectChanges']);
//     const element = jasmine.createSpyObj('ElementRef', ['detectChanges']);
//     const cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorElementEdgesControl,
//       ],
//       imports: [ReactiveFormsModule, FormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: PebAbstractEditor, useValue: editor },
//         { provide: ElementRef, useValue: element },
//         { provide: ChangeDetectorRef, useValue: cdr },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorElementEdgesControl);
//       component = fixture.componentInstance;
//     });

//     editorSpy = TestBed.inject(PebAbstractEditor) as jasmine.SpyObj<PebAbstractEditor>;
//     elSpy = TestBed.inject(ElementRef) as jasmine.SpyObj<ElementRef>;
//     cdrSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;

//   }));

//   it('can load instance', () => {
//     expect(component).toBeTruthy();
//   });

// });

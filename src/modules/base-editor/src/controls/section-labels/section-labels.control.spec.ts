// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ChangeDetectorRef, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebEditorSectionLabelsControl } from './section-labels.control';


// describe('Section Labels Control', () => {

//   let fixture: ComponentFixture<PebEditorSectionLabelsControl>;
//   let component: PebEditorSectionLabelsControl;

//   let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;


//   beforeEach(async(() => {

//     const cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorSectionLabelsControl,
//       ],
//       imports: [ReactiveFormsModule, FormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: ChangeDetectorRef, useValue: cdr },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorSectionLabelsControl);
//       component = fixture.componentInstance;
//     });

//     cdrSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;

//   }));

//   it('can load instance', () => {
//     expect(component).toBeTruthy();
//   });

// });

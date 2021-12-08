// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ChangeDetectorRef, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';

// import { PebEditorElementCoordsControl } from './element-coords.control';

// describe('Element Coords Control', () => {

//   let fixture: ComponentFixture<PebEditorElementCoordsControl>;
//   let component: PebEditorElementCoordsControl;
//   let el: DebugElement;

//   const cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);


//   let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;


//   beforeEach(async(() => {

//     TestBed.configureTestingModule({
//       providers: [
//         { provide: ChangeDetectorRef, useValue: cdr },
//       ],
//       declarations: [PebEditorElementCoordsControl],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorElementCoordsControl);
//       component = fixture.componentInstance;
//       el = fixture.debugElement;

//     });

//     cdrSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

// });

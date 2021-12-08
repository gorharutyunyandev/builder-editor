// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebEditorLineSidebarComponent } from './line.sidebar';


// describe('Line Sidebar Component', () => {

//   let fixture: ComponentFixture<PebEditorLineSidebarComponent>;
//   let  component: PebEditorLineSidebarComponent;


//   const lineForm = component.lineForm;

//   beforeEach(async(() => {

//     TestBed.configureTestingModule({
//       declarations: [PebEditorLineSidebarComponent],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorLineSidebarComponent);
//       component = fixture.componentInstance;
//     });

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   /**
//    *  patch value to line form
//    */

//   it('should set initial of form value', () => {
//     lineForm.patchValue({ stroking: '1' });
//     lineForm.patchValue({ strokeColor: 'black' });
//     lineForm.patchValue({ shadowBlur: '0' });
//     lineForm.patchValue({ shadowColor: '#333' });
//     lineForm.patchValue({ size: '1' });

//     expect(component.setInitialFormValue).toBeTruthy();
//   });

//   it('should set color of stroke', () => {

//     lineForm.patchValue({ strokeColor: 'black' });

//     expect(component.setStrokeColor).toBeTruthy();

//   });

//   it('should set shadow color', () => {

//     lineForm.patchValue({ shadowColor: '#333' });

//     expect(component.setShadowColor).toBeTruthy();

//   });

//   it('should test flipV function', () => {

//     expect(component.flipV).toBeTruthy();

//   });

//   it('should test flipV function', () => {

//     expect(component.flipH).toBeTruthy();

//   });

// });

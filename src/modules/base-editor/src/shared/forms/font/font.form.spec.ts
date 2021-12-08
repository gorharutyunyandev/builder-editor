// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// import { EditorFontForm } from './font.form';


// describe('Font Form', () => {

//   let fixture: ComponentFixture<EditorFontForm>;
//   let  component: EditorFontForm;

//   beforeEach(async(() => {


//     TestBed.configureTestingModule({
//       declarations: [
//         EditorFontForm,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(EditorFontForm);
//       component = fixture.componentInstance;
//     });

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should emit blur function', () => {

//     spyOn(component.blurred, 'emit');

//     component.blur();

//     expect(component.blurred.emit).toHaveBeenCalledWith();

//   });

// });

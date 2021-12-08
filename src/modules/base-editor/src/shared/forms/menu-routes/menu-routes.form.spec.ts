// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { EditorMenuRoutesForm } from './menu-routes.form';


// describe('Editor Menu Routes Form', () => {

//   let fixture: ComponentFixture<EditorMenuRoutesForm>;
//   let  component: EditorMenuRoutesForm;


//   const controls = component.formGroup.controls;

//   beforeEach(async(() => {

//     TestBed.configureTestingModule({
//       providers: [
//         EditorMenuRoutesForm,
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(EditorMenuRoutesForm);
//       component = fixture.componentInstance;
//     });

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should call controls', () => {
//     expect(controls).toBeDefined();
//   });

//   it('should call routes', () => {
//     expect(component.routes).toBeTruthy();
//     return expect(controls.routes).toBeDefined();
//   });

//   it('should emit on click changed', () => {
//     fixture = TestBed.createComponent(EditorMenuRoutesForm);
//     // spy on event emitter
//     component = fixture.componentInstance;
//     spyOn(component.changed, 'emit');

//     // trigger the click
//     const nativeElement = fixture.nativeElement;
//     const form = nativeElement.querySelector('form.form');
//     form.dispatchEvent(new Event('click'));
//     fixture.detectChanges();

//     expect(component.changed.emit).toHaveBeenCalled();
//   });

// });

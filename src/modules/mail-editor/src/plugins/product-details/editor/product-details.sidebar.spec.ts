// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';

// import { PebEditorApi } from '@pe/builder-api';

// import { PebEditorProductDetailsSidebarComponent } from './product-details.sidebar';


// describe('Product Details Sidebar Component', () => {

//   let fixture: ComponentFixture<PebEditorProductDetailsSidebarComponent>;
//   let component: PebEditorProductDetailsSidebarComponent;
//   let apiSpy: jasmine.SpyObj<PebEditorApi>;

//   beforeEach(async(() => {

//     const api = jasmine.createSpyObj('PebEditorApi', ['getActions']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorProductDetailsSidebarComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: PebEditorApi, useValue: api },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorProductDetailsSidebarComponent);
//       component = fixture.componentInstance;
//     });


//     // Inject the service-to-tests and its (spy) dependenc

//     apiSpy = TestBed.inject(PebEditorApi) as jasmine.SpyObj<PebEditorApi>;

//   }));

//   it('should be defined', () => {

//     expect(component).toBeTruthy();

//   });


//   /**
//    * TESTING GET FUNCTIONS()
//    */


//   it('should check if product has background', () => {

//     spyOn(component.styleForm, 'get');

//     const hasBackground = component.styleForm.get('hasBackground');

//     expect(hasBackground).toBeTruthy();

//   });

//   it('should check if button has background', () => {

//     spyOn(component.styleForm, 'get');

//     const hasButtonBackground = component.styleForm.get('hasButtonBackground');

//     expect(hasButtonBackground).toBeTruthy();

//   });

//   it('should test backgroundColor', () => {

//     spyOn(component.styleForm, 'get');

//     const backgroundColor = component.styleForm.get('backgroundColor');

//     expect(backgroundColor).toBeTruthy();

//   });

//   it('should test buttonBackgroundColor', () => {

//     spyOn(component.styleForm, 'get');

//     const buttonBackgroundColor = component.styleForm.get('buttonBackgroundColor');

//     expect(buttonBackgroundColor).toBeTruthy();

//   });

//   it('should test angle', () => {

//     spyOn(component.styleForm, 'get');

//     const angle = component.styleForm.get('angle');

//     expect(angle).toBeTruthy();

//   });

//   it('should test color', () => {

//     spyOn(component.styleForm, 'get');

//     const color = component.styleForm.get('color');

//     expect(color).toBeTruthy();

//   });

//   it('should  test buttonColor', () => {

//     spyOn(component.styleForm, 'get');

//     const buttonColor = component.styleForm.get('buttonColor');

//     expect(buttonColor).toBeTruthy();

//   });

//   it('should test fontSize', () => {

//     spyOn(component.styleForm, 'get');

//     const fontSize = component.styleForm.get('fontSize');

//     expect(fontSize).toBeTruthy();

//   });
// });

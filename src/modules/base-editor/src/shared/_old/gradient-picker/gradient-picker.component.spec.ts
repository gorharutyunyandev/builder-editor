// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebEditorGradientPickerComponent } from './gradient-picker.component';
// import { AngleFlipHelper } from '../helpers/angle-flip.helper';


// describe('Gradient Picker Component', () => {

//   let fixture: ComponentFixture<PebEditorGradientPickerComponent>;
//   let  component: PebEditorGradientPickerComponent;

//   let angleSpy: jasmine.SpyObj<AngleFlipHelper>;
//   const angle = jasmine.createSpyObj('AngleFlipHelper', ['uploadImage']);

//   beforeEach(async(() => {


//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorGradientPickerComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: AngleFlipHelper, useValue: angle },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorGradientPickerComponent);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     angleSpy = TestBed.inject(AngleFlipHelper) as jasmine.SpyObj<AngleFlipHelper>;

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   /**
//    * TESTING GET FUNCTIONS
//    */

//   it('should get a first gradient color', () => {

//     spyOn(component.formGroup, 'get');

//     const firstGradientColor = component.formGroup.get('firstGradientColor');

//     expect(firstGradientColor).toBeTruthy();

//   });

//   it('should get a second gradient color', () => {

//     spyOn(component.formGroup, 'get');

//     const secondGradientColor = component.formGroup.get('secondGradientColor');

//     expect(secondGradientColor).toBeTruthy();

//   });

//   it('should check if product has background', () => {

//     spyOn(component.formGroup, 'get');

//     const ang = component.formGroup.get('angle');

//     expect(ang).toBeTruthy();

//   });

//   it('should check flipV', () => {
//     const newAngle = component.angle.value;
//     angle.flipV(newAngle);

//     expect(component.flipV).toBeTruthy();
//   });

//   it('should check flipH', () => {
//     const newAngle = component.angle.value;
//     angle.flipH(newAngle);

//     expect(component.flipV).toBeTruthy();
//   });

// });

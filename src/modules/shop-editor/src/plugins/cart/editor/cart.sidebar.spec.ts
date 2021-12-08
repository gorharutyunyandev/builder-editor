// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebEditorApi } from '@pe/builder-api';

// import { PebEditorCartSideBarComponent } from './cart.sidebar';
// import { PebEditorStore } from '../../../..';
// import { AngleFlipHelper } from '../shared/helpers/angle-flip.helper';



// describe('Cart Sidebar Component', () => {

//   let fixture: ComponentFixture<PebEditorCartSideBarComponent>;
//   let  component: PebEditorCartSideBarComponent;

//   let apiSpy: jasmine.SpyObj<PebEditorApi>;
//   let storeSpy: jasmine.SpyObj<PebEditorStore>;
//   let angleSpy: jasmine.SpyObj<AngleFlipHelper>;

//   let formSpy: jasmine.SpyObj<FormGroup>;

//   const form = jasmine.createSpyObj('FormGroup', ['get']);

//   beforeEach(async(() => {

//     const api = jasmine.createSpyObj('PebEditorApi', ['uploadImage']);
//     const store = jasmine.createSpyObj('PebEditorStore', ['uploadImage']);
//     const angle = jasmine.createSpyObj('AngleFlipHelper', ['uploadImage']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorCartSideBarComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: PebEditorStore, useValue: store },
//         { provide: AngleFlipHelper, useValue: angle },
//         { provide: PebEditorApi, useValue: api },
//         { provide: FormGroup, useValue: form },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorCartSideBarComponent);
//       component = fixture.componentInstance;
//     });


//     // Inject the service-to-tests and its (spy) dependency

//     apiSpy = TestBed.inject(PebEditorApi) as jasmine.SpyObj<PebEditorApi>;
//     storeSpy = TestBed.inject(PebEditorStore) as jasmine.SpyObj<PebEditorStore>;
//     angleSpy = TestBed.inject(AngleFlipHelper) as jasmine.SpyObj<AngleFlipHelper>;
//     formSpy = TestBed.inject(FormGroup) as jasmine.SpyObj<FormGroup>;

//   }));



//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   /**
//    *  TESTING GET FUNCTIONS ()
//    */

//   // it('should return border width', () => {
//   //   spyOn(component.borderWidthControl, 'get');

//   //   const border = {
//   //     width: 0,
//   //   };

//   //   expect(border.width).toBe(0);

//   //   expect(spyOn).toBeTruthy();
//   // });

//   // it('should return font size', () => {
//   //   spyOn(component.fontSizeControl, 'get');

//   //   const font = {
//   //     size: 14,
//   //   };

//   //   expect(font.size).toBe(14);

//   //   expect(spyOn).toBeTruthy();

//   // });

//   // it('should return shadow blur', () => {

//   //   spyOn(component.shadowBlurControl, 'get');

//   //   const shadow = {
//   //     blur: 0,
//   //   };

//   //   expect(shadow.blur).toBe(0);

//   //   expect(spyOn).toBeTruthy();

//   // });

//   // it('should return border style', () => {

//   //   spyOn(component.borderStyleControl, 'get');

//   //   const border = {
//   //     style: 'bold',
//   //   };

//   //   expect(border.style).toBe('bold');

//   //   expect(spyOn).toBeTruthy();

//   // });
// });

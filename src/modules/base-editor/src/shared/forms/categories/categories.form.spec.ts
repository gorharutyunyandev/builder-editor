// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialog } from '@angular/material/dialog';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebProductsApi } from '@pe/builder-api';

// import { EditorCategoriesForm } from './categories.form';


// describe('Editor Categories Form', () => {

//   let fixture: ComponentFixture<EditorCategoriesForm>;
//   let component: EditorCategoriesForm;
//   let dialogSpy: jasmine.SpyObj<MatDialog>;
//   let productsSpy: jasmine.SpyObj<PebProductsApi>;

//   beforeEach(async(() => {

//     const dialog = jasmine.createSpyObj('MatDialog', ['MatDialog']);
//     const products = jasmine.createSpyObj('PebProductsApi', ['PebProductsApi']);


//     TestBed.configureTestingModule({
//       declarations: [
//         EditorCategoriesForm,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: MatDialog, useValue: dialog },
//         { provide: PebProductsApi, useValue: products },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(EditorCategoriesForm);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
//     productsSpy = TestBed.inject(PebProductsApi) as jasmine.SpyObj<PebProductsApi>;
//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });
//     // ensure the @Output is emitting the expected data to the parent
//   it('should remove a category', () => {

//     spyOn(component.blurred, 'emit');

//     component.removeCategory('1');

//     expect(component.blurred.emit).toHaveBeenCalledWith();

//   });

// });

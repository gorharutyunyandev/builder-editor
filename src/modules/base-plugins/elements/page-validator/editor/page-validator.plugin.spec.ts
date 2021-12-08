// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';

// import { PebEditorPageValidatorSidebar } from './page-validator.sidebar';

// describe('Page Validator Sidebar', () => {

//   let fixture: ComponentFixture<PebEditorPageValidatorSidebar>;
//   let component: PebEditorPageValidatorSidebar;
//   let dialogSpy: jasmine.SpyObj<MatDialog>;

//   beforeEach(async(() => {

//     const dialog = jasmine.createSpyObj('MatDialog', ['open']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorPageValidatorSidebar,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: MatDialog, useValue: dialog },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorPageValidatorSidebar);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
//   }));

//   it('should be defined', () => {

//     expect(component).toBeTruthy();

//   });

// });

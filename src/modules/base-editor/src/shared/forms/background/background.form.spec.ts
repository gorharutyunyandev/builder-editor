// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialog } from '@angular/material/dialog';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// import { MediaService, PebEditorApi } from '@pe/builder-api';

// import { EditorBackgroundForm } from './background.form';
// import { PebEditorProductDetailsSidebarComponent } from '../../_deprecated-sidebars/product-details/product-details.sidebar';


// describe('Editor Background Form', () => {

//   let fixture: ComponentFixture<EditorBackgroundForm>;
//   let  component: EditorBackgroundForm;


//   let mediaSpy: jasmine.SpyObj<MediaService>;
//   let matSpy: jasmine.SpyObj<MatDialog>;

//   beforeEach(async(() => {

//     const media = jasmine.createSpyObj('MediaService', ['getStyles']);
//     const matDialog = jasmine.createSpyObj('MatDialog', ['open']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorProductDetailsSidebarComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: MediaService, useValue: media },
//         { provide: MatDialog, useValue: matDialog },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(EditorBackgroundForm);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     mediaSpy = TestBed.inject(MediaService) as jasmine.SpyObj<MediaService>;
//     matSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should open media studio', () => {

//     expect(component.openMediaStudio).toBeTruthy();

//   });

//   it('should get fill type', () => {

//     expect(component.getFillType).toBeTruthy();

//   });

//   it('should change input handler', () => {

//     expect(component.changeBgInputHandler).toBeTruthy();

//   });

// });

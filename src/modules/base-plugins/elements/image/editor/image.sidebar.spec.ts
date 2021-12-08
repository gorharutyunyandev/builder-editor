// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';

// import { MediaService, PebEditorApi } from '@pe/builder-api';

// import { PebEditorState } from '../../../services/editor.state';
// import { PebEditorImageSidebar } from './image.sidebar';


// describe('Image Sidebar', () => {

//   let fixture: ComponentFixture<PebEditorImageSidebar>;
//   let component: PebEditorImageSidebar;

//   let apiSpy: jasmine.SpyObj<PebEditorApi>;
//   let stateSpy: jasmine.SpyObj<PebEditorState>;
//   let snackSpy: jasmine.SpyObj<MatSnackBar>;
//   let mediaSpy: jasmine.SpyObj<MediaService>;

//   beforeEach(async(() => {

//     const api = jasmine.createSpyObj('PebEditorApi', ['uploadImage']);
//     const state = jasmine.createSpyObj('PebEditorState', ['pagesView']);
//     const snackBar = jasmine.createSpyObj('MatSnackBar', ['HTMLElement', 'nativeElement']);
//     const media = jasmine.createSpyObj('MediaService', ['detectChanges']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorImageSidebar,
//       ],
//       imports: [ReactiveFormsModule, FormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: PebEditorApi, useValue: api },
//         { provide: PebEditorState, useValue: state },
//         { provide: MatSnackBar, useValue: snackBar },
//         { provide: MediaService, useValue: media },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorImageSidebar);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     apiSpy = TestBed.inject(PebEditorApi) as jasmine.SpyObj<PebEditorApi>;
//     stateSpy = TestBed.inject(PebEditorState) as jasmine.SpyObj<PebEditorState>;
//     snackSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
//     mediaSpy = TestBed.inject(MediaService) as jasmine.SpyObj<MediaService>;
//   }));

//   it('can load instance', () => {
//     expect(component).toBeTruthy();
//   });

// });

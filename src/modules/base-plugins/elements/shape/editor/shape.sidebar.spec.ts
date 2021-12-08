// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';

// import { MediaService, PebEditorApi } from '@pe/builder-api';

// import { PebEditorShapeSidebar } from './shape.sidebar';


// describe('Shape Sidebar', () => {

//   let fixture: ComponentFixture<PebEditorShapeSidebar>;
//   let component: PebEditorShapeSidebar;

//   let apiSpy: jasmine.SpyObj<PebEditorApi>;
//   let mediaSpy: jasmine.SpyObj<MediaService>;
//   let dialogSpy: jasmine.SpyObj<MatDialog>;

//   beforeEach(async(() => {

//     const api = jasmine.createSpyObj('PebEditorApi', ['uploadImage']);
//     const media = jasmine.createSpyObj('MediaService', ['detectChanges']);
//     const dialog = jasmine.createSpyObj('MatDialog', ['uploadImage']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorShapeSidebar,
//       ],
//       imports: [ReactiveFormsModule, FormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: PebEditorApi, useValue: api },
//         { provide: MediaService, useValue: media },
//         { provide: MatDialog, useValue: dialog },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorShapeSidebar);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     apiSpy = TestBed.inject(PebEditorApi) as jasmine.SpyObj<PebEditorApi>;
//     mediaSpy = TestBed.inject(MediaService) as jasmine.SpyObj<MediaService>;
//     dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
//   }));

//   it('can load instance', () => {
//     expect(component).toBeTruthy();
//   });

// });

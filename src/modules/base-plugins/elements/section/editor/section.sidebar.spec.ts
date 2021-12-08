// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { DomSanitizer } from '@angular/platform-browser';

// import { MediaService, PebEditorApi } from '@pe/builder-api';

// import { PebEditorSectionSidebar } from './section.sidebar';


// describe('Section Sidebar', () => {

//   let fixture: ComponentFixture<PebEditorSectionSidebar>;
//   let component: PebEditorSectionSidebar;

//   let apiSpy: jasmine.SpyObj<PebEditorApi>;
//   let mediaSpy: jasmine.SpyObj<MediaService>;
//   let dialogSpy: jasmine.SpyObj<MatDialog>;
//   let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;

//   beforeEach(async(() => {

//     const api = jasmine.createSpyObj('PebEditorApi', ['uploadImage']);
//     const media = jasmine.createSpyObj('MediaService', ['detectChanges']);
//     const dialog = jasmine.createSpyObj('MatDialog', ['uploadImage']);
//     const sanitizer = jasmine.createSpyObj('DomSanitizer', ['detectChanges']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorSectionSidebar,
//       ],
//       imports: [ReactiveFormsModule, FormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: PebEditorApi, useValue: api },
//         { provide: MediaService, useValue: media },
//         { provide: MatDialog, useValue: dialog },
//         { provide: DomSanitizer, useValue: sanitizer },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorSectionSidebar);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency


//     apiSpy = TestBed.inject(PebEditorApi) as jasmine.SpyObj<PebEditorApi>;
//     mediaSpy = TestBed.inject(MediaService) as jasmine.SpyObj<MediaService>;
//     dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
//     sanitizerSpy = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
//   }));

//   it('can load instance', () => {
//     expect(component).toBeTruthy();
//   });

// });

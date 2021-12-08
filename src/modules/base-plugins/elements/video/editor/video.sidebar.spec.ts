// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';

// import { MediaService } from '@pe/builder-api';

// import { PebEditorVideoSidebarComponent } from './video.sidebar';


// describe('PebEditorVideoSidebarComponent', () => {

//   let fixture: ComponentFixture<PebEditorVideoSidebarComponent>;
//   let component: PebEditorVideoSidebarComponent;

//   let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;
//   let mediaSpy: jasmine.SpyObj<MediaService>;
//   let dialogSpy: jasmine.SpyObj<MatDialog>;

//   beforeEach(async(() => {

//     const cdr = jasmine.createSpyObj('ChangeDetectorRef', ['uploadImage']);
//     const media = jasmine.createSpyObj('MediaService', ['detectChanges']);
//     const dialog = jasmine.createSpyObj('MatDialog', ['uploadImage']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorVideoSidebarComponent,
//       ],
//       imports: [ReactiveFormsModule, FormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: ChangeDetectorRef, useValue: cdr },
//         { provide: MediaService, useValue: media },
//         { provide: MatDialog, useValue: dialog },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorVideoSidebarComponent);
//       component = fixture.componentInstance;
//     });

//     cdrSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
//     mediaSpy = TestBed.inject(MediaService) as jasmine.SpyObj<MediaService>;
//     dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
//   }));

//   it('can load instance', () => {
//     expect(component).toBeTruthy();
//   });

// });

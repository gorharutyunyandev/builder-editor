// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';

// import { MediaService, PebEditorApi } from '@pe/builder-api';

// import { PebEditorPageSidebarComponent } from './page.sidebar';
// import { PebEditorProductDetailsSidebarComponent } from '../product-details/product-details.sidebar';


// describe('Page Sidebar ComponentOld', () => {

//   let fixture: ComponentFixture<PebEditorPageSidebarComponent>;
//   let  component: PebEditorPageSidebarComponent;

//   let apiSpy: jasmine.SpyObj<PebEditorApi>;
//   let mediaSpy: jasmine.SpyObj<MediaService>;
//   let matSpy: jasmine.SpyObj<MatDialog>;
//   let formSpy: jasmine.SpyObj<FormBuilder>;

//   let eventSpy: jasmine.SpyObj<Event>;

//   beforeEach(async(() => {

//     const api = jasmine.createSpyObj('PebEditorApi', ['uploadImage']);
//     const media = jasmine.createSpyObj('MediaService', ['getStyles']);
//     const matDialog = jasmine.createSpyObj('MatDialog', ['open']);
//     const form = jasmine.createSpyObj('FormBuilder', ['control']);


//     const event = jasmine.createSpyObj('Event', ['preventDefault']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorProductDetailsSidebarComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: PebEditorApi, useValue: api },
//         { provide: MediaService, useValue: media },
//         { provide: MatDialog, useValue: matDialog },
//         { provide: FormBuilder, useValue: form },
//         { provide: Event, useValue: event },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorPageSidebarComponent);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     apiSpy = TestBed.inject(PebEditorApi) as jasmine.SpyObj<PebEditorApi>;
//     mediaSpy = TestBed.inject(MediaService) as jasmine.SpyObj<MediaService>;
//     matSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
//     formSpy = TestBed.inject(FormBuilder) as jasmine.SpyObj<FormBuilder>;


//     // Inject the service-to-tests and its (spy) dependency


//     eventSpy = TestBed.inject(Event) as jasmine.SpyObj<Event>;
//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should test page name input enter handler', () => {

//     // ensure the @Output is emitting the expected data to the parent

//     eventSpy.preventDefault();

//     spyOn(component.changePageName, 'emit');

//     component.pageNameInputEnterHandler(eventSpy);

//     expect(component.changePageName.emit).toHaveBeenCalledWith();
//   });

// });

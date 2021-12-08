// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebEditorApi } from '@pe/builder-api';

// import { PebEditorProductsSidebarComponent } from './products.sidebar';


// describe('Products Sidebar Component', () => {

//   let fixture: ComponentFixture<PebEditorProductsSidebarComponent>;
//   let component: PebEditorProductsSidebarComponent;

//   let apiSpy: jasmine.SpyObj<PebEditorApi>;
//   let detectorSpy: jasmine.SpyObj<ChangeDetectorRef>;

//   beforeEach(async(() => {

//     const api = jasmine.createSpyObj('PebEditorApi', ['uploadImage']);
//     const formBuilderStub = { group: object1 => ({}) };
//     const detector = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorProductsSidebarComponent,
//       ],
//       imports: [ReactiveFormsModule, FormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: PebEditorApi, useValue: api },
//         { provide: ChangeDetectorRef, useValue: detector },
//         { provide: FormBuilder, useValue: formBuilderStub },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorProductsSidebarComponent);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     apiSpy = TestBed.inject(PebEditorApi) as jasmine.SpyObj<PebEditorApi>;
//     detectorSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
//   }));

//   it('can load instance', () => {
//     expect(component).toBeTruthy();
//   });

// });

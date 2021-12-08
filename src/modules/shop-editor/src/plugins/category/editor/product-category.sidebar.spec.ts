// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebEditorApi } from '@pe/builder-api';

// import { PebEditorProductCategorySidebarComponent } from './product-category.sidebar';


// describe('Product Sidebar Sidebar Component', () => {

//   let fixture: ComponentFixture<PebEditorProductCategorySidebarComponent>;
//   let component: PebEditorProductCategorySidebarComponent;

//   let apiSpy: jasmine.SpyObj<PebEditorApi>;
//   let detectorSpy: jasmine.SpyObj<ChangeDetectorRef>;

//   const api = jasmine.createSpyObj('PebEditorApi', ['uploadImage']);
//   const detector = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

//   beforeEach(async(() => {


//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorProductCategorySidebarComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: PebEditorApi, useValue: api },
//         { provide: ChangeDetectorRef, useValue: detector },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorProductCategorySidebarComponent);
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

// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebEditorSeoSidebar } from './seo.sidebar';
// import { PebEditorProductDetailsSidebarComponent } from '../product-details/product-details.sidebar';

// describe('Seo Sidebar', () => {

//   let fixture: ComponentFixture<PebEditorSeoSidebar>;
//   let  component: PebEditorSeoSidebar;

//   let detectorSpy: jasmine.SpyObj<ChangeDetectorRef>;

//   beforeEach(async(() => {

//     const detector = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorProductDetailsSidebarComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: ChangeDetectorRef, useValue: detector },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorSeoSidebar);
//       component = fixture.componentInstance;

//       component.ngOnInit();
//     });

//     // Inject the service-to-tests and its (spy) dependenc

//     detectorSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

// });

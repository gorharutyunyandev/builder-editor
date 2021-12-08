// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebMediaService } from '@pe/builder-core';

// import { EditorVideoForm } from './video.form';
// import { PebEditorProductDetailsSidebarComponent } from '../../_deprecated-sidebars/product-details/product-details.sidebar';


// describe('Video Form', () => {

//   let fixture: ComponentFixture<EditorVideoForm>;
//   let  component: EditorVideoForm;

//   let mediaSpy: jasmine.SpyObj<PebMediaService>;
//   let detectorSpy: jasmine.SpyObj<ChangeDetectorRef>;

//   beforeEach(async(() => {
//     const media = jasmine.createSpyObj('PebMediaService', ['clear']);
//     const detector = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorProductDetailsSidebarComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: PebMediaService, useValue: media },
//         { provide: ChangeDetectorRef, useValue: detector },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(EditorVideoForm);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     mediaSpy = TestBed.inject(PebMediaService) as jasmine.SpyObj<PebMediaService>;
//     detectorSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should check function onFileChange', () => {

//     expect(component.onFileChange).toBeTruthy();

//   });

// });

// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebEditorApi } from '@pe/builder-api';

// import { PebEditorCarouselSidebarComponent } from './carousel.sidebar';

// describe('Carousel Sidebar Component', () => {

//   let fixture: ComponentFixture<PebEditorCarouselSidebarComponent>;
//   let  component: PebEditorCarouselSidebarComponent;

//   let apiSpy: jasmine.SpyObj<PebEditorApi>;
//   let detectorSpy: jasmine.SpyObj<ChangeDetectorRef>;

//   beforeEach(async(() => {

//     const api = jasmine.createSpyObj('PebEditorApi', ['uploadImageWithProgress']);
//     const detector = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorCarouselSidebarComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: PebEditorApi, useValue: api },
//         { provide: ChangeDetectorRef, useValue: detector },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorCarouselSidebarComponent);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     apiSpy = TestBed.inject(PebEditorApi) as jasmine.SpyObj<PebEditorApi>;
//     detectorSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should check GallerySubTab', () => {
//     expect(component.gallerySubTab).toEqual(component.gallerySubTab);
//   });

//   it('should select slide', () => {
//     expect(component.selectedSlideIndex).toEqual(0);

//     expect(component.selectSlide).toBeTruthy();
//   });

//   it('should create initial of form', () => {

//     const form = {
//       size: {
//         height: '300',
//       },
//     };
//     // initialize value to form size
//     expect(form.size.height).toBe('300');
//     expect(component.createInitialForm).toBeTruthy();
//   });

//   it('should select image', () => {
//     const gallery = component.gallerySubTab;
//     // make gallery selected
//     expect(gallery).toEqual(component.GallerySubTab.Selected);

//     expect(component.onMediaImageSelected).toBeTruthy();
//   });

//   it('should replace to media image', () => {
//     const gallery = component.gallerySubTab;

//     expect(gallery).toEqual(component.GallerySubTab.Selected);

//     expect(component.replaceToMediaImage).toBeTruthy();

//     component.replaceToMediaImage(1);
//   });

// });

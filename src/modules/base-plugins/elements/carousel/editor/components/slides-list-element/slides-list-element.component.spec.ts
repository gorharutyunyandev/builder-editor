// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { DebugElement, ElementRef, NO_ERRORS_SCHEMA, ViewContainerRef } from '@angular/core';
// import { Overlay } from '@angular/cdk/overlay';
// import { By, DomSanitizer } from '@angular/platform-browser';

// import { PebEditorSlidesListElementSidebarComponent } from './slides-list-element.component';

// describe('Slides List Element Sidebar Component', () => {

//   let fixture: ComponentFixture<PebEditorSlidesListElementSidebarComponent>;
//   let  component: PebEditorSlidesListElementSidebarComponent;
//   let overlaySpy: jasmine.SpyObj<Overlay>;
//   let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;
//   let vcrSpy: jasmine.SpyObj<ViewContainerRef>;


//   const overlay = jasmine.createSpyObj('Overlay', ['create', 'position', 'dispose']);
//   const sanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustUrl']);
//   const vcr = jasmine.createSpyObj('ViewContainerRef', ['clear']);
//   const event = jasmine.createSpyObj('Event', ['preventDefault', 'stopPropagation']);


//   let de: DebugElement;
//   let button: ElementRef;

//   beforeEach(async(() => {

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorSlidesListElementSidebarComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: Overlay, useValue: overlay },
//         { provide: DomSanitizer, useValue: sanitizer },
//         { provide: ViewContainerRef, useValue: vcr },
//         { provide: Event, useValue: event },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorSlidesListElementSidebarComponent);
//       component = fixture.componentInstance;
//       de = fixture.debugElement;
//       button = de.query(By.css('button'));
//     });

//     overlaySpy = TestBed.inject(Overlay) as jasmine.SpyObj<Overlay>;
//     sanitizerSpy = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
//     vcrSpy = TestBed.inject(ViewContainerRef) as jasmine.SpyObj<ViewContainerRef>;
//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should select slide', () => {
//     spyOn(component.selectSlide, 'emit');
//     component.onSelectSlide();
//     expect(component.selectSlide.emit).toHaveBeenCalled();
//   });

//   it('should delete slide', () => {
//     spyOn(component.deleteSlide, 'emit');
//     component.onDelete();

//     component.closeContextMenu();
//     expect(component.deleteSlide.emit).toHaveBeenCalled();
//   });

//   it('should replace slide to own', () => {
//     spyOn(component.replaceToOwnImage, 'emit');
//     component.onReplaceToOwn();

//     component.closeContextMenu();
//     expect(component.replaceToOwnImage.emit).toHaveBeenCalled();
//   });

//   it('should replace from media', () => {
//     spyOn(component.replaceToMediaImage, 'emit');
//     component.onReplaceFromMedia();

//     component.closeContextMenu();
//     expect(component.replaceToMediaImage.emit).toHaveBeenCalled();
//   });

//   it('should open context menu', () => {
//     expect(component.openContextMenu).toBeTruthy();
//   });

//   it('should close context menu', () => {
//     overlay.dispose();

//     expect(component.closeContextMenu).toBeTruthy();
//   });

//   it('should sanitize url', () => {
//     sanitizer.bypassSecurityTrustUrl('url');

//     expect(component.sanitize).toBeTruthy();
//   });
// });

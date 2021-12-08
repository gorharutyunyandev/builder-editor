// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { ChangeDetectorRef, ElementRef, Injector, NO_ERRORS_SCHEMA, Renderer2, ViewContainerRef } from '@angular/core';
// import { Overlay } from '@angular/cdk/overlay';
// import { DomSanitizer } from '@angular/platform-browser';
//
// import { PebEditorApi } from '@pe/builder-api';
// import { PebEditorState, PebEditorStore, PebEditorUtilsService } from '@pe/builder-editor';
//
// import { PebEditorShopNavigationComponent } from './navigation.component';
// import { PebEditorProductDetailsSidebarComponent } from '../plugins/product-details/editor/product-details.sidebar';
//
//
// describe('Pages Sidebar Component', () => {
//
//   let fixture: ComponentFixture<PebEditorShopNavigationComponent>;
//   let component: PebEditorShopNavigationComponent;
//
//   let apiSpy: jasmine.SpyObj<PebEditorApi>;
//   let stateSpy: jasmine.SpyObj<PebEditorState>;
//   let utilsSpy: jasmine.SpyObj<PebEditorUtilsService>;
//   let elementSpy: jasmine.SpyObj<ElementRef>;
//   let injSpy: jasmine.SpyObj<Injector>;
//   let overlaySpy: jasmine.SpyObj<Overlay>;
//   let rendererSpy: jasmine.SpyObj<Renderer2>;
//   let domSpy: jasmine.SpyObj<DomSanitizer>;
//   let storeSpy: jasmine.SpyObj<PebEditorStore>;
//   let vcrSpy: jasmine.SpyObj<ViewContainerRef>;
//   let detectorSpy: jasmine.SpyObj<ChangeDetectorRef>;
//
//   let snapSpy: any;
//   snapSpy = jasmine.createSpyObj('PageSnapshot', ['id']);
//
//
//   let pageSpy: any;
//   pageSpy = jasmine.createSpyObj('PebPageShort', ['id']);
//
//
//   const api = jasmine.createSpyObj('PebEditorApi', ['uploadImage']);
//   const state = jasmine.createSpyObj('PebEditorState', ['pagesView']);
//   const utils = jasmine.createSpyObj('PebEditorUtilsService', ['constructPageSnapshot']);
//   const elRef = jasmine.createSpyObj('ElementRef', ['HTMLElement', 'nativeElement']);
//   const injector = jasmine.createSpyObj('Injector', ['create']);
//   const overlay = jasmine.createSpyObj('Overlay', ['create', 'position', 'scrollStrategies']);
//   const renderer = jasmine.createSpyObj('Renderer2', ['setStyle', 'createElement', 'removeChild']);
//   const dom = jasmine.createSpyObj('DomSanitizer', ['sanitize']);
//   const store = jasmine.createSpyObj('PebEditorStore', ['activePageId$', 'snapshot', 'updatePagePreview']);
//   const vcr = jasmine.createSpyObj('ViewContainerRef', ['clear']);
//   const detector = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
//
//   beforeEach(async(() => {
//
//
//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorProductDetailsSidebarComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: PebEditorApi, useValue: api },
//         { provide: PebEditorState, useValue: state },
//         { provide: PebEditorUtilsService, useValue: utils },
//         { provide: ElementRef, useValue: elRef },
//         { provide: Injector, useValue: injector },
//         { provide: Overlay, useValue: overlay },
//         { provide: Renderer2, useValue: renderer },
//         { provide: DomSanitizer, useValue: dom },
//         { provide: PebEditorStore, useValue: store },
//         { provide: ViewContainerRef, useValue: vcr },
//         { provide: ChangeDetectorRef, useValue: detector },
//       ],
//     }).compileComponents().then(() => {
//
//       fixture = TestBed.createComponent(PebEditorShopNavigationComponent);
//       component = fixture.componentInstance;
//     });
//
//     // Inject the service-to-tests and its (spy) dependency
//
//     apiSpy = TestBed.inject(PebEditorApi) as jasmine.SpyObj<PebEditorApi>;
//     stateSpy = TestBed.inject(PebEditorState) as jasmine.SpyObj<PebEditorState>;
//     utilsSpy = TestBed.inject(PebEditorUtilsService) as jasmine.SpyObj<PebEditorUtilsService>;
//     elementSpy = TestBed.inject(ElementRef) as jasmine.SpyObj<ElementRef>;
//     injSpy = TestBed.inject(Injector) as jasmine.SpyObj<Injector>;
//     overlaySpy = TestBed.inject(Overlay) as jasmine.SpyObj<Overlay>;
//     rendererSpy = TestBed.inject(Renderer2) as jasmine.SpyObj<Renderer2>;
//     domSpy = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
//     storeSpy = TestBed.inject(PebEditorStore) as jasmine.SpyObj<PebEditorStore>;
//     vcrSpy = TestBed.inject(ViewContainerRef) as jasmine.SpyObj<ViewContainerRef>;
//     detectorSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
//   }));
//
//   it('should be defined', () => {
//
//     expect(component).toBeTruthy();
//
//   });
//
//   it('should get page snapshot', () => {
//     // call snapshot page service
//     expect(snapSpy).toHaveBeenCalledWith(1);
//
//     expect(component.getPageSnapshot).toBeTruthy();
//   });
//
//   /**
//    * ensure the @Output is emitting the expected data to the parent
//    */
//
//   it('should emit when the button is clicked', () => {
//
//     spyOn(component.selected, 'emit');
//
//     component.onSelect(pageSpy);
//
//     expect(component.selected.emit).toHaveBeenCalledWith(1);
//   });
//
//   it('should delete a page', () => {
//
//     spyOn(component.deleted, 'emit');
//
//     component.deletePage(pageSpy);
//
//     expect(component.deleted.emit).toHaveBeenCalledWith(1);
//
//   });
//
//   it('should create a page', () => {
//
//     component.closeContextMenu();
//
//     spyOn(component.created, 'emit');
//
//     component.createPage(pageSpy);
//
//     expect(component.created.emit).toHaveBeenCalledWith(1);
//   });
//
//   it('should duplicate a page', () => {
//
//     component.closeContextMenu();
//
//
//     spyOn(component.duplicated, 'emit');
//
//     component.duplicatePage(pageSpy);
//
//     expect(component.duplicated.emit).toHaveBeenCalledWith(1);
//
//   });
//
//   it('should open a context menu', () =>  {
//
//     component.closeContextMenu();
//
//     expect(component.openContextMenu).toBeTruthy();
//
//   });
//
//   it('should close a context menu', () =>  {
//
//     overlay.dispose();
//
//     expect(component.closeContextMenu).toBeTruthy();
//   });
// });

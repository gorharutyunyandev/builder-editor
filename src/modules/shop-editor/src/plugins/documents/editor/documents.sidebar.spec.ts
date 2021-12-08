// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebEditorDocumentsSidebarComponent } from './documents.sidebar';
// import { PebEditorState } from '../../../../services/editor.state';

// describe('Code Sidebar Component', () => {

//   let fixture: ComponentFixture<PebEditorDocumentsSidebarComponent>;
//   let  component: PebEditorDocumentsSidebarComponent;

//   let stateSpy: jasmine.SpyObj<PebEditorState>;
//   const event: MouseEvent = null;
//   let stylesSpy: any;
//   let elementSpy: any;

//   elementSpy = jasmine.createSpyObj('PebElementDef', ['id', 'type']);

//   stylesSpy = jasmine.createSpyObj('PebStylesheet', ['style']);

//   beforeEach(async(() => {

//     const state = jasmine.createSpyObj('PebEditorState', ['pagesView']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorDocumentsSidebarComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: PebEditorState, useValue: state },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorDocumentsSidebarComponent);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     stateSpy = TestBed.inject(PebEditorState) as jasmine.SpyObj<PebEditorState>;

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should select an element', () => {
//     const openedElements = {};

//     expect(openedElements).toContain(elementSpy.id);

//     // toggle the element

//     expect(openedElements[elementSpy.id]).not.toEqual(openedElements[elementSpy.id]);

//     expect(stateSpy.selectedElements).toContain(elementSpy.id);
//   });

//   it('should get element name', () => {

//     const nameOverrides = {
//       'shop-cart': 'Cart',
//       'shop-products': 'Product',
//       'shop-product-details': 'Product Details',
//     };

//     expect(nameOverrides[elementSpy.type]).toBeTruthy();
//   });

//   it('should toggle visibility', () => {
//     // ensure the @Output is emitting the expected data to the parent
//     spyOn(component.changeElementVisible, 'emit');

//     component.toggleVisible(event, elementSpy);

//     expect(component.changeElementVisible.emit).toHaveBeenCalledWith(1);

//   });

//   it('should check if element is visible', () => {
//     // display: none
//     expect(stylesSpy.display).not.toEqual('none');
//   });
// });

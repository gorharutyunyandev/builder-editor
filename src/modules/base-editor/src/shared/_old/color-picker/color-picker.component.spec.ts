// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA, ViewContainerRef } from '@angular/core';
// import { Overlay } from '@angular/cdk/overlay';
// import { Directionality } from '@angular/cdk/bidi';

// import { PebEditorColorPickerComponent } from './color-picker.component';
// import { PebEditorProductDetailsSidebarComponent } from '../../product-details/product-details.sidebar';


// describe('Color Picker Component', () => {

//   let fixture: ComponentFixture<PebEditorColorPickerComponent>;
//   let  component: PebEditorColorPickerComponent;
//   let overlaySpy: jasmine.SpyObj<Overlay>;
//   let dirSpy: jasmine.SpyObj<Directionality>;
//   let vcrSpy: jasmine.SpyObj<ViewContainerRef>;


//   const overlay = jasmine.createSpyObj('Overlay', ['create', 'position', 'scrollStrategies']);
//   const dir = jasmine.createSpyObj('Directionality', ['value']);
//   const vcr = jasmine.createSpyObj('ViewContainerRef', ['clear']);

//   beforeEach(async(() => {

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorProductDetailsSidebarComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: Directionality, useValue: dir },
//         { provide: Overlay, useValue: overlay },
//         { provide: ViewContainerRef, useValue: vcr },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorColorPickerComponent);
//       component = fixture.componentInstance;
//       component.ngOnInit();
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     overlaySpy = TestBed.inject(Overlay) as jasmine.SpyObj<Overlay>;
//     dirSpy = TestBed.inject(Directionality) as jasmine.SpyObj<Directionality>;
//     vcrSpy = TestBed.inject(ViewContainerRef) as jasmine.SpyObj<ViewContainerRef>;
//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should select a color', () => {
//     const color = component.pebColorPicker;

//     // ensure the @Output is emitting the expected data to the parent
//     spyOn(component.pebColorPickerChange, 'emit');
//     component.selectColor(color);
//     expect(component.pebColorPickerChange.emit).toHaveBeenCalledWith();

//     overlay.dispose();
//     expect(component.selectColor).toBeTruthy();
//   });

// });

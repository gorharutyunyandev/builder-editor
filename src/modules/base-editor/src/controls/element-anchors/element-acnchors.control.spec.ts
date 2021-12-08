// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ChangeDetectorRef, DebugElement, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';

// import { PebEditorElementAnchorsControl } from './element-anchors.control';
// import { WherePipe } from '../../misc/pipes/where.pipe';
// describe('Element Anchors Control', () => {

//   let fixture: ComponentFixture<PebEditorElementAnchorsControl>;
//   let component: PebEditorElementAnchorsControl;
//   let el: DebugElement;

//   const element = jasmine.createSpyObj('ElementRef', ['definition']);
//   const cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

//   let elSpy: jasmine.SpyObj<ElementRef>;
//   let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;


//   beforeEach(async(() => {

//     TestBed.configureTestingModule({
//       providers: [
//         { provide: ElementRef, useValue: element },
//         { provide: ChangeDetectorRef, useValue: cdr },
//       ],
//       declarations: [PebEditorElementAnchorsControl, WherePipe],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorElementAnchorsControl);
//       component = fixture.componentInstance;
//       el = fixture.debugElement;

//       component.component = element;

//     });
//     // Inject the service-to-tests and its (spy) dependency
//     elSpy = TestBed.inject(ElementRef) as jasmine.SpyObj<ElementRef>;
//     cdrSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
//   }));


//   const dimensions = {
//     width: 100,
//     height: 100,
//     top: 0,
//     left: 0,
//   };


//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should test function detectChanges', () => {

//     cdr.detectChanges();

//     component.detectChanges();

//     expect(component.detectChanges).toBeTruthy();

//   });

//   it('should test function nativeElement', () => {
//     elSpy.nativeElement();
//   });

//   it('should test function width', () => {
//     expect(dimensions.width).toBeTruthy();

//   });

//   it('should test function height', () => {
//     expect(dimensions.height).toBeTruthy();

//   });

//   it('should test function top', () => {
//     expect(dimensions.top).toBe(0);
//   });

//   it('should test function left', () => {
//     expect(dimensions.left).toBe(0);
//   });

//   it('should test function canShowThreeXAnchors', () => {
//     const anchorSize = 9;
//     expect(anchorSize * 3).toBeGreaterThan(26);
//   });

//   it('should test function canShowThreeYAnchors', () => {
//     const anchorSize = 9;
//     expect(anchorSize * 3).toBeLessThan(28);
//   });

//   it('should get color', () => {
//     expect(component.color).toBe('#067AF1');
//   });

//   it('should get element definition', () => {
//     expect(element.definition).toBeTruthy();
//   });
// });

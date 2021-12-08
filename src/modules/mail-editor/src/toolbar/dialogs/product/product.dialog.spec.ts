// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { OVERLAY_DATA } from '../../overlay.data';
// import { PebEditorProductDialogComponent } from './product.dialog';

// describe('Product Dialog Component', () => {

//   let fixture: ComponentFixture<PebEditorProductDialogComponent>;
//   let  component: PebEditorProductDialogComponent;


//   let valueSpy: any;
//   valueSpy = jasmine.createSpyObj('ProductOptions');

//   beforeEach(async(() => {

//     const overlayDataMock = {};

//     TestBed.configureTestingModule({
//       providers: [
//         PebEditorProductDialogComponent,
//         { provide: OVERLAY_DATA, useValue: overlayDataMock },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorProductDialogComponent);
//       component = fixture.componentInstance;
//     });

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should set value', () => {
//     spyOn(component.data.emitter, 'next');
//     component.addProduct(valueSpy);
//     expect(component.data.emitter).toHaveBeenCalledWith(1);
//   });

// });

// import { Overlay } from '@angular/cdk/overlay';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';

// import { ColorPickerOverlayComponent } from './color-picker-overlay.component';
// import { COLOR_PICKER_DATA } from './color-picker.data';

// describe('Color Picker Overlay Input', () => {

//   let fixture: ComponentFixture<ColorPickerOverlayComponent>;
//   let  component: ColorPickerOverlayComponent;

//   beforeEach(async(() => {

//     const data = jasmine.createSpyObj('COLOR_PICKER_DATA', ['data']);


//     TestBed.configureTestingModule({
//       declarations: [
//         ColorPickerOverlayComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: COLOR_PICKER_DATA, useValue: data },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(ColorPickerOverlayComponent);
//       component = fixture.componentInstance;
//     });
//   }));

//   const color = '';

//   it('should be defined', () => {

//     expect(component).toBeTruthy();

//   });

//   it('should emit when clicked on setColorValue', () => {
//     spyOn(component.colorSelected, 'emit');
//     component.setColorValue(color);
//     expect(component.colorSelected.emit).toHaveBeenCalledWith();
//   });


//   it('should check output() changeStyle', () => {
//     spyOn(component.colorSelected, 'emit');
//     component.setColorAndClose(color);
//     expect(component.colorSelected.emit).toHaveBeenCalledWith();
//   });

//   it('should submit a color', () => {
//     component.setColorAndClose(color);
//   });


// });

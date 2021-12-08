// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { OVERLAY_DATA } from '../../overlay.data';
// import { PebEditorScreenDialogComponent } from './screen.dialog';

// let valueSpy: any;
// valueSpy = jasmine.createSpyObj('PebScreen');

// describe('Screen Dialog Component', () => {

//   let fixture: ComponentFixture<PebEditorScreenDialogComponent>;
//   let  component: PebEditorScreenDialogComponent;

//   beforeEach(async(() => {

//     const overlayDataMock = {};

//     TestBed.configureTestingModule({
//       providers: [
//         PebEditorScreenDialogComponent,
//         { provide: OVERLAY_DATA, useValue: overlayDataMock },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorScreenDialogComponent);
//       component = fixture.componentInstance;
//     });

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should test PebScreen', () => {
//     expect(valueSpy).toEqual(valueSpy);
//   });

//   it('should set value', () => {
//     spyOn(component.data.emitter, 'next');
//     component.setScreen(valueSpy);
//     expect(component.data.emitter).toHaveBeenCalledWith(1);
//   });

// });

// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

// import { PebEditorZoomDialogComponent } from './zoom.dialog';
// import { OVERLAY_DATA } from '../../overlay.data';


// describe('Zoom Dialog Component', () => {

//   let fixture: ComponentFixture<PebEditorZoomDialogComponent>;
//   let  component: PebEditorZoomDialogComponent;

//   beforeEach(async(() => {

//     const overlayDataMock = {};

//     TestBed.configureTestingModule({
//       providers: [
//         PebEditorZoomDialogComponent,
//         { provide: OVERLAY_DATA, useValue: overlayDataMock },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorZoomDialogComponent);
//       component = fixture.componentInstance;
//     });

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should set value', () => {
//     spyOn(component.data.emitter, 'next');
//     component.setValue(1);
//     expect(component.data.emitter).toHaveBeenCalledWith(1);
//   });

// });

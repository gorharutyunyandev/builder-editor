// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// import { OVERLAY_DATA } from '../../overlay.data';
// import { PebEditorObjectsDialogComponent } from './objects.dialog';


// let valueSpy: any;
// valueSpy = jasmine.createSpyObj('ObjectCategory');

// describe('Objects Dialog Component', () => {

//   let fixture: ComponentFixture<PebEditorObjectsDialogComponent>;
//   let  component: PebEditorObjectsDialogComponent;

//   beforeEach(async(() => {

//     const overlayDataMock = {};

//     TestBed.configureTestingModule({
//       providers: [
//         { provide: OVERLAY_DATA, useValue: overlayDataMock },
//       ],
//       declarations: [PebEditorObjectsDialogComponent],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorObjectsDialogComponent);
//       component = fixture.componentInstance;
//     });

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should set value', () => {
//     spyOn(component.data.emitter, 'next');
//     component.addObject(valueSpy);
//     expect(component.data.emitter).toHaveBeenCalledWith(1);
//   });

// });

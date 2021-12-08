// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { PebElementType } from '@pe/builder-core';

// import { OVERLAY_DATA } from '../../overlay.data';
// import { PebEditorMediaDialogComponent } from './media.dialog';

// let valueSpy: any;
// valueSpy = jasmine.createSpyObj('MediaOptions');

// describe('Media Dialog Component', () => {

//   let fixture: ComponentFixture<PebEditorMediaDialogComponent>;
//   let  component: PebEditorMediaDialogComponent;

//   beforeEach(async(() => {

//     const overlayDataMock = {};

//     TestBed.configureTestingModule({
//       providers: [
//         PebEditorMediaDialogComponent,
//         { provide: OVERLAY_DATA, useValue: overlayDataMock },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorMediaDialogComponent);
//       component = fixture.componentInstance;
//     });

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should set value', () => {
//     spyOn(component.data.emitter, 'next');
//     component.addMedia(valueSpy);
//     expect(component.data.emitter).toHaveBeenCalledWith(1);
//   });

// });

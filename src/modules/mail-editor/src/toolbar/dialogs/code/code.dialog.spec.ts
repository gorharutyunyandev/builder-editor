// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { PebElementType } from '@pe/builder-core';

// import { OVERLAY_DATA } from '../../overlay.data';
// import { PebEditorCodeDialogComponent } from './code.dialog';
// import { PebEditorState } from '../../../services/editor.state';

// describe('Code Dialog Component', () => {

//   let fixture: ComponentFixture<PebEditorCodeDialogComponent>;
//   let component: PebEditorCodeDialogComponent;
//   let stateSpy: jasmine.SpyObj<PebEditorState>;

//   beforeEach(async(() => {

//     const type = jasmine.createSpyObj('PebElementType', ['Html', 'Script']);
//     const overlayDataMock = {};
//     const state = jasmine.createSpyObj('PebEditorState', ['pagesView']);

//     TestBed.configureTestingModule({
//       providers: [
//         PebEditorCodeDialogComponent,
//         { provide: OVERLAY_DATA, useValue: overlayDataMock },
//         { provide: PebElementType, useValue: type },
//         { provide: PebEditorState, useValue: state },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorCodeDialogComponent);
//       component = fixture.componentInstance;
//     });

//     stateSpy = TestBed.inject(PebEditorState) as jasmine.SpyObj<PebEditorState>;
//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

// });

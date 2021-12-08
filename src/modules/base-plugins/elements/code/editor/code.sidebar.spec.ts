// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebEditorCodeSidebarComponent } from './code.sidebar';
// import { PebEditorState } from '../../../../services/editor.state';

// describe('Code Sidebar Component', () => {

//   let fixture: ComponentFixture<PebEditorCodeSidebarComponent>;
//   let component: PebEditorCodeSidebarComponent;

//   let stateSpy: jasmine.SpyObj<PebEditorState>;

//   const event: any = null;

//   beforeEach(async(() => {

//     const state = jasmine.createSpyObj('PebEditorState', ['pagesView']);

//     TestBed.configureTestingModule({
//       declarations: [PebEditorCodeSidebarComponent],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: PebEditorState, useValue: state },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorCodeSidebarComponent);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     stateSpy = TestBed.inject(PebEditorState) as jasmine.SpyObj<PebEditorState>;
//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   // ensure the @Output is emitting the expected data to the parent

//   it('should change code', () => {

//     expect(component.changeCode).toBeTruthy();

//     spyOn(component.changeCode, 'emit');
//     component.onCodeChange(event);
//     expect(component.changeCode.emit).toHaveBeenCalledWith();
//   });
// });

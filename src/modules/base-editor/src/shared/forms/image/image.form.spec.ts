// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { EditorImageForm } from './image.form';



// describe('Editor Image Form', () => {

//   let fixture: ComponentFixture<EditorImageForm>;
//   let  component: EditorImageForm;

//   beforeEach(async(() => {

//     const overlayDataMock = {};

//     TestBed.configureTestingModule({
//       providers: [
//         EditorImageForm,
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(EditorImageForm);
//       component = fixture.componentInstance;
//     });

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should emit blurred', () => {
//     // spy on event emitter
//     component = fixture.componentInstance;
//     spyOn(component.blurred, 'emit');

//     // trigger the click
//     const nativeElement = fixture.nativeElement;
//     const input = nativeElement.querySelector('editor-file-input');
//     input.dispatchEvent(new Event('click'));

//     fixture.detectChanges();

//     expect(component.blurred.emit).toHaveBeenCalled();
//   });

// });

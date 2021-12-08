// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { PebEditorArrangeTabComponent } from './arrange-tab.component';

// describe('Arrange Tab Component', () => {

//   let fixture: ComponentFixture<PebEditorArrangeTabComponent>;
//   let  component: PebEditorArrangeTabComponent;

//   let elementSpy: any;

//   elementSpy = jasmine.createSpyObj('PebElementDef', ['id', 'type']);

//   beforeEach(async(() => {

//     TestBed.configureTestingModule({
//       providers: [
//         PebEditorArrangeTabComponent,
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorArrangeTabComponent);
//       component = fixture.componentInstance;
//     });

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   /**
//    * OUTPUT() testing
//    */

//   it('should emit when lock element', () => {
//     spyOn(component.lockElement, 'emit');
//     component.lockElem();
//     expect(component.lockElement.emit).toHaveBeenCalledWith();
//   });

//   it('should emit when unlock element', () => {
//     spyOn(component.unlockElement, 'emit');
//     component.unlockElem();
//     expect(component.unlockElement.emit).toHaveBeenCalledWith();
//   });

//   it('should emit when click onElementFocus', () => {
//     spyOn(component.changeFocus, 'emit');
//     component.onElementFocus(elementSpy);
//     expect(component.changeFocus.emit).toHaveBeenCalledWith();
//   });

//   it('should emit when click onElementBlur', () => {
//     spyOn(component.changeBlur, 'emit');
//     component.onElementBlur(elementSpy);
//     expect(component.changeBlur.emit).toHaveBeenCalledWith();
//   });

//   /**
//    * TEStING GET FUNCTION ()
//    */

//   it('should test sizeFormGroup', () => {

//     spyOn(component.form, 'get');

//     const size = component.form.get('size');

//     expect(size).toBeTruthy();

//   });

//   it('should test positionFormGroup', () => {

//     spyOn(component.form, 'get');

//     const position = component.form.get('position');

//     expect(position).toBeTruthy();

//   });
// });

// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';

// import { SidebarNumberInput } from './number.input';


// describe('Sidebar Number Input', () => {

//   let fixture: ComponentFixture<SidebarNumberInput>;
//   let  component: SidebarNumberInput;

//   let injSpy: jasmine.SpyObj<Injector>;

//   beforeEach(async(() => {

//     const inj = jasmine.createSpyObj('Injector', ['create']);


//     TestBed.configureTestingModule({
//       declarations: [
//         SidebarNumberInput,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: Injector, useValue: inj },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(SidebarNumberInput);
//       component = fixture.componentInstance;
//     });

//     injSpy = TestBed.inject(Injector) as jasmine.SpyObj<Injector>;

//   }));

//   it('should be defined', () => {

//     expect(component).toBeTruthy();

//   });

//   it('should check output() focused', () => {
// // spy on event emitter
//     component = fixture.componentInstance;
//     spyOn(component.focused, 'emit');

// // trigger the click
//     const nativeElement = fixture.nativeElement;
//     const input = nativeElement.querySelector('input');
//     input.dispatchEvent(new Event('click'));

//     fixture.detectChanges();

//     expect(component.focused.emit).toHaveBeenCalled();
//   });

//   it('should check output() blurred', () => {
// // spy on event emitter
//     component = fixture.componentInstance;
//     spyOn(component.blurred, 'emit');

// // trigger the click
//     const nativeElement = fixture.nativeElement;
//     const div = nativeElement.querySelector('div.number-input');
//     div.dispatchEvent(new Event('click'));

//     fixture.detectChanges();

//     expect(component.blurred.emit).toHaveBeenCalled();
//   });

//   it('shoud test increment function', () => {
//     if (!component.inFocus) {
//       expect(component.focus).toBeTruthy();
//     }

//     expect(this.control.setValue).toHaveBeenCalledWith(this.control.value + 1);
//   });

//   it('shoud test decrement function', () => {
//     if (!component.inFocus) {
//       expect(component.focus).toBeTruthy();
//     }

//     expect(this.control.setValue).toHaveBeenCalledWith(this.control.value - 1);
//   });

//   it('should render label in a span tag', () => {
//     fixture = TestBed.createComponent(SidebarNumberInput);
//     fixture.detectChanges();
//     const compiled = fixture.debugElement.nativeElement;
//     const unit = component.unit;
//     expect(compiled.querySlector('span.number-input__unit').textContent).toContain(unit);
//   });

// });

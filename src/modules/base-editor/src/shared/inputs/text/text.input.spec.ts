// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';

// import { SidebarTextInput } from './text.input';


// describe('Sidebar Text Input', () => {

//   let fixture: ComponentFixture<SidebarTextInput>;
//   let  component: SidebarTextInput;

//   let injSpy: jasmine.SpyObj<Injector>;

//   beforeEach(async(() => {

//     const inj = jasmine.createSpyObj('Injector', ['create']);


//     TestBed.configureTestingModule({
//       declarations: [
//         SidebarTextInput,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: Injector, useValue: inj },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(SidebarTextInput);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     injSpy = TestBed.inject(Injector) as jasmine.SpyObj<Injector>;

//   }));

//   it('should be defined', () => {

//     expect(component).toBeTruthy();

//   });

//   it('should check output() focused', () => {
//     // spy on event emitter
//     component = fixture.componentInstance;
//     spyOn(component.focused, 'emit');

//     // trigger the click
//     const nativeElement = fixture.nativeElement;
//     const input = nativeElement.querySelector('input');
//     input.dispatchEvent(new Event('click'));

//     fixture.detectChanges();

//     expect(component.focused.emit).toHaveBeenCalled();
//   });

//   it('should check output() blurred', () => {
//     // spy on event emitter
//     component = fixture.componentInstance;
//     spyOn(component.blurred, 'emit');

//     // trigger the click
//     const nativeElement = fixture.nativeElement;
//     const input = nativeElement.querySelector('input');
//     input.dispatchEvent(new Event('click'));

//     fixture.detectChanges();

//     expect(component.blurred.emit).toHaveBeenCalled();
//   });

//   it('should check focus function', () => {
//     const focused = false;
//     expect(focused).toBe(true);
//     fixture.detectChanges();
//   });

// });

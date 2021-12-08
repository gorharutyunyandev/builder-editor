// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';

// import { SidebarSliderInput } from './slider.input';


// describe('Sidebar Slider Input', () => {

//   let fixture: ComponentFixture<SidebarSliderInput>;
//   let  component: SidebarSliderInput;

//   let injSpy: jasmine.SpyObj<Injector>;

//   beforeEach(async(() => {

//     const inj = jasmine.createSpyObj('Injector', ['create']);


//     TestBed.configureTestingModule({
//       declarations: [
//         SidebarSliderInput,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: Injector, useValue: inj },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(SidebarSliderInput);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     injSpy = TestBed.inject(Injector) as jasmine.SpyObj<Injector>;

//   }));

//   it('should be defined', () => {

//     expect(component).toBeTruthy();

//   });

//   it('should check output() blurred', () => {
//    // spy on event emitter
//     component = fixture.componentInstance;
//     spyOn(component.blurred, 'emit');

//    // trigger the click
//     const nativeElement = fixture.nativeElement;
//     const input = nativeElement.querySelector('input');
//     input.dispatchEvent(new Event('click'));

//     fixture.detectChanges();

//     expect(component.blurred.emit).toHaveBeenCalled();
//   });

//   it('should check focus function', () => {
//     const focused = true;
//     expect(focused).toBe(true);
//     fixture.detectChanges();
//   });
// });

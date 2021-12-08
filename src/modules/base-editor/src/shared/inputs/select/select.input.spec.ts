// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';

// import { SidebarSelectInput } from './select.input';


// describe('Sidebar Number Input', () => {

//   let fixture: ComponentFixture<SidebarSelectInput>;
//   let  component: SidebarSelectInput;

//   let injSpy: jasmine.SpyObj<Injector>;

//   beforeEach(async(() => {

//     const inj = jasmine.createSpyObj('Injector', ['create']);


//     TestBed.configureTestingModule({
//       declarations: [
//         SidebarSelectInput,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: Injector, useValue: inj },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(SidebarSelectInput);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     injSpy = TestBed.inject(Injector) as jasmine.SpyObj<Injector>;

//   }));

//   it('should be defined', () => {

//     expect(component).toBeTruthy();

//   });

//   it('should render label in a span tag', () => {
//     fixture = TestBed.createComponent(SidebarSelectInput);
//     const compiled = fixture.debugElement.nativeElement;
//     const options = component.options;
//     expect(compiled.querySlector('option').textContent).toContain(options);
//   });

//   it('should check output() focused', (changes) => {
//     // spy on event emitter
//     component = fixture.componentInstance;
//     spyOn(component.focused, 'emit');
//     expect(component.focused.emit).toHaveBeenCalled();
//   });

//   it('should check output() blurred', (changes) => {
//     // spy on event emitter
//     component = fixture.componentInstance;
//     spyOn(component.blurred, 'emit');
//     fixture.detectChanges();
//     expect(component.blurred.emit).toHaveBeenCalled();
//   });

// });

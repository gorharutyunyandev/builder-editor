// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebEditorApi } from '@pe/builder-api';

// import { SidebarCheckboxInput } from './checkbox.input';


// describe('Sidebar Checkbox Input', () => {

//   let fixture: ComponentFixture<SidebarCheckboxInput>;
//   let  component: SidebarCheckboxInput;

//   let injSpy: jasmine.SpyObj<Injector>;

//   beforeEach(async(() => {

//     const inj = jasmine.createSpyObj('Injector', ['create']);


//     TestBed.configureTestingModule({
//       declarations: [
//         SidebarCheckboxInput,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: Injector, useValue: inj },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(SidebarCheckboxInput);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     injSpy = TestBed.inject(Injector) as jasmine.SpyObj<Injector>;

//   }));

//   it('should be defined', () => {

//     expect(component).toBeTruthy();

//   });

//   it('should check output() focused', (changes) => {
//     // spy on event emitter
//     component = fixture.componentInstance;
//     spyOn(component.focused, 'emit');
//     fixture.detectChanges();
//     expect(component.focused.emit).toHaveBeenCalled();
//   });

//   it('should check output() blurred', () => {
//     // spy on event emitter
//     component = fixture.componentInstance;
//     spyOn(component.blurred, 'emit');
//     fixture.detectChanges();
//     expect(component.blurred.emit).toHaveBeenCalled();
//   });

//   it('should render label in a span tag', () => {
//     fixture = TestBed.createComponent(SidebarCheckboxInput);
//     fixture.detectChanges();
//     const compiled = fixture.debugElement.nativeElement;
//     const label = component.label;
//     expect(compiled.querySlector('span').textContent).toContain(label);
//   });

// });

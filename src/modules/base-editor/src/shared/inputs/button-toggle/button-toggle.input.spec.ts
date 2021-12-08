// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { distinctUntilChanged } from 'rxjs/operators';

// import { ButtonToggleInput } from './button-toggle.input';


// describe('Button Toggle Input', () => {

//   let fixture: ComponentFixture<ButtonToggleInput>;
//   let  component: ButtonToggleInput;


//   const valueSubject = new BehaviorSubject<string>(null);

//   let injSpy: jasmine.SpyObj<Injector>;

//   beforeEach(async(() => {

//     const inj = jasmine.createSpyObj('Injector', ['create']);

//     TestBed.configureTestingModule({
//       declarations: [
//         ButtonToggleInput,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: Injector, useValue: inj },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(ButtonToggleInput);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     injSpy = TestBed.inject(Injector) as jasmine.SpyObj<Injector>;

//   }));

//   it('should be defined', () => {

//     expect(component).toBeTruthy();

//   });

//   /**
//    * testing function from observable
//    */
//   it('should get themes from Observable',  (done: DoneFn) => {

//     valueSubject.subscribe((value) => {

//       expect(distinctUntilChanged).toBeTruthy();

//       done();

//     });
//   });

//   it('should set a value', () => {

//     valueSubject.subscribe((next) => {

//       expect(next).toEqual('value');

//     });

//   });

// });

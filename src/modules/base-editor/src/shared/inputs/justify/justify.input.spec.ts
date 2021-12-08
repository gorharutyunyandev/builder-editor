// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';

// import { EditorJustifyInput } from './justify.input';


// describe('Justify File Input', () => {

//   let fixture: ComponentFixture<EditorJustifyInput>;
//   let component: EditorJustifyInput;

//   let injSpy: jasmine.SpyObj<Injector>;

//   beforeEach(async(() => {

//     const inj = jasmine.createSpyObj('Injector', ['create']);

//     TestBed.configureTestingModule({
//       declarations: [
//         EditorJustifyInput,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: Injector, useValue: inj },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(EditorJustifyInput);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     injSpy = TestBed.inject(Injector) as jasmine.SpyObj<Injector>;
//   }));

//   it('should be defined', () => {

//     expect(component).toBeTruthy();

//   });



// });

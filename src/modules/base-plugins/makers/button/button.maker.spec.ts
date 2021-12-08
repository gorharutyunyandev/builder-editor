// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ChangeDetectorRef, ElementRef, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';

// import { PebButtonMaker } from './button.maker';



// describe('Button Maker', () => {

//   let fixture: ComponentFixture<PebButtonMaker>;
//   let component: PebButtonMaker;

//   let elSpy: jasmine.SpyObj<ElementRef>;
//   let rendererSpy: jasmine.SpyObj<Renderer2>;


//   beforeEach(async(() => {

//     const el = jasmine.createSpyObj('ElementRef', ['nativeElement']);
//     const renderer = jasmine.createSpyObj('Renderer2', ['createElement', 'createComment']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebButtonMaker,
//       ],
//       imports: [ReactiveFormsModule, FormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: ElementRef, useValue: el },
//         { provide: Renderer2, useValue: renderer },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebButtonMaker);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     elSpy = TestBed.inject(ElementRef) as jasmine.SpyObj<ElementRef>;
//     rendererSpy = TestBed.inject(Renderer2) as jasmine.SpyObj<Renderer2>;

//   }));

//   it('can load instance', () => {
//     expect(component).toBeTruthy();
//   });

// });

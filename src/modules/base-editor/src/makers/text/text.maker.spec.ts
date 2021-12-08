// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ElementRef, Injector, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// import { PebTextMaker } from './text.maker';
// import { PebEditorRenderer } from '../../renderer/editor-renderer';

// describe('Text Maker', () => {

//   let fixture: ComponentFixture<PebTextMaker>;
//   let component: PebTextMaker;

//   let elSpy: jasmine.SpyObj<ElementRef>;
//   let rendererSpy: jasmine.SpyObj<Renderer2>;
//   let injSpy: jasmine.SpyObj<Injector>;

//   const activeSubject$ = new BehaviorSubject<boolean>(false);

//   beforeEach(async(() => {

//     const el = jasmine.createSpyObj('ElementRef', ['nativeElement']);
//     const renderer = jasmine.createSpyObj('Renderer2', ['createElement', 'createComment']);
//     const edRenderer = jasmine.createSpyObj('PebEditorRenderer', ['createElement', 'createComment']);
//     const inj = jasmine.createSpyObj('Injector', ['get']);


//     TestBed.configureTestingModule({
//       declarations: [
//         PebTextMaker,
//       ],
//       imports: [ReactiveFormsModule, FormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: ElementRef, useValue: el },
//         { provide: Renderer2, useValue: renderer },
//         { provide: PebEditorRenderer, useValue: edRenderer },
//         { provide: Injector, useValue: inj },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebTextMaker);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     elSpy = TestBed.inject(ElementRef) as jasmine.SpyObj<ElementRef>;
//     rendererSpy = TestBed.inject(Renderer2) as jasmine.SpyObj<Renderer2>;
//     injSpy = TestBed.inject(Injector) as jasmine.SpyObj<Injector>;

//   }));

//   it('can load instance', () => {
//     expect(component).toBeUndefined();
//   });



// });

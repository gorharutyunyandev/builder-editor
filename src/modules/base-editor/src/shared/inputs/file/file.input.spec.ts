// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';

// import { SidebarFileInput } from './file.input';


// describe('Sidebar File Input', () => {

//   let fixture: ComponentFixture<SidebarFileInput>;
//   let component: SidebarFileInput;

//   let elementSpy: jasmine.SpyObj<ElementRef>;

//   beforeEach(async(() => {

//     const elRef = jasmine.createSpyObj('ElementRef', ['HTMLElement', 'nativeElement']);

//     TestBed.configureTestingModule({
//       declarations: [
//         SidebarFileInput,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: ElementRef, useValue: elRef },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(SidebarFileInput);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     elementSpy = TestBed.inject(ElementRef) as jasmine.SpyObj<ElementRef>;
//   }));

//   it('should be defined', () => {

//     expect(component).toBeTruthy();

//   });

//   it('should write a value', () => {

//     expect(elementSpy.nativeElement.value).toEqual('');
//   });
// });

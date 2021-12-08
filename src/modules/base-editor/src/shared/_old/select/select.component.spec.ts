// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebEditorSelectComponent } from './select.component';

// describe('Select Component', () => {

//   let fixture: ComponentFixture<PebEditorSelectComponent>;
//   let  component: PebEditorSelectComponent;


//   let formSpy: jasmine.SpyObj<FormControl>;

//   beforeEach(async(() => {

//     const form = jasmine.createSpyObj('FormControl', ['uploadImage']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorSelectComponent,
//       ],
//       imports: [ReactiveFormsModule, FormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: FormControl, useValue: form },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorSelectComponent);
//       component = fixture.componentInstance;

//       // testing ngOnInit()
//       fixture.detectChanges();

//     });

//     formSpy = TestBed.inject(FormControl) as jasmine.SpyObj<FormControl>;

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

// });

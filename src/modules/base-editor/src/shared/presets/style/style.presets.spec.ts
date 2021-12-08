// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';

// import { PebEditorSidebarStylePresetsComponent } from './style.presets';


// describe('Sidebar Style Presets', () => {

//   let fixture: ComponentFixture<PebEditorSidebarStylePresetsComponent>;
//   let  component: PebEditorSidebarStylePresetsComponent;

//   let rendererSpy: jasmine.SpyObj<Renderer2>;

//   beforeEach(async(() => {

//     const renderer = jasmine.createSpyObj('Renderer2', ['setStyle', 'createElement', 'removeChild']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorSidebarStylePresetsComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: Renderer2, useValue: renderer },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorSidebarStylePresetsComponent);
//       component = fixture.componentInstance;
//     });

//     rendererSpy = TestBed.inject(Renderer2) as jasmine.SpyObj<Renderer2>;

//   }));

//   it('should be defined', () => {

//     expect(component).toBeTruthy();

//   });

//   it('should check function applyPresetsStyles', () => {

//     expect(component.applyPresetsStyles).toBeTruthy();

//   });

// });

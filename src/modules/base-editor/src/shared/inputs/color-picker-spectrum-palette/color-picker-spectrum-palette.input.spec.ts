// import { Overlay } from '@angular/cdk/overlay';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';
// import { BehaviorSubject } from 'rxjs';

// import { SidebarColorPickerSpectrumPaletteInput } from './color-picker-spectrum-palette.input';


// describe('Color Picker Spectrum Palette Input', () => {

//   let fixture: ComponentFixture<SidebarColorPickerSpectrumPaletteInput>;
//   let  component: SidebarColorPickerSpectrumPaletteInput;

//   let injSpy: jasmine.SpyObj<Injector>;
//   let overlaySpy: jasmine.SpyObj<Overlay>;

//   beforeEach(async(() => {

//     const injector = jasmine.createSpyObj('Injector', ['create']);
//     const overlay = jasmine.createSpyObj('Overlay', ['create', 'position', 'scrollStrategies']);


//     TestBed.configureTestingModule({
//       declarations: [
//         SidebarColorPickerSpectrumPaletteInput,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: Injector, useValue: injector },
//         { provide: Overlay, useValue: overlay },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(SidebarColorPickerSpectrumPaletteInput);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     injSpy = TestBed.inject(Injector) as jasmine.SpyObj<Injector>;
//     overlaySpy = TestBed.inject(Overlay) as jasmine.SpyObj<Overlay>;

//   }));

//   const colorStream$ = new BehaviorSubject('#fff');

//   it('should be defined', () => {

//     expect(component).toBeTruthy();

//   });

//   it('should get a color', () => {
//     expect(colorStream$.value).toBeDefined();
//   });


// });

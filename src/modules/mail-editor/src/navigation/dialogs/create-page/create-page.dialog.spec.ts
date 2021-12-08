// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// import { OVERLAY_DATA } from '../../../../../toolbar/overlay.data';
// import { PebEditorCreatePageDialogComponent } from './create-page.component';


// describe('Pages Sidebar Component', () => {

//   let fixture: ComponentFixture<PebEditorCreatePageDialogComponent>;
//   let component: PebEditorCreatePageDialogComponent;


//   const overlay = jasmine.createSpyObj('OVERLAY_DATA', ['emitter']);

//   // @ts-ignore
//   const page: any;


//   beforeEach(async(() => {

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorCreatePageDialogComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: OVERLAY_DATA, useValue: overlay },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorCreatePageDialogComponent);
//       component = fixture.componentInstance;
//     });
//   }));

//   it('should be defined', () => {

//     expect(component).toBeTruthy();

//   });

//   it('should emit', () => {

//     component.overlayData.emitter.subscribe((next) => {
//       expect(next).toEqual(page);
//     });

//     component.select(); // or button.nativeElement.click()
//   });

// });

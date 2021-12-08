// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebEditorExpandablePanelComponent } from './expandable-panel.component';


// describe('Expandable Panel Component', () => {

//   let fixture: ComponentFixture<PebEditorExpandablePanelComponent>;
//   let  component: PebEditorExpandablePanelComponent;

//   beforeEach(async(() => {

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorExpandablePanelComponent,
//       ],
//       schemas: [NO_ERRORS_SCHEMA],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorExpandablePanelComponent);
//       component = fixture.componentInstance;
//     });

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should emit on click toggle()', () => {
//     // spy on event emitter
//     component = fixture.componentInstance;
//     spyOn(component.toggleOpened, 'emit');

//     // trigger the click
//     const nativeElement = fixture.nativeElement;
//     const div = nativeElement.querySelector('div.panel__header');
//     div.dispatchEvent(new Event('click'));

//     fixture.detectChanges();
//     expect(component.toggle).toBeDefined();
//     expect(component.toggleOpened.emit).toHaveBeenCalledWith(this.openedSubject$.value);
//   });

//   it('should open panel', () => {
//     let opened: boolean;
//     opened = false;
//     // trigger the click
//     const nativeElement = fixture.nativeElement;
//     const div = nativeElement.querySelector('div.panel--opened');
//     div.dispatchEvent(new Event('click'));

//     expect(opened).toEqual(true);
//     expect(div).toHaveBeenCalledWith(opened);
//   });

// });

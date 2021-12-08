// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ChangeDetectorRef } from '@angular/core';

// import { PebEditorCarouselComponent } from './carousel.component';


// describe('Border Select Component', () => {

//   let fixture: ComponentFixture<PebEditorCarouselComponent>;
//   let  component: PebEditorCarouselComponent;


//   let mediaSpy: any;
//   mediaSpy = jasmine.createSpyObj('PebMediaItem', ['id']);

//   beforeEach(async(() => {

//     TestBed.configureTestingModule({
//       providers: [
//         PebEditorCarouselComponent,
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorCarouselComponent);
//       component = fixture.componentInstance;
//     });

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should emit when the button is clicked', () => {
//     // ensure the @Output is emitting the expected data to the parent
//     spyOn(component.selectElement, 'emit');

//     component.onSelect(mediaSpy);

//     expect(component.selectElement.emit).toHaveBeenCalledWith();
//   });

// });

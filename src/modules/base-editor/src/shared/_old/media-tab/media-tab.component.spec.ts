// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// import { PebMediaService } from '@pe/builder-core';

// import { PebEditorMediaTabComponent } from './media-tab.component';


// describe('Media Tab Component', () => {

//   let fixture: ComponentFixture<PebEditorMediaTabComponent>;
//   let  component: PebEditorMediaTabComponent;

//   let mediaSpy: jasmine.SpyObj<PebMediaService>;

//   beforeEach(async(() => {

//     const media = jasmine.createSpyObj('PebMediaService', ['getCategories', 'getStyles', 'getFormats']);

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorMediaTabComponent,
//       ],
//       imports: [ReactiveFormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: PebMediaService, useValue: media },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorMediaTabComponent);
//       component = fixture.componentInstance;
//     });

//     // Inject the service-to-tests and its (spy) dependency

//     mediaSpy = TestBed.inject(PebMediaService) as jasmine.SpyObj<PebMediaService>;
//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   // ensure the @Output is emitting the expected data to the paren

//   it('should select an item', () => {

//     spyOn(component.selected, 'emit');

//     component.selectItem(mediaSpy);

//     expect(component.selected.emit).toHaveBeenCalledWith();

//   });

//   /**
//    *  TESTING GET FUNCTION()
//    */

//   it('should test categoriesForm', () => {

//     spyOn(component.mediaFilterSortForm, 'get');

//     const categories = component.mediaFilterSortForm.get('categories');

//     expect(categories).toBeTruthy();

//   });


//   it('should test stylesForm', () => {

//     spyOn(component.mediaFilterSortForm, 'get');

//     const styles = component.mediaFilterSortForm.get('styles');

//     expect(styles).toBeTruthy();

//   });

//   it('should test stylesForm', () => {

//     spyOn(component.mediaFilterSortForm, 'get');

//     const formats = component.mediaFilterSortForm.get('formats');

//     expect(formats).toBeTruthy();

//   });
// });

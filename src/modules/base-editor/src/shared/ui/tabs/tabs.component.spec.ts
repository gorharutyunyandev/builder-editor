// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA, QueryList } from '@angular/core';

// import { PebEditorTabsComponent } from './tabs.component';
// import { RootState } from '../../../..';



// describe('Tabs Component', () => {

//   let fixture: ComponentFixture<PebEditorTabsComponent>;
//   let  component: PebEditorTabsComponent;

//   // Inject the service-to-tests and its (spy) dependency

//   let tabsSpy: jasmine.SpyObj<RootState>;
//   tabsSpy = jasmine.createSpyObj('PebEditorTabsComponent', ['tabs']);
//   beforeEach(async(() => {

//     TestBed.configureTestingModule({
//       declarations: [
//         PebEditorTabsComponent,
//       ],

//       schemas: [NO_ERRORS_SCHEMA],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorTabsComponent);
//       component = fixture.componentInstance;
//     });

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('it should disable scroll bar', () => {
//     const scroll = true;

//     const nativeElement = fixture.nativeElement;

//     const ngScrollbar = nativeElement.querySelector('ng-scrollbar');

//     expect(scroll).toBe(true);

//     expect(ngScrollbar).toHaveBeenCalledWith(scroll);
//   });


//   it('should tab from tabs array', () => {
//     const compiled = fixture.debugElement.nativeElement;
//     expect(compiled.querySelector('div.tab').textContent).toContain('tabs.title');
//   });

// });

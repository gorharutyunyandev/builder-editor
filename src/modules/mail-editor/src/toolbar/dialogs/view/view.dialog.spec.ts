// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { Observable } from 'rxjs';

// import { OVERLAY_DATA } from '../../overlay.data';
// import { PebEditorViewDialogComponent } from './view.dialog';
// import { EditorSidebarTypes, PebEditorState } from '../../../services/editor.state';

// describe('View Dialog Component', () => {

//   let fixture: ComponentFixture<PebEditorViewDialogComponent>;
//   let  component: PebEditorViewDialogComponent;


//   const state = jasmine.createSpyObj('PebEditorState', ['pagesView'], { pagesView: new Observable<any>() });

//   const overlayData = {
//     data: state,
//   };

//   let stateSpy: jasmine.SpyObj<PebEditorState>;

//   let valueSpy: any;
//   valueSpy = jasmine.createSpyObj('EditorSidebarTypes');

//   beforeEach(async(() => {


//     TestBed.configureTestingModule({
//       providers: [
//         PebEditorViewDialogComponent,
//         { provide: OVERLAY_DATA, useValue: overlayData },
//         { provide: PebEditorState, useValue: state },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebEditorViewDialogComponent);
//       component = fixture.componentInstance;
//       component.ngOnInit();
//     });

//     stateSpy = TestBed.inject(PebEditorState) as jasmine.SpyObj<PebEditorState>;

//   }));

//   it('should create app', () => {

//     expect(component).toBeDefined();

//   });


//   it('should contain navigator in div tag', () => {
//     const divEl = fixture.debugElement.query(By.css('div.navg'));
//     expect(divEl.nativeElement.textContent).toBe('Navigator');
//   });


//   it('should contain Inspector in div tag', () => {
//     const divEl = fixture.debugElement.query(By.css('div.inspect'));
//     expect(divEl.nativeElement.textContent).toBe('Inspector');
//   });


//   it('should contain Edit Master Pages in div tag', () => {
//     const divEl = fixture.debugElement.query(By.css('div.edit'));
//     expect(divEl.nativeElement.textContent).toBe('Edit Master Pages');
//   });

//   it('should contain Layers List in div tag', () => {
//     const divEl = fixture.debugElement.query(By.css('div.layers'));
//     expect(divEl.nativeElement.textContent).toBe('Layers List');
//   });

//   it('should call function setValue', () => {
//     spyOn(component, 'setValue').and.callThrough();
//   });

//   it('should test ngOnInit',  () => {
//     fixture.detectChanges();
//     const options = component.options;
//     spyOn(state, 'sidebarsActivity').and.returnValue(EditorSidebarTypes);
//     component.ngOnInit();
//     fixture.detectChanges();
//     expect(options[1].active).toEqual(state);
//   });

//   it('should set value', () => {
//     spyOn(component.data.emitter, 'next');
//     component.setValue(valueSpy);
//     expect(component.data.emitter).toHaveBeenCalledWith(1);
//   });
// });

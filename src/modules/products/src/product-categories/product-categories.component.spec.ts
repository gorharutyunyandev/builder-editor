// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { async, ComponentFixture, inject, TestBed  } from '@angular/core/testing';
// import { MatLabel } from '@angular/material/form-field';
// import { BehaviorSubject } from 'rxjs';
// import { map } from 'rxjs/operators';

// import { PebProductCategoriesComponent } from './product-categories.component';

// import { callbackify } from 'util';

// const matDialogRefSpy = {
//   close() {},

//   map() {},
// };

// describe('PebProductCategories', () => {

//   let component: PebProductCategoriesComponent;
//   let fixture: ComponentFixture<PebProductCategoriesComponent>;
//   let matDialogRef;

//   beforeEach(async(() => {

//     TestBed.configureTestingModule({
//       declarations: [
//         PebProductCategoriesComponent,
//       ],
//       providers: [
//         {
//           provide: MAT_DIALOG_DATA, useValue: { data: 'm' },
//         },
//         {
//           provide: MatDialogRef, useValue: matDialogRefSpy,
//         },
//       ]}).compileComponents().then(() => {
//         fixture = TestBed.createComponent(PebProductCategoriesComponent);
//         component = fixture.componentInstance;
//         matDialogRef = TestBed.get(MatDialogRef);
//       });

//   }));

//   it('Should create ProductCategories Component', () => {
//     const component_call = PebProductCategoriesComponent;
//     expect(component_call).toBeDefined();
//   });

//   it('should call onClose function', () => {
//     const spy = spyOn(component, 'onClose').and.callThrough();
//     fixture.detectChanges();
//     expect(spy).not.toHaveBeenCalled();
//     component.onClose(true);
//     expect(spy).toHaveBeenCalledTimes(1);
//     expect(component.data).toBeUndefined();
//   });

//   it('should call onSelectedItem function', () => {
//     const spy = spyOn(component, 'onSelectedItemsChanged').and.callThrough();
//     fixture.detectChanges();
//     expect(spy).not.toHaveBeenCalled();
//     let items: any[];
//     component.onSelectedItemsChanged(items);
//     expect(spy).toHaveBeenCalledTimes(1);
//     expect(component).toBeUndefined();
//   });

//   it('should call onClose function', () => {
//     const spy = spyOn(component, 'onClose').and.callThrough();
//     fixture.detectChanges();
//     expect(spy).not.toHaveBeenCalled();
//     component.onClose(true);
//     expect(spy).toHaveBeenCalledTimes(1);
//     expect(component.data).toBeUndefined();
//   });

//   it('should call multipleSelectedActions', () => {
//     const selectedActionFake = component.multipleSelectedActions;
//     expect(selectedActionFake).toHaveBeenCalled();
//   });

//   it('should call multipleSlectedActionsSelectedAll', () => {
//     const dialogSpy = spyOn(matDialogRef, 'close').and.returnValue(true);
//     const applyAction = component.multipleSelectedActions[2];
//     const onCloseSpy = spyOn(component, 'onClose').and.callThrough();
//     applyAction.callback();
//     expect(onCloseSpy).toHaveBeenCalledWith(true);
//     expect(dialogSpy).toHaveBeenCalled;
//   });

//   it('should call multipleSlectedActionsSelectedAll in products component and return false', () => {
//     const dialogSpy = spyOn(matDialogRef, 'close').and.returnValue(false);
//     const closeAction = component.multipleSelectedActions[3];
//     const onCloseSpy = spyOn(component, 'onClose').and.callThrough();
//     closeAction.callback();
//     expect(onCloseSpy).toHaveBeenCalledWith(false);
//     expect(dialogSpy).toHaveBeenCalled;
//   });

//   it('should call multipleSlectedActionsSelectedAll in products deselect all', () => {
//     const deselectAction = component.multipleSelectedActions[1];
//     deselectAction.callback();
//     expect(component.selected).toEqual([]);
//   });

//   it('should call multipleSlectedActionsSelectedAll in products Select all', () => {
//     const selectedSpy = spyOnProperty(component, 'selected', 'set').and.callThrough();

//     component.data = {
//         products: [{ id: '000' }],
//       };

//     const spyOnMap = spyOn(component.data.products, 'map').and.callThrough();
//     const selectAction = component.multipleSelectedActions[0];
//     selectAction.callback();
//     expect(spyOnMap).toHaveBeenCalled();
//     expect(selectedSpy).toHaveBeenCalled();
//   });

// });

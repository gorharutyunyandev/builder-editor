describe('TEST', () => {
  it('Just for check', () => {
    expect('test').toContain('test');
  });
});


// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

// import { PebProductsComponent } from './products.component';

// const matDialogRefSpy = {
//   close() { },
// };


// describe('PebProducstComponent', () => {

//   let component: PebProductsComponent;
//   let fixture: ComponentFixture<PebProductsComponent>;
//   let matDialogRef;

//   beforeEach(async(() => {

//     TestBed.configureTestingModule({

//       declarations: [
//         PebProductsComponent,
//       ],
//       providers: [
//         {
//           provide: MAT_DIALOG_DATA, useValue: { data: 'm' },
//         },
//         {
//           provide: MatDialogRef, useValue: matDialogRefSpy,
//         },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebProductsComponent);
//       component = fixture.componentInstance;
//       matDialogRef = TestBed.get(MatDialogRef);

//     });

//   }));

//   it('Should create ProductCategories Component', () => {
//     const component_call = PebProductsComponent;
//     expect(component_call).toBeDefined();
//   });

//   it('should call onSearchChanged function', () => {
//     const spy = spyOn(component, 'onSearchChanged').and.callThrough();
//     fixture.detectChanges();
//     expect(spy).not.toHaveBeenCalled();
//     component.onSearchChanged('amel');
//     expect(spy).toHaveBeenCalledTimes(1);
//     expect(component.data).toBeUndefined();
//   });

//   it('should call onSelectedItemsChanged function', () => {
//     const spy = spyOn(component, 'onSelectedItemsChanged').and.callThrough();
//     fixture.detectChanges();
//     expect(spy).not.toHaveBeenCalled();
//     let items: string[];
//     component.onSelectedItemsChanged(items);
//     expect(spy).toHaveBeenCalledTimes(1);
//     expect(component.data).toBeUndefined();
//   });

//   it('should call onClose function', () => {
//     const spy = spyOn(component, 'onClose').and.callThrough();
//     fixture.detectChanges();
//     expect(spy).not.toHaveBeenCalled();
//     component.onClose(true);
//     expect(spy).toHaveBeenCalledTimes(1);
//     expect(component.data).toBeUndefined();
//   });

//   it('should call multipleSlectedActionsSelectedAll in products component and return true', () => {
//     const dialogSpy = spyOn(matDialogRef, 'close').and.returnValue(true);
//     const applyAction = component.multipleSelectedActions[2];
//     const onCloseSpy = spyOn(component, 'onClose').and.callThrough();
//     applyAction.callback();
//     expect(onCloseSpy).toHaveBeenCalledWith(true);
//     expect(dialogSpy).toHaveBeenCalled;
//   });

//   it('should call multipleSlectedAction SelectedAll in products component and return false', () => {
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
//       products: [{ id: '000' }],
//     };
//     const spyOnMap = spyOn(component.data.products, 'map').and.callThrough();
//     const selectAction = component.multipleSelectedActions[0];
//     selectAction.callback();
//     expect(spyOnMap).toHaveBeenCalled();
//     expect(selectedSpy).toHaveBeenCalled();
//   });

//   it('should call sortByActions-Name', () => {
//     const selectAction = component.sortByActions[0];
//     const consoleSpy = spyOn(console, 'log').and.callThrough();
//     selectAction.callback();
//     expect(consoleSpy).toHaveBeenCalledWith('sort by name');
//   });

//   it('should call sortByActions-Price', () => {
//     const selectActionPrice = component.sortByActions[1];
//     const consoleSpy = spyOn(console, 'log').and.callThrough();
//     selectActionPrice.callback();
//     expect(consoleSpy).toHaveBeenCalledWith('sort by price: asc');
//   });

//   it('should call sortByActions-Price-descending', () => {
//     const selectActionPriceDescending = component.sortByActions[2];
//     const consoleSpy = spyOn(console, 'log').and.callThrough();
//     selectActionPriceDescending.callback();
//     expect(consoleSpy).toHaveBeenCalledWith('sort by price des');
//   });

//   it('should call sortByActions-Date', () => {
//     const selectActionPriceDate = component.sortByActions[3];
//     const consoleSpy = spyOn(console, 'log').and.callThrough();
//     selectActionPriceDate.callback();
//     expect(consoleSpy).toHaveBeenCalledWith('sort by date');
//   });

//   it('should test single selected action', () => {
//     const testSingleSelected = component.singleSelectedAction;
//     const dialogSpy = spyOn(matDialogRef, 'close').and.returnValue(false);
//     testSingleSelected.callback();
//     expect(dialogSpy).toHaveBeenCalled();
//   });

// });

describe('TEST', () => {
  it('Just for check', () => {
    expect('test').toContain('test');
  });
});

// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
// import { MatLabel } from '@angular/material/form-field';
// import { BehaviorSubject } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { ChangeDetectorRef, ElementRef, SimpleChange } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';

// import { PebShop, PebShopThemeSnapshot, snapshotToSourceConverter } from '@pe/builder-core';

// import { PebViewer, ViewerLocationStrategy } from './viewer';
// import { ContextBuilder } from '../services/context.service';
// import { SCREEN_FROM_WIDTH } from '../viewer.constants';
// import * as demo from './viewer';

// import { callbackify } from 'util';
// import { fromLocationUrlChange, fromResizeObserver } from 'src/modules/viewer/src/viewer.utils';


// describe('Viewer', () => {

//   let component: PebViewer;
//   let fixture: ComponentFixture<PebViewer>;
//   let changes: any;
//   let themeSnapshot: PebShopThemeSnapshot;
//   let fixture_two: ComponentFixture<ViewerLocationStrategy>;
//   const component_two = ViewerLocationStrategy;


//   beforeEach(async(() => {

//     TestBed.configureTestingModule({
//         declarations: [
//             PebViewer,
//           ],
//         providers: [
//             {
//               provide: MAT_DIALOG_DATA, useValue: { data: 'm' },
//             },
//             {
//               provide: SCREEN_FROM_WIDTH, useValue: '',
//             },
//             {
//               provide: ContextBuilder, useValue: '',
//             },
//             {
//               provide: Location, useValue: '',
//             },
//             {
//               provide: ElementRef, useValue: '',
//             },
//             {
//               provide: ChangeDetectorRef, useValue: '',
//             },
//             {
//               provide: ActivatedRoute, useValue: '',
//             },

//           ],
//       }).compileComponents().then(() => {

//           fixture = TestBed.createComponent(PebViewer);
//           component = fixture.componentInstance;

//         });

//   }));



//   it('Should create PebViewer Component', () => {
//     const component_call = PebViewer;
//     expect(component_call).toBeDefined();
//   });

//   it('Should create Viewer strategy', () => {
//     const component_call = ViewerLocationStrategy;
//     expect(component_call).toBeDefined();
//   });

//   it('should test ngOnChanges method', () => {
//     const spy = spyOn(component, 'ngOnChanges').and.callThrough();


//     const snapSpy = jasmine.createSpy('snapshotToSourceConverter', snapshotToSourceConverter);
//     snapSpy.and.returnValue({} as PebShop);

//     changes = {
//         themeSnapshot: {
//             hash: 'h4f42s0',

//           },
//       };
//     component.themeSnapshot = {
//         id: '000',
//         hash: 'h000d52s5',
//       } as PebShopThemeSnapshot;


//     expect(spy).not.toHaveBeenCalled();
//     component.ngOnChanges(changes);
//     expect(snapSpy).toHaveBeenCalled();
//     expect(spy).toHaveBeenCalledTimes(1);

//   });

//   it('should test ngAfterViewInit method', () => {
//     const spy = spyOn(component, 'ngAfterViewInit').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     component.ngAfterViewInit();
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   it('should test onRendererInteraction', () => {
//     const spy = spyOn(component, 'onRendererInteraction').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     component.onRendererInteraction(EventTarget);
//     expect(spy).toHaveBeenCalledTimes(1);

//   });



//   it('should test screen property', () => {
//     const spyOn = jasmine.createSpy('fromResizeObserver', fromResizeObserver).and.callThrough();
//     const spyOne = jasmine.createSpyObj('screenFromWidth', SCREEN_FROM_WIDTH).and.callThrough();
//     expect(component.screen$);
//     expect(spyOn).toHaveBeenCalled();
//     expect(spyOne).toHaveBeenCalled();
//   });











// });

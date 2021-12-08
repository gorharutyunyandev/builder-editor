// import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
// import { ChangeDetectorRef, DebugElement } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { of } from 'rxjs';
// import { HttpEventType } from '@angular/common/http';
// import { By } from '@angular/platform-browser';

// import { PebEditorApi } from '@pe/builder-api';
// import { MessageBus } from '@pe/builder-core';
// import { PePlatformHeaderService } from '@pe/platform-header';

// import { PebShopEditComponent } from './shop-edit.component';
// import { TestEditModule } from './test.edit.module';

// describe('PebShopEditComponent', () => {

//   let fixture: ComponentFixture<PebShopEditComponent>,
//     component: PebShopEditComponent,
//     el: DebugElement,
//     api: any,
//     activatedRoute: any,
//     messageBus: any,
//     cdr: any,
//     platformHeader: any,
//     testShop: any;

//   beforeEach(async(() => {

//     const apiSpy = jasmine.createSpyObj('PebEditorApi', [
//       'uploadImageWithProgress',
//       'getShop',
//       'updateShop',
//     ]);
//     const messageBusSpy = jasmine.createSpyObj('MessageBus', [
//       'emit',
//     ]);
//     const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', [
//       'detectChanges',
//       'markForCheck',
//     ]);
//     const platformHeaderSpy = jasmine.createSpyObj('PePlatformHeaderService',
//       [
//         'setShortHeader',
//         'setFullHeader',
//       ],
//       [
//         'shortHeader',
//       ],
//     );
//     const activatedRouteMock = {
//       parent: {
//         snapshot: {
//           params: {
//             shopId: '',
//           },
//         },
//       },
//     };

//     TestBed.configureTestingModule({
//       imports: [
//         TestEditModule,
//       ],
//       providers: [
//         PebShopEditComponent,
//         { provide: PebEditorApi, useValue: apiSpy },
//         { provide: MessageBus, useValue: messageBusSpy },
//         { provide: ChangeDetectorRef, useValue: cdrSpy },
//         { provide: PePlatformHeaderService, useValue: platformHeaderSpy },
//         { provide: ActivatedRoute, useValue: activatedRouteMock },
//       ],
//     }).compileComponents().then(() => {
//       fixture = TestBed.createComponent(PebShopEditComponent);
//       component = fixture.componentInstance;
//       el = fixture.debugElement;
//       api = TestBed.get(PebEditorApi);
//       messageBus = TestBed.get(MessageBus);
//       cdr = TestBed.get(ChangeDetectorRef);
//       platformHeader = TestBed.get(PePlatformHeaderService);
//       activatedRoute = TestBed.get(ActivatedRoute);

//       testShop = {
//         id: '000',
//         name: 'testShop',
//         picture: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=r
// b-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
//       };

//       activatedRoute.parent.snapshot.params.shopId = testShop.id;

//       api.getShop.and.returnValue(of(testShop));
//     });
//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should get shop on ngInit', () => {

//     fixture.detectChanges();

//     expect(component.shop).toBeTruthy();
//     expect(component.shop.id).toEqual(testShop.id);
//     expect(api.getShop).toHaveBeenCalledWith(testShop.id);
//     expect(api.getShop).toHaveBeenCalledTimes(1);

//   });

//   it('should have and render form', () => {

//     fixture.detectChanges();

//     expect(component.form).toBeDefined('component form is undefined');
//     expect(el.query(By.css('.form'))).toBeTruthy('form has not been rendered');
//     expect(component.form.controls.name.value).toEqual(testShop.name);
//     expect(component.form.controls.picture.value).toEqual(testShop.picture);

//   });

//   it('should upload logo - inProgress', () => {

//     const testUploadProgress = 45;
//     const event = {
//       target: {
//         files: [
//           new File(['data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAM
// AAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7'], 'test', { type: 'image/png' }),
//         ],
//       },
//     };

//     api.uploadImageWithProgress.and.returnValue(of({
//       type: HttpEventType.UploadProgress,
//       loaded: testUploadProgress,
//     }));

//     fixture.detectChanges();

//     component.onLogoUpload(event);

//     expect(component.isLoading).toBeTrue();
//     expect(component.isLargeThenParent).toBeFalse();

//   });

//   it('should upload logo - finished', () => {

//     const event = {
//       target: {
//         files: [
//           new File(['data:image/png;base64,R0lGODlhDAAMAKIFAF5
// LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0ux
// FAgA7'], 'test', { type: 'image/png' }),
//         ],
//       },
//     };

//     api.uploadImageWithProgress.and.returnValue(of({
//       type: HttpEventType.Response,
//       body: {
//         blobName: 'test',
//       },
//     }));

//     fixture.detectChanges();

//     component.onLogoUpload(event);

//     expect(component.uploadProgress).toBe(0);

//   });

//   it('should not upload logo if no event.type', () => {

//     const event = {
//       target: {
//         files: [
//           new File(['data:image/png;base64,R0lGODlhDA
// AMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGj
// DKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7'], 'test', { type: 'image/png' }),
//         ],
//       },
//     };

//     api.uploadImageWithProgress.and.returnValue(of({
//       event: {
//         type: null,
//       },
//     }));

//     fixture.detectChanges();

//     component.onLogoUpload(event);

//     expect(cdr.detectChanges).not.toHaveBeenCalled();
//   });

//   it('should check isLargeThenParent onLoad - true', () => {

//     fixture.detectChanges();

//     component.logoEl = {
//       nativeElement: {
//         width: 100,
//         height: 100,
//       },
//     };

//     component.logoWrapperEl = {
//       nativeElement: {
//         clientWidth: 50,
//         clientHeight: 50,
//       },
//     };

//     fixture.detectChanges();

//     component.onLoad();

//     expect(component.isLargeThenParent).toBeTrue();

//   });

//   it('should check isLargeThenParent onLoad - false', () => {

//     fixture.detectChanges();

//     component.logoEl = {
//       nativeElement: {
//         width: 100,
//         height: 100,
//       },
//     };

//     component.logoWrapperEl = {
//       nativeElement: {
//         clientWidth: 200,
//         clientHeight: 200,
//       },
//     };

//     fixture.detectChanges();

//     component.onLoad();

//     expect(component.isLargeThenParent).toBeFalse();

//   });

//   it('should NOT submit if form is invalid', () => {

//     fixture.detectChanges();

//     component.form.patchValue({
//       name: '',
//     });

//     component.onSubmit();

//     expect(component.form.invalid).toBeTrue();
//     expect(api.updateShop).not.toHaveBeenCalled();
//   });

//   it('should submit if form is valid - has picture', () => {

//     fixture.detectChanges();

//     component.form.patchValue({
//       name: 'Test Name',
//     });

//     api.updateShop.and.returnValue(of({
//       id: '000',
//     }));

//     const submitValues = {
//       name: component.form.controls.name.value,
//       picture: component.form.controls.picture.value,
//     };

//     component.onSubmit();

//     expect(component.form.disabled).toBeTrue();
//     expect(api.updateShop).toHaveBeenCalledWith(submitValues);
//     expect(api.updateShop).toHaveBeenCalledTimes(1);
//     expect(messageBus.emit).toHaveBeenCalledWith('shop.edited', '000');
//     expect(messageBus.emit).toHaveBeenCalledTimes(1);
//     expect(platformHeader.setFullHeader).toHaveBeenCalledTimes(1);

//   });

//   it('should submit if form is valid - no picture', () => {

//     fixture.detectChanges();

//     component.form.patchValue({
//       name: 'Test Name',
//       picture: null,
//     });

//     api.updateShop.and.returnValue(of({
//       id: '000',
//     }));

//     const submitValues = {
//       name: component.form.controls.name.value,
//       picture: null,
//     };

//     component.onSubmit();

//     expect(component.form.disabled).toBeTrue();
//     expect(api.updateShop).toHaveBeenCalledWith(submitValues);
//     expect(api.updateShop).toHaveBeenCalledTimes(1);
//     expect(messageBus.emit).toHaveBeenCalledWith('shop.edited', '000');
//     expect(messageBus.emit).toHaveBeenCalledTimes(1);
//     expect(platformHeader.setFullHeader).toHaveBeenCalledTimes(1);

//   });

// });

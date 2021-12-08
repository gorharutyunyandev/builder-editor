// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { DebugElement } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { By } from '@angular/platform-browser';
// import { of, throwError } from 'rxjs';

// import { PebEditorApi } from '@pe/builder-api';
// import { PePlatformHeaderService } from '@pe/platform-header';

// import { PebShopPasswordSettingsComponent } from './shop-password-settings.component';
// import { TestPasswordModule } from './test.password.module';

// describe('PebShopPasswordSettingsComponent', () => {

//   let fixture: ComponentFixture<PebShopPasswordSettingsComponent>,
//     component: PebShopPasswordSettingsComponent,
//     el: DebugElement,
//     api: any,
//     router: any,
//     activatedRoute: any,
//     platformHeader: any,
//     accessConfig: any;

//   accessConfig = {
//     internalDomain: 'testDomain',
//     isLive: true,
//     isLocked: true,
//     isPrivate: true,
//     ownDomain: 'testOwnDomain',
//     privateMessage: 'Test private message',
//     privatePassword: 'test_password',
//   };

//   beforeEach(async(() => {

//     const apiSpy = jasmine.createSpyObj('PebEditorApi', [
//       'updateShopDeploy',
//     ]);
//     const routerSpy = jasmine.createSpyObj('Router', [
//       'navigate',
//     ]);
//     const platformHeaderSpy = jasmine.createSpyObj('PePlatformHeaderService', [
//       'setShortHeader',
//       'setFullHeader',
//     ]);
//     const activatedRouteMock = {
//       parent: {
//         snapshot: {
//           data: {
//             shop: {
//               accessConfig,
//             },
//           },
//           params: {
//             shopId: '',
//           },
//         },
//       },
//     };

//     TestBed.configureTestingModule({
//       imports: [
//         TestPasswordModule,
//       ],
//       providers: [
//         PebShopPasswordSettingsComponent,
//         { provide: PebEditorApi, useValue: apiSpy },
//         { provide: Router, useValue: routerSpy },
//         { provide: PePlatformHeaderService, useValue: platformHeaderSpy },
//         { provide: ActivatedRoute, useValue: activatedRouteMock },
//       ],
//     }).compileComponents().then(() => {
//       fixture = TestBed.createComponent(PebShopPasswordSettingsComponent);
//       component = fixture.componentInstance;
//       el = fixture.debugElement;
//       api = TestBed.get(PebEditorApi);
//       router = TestBed.get(Router);
//       platformHeader = TestBed.get(PePlatformHeaderService);
//       activatedRoute = TestBed.get(ActivatedRoute);

//       fixture.detectChanges();
//     });
//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should have and render form', () => {

//     expect(component.shopDeploy).toBeTruthy();
//     expect(component.form).toBeDefined('component form is undefined');
//     expect(component.form.controls.privatePassword.value).toEqual(accessConfig.privatePassword);
//     expect(component.form.controls.privateMessage.value).toEqual(accessConfig.privateMessage);
//     expect(component.form.controls.isPrivate.value).toBe(accessConfig.isPrivate);

//   });

//   it('should not set form values if shopDeploy is undefined', () => {

//     activatedRoute.parent.snapshot.data = undefined;

//     fixture = TestBed.createComponent(PebShopPasswordSettingsComponent);
//     component = fixture.componentInstance;

//     fixture.detectChanges();

//     expect(component.form.controls.privatePassword.value).toBeFalsy();
//     expect(component.form.controls.privateMessage.value).toBeFalsy();

//   });

//   it('should remove validators if isPrivate set to false', () => {

//     component.form.patchValue({
//       isPrivate: true,
//     });

//     const isPrivateField = el.query(By.css('[formControlName="isPrivate"]')).nativeElement;
//     isPrivateField.click();

//     const privatePasswordField = component.form.controls.privatePassword;
//     const privateMessageField = component.form.controls.privateMessage;

//     expect(privatePasswordField.validator).toBeFalsy();
//     expect(privateMessageField.validator).toBeFalsy();

//   });

//   it('should set validators if isPrivate set to true', () => {

//     component.form.patchValue({
//       isPrivate: false,
//     });

//     const isPrivateField = el.query(By.css('[formControlName="isPrivate"]')).nativeElement;
//     isPrivateField.click();

//     const privatePasswordField = component.form.controls.privatePassword;
//     const privateMessageField = component.form.controls.privateMessage;

//     expect(privatePasswordField.validator).toBeTruthy();
//     expect(privateMessageField.validator).toBeTruthy();

//   });

//   it('should submit form on onSubmit - Success', async(() => {

//     api.updateShopDeploy.and.returnValue(of(accessConfig));
//     router.navigate.and.returnValue(Promise.resolve(true));

//     const formDisableSpy = spyOn(component.form, 'disable');

//     component.onSubmit();

//     fixture.detectChanges();

//     fixture.whenStable().then(() => {
//       expect(formDisableSpy).toHaveBeenCalledTimes(1);
//       expect(component.loading).toBeFalse();
//       expect(router.navigate).toHaveBeenCalledTimes(1);
//       expect(platformHeader.setFullHeader).toHaveBeenCalledTimes(1);
//     });
//   }));

//   it('should submit form on onSubmit - Error', () => {

//     api.updateShopDeploy.and.returnValue(throwError({ error: { message: 'Fake Test Error' } }));

//     const formDisableSpy = spyOn(component.form, 'disable');
//     const formEnableSpy = spyOn(component.form, 'enable');
//     const alertSpy = spyOn(window, 'alert');

//     component.onSubmit();

//     fixture.detectChanges();

//     expect(formDisableSpy).toHaveBeenCalledTimes(1);
//     expect(formEnableSpy).toHaveBeenCalledTimes(1);
//     expect(formEnableSpy).toHaveBeenCalledBefore(alertSpy);
//     expect(alertSpy).toHaveBeenCalledTimes(1);
//     expect(component.loading).toBeFalse();
//   });

// });

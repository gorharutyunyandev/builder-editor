// import { ChangeDetectorRef, DebugElement } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { HttpEventType } from '@angular/common/http';
// import { of } from 'rxjs';

// import { PebEditorApi } from '@pe/builder-api';
// import { MessageBus, PebEnvService } from '@pe/builder-core';
// import { PePlatformHeaderService } from '@pe/platform-header';

// import { PebShopCreateComponent } from './shop-create.component';
// import { TestCreateModule } from './test.create.module';

// describe('PebShopCreateComponent', () => {

//   let fixture: ComponentFixture<PebShopCreateComponent>,
//     component: PebShopCreateComponent,
//     el: DebugElement,
//     api: any,
//     cdr: any,
//     envService: any,
//     messageBus: any,
//     platformHeader: any;

//   beforeEach(async(() => {

//     const apiSpy = jasmine.createSpyObj(PebEditorApi, [
//       'uploadImageWithProgress',
//       'createShop',
//     ]);
//     const envServiceMock = {
//       businessData: {
//         name: 'Test Name',
//       },
//     };
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
//     );

//     TestBed.configureTestingModule({
//       imports: [
//         TestCreateModule,
//       ],
//       providers: [
//         PebShopCreateComponent,
//         { provide: PebEditorApi, useValue: apiSpy },
//         { provide: ChangeDetectorRef, useValue: cdrSpy },
//         { provide: PebEnvService, useValue: envServiceMock },
//         { provide: MessageBus, useValue: messageBusSpy },
//         { provide: PePlatformHeaderService, useValue: platformHeaderSpy },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebShopCreateComponent);
//       component = fixture.componentInstance;
//       el = fixture.debugElement;
//       api = TestBed.get(PebEditorApi);
//       cdr = TestBed.get(ChangeDetectorRef);
//       envService = TestBed.get(PebEnvService);
//       messageBus = TestBed.get(MessageBus);
//       platformHeader = TestBed.get(PePlatformHeaderService);

//       fixture.detectChanges();

//     });

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined('component is not defined');

//     component.form.controls.name.patchValue('');

//     envService.businessData = undefined;

//     component.ngOnInit();

//     expect(component.form.controls.name.value).toEqual('');

//   });

//   it('should have and render form', () => {

//     expect(component.form).toBeDefined('component form is undefined');
//     expect(el.query(By.css('.form'))).toBeTruthy('form has not been rendered');

//   });

//   it('should upload logo - inProgress', () => {

//     fixture.detectChanges();

//     const testUploadProgress = 45;

//     api.uploadImageWithProgress.and.returnValue(of({
//       type: HttpEventType.UploadProgress,
//       loaded: testUploadProgress,
//     }));

//     const event = {
//       target: {
//         files: [
//           new File(['data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAE
// AAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7'], 'test', { type: 'image/png' }),
//         ],
//       },
//     };

//     fixture.detectChanges();

//     component.onLogoUpload(event);

//     expect(component.isLoading).toBeTrue();
//     expect(component.isLargeThenParent).toBeFalse();
//     // expect(component.uploadProgress).toBe(testUploadProgress, 'Unexpected upload progress');

//   });

//   it('should upload logo - finished', () => {

//     api.uploadImageWithProgress.and.returnValue(of({
//       type: HttpEventType.Response,
//       body: {
//         blobName: 'test',
//       },
//     }));

//     const event = {
//       target: {
//         files: [
//           new File(['data:image/png;'], 'test', { type: 'image/png' }),
//         ],
//       },
//     };

//     fixture.detectChanges();

//     component.onLogoUpload(event);

//     // expect(component.isLoading).toBeFalse();
//     expect(component.uploadProgress).toBe(0);

//   });

//   it('should not upload logo if no event.type', () => {

//     const event = {
//       target: {
//         files: [
//           new File(['data:image/png;'], 'test', { type: 'image/png' }),
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
//     expect(api.createShop).not.toHaveBeenCalled();

//   });

//   it('should submit if form is valid', () => {

//     fixture.detectChanges();

//     component.form.patchValue({
//       name: 'Test Name',
//     });

//     api.createShop.and.returnValue(of({
//       id: '000',
//     }));

//     component.onSubmit();

//     expect(component.form.disabled).toBeTrue();
//     expect(api.createShop).toHaveBeenCalledTimes(1);
//     expect(messageBus.emit).toHaveBeenCalledWith('shop.created', '000');
//     expect(messageBus.emit).toHaveBeenCalledTimes(1);
//     expect(platformHeader.setFullHeader).toHaveBeenCalledTimes(1);

//     component.form.controls.picture.patchValue('test.jpg');

//     component.onSubmit();

//   });

// });

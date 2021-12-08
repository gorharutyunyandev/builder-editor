// import { ChangeDetectorRef, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Observable, of } from 'rxjs';

// import { PebEditorApi, PEB_STORAGE_PATH } from '@pe/builder-api';

// import { OVERLAY_DATA } from '../../overlay.data';
// import { PebEditorPublishDialogComponent } from './publish.dialog';
// import { PebEditorStore } from '../../..';

// describe('Publish Dialog Component', () => {
//   let component: PebEditorPublishDialogComponent;
//   let fixture: ComponentFixture<PebEditorPublishDialogComponent>;
//   let el: DebugElement;

//   let apiSpy: jasmine.SpyObj<PebEditorApi>;
//   let detectorSpy: jasmine.SpyObj<ChangeDetectorRef>;
//   let storeSpy: jasmine.SpyObj<PebEditorStore>;

//   const api = jasmine.createSpyObj('PebEditorApi', [
//     'getShopThemeVersions',
//     'createShopThemeVersion',
//     'activateShopThemeVersion',
//     'getShopThemeVersionById',
//     'getSnapshotByVersionId',
//     'publishShopThemeVersion',
//     'deleteShopThemeVersion',
//     'uploadImageWithProgress',
//   ]);
//   const detector = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
//   const store = jasmine.createSpyObj('PebEditorStore', [
//     'openTheme',
//     'updateThemeName',
//     'updateThemePreview',
//   ],                                 { theme$: new Observable<any>() });
//   const overlayDataMock = {
//     data: store,
//   };
//   const storagePathMock = {};

//   beforeEach(async(() => {

//     TestBed.configureTestingModule({
//       providers: [
//         { provide: PebEditorApi, useValue: api },
//         { provide: OVERLAY_DATA, useValue: overlayDataMock },
//         { provide: PEB_STORAGE_PATH, useValue: storagePathMock },
//         { provide: ChangeDetectorRef, useValue: detector },
//         { provide: PebEditorStore, useValue: store },
//       ],
//       declarations: [PebEditorPublishDialogComponent],
//       schemas: [NO_ERRORS_SCHEMA],
//     }).compileComponents().then(() => {
//       fixture = TestBed.createComponent(PebEditorPublishDialogComponent);
//       component = fixture.componentInstance;
//       el = fixture.debugElement;
//       fixture.detectChanges();

//     });

//     apiSpy = TestBed.inject(PebEditorApi) as jasmine.SpyObj<PebEditorApi>;
//     detectorSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
//     storeSpy = TestBed.inject(PebEditorStore) as jasmine.SpyObj<PebEditorStore>;
//   }));

//   it('should create', () => {
//     expect(component).toBeDefined();
//   });

//   it('should check isLargeThanParent onLoad - true',  () =>  {
//     spyOn(component, 'onLogoLoad');

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


//     component.onLogoLoad();

//     expect(component.isLargeThenParent).toBeTrue();
//   });

//   it('should check isLargeThenParent onLoad - false', () => {
//     spyOn(component, 'onLogoLoad');

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
//     component.onLogoLoad();

//     expect(component.isLargeThenParent).toBeFalse();
//   });

//   // it('should not upload logo if no event type', () => {
//   //   const event = {
//   //       target: {
//   //           files: [
//   // tslint:disable-next-line:max-line-length
//   //             new File(['https://www.apple.com/ac/globalnav/6/en_US/images/be15095f-5a20-57d0-ad14-cf4c638e223a/globalnav_apple_image__cxwwnrj0urau_large.svg'])
//   //           ],
//   //       },
//   //   }
//   //
//   //   api.uploadImageWithProgress.and.returnValue(of({
//   //       event: {
//   //         type: null
//   //       },
//   //   }));
//   //
//   //   fixture.detectChanges();
//   //   component.onLogoUpload(event);
//   //
//   //   expect(cdr.detectChanges).not.toHaveBeenCalled();
//   // });

//   it('should test onChangeShopName function', () => {
//     spyOn(component, 'onChangeShopName');
//     const name = '';
//     component.currentShopName$.subscribe((next) => {
//       expect(next).toEqual(name);
//     });

//     component.onChangeShopName();
//     store.updateThemeName(name);
//   });

//   it('should test onDeleteVersion function', () => {
//     spyOn(component, 'onDeleteVersion');
//     const id = '';
//     api.deleteShopThemeVersion();

//     component.onDeleteVersion(id);
//   });

//   it('should test onPublishVersion function', () => {
//     spyOn(component, 'onPublishVersion');
//     const id = '';
//     api.publishShopThemeVersion();

//     component.onPublishVersion(id);
//   });

//   it('should test onSelectVersion', () => {
//     spyOn(component, 'onSelectVersion');
//     const id = '';
//     component.onSelectVersion(id);

//     expect(component.onSelectVersion).toBeTruthy();
//   });

// });

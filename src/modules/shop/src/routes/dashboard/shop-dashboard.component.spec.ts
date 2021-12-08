// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ChangeDetectorRef, DebugElement } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { of } from 'rxjs';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// import { BUILDER_MEDIA_STORAGE_PATH, PebEditorApi, PEB_PRODUCTS_API_PATH } from '@pe/builder-api';
// import { MessageBus, PebEnvService } from '@pe/builder-core';

// import { PebShopDashboardComponent } from './shop-dashboard.component';
// import { TestDashboardModule } from './test.edit.module';

// describe('PebShopDashboardComponent', () => {

//   let fixture: ComponentFixture<PebShopDashboardComponent>,
//     component: PebShopDashboardComponent,
//     el: DebugElement,
//     api: any,
//     envService: any,
//     cdr: any,
//     messageBus: any,
//     activatedRoute: any,
//     testShop: any;

//   beforeEach(async(() => {

//     const apiSpy = jasmine.createSpyObj(PebEditorApi, [
//       'getShop',
//       'getShopPreview',
//     ]);
//     const envServiceMock = {
//       businessData: {
//         name: '',
//       },
//     };
//     const messageBusSpy = jasmine.createSpyObj('MessageBus', [
//       'emit',
//     ]);
//     const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', [
//       'markForCheck',
//     ]);
//     const activatedRouteMock = {
//       parent: {
//         params: of([
//           { shopId: '222' },
//           { shopId: '45' },
//         ]),
//         snapshot: {
//           params: {
//             shopId: '',
//           },
//         },
//       },
//     };

//     TestBed.configureTestingModule({
//       imports: [
//         TestDashboardModule,
//         NoopAnimationsModule,
//       ],
//       providers: [
//         PebShopDashboardComponent,
//         { provide: PebEditorApi, useValue: apiSpy },
//         { provide: PebEnvService, useValue: envServiceMock },
//         { provide: MessageBus, useValue: messageBusSpy },
//         { provide: ActivatedRoute, useValue: activatedRouteMock },
//         { provide: ChangeDetectorRef, useValue: cdrSpy },
//       ],
//     }).compileComponents().then(() => {
//       fixture = TestBed.createComponent(PebShopDashboardComponent);
//       component = fixture.componentInstance;
//       el = fixture.debugElement;
//       api = TestBed.get(PebEditorApi);
//       envService = TestBed.get(PebEnvService);
//       messageBus = TestBed.get(MessageBus);
//       activatedRoute = TestBed.get(ActivatedRoute);
//       cdr = TestBed.get(ChangeDetectorRef);

//       testShop = {
//         id: '000',
//         name: 'testShop',
//         picture: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-1.2.1&i
// xid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
//       };

//       activatedRoute.parent.snapshot.params.shopId = testShop.id;

//       api.getShop.and.returnValue(of(testShop));
//       api.getShopPreview.and.returnValue(of(null));
//     });
//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('shuold get shop on ngInit', () => {

//     fixture.detectChanges();

//     expect(component.shopId).toEqual(testShop.id);
//     expect(api.getShop).toHaveBeenCalledWith(testShop.id);
//     expect(api.getShop).toHaveBeenCalledTimes(1);
//     expect(component.shop).toBe(testShop);

//   });

//   it('should call messageBus.emit onEditClick', () => {

//     fixture.detectChanges();

//     component.onEditClick();

//     expect(component.editButtonLoading).toBeTrue();
//     expect(messageBus.emit).toHaveBeenCalledWith('shop.open-builder', testShop.id);
//     expect(messageBus.emit).toHaveBeenCalledTimes(1);

//   });

//   it('should call messageBus.emit onOpenClick', () => {

//     fixture.detectChanges();

//     component.onOpenClick();

//     expect(messageBus.emit).toHaveBeenCalledWith('shop.open', testShop);
//     expect(messageBus.emit).toHaveBeenCalledTimes(1);

//   });

// });

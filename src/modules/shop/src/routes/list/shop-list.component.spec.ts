// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ChangeDetectorRef, DebugElement } from '@angular/core';
// import { of } from 'rxjs';

// import { MessageBus, PebEnvService } from '@pe/builder-core';
// import { PebEditorApi } from '@pe/builder-api';
// import { PePlatformHeaderService } from '@pe/platform-header';

// import { PebShopListComponent } from './shop-list.component';
// import { TestListModule } from './test.list.module';

// describe('PebShopListComponent', () => {

//   let fixture: ComponentFixture<PebShopListComponent>,
//     component: PebShopListComponent,
//     el: DebugElement,
//     api: any,
//     envService: any,
//     messageBus: any,
//     cdr: any,
//     platformHeader: any,
//     shopsList: any[];

//   beforeEach(async(() => {

//     const apiSpy = jasmine.createSpyObj('PebEditorApi', [
//       'uploadImageWithProgress',
//       'getShops',
//       'setAsDefaultShop',
//     ]);
//     const envServiceMock = {
//       businessData: {
//         shopid: '000',
//       },
//     };
//     const messageBusSpy = jasmine.createSpyObj('MessageBus', [
//       'emit',
//     ]);
//     const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', [
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

//     TestBed.configureTestingModule({
//       imports: [
//         TestListModule,
//       ],
//       providers: [
//         PebShopListComponent,
//         { provide: PebEditorApi, useValue: apiSpy },
//         { provide: PebEnvService, useValue: envServiceMock },
//         { provide: MessageBus, useValue: messageBusSpy },
//         { provide: ChangeDetectorRef, useValue: cdrSpy },
//         { provide: PePlatformHeaderService, useValue: platformHeaderSpy },
//       ],
//     }).compileComponents().then(() => {

//       fixture = TestBed.createComponent(PebShopListComponent);
//       component = fixture.componentInstance;
//       el = fixture.debugElement;
//       api = TestBed.get(PebEditorApi);
//       envService = TestBed.get(PebEnvService);
//       messageBus = TestBed.get(MessageBus);
//       cdr = TestBed.get(ChangeDetectorRef);
//       platformHeader = TestBed.get(PePlatformHeaderService);

//       shopsList = [
//         {
//           id: 'shopId',
//           name: 'testShop',
//           picture: 'https://images.unsplash.com/photo-1598966474832-56564ad5cf03?ixlib=
// rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
//           isDefault: true,
//         },
//         {
//           id: 'shopId2',
//           name: 'testShop2',
//           picture: 'https://images.unsplash.com/photo-1598948208894-ca6c00e2f01b?ixlib=rb-1
// .2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
//           isDefault: false,
//         },
//       ];

//       api.getShops.and.returnValue(of(shopsList));

//     });
//   }));


//   it('should be defined', () => {

//     fixture.detectChanges();

//     expect(component).toBeDefined('component is not defined');
//     expect(platformHeader.setShortHeader).toHaveBeenCalledTimes(1);

//   });

//   it('should get shops list', () => {

//     fixture.detectChanges();

//     expect(component.shops).toBeTruthy('shops is not defined');
//     expect(component.shops.length).toBe(2, 'unexpected shops count');
//     expect(component.shops[0].id).toEqual(shopsList[0].id, 'unexpected shops list');
//     expect(component.defaultShopSubject.getValue().id).toEqual(shopsList[0].id, 'unexpected default shop subject');
//     expect(envService.shopId).toEqual(shopsList[0].id, 'unexpected shopId in envService');

//   });

//   it('should set full header', () => {

//     component.onOpen(shopsList[0]);

//     expect(messageBus.emit).toHaveBeenCalledTimes(1);
//     expect(platformHeader.setFullHeader).toHaveBeenCalledTimes(1);

//   });

//   it('should call messageBox.emit onEdit', () => {

//     component.onEdit(shopsList[0].id);

//     expect(messageBus.emit).toHaveBeenCalledTimes(1);

//   });

//   it('should set default shop', () => {

//     api.setAsDefaultShop.and.returnValue(of(null));

//     component.onSetAsDefault(shopsList[0].id);

//     expect(messageBus.emit).toHaveBeenCalledTimes(1);

//   });


// });

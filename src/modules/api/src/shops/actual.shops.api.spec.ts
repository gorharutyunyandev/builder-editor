// import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
// import { HttpClient } from '@angular/common/http';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { of } from 'rxjs';

// import { PebEnvService } from '@pe/builder-core';

// import { PebActualShopsApi } from './actual.shops.api';
// import { PEB_SHOPS_API_PATH } from '../shops/actual.shops.api';
// import { PEB_GENERATOR_API_PATH, PEB_STORAGE_PATH } from '../constants';
// import { BUILDER_MEDIA_API_PATH, PEB_MEDIA_API_PATH, PEB_STUDIO_API_PATH } from '../constants';

// import { stringify } from 'querystring';

// describe('ContextService', () => {
//   let service: PebActualShopsApi,
//     envService: PebEnvService,
//     http: HttpTestingController,
//     shopsApiPath: string,
//     shopApiPath: string,
//     shoopsApiPath: string;
//   let payload: any;


//   beforeEach(() => {
//     const envServiceMock = {
//         businessId: '000',
//         shopId: 1,
//         accessId: 1,
//       };

//     TestBed.configureTestingModule({
//         imports: [
//             HttpClientTestingModule,
//           ],
//         providers: [
//             PebActualShopsApi,
//             {
//               provide: PEB_SHOPS_API_PATH, useValue: 'PEB_SHOPS_API_PATH',
//             },


//             {
//               provide: PebEnvService, useValue: envServiceMock,
//             },
//           ],
//       });

//     service = TestBed.get(PebActualShopsApi);
//     http = TestBed.get(HttpTestingController);
//     shopsApiPath = TestBed.get(PEB_SHOPS_API_PATH);
//     shopApiPath = TestBed.get(PEB_SHOPS_API_PATH);
//     shoopsApiPath = TestBed.get(PEB_SHOPS_API_PATH);
//     envService = TestBed.get(PebEnvService);

//   });

//   it('should call test service', () => {

//     expect(service).toBeDefined();
//   });

//   it('should get shops list', () => {

//     const shops = [
//         {
//           id: '001',
//         },
//         {
//           id: '002',
//         },
//       ];

//     const endpoint = `${shopsApiPath}/business/${envService.businessId}/shop`;


//     service.getShopsList().subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(shops));

//   });

//   it('should call get shops single list', () => {

//     const shops = [
//         {
//           id: '001',
//         },
//         {
//           id: '002',
//         },
//       ];

//     const endpoint = `${shopApiPath}/business/${envService.businessId}/shop/1`;


//     service.getSingleShop('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(shops));

//   });

//     // check it

//   it('should test create shop', () => {
//     const shops = [
//         {
//           id: '001',
//         },
//         {
//           id: '002',
//         },
//       ];


//     const endpoint = `${shopApiPath}/business/${envService.businessId}/shop`;

//     service.createShop(payload).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(shops));

//   });



//   it('should test delete shop', () => {
//     const shops = [
//         {
//           id: '001',
//         },
//         {
//           id: '002',
//         },
//       ];


//     const endpoint = `${shopApiPath}/business/000/shop/000`;

//     service.deleteShop('000').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('DELETE');

//     req.flush(of(shops));

//   });



//   it('should test update shop', () => {
//     const shops = [
//         {
//           id: '001',
//         },
//         {
//           id: '002',
//         },
//       ];

//     const payload = [
//         {
//           id:'001',
//         },
//       ];



//     const endpoint = `${shopsApiPath}/business/000/shop/1`;

//     service.updateShop('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PATCH');

//     req.flush(of(shops));

//   });

//   it('should test markShopAsDefault-one', () => {

//     const shops = [
//         {
//           id: '001',
//         },
//         {
//           id: '002',
//         },
//       ];

//     const endpoint = `${shopApiPath}/business/${envService.businessId}/shop/1/default`;

//     service.markShopAsDefault('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PUT');

//     req.flush(of(shops));

//   });

//   it('should test updateShopDeloy', () => {

//     const shops = [
//         {
//           id: '001',
//         },
//         {
//           id: '002',
//         },
//       ];

//     const endpoint = `${shopsApiPath}/business/${envService.businessId}/shop/access/`;

//     service.updateShopDeploy('', payload).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PATCH');

//     req.flush(of(shops));


//   });


//   it('should test getShopPreview', () => {

//     let include:string[];

//     const shops = [
//         {
//           id: '001',
//         },
//         {
//           id: '002',
//         },
//       ];

//     const endpoint = `${shopsApiPath}/business/${envService.businessId}/shop/${envService.shopId}/preview`;



//     service.getShopPreview('', include).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(shops));


//   });







// });

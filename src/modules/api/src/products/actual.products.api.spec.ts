// import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
// import { HttpClient } from '@angular/common/http';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { of } from 'rxjs';

// import { PebEnvService } from '@pe/builder-core';

// import { PebActualProductsApi } from './actual.products.api';
// import { PEB_PRODUCTS_API_PATH } from './actual.products.api';
// import { PEB_STORAGE_PATH } from '../constants';

// describe('PebActualProductsApi', () => {
//   let service: PebActualProductsApi;
//   let  envService: PebEnvService,
//     http: HttpTestingController,
//     productsApiPath: string;


//   beforeEach(() => {
//     const envServiceMock = {};

//     TestBed.configureTestingModule({
//       imports:[
//         HttpClientTestingModule,
//       ],
//       providers:[
//         PebActualProductsApi,
//         {
//           provide: PEB_PRODUCTS_API_PATH, useValue:'PEB_PRODUCTS_API_PATH',
//         },

//         {
//           provide:  PEB_STORAGE_PATH, useValue: 'PEB_STORAGE_PATH',
//         },



//         {
//           provide: PebEnvService, useValue: envServiceMock,
//         },
//       ],
//     });

//     service = TestBed.get(PebActualProductsApi);
//     http = TestBed.get(HttpTestingController);
//     envService = TestBed.get(PebEnvService);
//     productsApiPath = TestBed.get(PEB_PRODUCTS_API_PATH);

//   });

//   it('should call test service', () => {

//     expect(service).toBeDefined();
//   });

//   it('should get getProductsCategories list', () => {

//     const products = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];


//     const endpoint = `${productsApiPath}/products`;


//     service.getProductsCategories('title').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(products));

//   });

//   it('should get getProducts list', () => {

//     const products = [
//       {
//         id: '001',

//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${productsApiPath}/products`;

//     service.getProducts().subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(products));

//   });

//   it('should get getProducts list - with ids[]', () => {

//     const products = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${productsApiPath}/products`;

//     service.getProducts(['001', '002']).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     const result = {
//     data: {
//       getProducts: {
//         products,
//       },
//     },
//   };

//     req.flush(result);

//   });

//   it('should get getProductsCategoriesbyId list', () => {


//     const mock = ['1'];

//     const products = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${productsApiPath}/products`;

//     const result = {
//     data: {
//       getProducts: {

//         category: [
//           { id: 'cat01' },
//           { id: 'cat02' },
//         ],

//         acc: 1,
//       },
//     },
//   };


//     service.getProductCategoriesByIds(['001', '002', '1']).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(result);

//   });



//   it('should get getProductsCategoriesbyId with categoryId', () => {


//     const mock = ['1'];

//     const categories = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${productsApiPath}/products`;



//     service.getProductCategoriesByIds(['001', '002', '1']).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(categories);

//   });

//   it('should get getProductsByCategories list', () => {
//     let ids: string[];

//     const products = [
//     {
//       id: '001',
//       categories: [
//             { id: 'cat01' },
//             { id: 'cat02' },
//       ],
//     },
//     {
//       id: '002',
//       categories: [
//             { id: 'cat01' },
//             { id: 'cat02' },
//             { id: 'cat03' },
//       ],
//     },
//   ];

//     const result = {
//     data: {
//       getProductsByCategories: {
//         products,
//         categories: 1,
//       },
//     },
//     category:{
//       category: 1,
//     },
//   };

//     const endpoint = `${productsApiPath}/products`;


//     service.getProductsByCategories((['001', '002'])).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(result);

//   });









// });

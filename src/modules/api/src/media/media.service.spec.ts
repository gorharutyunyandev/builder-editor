// import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
// import { HttpClient } from '@angular/common/http';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { of } from 'rxjs';

// import { PebEnvService } from '@pe/builder-core';
// import {
//   PebMediaService,
//   PebMediaSidebarCollectionFilters,
//   PebMediaSidebarCollectionItem,
// } from '@pe/builder-core';

// import { MediaService } from './media.service';
// import { PEB_SHOPS_API_PATH } from '../shops/actual.shops.api';
// import { PEB_GENERATOR_API_PATH, PEB_STORAGE_PATH } from '../constants';
// import { BUILDER_MEDIA_API_PATH, PEB_MEDIA_API_PATH, PEB_STUDIO_API_PATH } from '../constants';


// describe('MediaService', () => {
//   let service: MediaService;
//   let builderMediaApiPath: string;
//   let http: HttpTestingController;
//   let mediaPath: any;
//   let envService: PebEnvService;
//   let studioPath: any;




//   beforeEach(() => {
//     const envServiceMock = {
//       businessId: '000',
//       shopId: 1,
//       terminalId: 1,
//       themeId: 1,
//       actionId: 1,
//     };

//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule,
//       ],
//       providers: [
//         MediaService,
//         {
//           provide: BUILDER_MEDIA_API_PATH, useValue: 'BUILDER_MEDIA_API_PATH',
//         },

//         {
//           provide: PEB_MEDIA_API_PATH, useValue: 'PEB_MEDIA_API_PATH',
//         },

//         {
//           provide: PEB_STORAGE_PATH, useValue: 'PEB_STORAGE_PATH',
//         },



//         {
//           provide: PEB_STUDIO_API_PATH, useValue: 'PEB_STUDIO_API_PATH',
//         },

//         {
//           provide: PebEnvService, useValue: envServiceMock,
//         },
//       ],
//     });

//     service = TestBed.get(MediaService);
//     builderMediaApiPath = TestBed.get(BUILDER_MEDIA_API_PATH);
//     http = TestBed.get(HttpTestingController);
//     mediaPath = TestBed.get(PEB_MEDIA_API_PATH);
//     studioPath = TestBed.get(PEB_STUDIO_API_PATH);


//   });

//   it('should call test service', () => {

//     expect(service).toBeDefined();
//   });


//   it('should test getImageCollection', () => {

//     let filters: PebMediaSidebarCollectionFilters,
//       page = 1, perPage = 54;

//     const media = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = (`${builderMediaApiPath}/api/selection`);


//     service.getImageCollection(filters, page, perPage).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(media));

//   });


//   it('should test getVideoCollection', () => {

//     let filters: PebMediaSidebarCollectionFilters,
//       page = 1, perPage = 54;

//     const media = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = (`${builderMediaApiPath}/api/selection`);


//     service.getVideoCollection(filters, page, perPage).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(media));

//   });

//   it('should test getCategories', () => {



//     const media = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = (`${builderMediaApiPath}/api/selection/categories?type=image`);


//     service.getCategories().subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(media));

//   });

//   it('should test getFormats', () => {



//     const media = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = (`${builderMediaApiPath}/api/selection/formats?type=image`);


//     service.getFormats().subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(media));

//   });


//   it('should test getStyles', () => {



//     const media = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = (`${builderMediaApiPath}/api/selection/styles?type=image`);


//     service.getStyles().subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(media));

//   });





//   it('should test UploadImages', () => {



//     let container: string, businessId: string, file: File, returnShortPath: boolean;

//     file = new File(['jpg'], 'test_jpg.jpg', { type: 'image/jpg' });

//     const mockData = ['1', '2', '3'];




//     const shops = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${mediaPath}/api/image/business/000/${container}`;


//     service.uploadImage(file, container).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(shops, mockData));

//   });

//   it('should test UploadImagesWithProgress', () => {



//     let container: string, businessId: string, file: File, returnShortPath: boolean;

//     file = new File(['jpg'], 'test_jpg.jpg', { type: 'image/jpg' });

//     const mockData = ['1', '2', '3'];




//     const shops = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${mediaPath}/api/image/business/000/${container}`;


//     service.uploadImageWithProgress(file, container).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(shops, mockData));

//   });

//   it('should test UploadVideo', () => {



//     let container: string, businessId: string, file: File, returnShortPath: boolean;

//     file = new File(['jpg'], 'test_jpg.jpg', { type: 'image/jpg' });

//     const mockData = ['1', '2', '3'];




//     const shops = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${mediaPath}/api/video/business/000/${container}`;


//     service.uploadVideo(file, container).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(shops, mockData));

//   });


//   it('should test searchMedia', () => {



//     let container: string, businessId: string, file: File, returnShortPath: boolean;

//     file = new File(['jpg'], 'test_jpg.jpg', { type: 'image/jpg' });

//     const mockData = ['1', '2', '3'];




//     const shops = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${studioPath}/api/000/media/search?name=1`;


//     service.searchMedia('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(shops));

//   });


//   it('should apply filters', () => {

//     const filters = {
//         categories: [],
//         formats: [],
//         styles: [],
//         hasPeople: false,
//       },
//       page = 1,
//       perPage = 10;

//     let params: any;

//     params = service.applyFilters(filters, 'image', page, perPage);

//     filters.categories = [
//       'test',
//       'big',
//       'small',
//     ];
//     filters.formats = [
//       'album',
//     ];
//     filters.styles = [
//       'b&w',
//     ];
//     filters.hasPeople = true;

//     params = service.applyFilters(filters, 'image', page, perPage);



//   });









// });

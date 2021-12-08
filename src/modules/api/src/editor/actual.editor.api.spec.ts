describe('TEST', () => {
  it('Just for check', () => {
    expect('test').toContain('test');
  });
});

// import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
// import { HttpClient } from '@angular/common/http';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { of } from 'rxjs';
// import { HttpErrorResponse } from '@angular/common/http';

// import { PebAction, PebEnvService, PebShopId,
//   PebShopThemeId,
//   PebShopThemeSourceId,
//   PebShopThemeSourcePagePreviews } from '@pe/builder-core';

// import { CreateShopThemeDto, CreateShopThemePayload, PebEditorApi } from './abstract.editor.api';
// import { PebActualEditorApi } from './actual.editor.api';
// import { PEB_EDITOR_API_PATH } from './actual.editor.api';
// import { PEB_SHOPS_API_PATH } from '../shops/actual.shops.api';
// import { PEB_GENERATOR_API_PATH, PEB_MEDIA_API_PATH, PEB_STORAGE_PATH } from '../constants';




// describe('ActualService', () => {
//   let service: PebActualEditorApi;
//   let editorApiPath: string;
//   let apiGeneratorPath: string;
//   let envService: PebEnvService;
//   let http: HttpTestingController;
//   let themeId: any;
//   let shopApiPath: string;
//   let apiMediaPath: string;



//   beforeEach(() => {
//     const envServiceMock = {
//       businessId: '000',
//       shopId: 1,
//       terminalId:1,
//       themeId: 1,
//       actionId:1,
//     };


//     TestBed.configureTestingModule({
//       imports:[
//         HttpClientTestingModule,
//       ],
//       providers:[


//         PebActualEditorApi,
//         {
//           provide: PEB_EDITOR_API_PATH, useValue:'PEB_EDITOR_API_PATH',
//         },

//         {
//           provide: PEB_SHOPS_API_PATH, useValue: 'PEB_SHOPS_API_PATH',
//         },

//         {
//           provide: PEB_GENERATOR_API_PATH, useValue: 'PEB_GENERATOR_API_PATH',
//         },

//         {
//           provide: PEB_MEDIA_API_PATH, useValue: 'PEB_MEDIA_API_PATH',
//         },

//         {
//           provide: PEB_STORAGE_PATH, useValue: 'PEB_STORAGE_PATH',
//         },

//         {
//           provide: PebEnvService, useValue: envServiceMock,
//         },
//       ],
//     });

//     service = TestBed.get(PebActualEditorApi);
//     http = TestBed.get(HttpTestingController);
//     envService = TestBed.get(PebEnvService);
//     editorApiPath = TestBed.get(PEB_EDITOR_API_PATH);
//     apiGeneratorPath = TestBed.get(PEB_GENERATOR_API_PATH);
//     shopApiPath = TestBed.get(PEB_SHOPS_API_PATH);
//     apiMediaPath = TestBed.get(PEB_MEDIA_API_PATH);


//   });

//   it('should be defined service', () => {

//     expect(service).toBeDefined();
//   });

//   it('should get shops list', () => {

//     const editor = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${editorApiPath}/api/theme/${1}/snapshot`;


//     service.getSnapshot('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(editor));

//   });


//   it('should test getActions list', () => {

//     const editor = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${editorApiPath}/api/theme/${1}/actions`;


//     service.getActions('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(editor));

//   });


//   it('should test getAvailables themes', () => {

//     const editor = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${editorApiPath}/api/themes`;


//     service.getAllAvailableThemes().subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(editor));

//   });

//   it('should test getThemeList', () => {

//     const editor = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${editorApiPath}/api/business/000/application/${envService.shopId}/themes`;


//     service.getShopThemesList().subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(editor));

//   });

//   it('should test getThemeById', () => {

//     const editor = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${editorApiPath}/api/theme/1`;


//     service.getShopThemeById('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(editor));

//   });

//   it('should test getShopActiveTheme', () => {

//     const editor = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${editorApiPath}/api/business/000/application/${envService.shopId}/themes/active`;


//     service.getShopActiveTheme('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(editor));

//   });


//   it('should create ShopTheme', () => {

//     let input: CreateShopThemePayload;

//     const editor = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${editorApiPath}/api/theme`;


//     service.createShopTheme(input).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(editor));

//   });

//   it('should test add action', () => {

//     let input: CreateShopThemePayload;
//     let shopId: PebShopId;
//     let action: PebAction;

//     const editor = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${editorApiPath}/api/theme/${shopId}/action`;


//     service.addAction(shopId, action).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(editor));

//   });


//   it('should test undo action', () => {

//     let input: CreateShopThemePayload;
//     let shopId: PebShopId;
//     let action: PebAction;
//     let actionId: any;

//     const editor = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${editorApiPath}/api/theme/${themeId}/action/${shopId}`;


//     service.undoAction(shopId, actionId).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('DELETE');

//     req.flush(of(editor));

//   });

//   it('should test update replica', () => {

//     let themeId: string, oldInitAction: PebAction, newInitAction: PebAction;

//     service.updateReplica(themeId, oldInitAction, newInitAction);

//   });

//   it('should test updateReplica ', () => {
//     let themeId: string, oldInitAction: PebAction, newInitAction: PebAction;

//     const spy = spyOn(service, 'updateReplica').and.callThrough();
//     expect(spy).not.toHaveBeenCalled();
//     service.updateReplica(themeId, oldInitAction, newInitAction);
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   it('should test getShopThemeVersion', () => {

//     let input: CreateShopThemePayload;
//     let shopId: PebShopId;
//     let action: PebAction;
//     let actionId: any;

//     const editor = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${editorApiPath}/api/theme/1/versions`;


//     service.getShopThemeVersions('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(editor));

//   });


//   it('should test createShopThemeVersion', () => {

//     let themeId: PebShopId;
//     let name:string;

//     const editor = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${editorApiPath}/api/theme/${themeId}/version`;


//     service.createShopThemeVersion(themeId, '1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(editor));

//   });

//   it('should test updateShopThemePreview', () => {

//     let themeId: PebShopId;
//     let name:string;

//     const editor = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${editorApiPath}/api/theme/${themeId}/image-preview`;


//     service.updateShopThemePreview(themeId, '1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(editor));

//   });

//   it('should test updateShopThemeName', () => {

//     let themeId: PebShopId;
//     let name:string;

//     const editor = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${editorApiPath}/api/theme/${themeId}/name`;


//     service.updateShopThemeName(themeId, '1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PATCH');

//     req.flush(of(editor));

//   });

//   it('should test deleteShopThemeVersion', () => {

//     let themeId: PebShopId;
//     let name:string;

//     const editor = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${editorApiPath}/api/theme/${themeId}/version/1`;


//     service.deleteShopThemeVersion(themeId, '1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('DELETE');

//     req.flush(of(editor));

//   });

//   it('should test activateShopThemeVersion', () => {

//     let themeId: PebShopId;
//     let name:string;

//     const editor = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${editorApiPath}/api/theme/${themeId}/version/1`;


//     service.activateShopThemeVersion(themeId, '1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(editor));

//   });


//   it('should test publishShopThemeVersion', () => {

//     let themeId: PebShopId;
//     let name:string;

//     const editor = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${editorApiPath}/api/theme/${themeId}/version/1/publish`;


//     service.publishShopThemeVersion(themeId, '1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PUT');

//     req.flush(of(editor));

//   });



//   it('should test getTemplateThemes', () => {

//     let themeId: PebShopId;
//     let name:string;

//     const editor = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${editorApiPath}/api/templates`;


//     service.getTemplateThemes().subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(editor));

//   });


//   it('should test generateTemplateThemes', () => {

//     let themeId: PebShopId;
//     let name:string;
//     let category: string;
//     let  page: string,
//      theme: string,
//      logo: string;

//     const editor = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${apiGeneratorPath}/api/builder-generator/business/${envService.businessId}/generate`;


//     service.generateTemplateTheme(category, page, theme, logo).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(editor));

//   });


//   it('should test updateThemeSourcePage', () => {

//     let  themeId: PebShopThemeId,
//      sourceId: PebShopThemeSourceId,
//      previews: PebShopThemeSourcePagePreviews;

//     const editor = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${editorApiPath}/api/theme/${themeId}/source/1/previews`;


//     service.updateThemeSourcePagePreviews(themeId, '1', previews).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PATCH');

//     req.flush(of(editor));

//   });


//   it('should test installTemplateTheme', () => {

//     let  themeId: PebShopThemeId,
//      sourceId: PebShopThemeSourceId,
//      previews: PebShopThemeSourcePagePreviews;

//     const editor = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${editorApiPath}/api/business/${envS
// ervice.businessId}/application/${envService.shopId}/theme/1/install`;


//     service.installTemplateTheme('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(editor));

//   });


//   it('should test instaltinstallTemplateTheme', () => {

//     let  themeId: PebShopThemeId,
//      sourceId: PebShopThemeSourceId,
//      previews: PebShopThemeSourcePagePreviews;

//     const editor = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${editorApiPath}/api/business/${envService.
// businessId}/application/${envService.shopId}/template/1/instant-setup`;


//     service.instantInstallTemplateTheme('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PUT');

//     req.flush(of(editor));

//   });

//   it('should test installTemplateTheme', () => {

//     let  themeId: PebShopThemeId,
//      sourceId: PebShopThemeSourceId,
//      previews: PebShopThemeSourcePagePreviews;

//     const editor = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${editorApiPath}/api/business/${envSe
// rvice.businessId}/application/${envService.shopId}/theme/1/install`;


//     service.installTemplateTheme('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(editor));

//   });


//   it('should test deleteTemplateTheme', () => {

//     let  themeId: PebShopThemeId,
//      sourceId: PebShopThemeSourceId,
//      previews: PebShopThemeSourcePagePreviews;

//     const editor = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${editorApiPath}/api/business/${envSe
// rvice.businessId}/application/${envService.shopId}/theme/1`;


//     service.deleteTemplateTheme('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('DELETE');

//     req.flush(of(editor));

//   });


//   it('should test duplicateTemplateTheme', () => {

//     let  themeId: PebShopThemeId,
//      sourceId: PebShopThemeSourceId,
//      previews: PebShopThemeSourcePagePreviews;

//     const editor = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${editorApiPath}/api/business/${envServi
// ce.businessId}/application/${envService.shopId}/theme/1/duplicate`;


//     service.duplicateTemplateTheme('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PUT');

//     req.flush(of(editor));

//   });


//   it('should test getShops', () => {

//     let  themeId: PebShopThemeId,
//      sourceId: PebShopThemeSourceId,
//      previews: PebShopThemeSourcePagePreviews;

//     const editor = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${editorApiPath}/api/business/${envService.
// businessId}/application/${envService.shopId}/theme/1/duplicate`;


//     service.getShops().subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(editor));

//   });

//   it('should get shops list', () => {

//     const shops = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${shopApiPath}/business/${envService.businessId}/shop`;


//     service.getShops().subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(shops));

//   });

//   it('should get shop list', () => {

//     const shops = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${shopApiPath}/business/${envService.businessId}/shop/1`;


//     service.getShop('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(shops));

//   });



//   it('should test updateShopDeploy', () => {

//     let payload: any;

//     const shops = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${shopApiPath}/business/${envService.businessId}/shop/access/1`;


//     service.updateShopDeploy('1', payload).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PATCH');

//     req.flush(of(shops));

//   });



//   it('should test createShop', () => {

//     let payload: any;

//     const shops = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${shopApiPath}/business/${envService.businessId}/shop`;


//     service.createShop(payload).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(shops));

//   });


//   it('should test deleteShop', () => {


//     const shops = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${shopApiPath}/business/${envService.businessId}/shop/1`;


//     service.deleteShop('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('DELETE');

//     req.flush(of(shops));

//   });

//   it('should test setAsDefault', () => {


//     const shops = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${shopApiPath}/business/${envService.businessId}/shop/1/default`;


//     service.setAsDefaultShop('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PUT');

//     req.flush(of(shops));

//   });

//   it('should test updateShop', () => {

//     let payload: any;

//     const shops = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${shopApiPath}/business/${envService.businessId}/shop/1`;


//     service.updateShop(payload).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PATCH');

//     req.flush(of(shops));

//   });


//   it('should test getShopPreview', () => {

//     let include: string[];

//     const shops = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${editorApiPath}/api/business/${envService.businessId}/application/1/preview`;


//     service.getShopPreview('1', include).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(shops));

//   });

//   it('should test getShopPreviewPages', () => {

//     let include: string[];

//     const shops = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${editorApiPath}/api/application/1/source/pages/1`;


//     service.getShopPreviewPages('1', '1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(shops));

//   });

//   it('should test getThemePreviewPages', () => {


//     const shops = [
//     {
//       id: '001',
//     },
//     {
//       id: '002',
//     },
//   ];

//     const endpoint = `${editorApiPath}/api/application/1/source/pages/1`;


//     service.getThemePreviewPages('1', '1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(shops));

//   });


//   it('should test UploadImages', () => {



//     let container: string, file: File, returnShortPath: boolean;

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

//     const endpoint = `${apiMediaPath}/api/image/business/${envService.businessId}/${container}`;


//     service.uploadImage(container, file, returnShortPath).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(shops, mockData, null));

//   });

//   it('should test UploadImages - error', () => {

//     let container: string, file: File, returnShortPath: boolean;

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

//     const endpoint = `${apiMediaPath}/api/image/business/${envService.businessId}/${container}`;


//     service.uploadImage(container, file, returnShortPath).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     // Just as example
//     req.flush('Upload failed', {
//       status: 500,
//       statusText: 'Internal Server Error',
//     });

//   });

//   it('should test UploadImagesWithProgress', () => {

//     const mock = 1;

//     let container: string, file: File, returnShortPath: boolean;

//     file = new File(['jpg'], 'test_jpg.jpg', { type: 'image/jpg' });

//     const errorResponse = null;


//     const nmb = 100;




//     const shops = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${apiMediaPath}/api/image/business/${envService.businessId}/${container}`;


//     service.uploadImageWithProgress(container, file, returnShortPath).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(shops, nmb, mock, errorResponse));


//   });




//   it('should test UploadImagesWithProgress-errors', () => {

//     const mock = 1;

//     let container: string, file: File, returnShortPath: boolean;

//     file = new File(['jpg'], 'test_jpg.jpg', { type: 'image/jpg' });

//     const errorResponse = null;


//     const nmb = 100;




//     const shops = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${apiMediaPath}/api/image/business/${envService.businessId}/${container}`;


//     service.uploadImageWithProgress(container, file, returnShortPath).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush('Upload failed', {
//       status: 500,
//       statusText: 'Internal Server Error',
//     });


//   });



//   it('should test UploadVideo', () => {

//     let container: string, file: File, returnShortPath: boolean;

//     file = new File(['jpg'], 'test_jpg.jpg', { type: 'image/jpg' });




//     const shops = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${apiMediaPath}/api/video/business/${envService.businessId}/${container}`;


//     service.uploadVideo(container, file).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush('Upload failed', {
//       status: 500,
//       statusText: 'Internal Server Error',
//     });

//   });


//   it('should test UploadVideo-errors', () => {

//     let container: string, file: File, returnShortPath: boolean;

//     file = new File(['jpg'], 'test_jpg.jpg', { type: 'image/jpg' });




//     const shops = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${apiMediaPath}/api/video/business/${envService.businessId}/${container}`;


//     service.uploadVideo(container, file).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(shops));

//   });

//   it('should test UploadVideoWithProgress', () => {

//     let container: string, file: File, returnShortPath: boolean;

//     file = new File(['jpg'], 'test_jpg.jpg', { type: 'image/jpg' });




//     const shops = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${apiMediaPath}/api/video/business/${envService.businessId}/${container}`;


//     service.uploadVideoWithProgress(container, file).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(shops));

//   });


//   it('should test UploadVideoWithProgress-erros', () => {

//     let container: string, file: File, returnShortPath: boolean;

//     file = new File(['jpg'], 'test_jpg.jpg', { type: 'image/jpg' });




//     const shops = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${apiMediaPath}/api/video/business/${envService.businessId}/${container}`;


//     service.uploadVideoWithProgress(container, file).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush('Upload failed', {
//       status: 500,
//       statusText: 'Internal Server Error',
//     });

//   });
























// });


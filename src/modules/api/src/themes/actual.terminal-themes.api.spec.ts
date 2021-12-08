// import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
// import { HttpClient } from '@angular/common/http';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { of } from 'rxjs';

// import { PebEnvService } from '@pe/builder-core';

// import { PebActualTerminalThemesApi } from './actual.terminal-themes.api';
// import { PEB_SHOPS_API_PATH } from '../shops/actual.shops.api';
// import { PEB_GENERATOR_API_PATH, PEB_STORAGE_PATH } from '../constants';
// import { BUILDER_MEDIA_API_PATH, PEB_MEDIA_API_PATH, PEB_STUDIO_API_PATH } from '../constants';
// import { PEB_BUILDER_POS_API_PATH } from '../pos/actual.pos.api';

// import { stringify } from 'querystring';


// describe('ThemesService', () => {
//   let service: PebActualTerminalThemesApi,
//     envService: PebEnvService,
//     http: HttpTestingController,
//     themeId: '1',
//     terminalId: any,
//     editorApiPath: string;
//   let payload: any;


//   beforeEach(() => {
//     const envServiceMock = {
//         businessId: '000',
//         shopId: 1,
//         terminalId:1,
//       };

//     TestBed.configureTestingModule({
//         imports: [
//             HttpClientTestingModule,
//           ],
//         providers: [
//             PebActualTerminalThemesApi,
//             {
//               provide: PEB_BUILDER_POS_API_PATH, useValue: 'PEB_BUILDER_POS_API_PATH, useValue',
//             },


//             {
//               provide: PebEnvService, useValue: envServiceMock,
//             },
//           ],
//       });

//     service = TestBed.get(PebActualTerminalThemesApi);
//     http = TestBed.get(HttpTestingController);
//     envService = TestBed.get(PebEnvService);
//     editorApiPath = TestBed.get(PEB_BUILDER_POS_API_PATH);

//   });

//   it('should call test service', () => {

//     expect(service).toBeDefined();
//   });

//   it('should get themes list', () => {

//     const themes = [
//         {
//           id: '001',
//         },
//         {
//           id: '002',
//         },
//       ];

//     const endpoint = `${editorApiPath}/business/${envService.businessId}/terminal/${envService.terminalId}/themes`;


//     service.getThemesList().subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(themes));

//   });


//   it('should get themes by id', () => {

//     const themes = [
//         {
//           id: '001',
//         },
//         {
//           id: '002',
//         },
//       ];



//     const endpoint = `${editorApiPath}/theme/${themeId}`;

//     service.getThemeById(themeId).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(themes));

//   });

//   it('should get getThemeTemplates', () => {

//     const themes = [
//         {
//           id: '001',
//         },
//         {
//           id: '002',
//         },
//       ];



//     const endpoint = `${editorApiPath}/api/templates`;

//     service.getTemplateThemes().subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(themes));

//   });

//   it('duplicateTemplateTheme', () => {

//     const themes = [
//         {
//           id: '001',
//         },
//         {
//           id: '002',
//         },
//       ];



//     const endpoint = `${editorApiPath}/business/${envSer
// vice.businessId}/terminal/${terminalId}/theme/${themeId}/duplicate`;

//     service.duplicateTemplateTheme('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PUT');

//     req.flush(of(themes));

//   });


//   it('deleteTemplateTheme', () => {

//     const themes = [
//         {
//           id: '001',
//         },
//         {
//           id: '002',
//         },
//       ];



//     const endpoint = `${editorApiPath}/business/${envService.businessId}/terminal/${terminalId}/theme/${themeId}`;

//     service.deleteTemplateTheme('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('DELETE');

//     req.flush(of(themes));

//   });

//   it('InstantSetup', () => {

//     const themes = [
//         {
//           id: '001',
//         },
//         {
//           id: '002',
//         },
//       ];



//     const endpoint = `${editorApiPath}/business/000/terminal/1/theme/1/instant-setup`;

//     service.instantInstallTemplateTheme('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PUT');

//     req.flush(of(themes));

//   });


//   it('install theme', () => {

//     const themes = [
//         {
//           id: '001',
//         },
//         {
//           id: '002',
//         },
//       ];



//     const endpoint = `${editorApiPath}/business/${en
// vService.businessId}/terminal/${terminalId}/theme/${themeId}/install`;

//     service.installTemplateTheme('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(themes));

//   });













// });

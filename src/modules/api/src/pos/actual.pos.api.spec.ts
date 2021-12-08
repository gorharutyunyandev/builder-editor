// import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
// import { HttpClient } from '@angular/common/http';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { of } from 'rxjs';

// import { PebEnvService } from '@pe/builder-core';

// import { PebActualPosApi, PEB_CONNECT_API_PATH } from './actual.pos.api';
// import { PEB_STORAGE_PATH } from '../constants';
// import { PEB_BUILDER_POS_API_PATH, PEB_POS_API_PATH } from './actual.pos.api';

// describe('PebActualProductsApi', () => {
//   let service: PebActualPosApi;
//   let  envService: PebEnvService,
//     http: HttpTestingController,
//     posApiPath: string;
//   let builderPosApiPath: string;
//   let connectApiPath: string;


//   beforeEach(() => {
//     const envServiceMock = {};

//     TestBed.configureTestingModule({
//       imports:[
//         HttpClientTestingModule,
//       ],
//       providers:[
//         PebActualPosApi,
//         {
//           provide: PEB_POS_API_PATH, useValue:'PEB_POS_API_PATH',
//         },

//         {
//           provide:  PEB_BUILDER_POS_API_PATH, useValue: 'PEB_BUILDER_POS_API_PATH',
//         },

//         {
//           provide: PEB_CONNECT_API_PATH, useValue: 'PEB_CONNECT_API_PATH',
//         },

//         {
//           provide: PebEnvService, useValue: envServiceMock,
//         },
//       ],
//     });

//     service = TestBed.get(PebActualPosApi);
//     http = TestBed.get(HttpTestingController);
//     envService = TestBed.get(PebEnvService);
//     posApiPath = TestBed.get(PEB_POS_API_PATH);
//     builderPosApiPath = TestBed.get(PEB_BUILDER_POS_API_PATH);
//     connectApiPath = TestBed.get(PEB_CONNECT_API_PATH);

//   });

//   it('should call test service', () => {

//     expect(service).toBeDefined();

//   });

//   it('should getTerminalslist', () => {

//     const pos = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${posApiPath}/business/${envService.businessId}/terminal`;


//     service.getTerminalsList().subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(pos));

//   });

//   it('should getTerminal', () => {

//     const pos = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${posApiPath}/business/${envService.businessId}/terminal/1`;


//     service.getSingleTerminal('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(pos));

//   });


//   it('should createTerminal', () => {

//     let payload: any;

//     const pos = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${posApiPath}/business/${envService.businessId}/terminal`;


//     service.createTerminal(payload).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(pos));

//   });

//   it('should deleteTerminal', () => {

//     let payload: any;

//     const pos = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${posApiPath}/business/${envService.businessId}/terminal/1`;


//     service.deleteTerminal('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('DELETE');

//     req.flush(of(pos));

//   });

//   it('should test updateTerminal', () => {

//     let payload: any;

//     const pos = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${posApiPath}/business/${envService.businessId}/terminal/${envService.terminalId}`;


//     service.updateTerminal('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PATCH');

//     req.flush(of(pos));

//   });

//   it('should test updateTerminal-Deploy', () => {

//     let  accessId: string,
//       payload: any;

//     const pos = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${posApiPath}/business/${envService.businessId}/terminal/access/${accessId}`;


//     service.updateTerminalDeploy(accessId, payload).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PATCH');

//     req.flush(of(pos));

//   });

//   it('should test getTerminalPreview', () => {

//     let  accessId: string,
//       payload: any;

//     const pos = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${posApiPath}/business/${envService.businessId}/terminal/1/preview`;


//     service.getTerminalPreview('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(pos));

//   });

//   it('should test markTerminalAsActive', () => {



//     const pos = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${posApiPath}/business/${envService.businessId}/terminal/1/active`;


//     service.markTerminalAsActive('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PATCH');

//     req.flush(of(pos));

//   });

//   it('should test getIntegrationsInfo', () => {



//     const pos = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${posApiPath}/business/1/integration`;


//     service.getIntegrationsInfo('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(pos));

//   });

//   it('should test getIntegrationInfo', () => {



//     const pos = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${posApiPath}/business/1/integration/1`;


//     service.getIntegrationInfo('1', '1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(pos));

//   });

//   it('should test getConnectIntegrationInfo', () => {
//     let integrationId: string;



//     const pos = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${connectApiPath}/integration/1`;


//     service.getConnectIntegrationInfo('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(pos));

//   });

//   it('should test getTerminalEnabledIntegrations', () => {



//     const pos = [
//       {
//         id: '001',
//       },
//       {
//         id: '002',
//       },
//     ];

//     const endpoint = `${posApiPath}/business/1/terminal/1/integration`;


//     service.getTerminalEnabledIntegrations('1', '1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(pos));

//   });



//   it('should test toggleTerminalIntegration-true', () => {

//     const pos = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${posApiPath}/business/1/terminal/1/integration/1/install`;


//     service.toggleTerminalIntegration('1', '1', '1', true).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PATCH');

//     req.flush(of(pos));

//   });

//   it('should test toggleTerminalIntegration-false', () => {

//     const pos = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${posApiPath}/business/1/terminal/1/integration/1/uninstall`;


//     service.toggleTerminalIntegration('1', '1', '1', false).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PATCH');

//     req.flush(of(pos));

//   });

//   it('should test getTerminalActiveTheme', () => {

//     let terminalId: string;

//     const pos = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${builderPosApiPath}/business/${envService.businessId}/terminal/${terminalId}/themes/active`;


//     service.getTerminalActiveTheme(terminalId).subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(pos));

//   });

//   it('should test getTerminalThemes', () => {

//     let terminalId: string;

//     const pos = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${builderPosApiPath}/business/1/terminal/1/themes`;


//     service.getTerminalThemes('1', '1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(pos));

//   });

//   it('should test getTerminalThemesVersions', () => {

//     let terminalId: string;

//     const pos = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${builderPosApiPath}/theme/1/versions`;


//     service.getTerminalThemeVersions('1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('GET');

//     req.flush(of(pos));

//   });

//   it('should test createTerminalThemesVersions', () => {

//     let terminalId: string;

//     const pos = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${builderPosApiPath}/theme/1/version`;


//     service.createTerminalThemeVersion('1', 'svire').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('POST');

//     req.flush(of(pos));

//   });


//   it('should test deleteTerminal', () => {

//     let terminalId: string;

//     const pos = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${builderPosApiPath}/theme/1/version/1`;


//     service.deleteTerminalThemeVersion('1', '1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('DELETE');

//     req.flush(of(pos));

//   });

//   it('should test publishTheme', () => {

//     let terminalId: string;

//     const pos = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${builderPosApiPath}/theme/1/version/1/publish`;


//     service.publishTerminalThemeVersion('1', '1').subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PUT');

//     req.flush(of(pos));

//   });


//   it('should test instantSetup', () => {

//     let terminalId: string;

//     const pos = [
//      {
//        id: '001',
//      },
//      {
//        id: '002',
//      },
//    ];

//     const endpoint = `${builderPosApiPath}/business/1/terminal/1/instant-setup`;


//     service.instantSetup().subscribe();

//     const req = http.expectOne(endpoint);

//     expect(req.request.method).toEqual('PUT');

//     req.flush(of(pos));

//   });





















// });

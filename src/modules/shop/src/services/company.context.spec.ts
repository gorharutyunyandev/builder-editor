// import { TestBed } from '@angular/core/testing';
// import { of } from 'rxjs';

// import { PebEditorApi } from '@pe/builder-api';
// import { PebElementContextState, PebEnvService } from '@pe/builder-core';

// import { CompanyContext } from './company.context';

// describe('CompanyContext', () => {

//   let companyContext: CompanyContext,
//     api: any,
//     envService: any;

//   beforeEach(() => {
//     const pebEditorApiSpy = jasmine.createSpyObj('PebEditorApi', ['getShop']);
//     const envServiceMock = {
//       shopId: '000',
//     };

//     TestBed.configureTestingModule({
//       providers: [
//         CompanyContext,
//         { provide: PebEditorApi, useValue: pebEditorApiSpy },
//         { provide: PebEnvService, useValue: envServiceMock },
//       ],
//     });

//     companyContext = TestBed.get(CompanyContext);
//     api = TestBed.get(PebEditorApi);
//     envService = TestBed.get(PebEnvService);
//   });

//   it('should be defined', () => {

//     expect(companyContext).toBeDefined('service is undefined');

//   });

//   it('should get logo - has picture', () => {

//     const shop = {
//       picture: 'https://images.unsplash.com/photo-1599008634401-92a2827a9a72?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMD
// d9&auto=format&fit=crop&w=500&q=60',
//     };

//     api.getShop.and.returnValue(of(shop));

//     companyContext.getLogo().subscribe(result => {
//       expect(result).toBeTruthy();
//       expect(result).toEqual({ state: PebElementContextState.Ready, data: { src: shop.picture } });
//     });

//     expect(api.getShop).toHaveBeenCalledWith(envService.shopId);
//     expect(api.getShop).toHaveBeenCalledTimes(1);

//   });

//   it('should get logo - no picture', () => {

//     api.getShop.and.returnValue(of({}));

//     companyContext.getLogo().subscribe(result => {
//       expect(result).toBeTruthy();
//       expect(result.state).toBe(PebElementContextState.Empty);
//     });

//     expect(api.getShop).toHaveBeenCalledWith(envService.shopId);
//     expect(api.getShop).toHaveBeenCalledTimes(1);
//   });

// });

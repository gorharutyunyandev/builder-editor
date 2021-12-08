// import { TestBed } from '@angular/core/testing';
// import { ActivatedRouteSnapshot, Router } from '@angular/router';
// import { of } from 'rxjs';

// import { PebEditorApi } from '@pe/builder-api';
// import { PebEnvService } from '@pe/builder-core';

// import { ShopResolver } from './shop.resolver';

// describe('ShopResolver', () => {

//   let resolver: ShopResolver,
//     api: any,
//     envService: any,
//     router: any;

//   beforeEach(() => {

//     const apiSpy = jasmine.createSpyObj('PebEditorApi', ['getShop']);
//     const envServiceMock = {
//       shopId: '000',
//     };
//     const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

//     TestBed.configureTestingModule({
//       providers: [
//         ShopResolver,
//         { provide: PebEditorApi, useValue: apiSpy },
//         { provide: PebEnvService, useValue: envServiceMock },
//         { provide: Router, useValue: routerSpy },
//       ],
//     });

//     resolver = TestBed.get(ShopResolver);
//     api = TestBed.get(PebEditorApi);
//     envService = TestBed.get(PebEnvService);
//     router = TestBed.get(Router);

//   });

//   it('should be defined', () => {

//     expect(resolver).toBeDefined();

//   });

//   it('should resolve route', () => {

//     const route = new ActivatedRouteSnapshot;
//     const shopMock = {
//       id: '000',
//       name: 'Test Name',
//     };

//     api.getShop.and.returnValue(of(shopMock));

//     const resultRoute = resolver.resolve(route);

//     resultRoute.subscribe(shop => {
//       expect(shop).toBe(shopMock);
//     });

//     expect(api.getShop).toHaveBeenCalledTimes(1);

//   });



// });

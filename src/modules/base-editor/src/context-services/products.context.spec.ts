// import { TestBed } from '@angular/core/testing';

// import { PebEditorApi } from '../../../api/src';
// import { ProductsContext } from './products.context';


// describe('Products Context', () => {

//   let service: ProductsContext;
//   let apiSpy: jasmine.SpyObj<PebEditorApi>;

//   const api = jasmine.createSpyObj('PebEditorApi', ['updateReplica']);

//   beforeEach(() => {

//     TestBed.configureTestingModule({
//       // Provide both the service-to-test and its (spy) dependency
//       providers: [
//         ProductsContext,
//         { provide: PebEditorApi, useValue: api },
//       ],
//     });

//     // Inject both the service-to-test and its (spy) dependency
//     service = TestBed.inject(ProductsContext);
//     apiSpy = TestBed.inject(PebEditorApi) as jasmine.SpyObj<PebEditorApi>;
//   });

//   it('should create a service', () => {

//     expect(service).toBeTruthy();

//   });

//   it('should get by ids', () => {
//     api.getProducts(1);

//     expect(service.getByIds).toBeTruthy();
//   });

//   it('should get products', () => {
//     expect(service.getProducts).toBeTruthy();
//   });

//   it('should get products', () => {
//     expect(service.getProductsCatalog).toBeTruthy();
//   });
// });

// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { of } from 'rxjs';

// import { PebProductsApi, PEB_PRODUCTS_API_PATH, PEB_STORAGE_PATH } from '@pe/builder-api';
// import { PebEnvService } from '@pe/builder-core';

// import { ProductsContext } from './products.context';

// describe('ProductsContext', () => {

//   let context: ProductsContext,
//     productsApi: any,
//     productsList: any,
//     categoriesList: any;

//   beforeEach(() => {

//     const productsListMock = [
//       {
//         state: 'ready',
//         data: {
//           title: 'Product detail',
//           description: '',
//           price: '',
//           salePrice: '',
//           currency: '',
//           images: [],
//           variants: [
//             {
//               id: '1',
//               title: '',
//               description: '',
//               price: '',
//               salePrice: '',
//               disabled: false,
//               options: [],
//               images: [],
//             },
//           ],
//         },
//       },
//       {
//         state: 'ready',
//         data: {
//           title: 'Product detail',
//           description: '',
//           price: '',
//           salePrice: '',
//           currency: '',
//           images: [],
//           variants: [
//             {
//               id: '2',
//               title: '',
//               description: '',
//               price: '',
//               salePrice: '',
//               disabled: false,
//               options: [],
//               images: [],
//             },
//           ],
//         },
//       },
//       {
//         state: 'ready',
//         data: {
//           title: 'Product detail',
//           description: '',
//           price: '',
//           salePrice: '',
//           currency: '',
//           images: [],
//           variants: [
//             {
//               id: '3',
//               title: '',
//               description: '',
//               price: '',
//               salePrice: '',
//               disabled: false,
//               options: [],
//               images: [],
//             },
//           ],
//         },
//       },
//       {
//         state: 'ready',
//         data: {
//           title: 'Product detail',
//           description: '',
//           price: '',
//           salePrice: '',
//           currency: '',
//           images: [],
//           variants: [
//             {
//               id: '4',
//               title: '',
//               description: '',
//               price: '',
//               salePrice: '',
//               disabled: false,
//               options: [],
//               images: [],
//             },
//           ],
//         },
//       },
//     ];

//     const categoriesListMock = [
//       {
//         id: 'cat001',
//         title: 'category',
//       },
//       {
//         id: 'cat002',
//         title: 'category 2',
//       },
//     ];

//     const productsApiSpy = jasmine.createSpyObj('PebProductsApi', [
//       'getProducts',
//       'getProductsCategories',
//       'getProductCategoriesByIds',
//       'getProductsByCategories',
//     ]);
//     const envServiceMock = {};

//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule,
//       ],
//       providers: [
//         ProductsContext,
//         { provide: PEB_PRODUCTS_API_PATH, useValue: 'PEB_PRODUCTS_API_PATH' },
//         { provide: PEB_STORAGE_PATH, useValue: 'PEB_STORAGE_PATH' },
//         { provide: PebProductsApi, useValue: productsApiSpy },
//         { provide: PebEnvService, useValue: envServiceMock },
//       ],
//     });

//     context = TestBed.get(ProductsContext);
//     productsApi = TestBed.get(PebProductsApi);

//     productsList = productsListMock;
//     categoriesList = categoriesListMock;

//   });

//   it('should be defined', () => {

//     expect(context).toBeDefined();

//   });

//   it('should get products by ids', () => {

//     const ids = ['1', '4'];
//     const filteredProducts = productsList.filter(product => {
//       const filteredVariants = product.data.variants.filter(variant => ids.find(id => id == variant.id));

//       return filteredVariants.length > 0;
//     });

//     productsApi.getProducts.and.returnValue(of(filteredProducts));

//     context.getByIds(['1', '2']).subscribe(result => {
//       expect(productsApi.getProducts).toHaveBeenCalledWith(['1', '2']);
//       expect(result).toBeTruthy();
//       expect(result.data.length).toBe(2);
//     });

//   });

//   it('should return product details', () => {

//     expect(context.getProductDetails()).toBeTruthy();

//   });

//   it('should return products', () => {

//     expect(context.getProducts()).toBeTruthy();

//   });

//   it('should getProductsCategories', () => {

//     const title = 'category';

//     productsApi.getProductsCategories.and.returnValue(of(categoriesList));

//     context.getProductsCategories(title).subscribe(categories => {
//       expect(categories.data.length).toBe(2);
//     });

//     const productsByCategories = {
//       cat001: [
//         productsList[0],
//       ],
//       cat002: [
//         productsList[1],
//       ],
//     };
//     productsApi.getProductsByCategories.and.returnValue(of(productsByCategories));

//     context.getProductsCategories(title, true).subscribe(categories => {
//       expect(categories.data[0].products.length).toBe(1);
//       expect(categories.data[0].products[0]).toEqual(productsList[0]);
//     });

//     productsApi.getProductsByCategories.and.returnValue(of({}));

//     context.getProductsCategories(title, true).subscribe(categories => {
//       expect(categories.data[0].products.length).toBe(0);
//     });

//   });

//   it('should getProductCategoriesByIds', () => {

//     const title = 'category';

//     categoriesList.pop();
//     productsApi.getProductCategoriesByIds.and.returnValue(of(categoriesList));

//     context.getProductCategoriesByIds(['cat001']).subscribe(categories => {
//       expect(categories.data.length).toBe(1);
//     });

//     const productsByCategories = {
//       cat001: [
//         productsList[0],
//       ],
//     };
//     productsApi.getProductsByCategories.and.returnValue(of(productsByCategories));

//     context.getProductCategoriesByIds(['cat001'], true).subscribe(categories => {
//       expect(categories.data[0].products.length).toBe(1);
//       expect(categories.data[0].products[0]).toEqual(productsList[0]);
//     });

//     productsApi.getProductsByCategories.and.returnValue(of({}));

//     context.getProductCategoriesByIds(['cat001'], true).subscribe(categories => {
//       expect(categories.data[0].products.length).toBe(0);
//     });

//   });

// });

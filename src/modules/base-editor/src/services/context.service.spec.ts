// import { TestBed } from '@angular/core/testing';
// import { Injector } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// import { ContextBuilder, RootState } from './context.service';

// describe('Context Service', () => {

//   let service: ContextBuilder;
//   let injSpy: jasmine.SpyObj<Injector>;

//   let stateSpy: any;
//   stateSpy = jasmine.createSpyObj('RootState', ['@search']);


//   beforeEach(() => {
//     const injector = jasmine.createSpyObj('Injector', ['get']);

//     TestBed.configureTestingModule({
//       // Provide both the service-to-test and its (spy) dependency
//       providers: [
//         ContextBuilder,
//         { provide: Injector, useValue: injector },
//       ],
//     });

//     // Inject both the service-to-test and its (spy) dependency
//     service = TestBed.inject(ContextBuilder);
//     injSpy = TestBed.inject(Injector) as jasmine.SpyObj<Injector>;
//   });

//   it('should create a service', () => {
//     expect(service).toBeTruthy();
//   });

//   it('', () => {

//   });

//   it('should clear cache', () => {
//     const cacheData = new Map();

//     cacheData.clear();

//     expect(service.clearCache).toBeTruthy();
//   });
// });

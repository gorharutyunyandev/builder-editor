// import { TestBed } from '@angular/core/testing';

// import { PebEditorApi } from '../../../api/src';
// import { CompanyContext } from './company.context';
// import { PebEnvService } from '../../../core/src';

// describe('Company Context', () => {

//   let service: CompanyContext;
//   let apiSpy: jasmine.SpyObj<PebEditorApi>;
//   let envSpy: jasmine.SpyObj<PebEnvService>;

//   const env = jasmine.createSpyObj('PebEnvService', ['shopId']);

//   beforeEach(() => {
//     const api = jasmine.createSpyObj('PebEditorApi', ['getActions', 'addAction']);

//     TestBed.configureTestingModule({
//       // Provide both the service-to-test and its (spy) dependency
//       providers: [
//         CompanyContext,
//         { provide: PebEditorApi, useValue: api },
//         { provide: PebEnvService, useValue: env },
//       ],
//     });
//     // Inject both the service-to-test and its (spy) dependency
//     service = TestBed.inject(CompanyContext);
//     apiSpy = TestBed.inject(PebEditorApi) as jasmine.SpyObj<PebEditorApi>;
//     envSpy = TestBed.inject(PebEnvService) as jasmine.SpyObj<PebEnvService>;
//   });

//   it('should create a service', () => {

//     expect(service).toBeTruthy();

//   });

//   it('should get logo from service', () => {
//     apiSpy.getShop(env.id);

//     expect(service.getLogo).toBeTruthy();
//   });

// });

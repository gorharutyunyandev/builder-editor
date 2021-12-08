// import { TestBed } from '@angular/core/testing';
// import { MatDialog } from '@angular/material/dialog';

// import { PebEditorThemeService } from './theme.service';
// import { PebEditorApi } from '../../../api/src';
// import { PebTheme } from '../../../core/src/models/database';

// describe('Theme Service', () => {

//   let service: PebEditorThemeService;
//   let apiSpy: jasmine.SpyObj<PebEditorApi>;
//   let dialogSpy: jasmine.SpyObj<MatDialog>;
//   let themeSpy: any;
//   let snapSpy: any;

//   const api = jasmine.createSpyObj('PebEditorApi', ['getActions', 'addAction']);
//   const dialog = jasmine.createSpyObj('MatDialog', ['open']);
//   themeSpy = jasmine.createSpyObj('PebTheme', ['next']);
//   snapSpy = jasmine.createSpyObj('PebShopThemeSnapshot', ['asObservable']);

//   beforeEach(() => {

//     TestBed.configureTestingModule({
//       // Provide both the service-to-test and its (spy) dependency
//       providers: [
//         PebEditorThemeService,
//         { provide: PebEditorApi, useValue: api },
//         { provide: MatDialog, useValue: dialog },
//       ],
//     });
//     // Inject both the service-to-test and its (spy) dependency
//     service = TestBed.inject(PebEditorThemeService);
//     apiSpy = TestBed.inject(PebEditorApi) as jasmine.SpyObj<PebEditorApi>;
//     dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
//   });

//   it('should create a service', () => {

//     expect(service).toBeTruthy();

//   });

//   it('should update page preview', () => {
//     api.updateThemeSourcePagePreviews();

//     themeSpy.subscribe((next) => {
//       expect(next).toEqual(1);
//     });

//     expect(service.updatePagePreview).toBeTruthy();
//   });

//   it('should get themes from Observable',  (done: DoneFn) => {
//     themeSpy.subscribe((value) => {

//       expect(value).toBe(name);

//       done();
//     });
//   });

//   it('should open a theme', () => {
//     themeSpy.subscribe((next) => {

//       expect(next).toEqual(service.theme);

//     });
//     snapSpy.subscribe((next) => {
//       expect(next).toEqual(service.snapshot);
//     });
//   });
// });

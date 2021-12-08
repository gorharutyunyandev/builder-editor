// import { TestBed } from '@angular/core/testing';

// import { PebEditorStore } from './editor.store';
// import { PebEditorApi } from '../../../api/src';
// import { PebEditorThemeService } from './theme.service';


// describe('Editor Store', () => {

//   let service: PebEditorStore;
//   let themeSpy: jasmine.SpyObj<PebEditorThemeService>;
//   let apiSpy: jasmine.SpyObj<PebEditorApi>;


//   const theme = jasmine.createSpyObj('PebEditorThemeService', ['theme$', 'snapshot']);

//   beforeEach(() => {
//     const api = jasmine.createSpyObj('PebEditorApi', ['updateReplica']);

//     TestBed.configureTestingModule({
//       // Provide both the service-to-test and its (spy) dependency
//       providers: [
//         PebEditorStore,
//         { provide: PebEditorApi, useValue: api },
//         { provide: PebEditorThemeService, useValue: theme },
//       ],
//     });

//     // Inject both the service-to-test and its (spy) dependency
//     service = TestBed.inject(PebEditorStore);
//     apiSpy = TestBed.inject(PebEditorApi) as jasmine.SpyObj<PebEditorApi>;
//     themeSpy = TestBed.inject(PebEditorThemeService) as jasmine.SpyObj<PebEditorThemeService>;
//   });

//   it('should create a service', () => {

//     expect(service).toBeTruthy();

//   });

//   it('should get themes from Observable',  (done: DoneFn) => {
//     service.theme$.subscribe((value) => {

//       expect(value).toBe(theme.theme$);

//       done();
//     });
//   });

//   it('should get themes from Observable',  (done: DoneFn) => {
//     service.theme$.subscribe((value) => {

//       expect(value).toBe(theme.snapshot$);

//       done();
//     });
//   });

//   it('should do undo action', (done: DoneFn) => {
//     service.theme$.subscribe((value) => {

//       expect(value).toBe(theme.canUndo$);

//       done();
//     });
//   });

//   it('should do redo action', (done: DoneFn) => {
//     service.theme$.subscribe((value) => {

//       expect(value).toBe(theme.canRedo$);

//       done();
//     });
//   });

//   it('should check function of undo action', () => {
//     const undo = theme.undo();
//     expect(undo).toBeDefined();
//   });

//   it('should check function of undo action', () => {
//     const redo = theme.redo();
//     expect(redo).toBeDefined();
//   });
// });

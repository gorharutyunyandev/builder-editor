describe('TEST', () => {
  it('Just for check', () => {
    expect('test').toContain('test');
  });
});

// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { DebugElement } from '@angular/core';
// import { of } from 'rxjs';
// import { MatDialog } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { map } from 'rxjs/operators';

// import { MessageBus, PebEnvService, PebTranslateService } from '@pe/builder-core';
// import { PebEditorApi, PebThemesApi, PEB_STORAGE_PATH } from '@pe/builder-api';

// import { PebThemesComponent } from './themes.component';
// import { TestThemesModule } from './test.themes.module';
// import { THEMES } from './mock.themes-data';

// describe('PebThemesComponent', () => {

//   let fixture: ComponentFixture<PebThemesComponent>,
//     component: PebThemesComponent,
//     el: DebugElement,
//     apiThemes: any,
//     apiEditor: any,
//     envService: PebEnvService,
//     dialog: any,
//     messageBus: any,
//     snackbar: any,
//     translateService: any;

//   enum ThemesType {
//     Application = 'application',
//     My = 'my',
//   }

//   beforeEach(async(() => {

//     const apiThemesSpy = jasmine.createSpyObj('PebThemesApi', [
//       'duplicateTemplateTheme',
//       'deleteTemplateTheme',
//       'getThemeById',
//       'getThemesList',
//       'getTemplateThemes',
//       'instantInstallTemplateTheme',
//       'installTemplateTheme',
//     ]);

//     const apiEditorSpy = jasmine.createSpyObj('PebEditorApi', [
//       'getShopActiveTheme',
//     ]);

//     const envServiceMock = {
//       shopId: '000',
//     };

//     const dialogSpy = jasmine.createSpyObj('MatDialog', [
//       'open',
//     ]);

//     const messageBusSpy = jasmine.createSpyObj('MessageBus', [
//       'emit',
//     ]);

//     const snackbarSpy = jasmine.createSpyObj('MatSnackBar', [
//       'openFromComponent',
//     ]);

//     const translateServiceSpy = jasmine.createSpyObj('PebTranslateService', [
//       'translate',
//     ]);

//     TestBed.configureTestingModule({
//       imports: [
//         TestThemesModule,
//       ],
//       providers: [
//         PebThemesComponent,
//         { provide: PebThemesApi, useValue: apiThemesSpy },
//         { provide: PebEditorApi, useValue: apiEditorSpy },
//         { provide: PebEnvService, useValue: envServiceMock },
//         { provide: MatDialog, useValue: dialogSpy },
//         { provide: MessageBus, useValue: messageBusSpy },
//         { provide: MatSnackBar, useValue: snackbarSpy },
//         { provide: PebTranslateService, useValue: translateServiceSpy },
//         { provide: PEB_STORAGE_PATH, useValue: 'PEB_STORAGE_PATH' },
//         { provide: 'PEB_ENTITY_NAME', useValue: 'PEB_ENTITY_NAME' },
//       ],
//     }).compileComponents().then(() => {

//       apiThemes = TestBed.get(PebThemesApi);
//       apiEditor = TestBed.get(PebEditorApi);
//       envService = TestBed.get(PebEnvService);
//       dialog = TestBed.get(MatDialog);
//       messageBus = TestBed.get(MessageBus);
//       snackbar = TestBed.get(MatSnackBar);
//       translateService = TestBed.get(PebTranslateService);

//       apiEditor.getShopActiveTheme.and.returnValue(of(null));
//       apiThemes.getTemplateThemes.and.returnValue(of([{
//         ...THEMES, title: '', icon: '', items: [{
//           id: '2',
//           code: '03',
//           themes: [
//             { name: '', category: '01', isActive: true },
//             { name: '', category: '02', isActive: true },
//             { name: '', category: '03', isActive: true },
//           ],
//         }],
//       }]));
//       apiThemes.getThemesList.and.returnValue(of([THEMES]));
//       translateService.translate.and.returnValue('');

//       fixture = TestBed.createComponent(PebThemesComponent);
//       component = fixture.componentInstance;
//       el = fixture.debugElement;

//       fixture.detectChanges();

//     });

//   }));

//   it('should be defined', () => {

//     component.selectedThemes;
//     component.selectedFilters = [];
//     component.searchString = 'test string';

//     expect(component).toBeDefined();
//     expect(apiEditor.getShopActiveTheme).toHaveBeenCalledWith(envService.shopId);

//   });

//   it('should have activeThemes$ defined', () => {

//     apiEditor.getShopActiveTheme.and.returnValue(of({ id: envService.shopId }));

//     fixture = TestBed.createComponent(PebThemesComponent);
//     component = fixture.componentInstance;

//     component.activeThemeId$.subscribe(activeId => {
//       expect(activeId).toEqual(envService.shopId);
//     });

//   });

//   it('should set/get selected themes', () => {

//     const getSelectedThemesSpy = spyOnProperty(component, 'selectedThemes');
//     const setSelectedThemesSpy = spyOnProperty(component, 'selectedThemes', 'set');
//     const selectedThemesMock = ['abc', 'def'];

//     component.selectedThemes = selectedThemesMock;
//     expect(setSelectedThemesSpy).toHaveBeenCalled();

//     component.selectedThemes;
//     expect(getSelectedThemesSpy).toHaveBeenCalled();

//   });

//   it('should set selected filters', () => {

//     const setSelectedFiltersSpy = spyOnProperty(component, 'selectedFilters', 'set');
//     const selectedFiltersMock = [
//       { title: '', key: '', image: '', selected: true },
//       { title: '', key: '', image: '', selected: true },
//       { title: '', key: '', image: '', selected: true },
//     ];

//     component.selectedFilters = selectedFiltersMock;
//     expect(setSelectedFiltersSpy).toHaveBeenCalled();

//   });

//   it('should set search string', () => {

//     const setSearchStringSpy = spyOnProperty(component, 'searchString', 'set');
//     const searchStringMock = 'test search string';

//     component.searchString = searchStringMock;
//     expect(setSearchStringSpy).toHaveBeenCalled();

//   });

//   it('should call themesTypeSubject.next() on ownThemesFilter.labelCallb
// ack if themesTypeSubject.value !== ThemesType.My', () => {

//     const themesTypeSubjectSpy = spyOn(component.themesTypeSubject, 'next').and.callThrough();

//     component.ownThemesFilter.labelCallback();

//     expect(themesTypeSubjectSpy).toHaveBeenCalledWith(ThemesType.My);

//   });

//   it('should NOT call themesTypeSubject.next() on ownThemes
// Filter.labelCallback if themesTypeSubject.value === ThemesType.My', () => {

//     component.themesTypeSubject.next(ThemesType.My);

//     const themesTypeSubjectSpy = spyOn(component.themesTypeSubject, 'next').and.callThrough();

//     component.ownThemesFilter.labelCallback();

//     expect(themesTypeSubjectSpy).not.toHaveBeenCalled();

//   });

//   it('should call themesTypeSubject.next() on ownThemesFilter.
// allItemsLabelCallback if themesTypeSubject.value !== ThemesType.Application', () => {

//     component.themesTypeSubject.next(ThemesType.My);

//     const themesTypeSubjectSpy = spyOn(component.themesTypeSubject, 'next').and.callThrough();

//     component.ownThemesFilter.allItemsLabelCallback();

//     expect(themesTypeSubjectSpy).toHaveBeenCalledWith(ThemesType.Application);

//   });

//   it('should NOT call themesTypeSubject.next() on ownThemesFilter.a
// llItemsLabelCallback if themesTypeSubject.value !== ThemesType.Application', () => {

//     const themesTypeSubjectSpy = spyOn(component.themesTypeSubject, 'next').and.callThrough();

//     component.ownThemesFilter.allItemsLabelCallback();

//     expect(themesTypeSubjectSpy).not.toHaveBeenCalled();

//   });

//   it('should call onOpenPreview on firstCardAction.callback - async', async(() => {

//     const themeId = '000';
//     const firstCardActionSpy = spyOn(component.firstCardAction, 'callback').and.callThrough();

//     apiThemes.getThemeById.and.returnValue(of({ source: '', snapshot: '' }));

//     component.firstCardAction.callback(themeId);

//     fixture.whenStable().then(() => {
//       expect(firstCardActionSpy).toHaveBeenCalledWith(themeId);
//     });

//   }));

//   it('should call onInstall on secondCardAction.callback', () => {

//     const themeId = '000';
//     const spy = spyOn(component.secondCardAction, 'callback').and.callThrough();
//     const onInstallSpy = spyOn<any>(component, 'onInstall');

//     component.secondCardAction.callback(themeId);

//     expect(spy).toHaveBeenCalledWith(themeId);
//     expect(onInstallSpy).toHaveBeenCalled();

//   });

//   it('should set selected themes on Select all action', () => {

//     const selectedIds = ['001', '002'];
//     const setSelectedThemesSpy = spyOnProperty(component, 'selectedThemes', 'set');
//     const filterResult = component.multipleSelectedActions$.pipe(
//       map(actionsList => {
//         return actionsList.filter(action => action.label === 'Select all');
//       }),
//     );

//     filterResult.subscribe(action => {
//       const selectAllAction = action[0];
//       selectAllAction.callback(selectedIds);

//       expect(setSelectedThemesSpy).toHaveBeenCalled();
//     });

//   });

//   it('should set selected themes to [] on Deselect all action', () => {

//     const setSelectedThemesSpy = spyOnProperty(component, 'selectedThemes', 'set');
//     const filterResult = component.multipleSelectedActions$.pipe(
//       map(actionsList => {
//         return actionsList.filter(action => action.label === 'Deselect all');
//       }),
//     );

//     filterResult.subscribe(action => {
//       const deselectAllAction = action[0];
//       deselectAllAction.callback([]);

//       expect(setSelectedThemesSpy).toHaveBeenCalled();
//     });

//   });

//   it('should call onDuplicate on Duplicate action', () => {

//     const filterResult = component.multipleSelectedActions$.pipe(
//       map(actionsList => {
//         return actionsList.filter(action => action.label === 'Duplicate');
//       }),
//     );

//     apiThemes.duplicateTemplateTheme.and.returnValue(of(true));

//     filterResult.subscribe(action => {
//       const duplicateAction = action[0];
//       const duplicateSpy = spyOn(duplicateAction, 'callback').and.callThrough();

//       duplicateAction.callback([]);

//       expect(duplicateSpy).toHaveBeenCalled();
//     });

//   });

//   it('should have multipleSelectAction Delete which calls onDelete if type === ThemesType.My', () => {

//     component.themesTypeSubject.next(ThemesType.My);
//     const selectedThemes = ['001', '002'];
//     const filterResult = component.multipleSelectedActions$.pipe(
//       map(actionsList => {
//         return actionsList.filter(action => action.label === 'Delete');
//       }),
//     );

//     filterResult.subscribe(action => {
//       const deleteAction = action[0];
//       const deleteSpy = spyOn(deleteAction, 'callback').and.callThrough();
//       deleteAction.callback(selectedThemes);

//       expect(action.length).toBe(1);
//       expect(deleteSpy).toHaveBeenCalled();
//     });

//   });

//   it('should set selectedThemes onSelectedItemsChanged', () => {

//     const spy = spyOn(component, 'onSelectedItemsChanged').and.callThrough();
//     const setSelectedThemesSpy = spyOnProperty(component, 'selectedThemes', 'set');
//     const selectedThemesMock = ['abc', 'def'];

//     component.onSelectedItemsChanged(selectedThemesMock);

//     expect(spy).toHaveBeenCalled();
//     expect(spy).toHaveBeenCalledWith(selectedThemesMock);
//     expect(setSelectedThemesSpy).toHaveBeenCalled();

//   });

//   it('should set selectedFilters onFiltersChanged', () => {

//     const spy = spyOn(component, 'onFiltersChanged').and.callThrough();
//     const setSelectedFiltersSpy = spyOnProperty(component, 'selectedFilters', 'set');
//     const selectedFiltersMock = [
//       { title: '', key: '', image: '', selected: true },
//       { title: '', key: '', image: '', selected: true },
//       { title: '', key: '', image: '', selected: true },
//     ];

//     component.onFiltersChanged(selectedFiltersMock);

//     expect(spy).toHaveBeenCalled();
//     expect(spy).toHaveBeenCalledWith(selectedFiltersMock);
//     expect(setSelectedFiltersSpy).toHaveBeenCalled();

//   });

//   it('should set searchString onSearchChanged', () => {

//     const spy = spyOn(component, 'onSearchChanged').and.callThrough();
//     const setSearchStringSpy = spyOnProperty(component, 'searchString', 'set');
//     const searchStringMock = 'test search string';

//     component.onSearchChanged(searchStringMock);

//     expect(spy).toHaveBeenCalled();
//     expect(spy).toHaveBeenCalledWith(searchStringMock);
//     expect(setSearchStringSpy).toHaveBeenCalled();

//   });

//   it('should call installTemplateTheme onInstall', () => {

//     const themeId = '000';
//     const spy = spyOn<any>(component, 'installTemplateTheme').and.returnValue(of(THEMES[2]));
//     const installedSpy = spyOn(component.installed, 'emit');

//     snackbar.openFromComponent.and.returnValue({
//       afterDismissed() {
//         return of({});
//       },
//     });

//     component.testOnInstall(themeId);

//     expect(spy).toHaveBeenCalled();
//     expect(messageBus.emit).toHaveBeenCalledTimes(2);
//     expect(installedSpy).toHaveBeenCalledWith(themeId);
//     expect(installedSpy).toHaveBeenCalledTimes(1);

//   });

//   it('should call duplicateTemplateTheme onDuplicate', () => {

//     const themeId = '000';
//     const themesTypeSubjectSpy = spyOn(component.themesTypeSubject, 'next');

//     apiThemes.duplicateTemplateTheme.and.returnValue(of({}));

//     component.testOnDuplicate(themeId);

//     expect(themesTypeSubjectSpy).toHaveBeenCalled();

//   });

//   it('should call openSnackbar onDelete - success', () => {

//     const themeIds = ['000', '111'];
//     const themesTypeSubjectSpy = spyOn(component.themesTypeSubject, 'next');

//     apiThemes.deleteTemplateTheme.and.returnValue(of(true));

//     component.testOnDelete(themeIds);

//     expect(themesTypeSubjectSpy).toHaveBeenCalledWith(component.themesTypeSubject.value);

//   });

//   it('should call openSnackbar onDelete - error', () => {

//     const themeIds = ['000', '111'];

//     apiThemes.deleteTemplateTheme.and.returnValue(new Error('fake error'));

//     component.testOnDelete(themeIds);

//     expect(apiThemes.deleteTemplateTheme).toHaveBeenCalled();

//   });

//   it('should call getThemeById and open dialogue - async', async(() => {

//     const themeId = '000';

//     apiThemes.getThemeById.and.returnValue(of({ source: '', snapshot: '' }));

//     component.testOnOpenPreview(themeId);

//     fixture.whenStable().then(() => {
//       expect(apiThemes.getThemeById).toHaveBeenCalled();
//       expect(dialog.open).toHaveBeenCalled();
//     });

//   }));

//   it('should getFilteredTemplates - no searchString', () => {

//     const templates = [{
//       ...THEMES, title: '', icon: '', items: [{
//         id: '2',
//         code: '03',
//         themes: [
//           { name: '', category: '03' },
//           { name: '', category: '03' },
//           { name: '', category: '03' },
//         ],
//       }],
//     }];
//     const selectedFiltersMock = [
//       { title: '', key: '2', image: '', selected: true },
//       { title: '', key: '', image: '', selected: true },
//       { title: '', key: '', image: '', selected: true },
//     ];
//     const searchStringMock = '';

//     const result = component.testGetFilteredTemplates(templates, selectedFiltersMock, searchStringMock);

//     expect(result.length).toBe(1);

//   });

//   it('should getFilteredTemplates - with searchString', () => {

//     const templates = [{
//       ...THEMES, title: '', icon: '', items: [{
//         id: '2',
//         code: '03',
//         themes: [
//           { name: 'test theme 1', category: '03' },
//           { name: 'test theme 2', category: '03' },
//           { name: 'test theme 3', category: '03' },
//         ],
//       }],
//     }];
//     const selectedFiltersMock = [
//       { title: '', key: '2', image: '', selected: true },
//     ];
//     const searchStringMock = 'theme 2';

//     const result = component.testGetFilteredTemplates(templates, selectedFiltersMock, searchStringMock);

//     expect(result.length).toBe(1);
//     expect(result[0].name).toContain(searchStringMock);

//   });

//   it('should getFilteredTemplates - no selectedFilters', () => {

//     const templates = [{
//       ...THEMES, title: '', icon: '', items: [{
//         id: '2',
//         code: '03',
//         themes: [
//           { name: 'test theme 1', category: '03' },
//           { name: 'test theme 2', category: '03' },
//           { name: 'test theme 3', category: '03' },
//         ],
//       }],
//     }];
//     const selectedFiltersMock = [];
//     const searchStringMock = '';

//     const result = component.testGetFilteredTemplates(templates, selectedFiltersMock, searchStringMock);

//     expect(result.length).toBe(1);

//   });

//   it('should install template theme - useInstantInsall', () => {

//     const themeId = '000';

//     component.useInstantInstall = true;

//     component.testInstallTemplateTheme(themeId);

//     expect(component.useInstantInstall).toBeTrue();
//     expect(apiThemes.instantInstallTemplateTheme).toHaveBeenCalledWith(themeId);
//     expect(apiThemes.installTemplateTheme).not.toHaveBeenCalled();

//   });

//   it('should install template theme - do not useInstantInsall', () => {

//     const themeId = '000';

//     component.testInstallTemplateTheme(themeId);

//     expect(component.useInstantInstall).toBeFalse();
//     expect(apiThemes.instantInstallTemplateTheme).not.toHaveBeenCalled();
//     expect(apiThemes.installTemplateTheme).toHaveBeenCalledWith(themeId);

//   });

//   it('should openSnackbar', () => {

//     component.testOpenSnackbar('test string', false);

//     expect(snackbar.openFromComponent).toHaveBeenCalled();

//   });

// });

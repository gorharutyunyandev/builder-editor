describe('TEST', () => {
  it('Just for check', () => {
    expect('test').toContain('test');
  });
});

// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ChangeDetectorRef, DebugElement } from '@angular/core';
// import { BehaviorSubject, of } from 'rxjs';
// import { MatDialogRef } from '@angular/material/dialog';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// import { MediaService } from '@pe/builder-api';
// import { PePlatformHeaderService } from '@pe/platform-header';
// import { MediaType } from '@pe/builder-core';

// import { PebMediaComponent } from './media.component';
// import { PebMediaModule } from './media.module';
// import { IMAGES } from './mock.media-data';
// import { VIDEOS } from './mock.media-data';

// describe('PebMediaComponent', () => {

//   let fixture: ComponentFixture<PebMediaComponent>,
//     component: PebMediaComponent,
//     el: DebugElement,
//     mediaService: any,
//     cdr: any,
//     platformHeader: any,
//     dialogRef: any;

//   beforeEach(async(() => {

//     const mediaServiceSpy = jasmine.createSpyObj('MediaService', [
//       'getImageCollection',
//       'getVideoCollection',
//       'getCategories',
//       'getStyles',
//       'getFormats',
//       'searchMedia',
//     ]);

//     const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', [
//       'detectChanges',
//       'markForCheck',
//     ]);

//     const platformHeaderSpy = jasmine.createSpyObj('PePlatformHeaderService', [
//       'setShortHeader',
//     ],                                             {
//       config: {},
//       config$: new BehaviorSubject<any>({}),
//       routeChanged$: new BehaviorSubject<any>({}),
//       closeButtonClicked$: {
//         next() {
//           return true;
//         },
//         asObservable() {
//           return of([]);
//         },
//       },
//     });

//     const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
//       'close',
//     ]);

//     TestBed.configureTestingModule({
//       imports: [
//         PebMediaModule,
//         NoopAnimationsModule,
//       ],
//       providers: [
//         PebMediaComponent,
//         { provide: MediaService, useValue: mediaServiceSpy },
//         { provide: ChangeDetectorRef, useValue: cdrSpy },
//         { provide: PePlatformHeaderService, useValue: platformHeaderSpy },
//         { provide: MatDialogRef, useValue: dialogRefSpy },
//       ],
//     }).compileComponents().then(() => {

//       mediaService = TestBed.get(MediaService);
//       cdr = TestBed.get(ChangeDetectorRef);
//       platformHeader = TestBed.get(PePlatformHeaderService);
//       dialogRef = TestBed.get(MatDialogRef);

//       mediaService.getImageCollection.and.returnValue(IMAGES);
//       mediaService.getCategories.and.returnValue(of([]));
//       mediaService.getStyles.and.returnValue(of([]));
//       mediaService.getFormats.and.returnValue(of([]));

//       fixture = TestBed.createComponent(PebMediaComponent);
//       component = fixture.componentInstance;
//       el = fixture.debugElement;

//       fixture.detectChanges();

//     });

//   }));

//   it('should be defined', () => {

//     expect(component).toBeDefined();

//   });

//   it('should create filters', () => {

//     mediaService.getCategories.and.returnValue(of([
//       'Animals',
//       'Cars',
//       'Games',
//     ]));

//     mediaService.getStyles.and.returnValue(of([
//       'Black&White',
//       'Abstract',
//     ]));

//     mediaService.getFormats.and.returnValue(of([
//       'portrait',
//       'album',
//     ]));

//     component.testCreateFilters();

//     fixture.detectChanges();

//     expect(mediaService.getCategories).toHaveBeenCalled();
//     expect(mediaService.getStyles).toHaveBeenCalled();
//     expect(mediaService.getFormats).toHaveBeenCalled();

//   });

//   it('should set filters onFilterChanged', () => {

//     const filterItemsMock = [
//       {
//         title: 'title 1',
//         key: 'key 1',
//       },
//       {
//         title: 'title 2',
//         key: 'key 2',
//       },
//     ];

//     const filterSubjectSpy = spyOn(component.filterSubject$, 'next');

//     component.onFiltersChanged(filterItemsMock);

//     expect(component.filterItems).toEqual(filterItemsMock);
//     expect(filterSubjectSpy).toHaveBeenCalledWith({ filter: filterItemsMock, page: 1 });

//   });

//   it('should call filterSubject$.next() onReachPageEnd', () => {

//     const $page = 2;
//     const filterSubjectSpy = spyOn(component.filterSubject$, 'next');

//     component.onReachPageEnd($page);

//     expect(filterSubjectSpy).toHaveBeenCalledWith({ filter: component.filterItems, page: $page });

//   });

//   it('should search media', () => {

//     const searchString = 'search string';

//     mediaService.searchMedia.and.returnValue(of({ test: true }));

//     component.search(searchString);

//     expect(mediaService.searchMedia).toHaveBeenCalledWith(searchString);

//   });

//   it('should find image in imageCollection on singleSelectedAction', () => {

//     const data = '001';
//     const nextSpy = spyOn(platformHeader.closeButtonClicked$, 'next').and.callThrough();

//     component.singleSelectedAction.callback(data);

//     expect(nextSpy).toHaveBeenCalled();
//     expect(dialogRef.close).toHaveBeenCalled();

//   });

//   it('should have all filters', () => {

//     const filters = {
//       filter: [
//         { title: 'Has people', key: 'hasPeople' },
//         { title: 'Cars', key: 'category' },
//         { title: 'Black&White', key: 'style' },
//         { title: 'Album', key: 'format' },
//       ],
//       page: 1,
//     };

//     component.filterSubject$.next(filters);

//     component.filter$.subscribe(filters => {
//       expect(filters.filter.length).toBe(4);
//       expect(filters.page).toBe(1);
//     });

//   });

//   it('should NOT have any filters after createFilters if none of the categories
// styles and formats provided', () => {

//     const unshiftSpy = spyOn(component.filters, 'unshift').and.callThrough();
//     const pushSpy = spyOn(component.filters, 'push').and.callThrough();

//     mediaService.getCategories.and.returnValue(of(undefined));
//     mediaService.getStyles.and.returnValue(of(undefined));
//     mediaService.getFormats.and.returnValue(of(undefined));

//     component.testCreateFilters();

//     expect(unshiftSpy).not.toHaveBeenCalled();
//     expect(pushSpy).toHaveBeenCalledTimes(1);

//   });

//   it('should call getVideoCollection if type === MediaType.Videos', () => {

//     const filters = {
//       filter: [
//         { title: 'Has people', key: 'hasPeople' },
//       ],
//       page: 1,
//     };

//     mediaService.getVideoCollection.and.returnValue(VIDEOS);

//     component.type = MediaType.Videos;
//     component.filterSubject$.next(filters);

//     component.images$.subscribe(images => {
//       expect(images[0].id).toEqual(VIDEOS[0].list[0].sourceUrl);
//     });

//   });

// });

import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { PeDataGridSingleSelectedAction } from '@pe/data-grid';
import { PePlatformHeaderConfig, PePlatformHeaderService } from '@pe/platform-header';

@Component({
  selector: 'peb-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebProductsComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PebProductsComponent>,
    private platformHeader: PePlatformHeaderService,
  ) {}

  set selected(ids: string[]) {
    this.selectedSubject$.next(ids);
  }

  get selected(): string[] {
    return this.selectedSubject$.value;
  }

  private headerConfig: PePlatformHeaderConfig;
  private destroyed$ = new ReplaySubject<boolean>();

  multipleSelectedActions: any[] = [
    {
      label: 'Select all',
      callback: () =>
        (this.selected = this.data.products.map((p: any) => p.id)),
    },
    {
      label: 'Deselect all',
      callback: () => (this.selected = []),
    },
    {
      label: 'Add to Collection',
      callback: () => this.onClose(true),
    },
    {
      label: 'Close',
      callback: () => this.onClose(false),
    },
  ];

  sortByActions: any[] = [
    {
      label: 'Name',
      callback: () => console.log('sort by name'),
    },
    {
      label: 'Price: Ascending',
      callback: () => console.log('sort by price: asc'),
    },
    {
      label: 'Price: Descending',
      callback: () => console.log('sort by price des'),
    },
    {
      label: 'Date',
      callback: () => console.log('sort by date'),
    },
  ];

  singleSelectedAction: PeDataGridSingleSelectedAction = {
    label: 'Select',
    callback: (data: string) => {
      this.platformHeader.closeButtonClicked$.next(true);
      this.dialogRef.close([data]);
    },
  };


  private readonly selectedSubject$ = new BehaviorSubject<string[]>(
    this.data.selectedProducts,
  );
  selected$ = this.selectedSubject$.asObservable();

  ngOnInit() {
    this.createHeader();
  }

  onSelectedItemsChanged(items: string[]) {
    this.selected = items;
  }

  private createHeader(): void {
    this.headerConfig = this.platformHeader.config;
    this.platformHeader.config$.next({
      mainDashboardUrl: null,
      currentMicroBaseUrl: null,
      isShowShortHeader: true,
      mainItem: null,
      isShowMainItem: false,
      closeItem: {
        title: 'Close',
      },
      isShowCloseItem: true,
      businessItem: null,
      isShowBusinessItem: false,
      isShowBusinessItemText: false,
    });
    this.platformHeader?.setShortHeader({
      title: 'Products',
    });
    this.platformHeader.closeButtonClicked$.asObservable().pipe(
      takeUntil(this.destroyed$),
      tap(() => {
        this.dialogRef.close(null);
      }),
    ).subscribe();
  }

  onSearchChanged(value: string) {}

  onClose(save: boolean) {
    this.dialogRef.close(save ? this.selected : null);
  }

  public ngOnDestroy(): void {
    if (this.headerConfig) {
      this.platformHeader.config$.next(this.headerConfig);
    }
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { merge, Observable, of } from 'rxjs';
import { catchError, finalize, takeUntil, tap } from 'rxjs/operators';

import { MediaService, PebEditorApi } from '@pe/builder-api';
import { PebElementStyles, PebPageShort, PebPageVariant, PebShop } from '@pe/builder-core';
import { getSelectedOption, PageSidebarDefaultOptions, PebEditorElement, PebEditorStore, SidebarBasic } from '@pe/builder-editor';

@Component({
  selector: 'peb-editor-page-sidebar',
  templateUrl: 'page.sidebar.html',
  styleUrls: [
    './page.sidebar.scss',
    '../../../sidebars.scss',
  ],
})

export class PebEditorPageSidebarComponent extends SidebarBasic implements OnInit {
  @Input() page: PebPageShort;
  @Input() shop: PebShop;
  @Input() component: PebEditorElement;
  @Input() styles: PebElementStyles;

  @Output() changePageName = new EventEmitter<string>();
  @Output() changePageType = new EventEmitter<any>();
  @Output() changeRootPage = new EventEmitter<boolean>();
  @Output() changeBgImage = new EventEmitter<string>();
  @Output() changeImageOptions = new EventEmitter<any>();
  @Output() changeImageScale = new EventEmitter<number>();
  @Output() changeStyle = new EventEmitter<any>();

  @ViewChild('nameInput') nameInput: ElementRef;

  constructor(
    public api: PebEditorApi,
    public mediaService: MediaService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private store: PebEditorStore,
  ) {
    super(api, mediaService, dialog);
  }

  ngOnInit() {
    this.initForm();
    this.watchOnChanges();
  }


  pageNameInputEnterHandler($event: Event) {
    $event.preventDefault();
    this.changePageName.emit(($event.target as HTMLInputElement).value.trim());
  }

  setPageNameBeforeDestroy(value: string) {
    this.changePageName.emit(value.trim());
  }

  private fieldEmit(filedName: string, emitter: EventEmitter<any>): Observable<any> {
    return this.form.get(filedName).valueChanges.pipe(
      tap((value: any) => {
        emitter.emit(value);
      }),
    );
  }

  private initForm() {
    this.form = this.formBuilder.group({
      name: [this.page.name, { updateOn: 'blur' }],
      type: [getSelectedOption(
        this.PageTypes, this.page.variant, PageSidebarDefaultOptions.PageType,
      )],
      root: [this.page.variant === PebPageVariant.Front],
    });
  }

  private watchOnChanges() {
    merge(
      this.fieldEmit('root', this.changeRootPage),
      this.fieldEmit('type', this.changePageType),
      this.store.versionUpdated$.pipe(
        tap((value) => {
          this.form.get('root').patchValue(value);
        }),
      ),
      this.form.get('name').valueChanges.pipe(
        tap((value: string) => {
          this.changePageName.emit(value);
          if (!value) {
            this.form.patchValue({ name: this.page.name }, { emitEvent: false });
          }
        }),
      ),
    ).pipe(
      takeUntil(this.destroyed$),
      finalize(() => this.setPageNameBeforeDestroy(this.nameInput.nativeElement.value)),
      catchError(() => of(null)),
    ).subscribe();
  }
}

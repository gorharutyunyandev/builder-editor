import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
  ViewChild,
} from '@angular/core';
import {
  filter,
  finalize,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, merge, of } from 'rxjs';

import { MessageBus, PebEnvService, PebShopContainer } from '@pe/builder-core';
import { PebEditorApi, PebShopsApi } from '@pe/builder-api';
import { PePlatformHeaderService } from '@pe/platform-header';

import { AbstractComponent } from '../../misc/abstract.component';
import { shopNameAsyncValidator } from '../../misc/helpers/shop-name-async.validator';

@Component({
  selector: 'peb-shop-create',
  templateUrl: './shop-create.component.html',
  styleUrls: ['./shop-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebShopCreateComponent extends AbstractComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('logo') logoEl: ElementRef;
  @ViewChild('logoWrapper') logoWrapperEl: ElementRef;

  @Input() showCreateButton = true;

  @Output() valid = new EventEmitter<boolean>();
  @Output() created = new EventEmitter<string>();
  @Output() loading = new EventEmitter<boolean>();

  private readonly isLoadingSubject = new BehaviorSubject(false);
  readonly isLoading$ = this.isLoadingSubject.asObservable();
  get isLoading() {
    return this.isLoadingSubject.getValue();
  }
  set isLoading(loading) {
    this.isLoadingSubject.next(loading);
  }
  form = this.formBuilder.group({
    name: this.formBuilder.control('', {
      validators: [Validators.required],
      asyncValidators: [shopNameAsyncValidator(this.apiShop, this.cdr, 'test')],
    }),
    picture: [''],
  });
  isLargeThenParent = false;
  uploadProgress = 0;

  get shopName(): string {
    return this.form.get('name').value;
  }

  constructor(
    private api: PebEditorApi,
    private apiShop: PebShopsApi,
    private cdr: ChangeDetectorRef,
    private envService: PebEnvService,
    private messageBus: MessageBus,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Optional() private platformHeader: PePlatformHeaderService,
  ) {
    super();
  }

  ngOnInit() {
    this.isLoading$.pipe(
      takeUntil(this.destroyed$),
      tap(loading => this.loading.emit(loading)),
    ).subscribe();
    this.platformHeader?.setShortHeader({
      title: 'Create shop',
    });
    merge(
      this.form.statusChanges.pipe(
        tap(() => this.valid.emit(this.form.valid)),
      ),
      this.form.statusChanges.pipe(
        tap((status) => {
          switch (status) {
            case 'INVALID':
              this.valid.emit(false);
              break;
            case 'VALID':
              this.valid.emit(true);
              break;
            default:
              break;
          }
        }),
      ),
    ).pipe(
      takeUntil(this.destroyed$),
    ).subscribe();
    if (this.envService.businessData?.name) {
      this.form.get('name').patchValue(this.envService.businessData.name);
    }
  }

  onLogoUpload($event: any) {
    const files = $event.target.files as FileList;

    if (files.length > 0) {
      this.isLoading = true;
      this.isLargeThenParent = false;
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.fileInput.nativeElement.value = '';

      reader.onload = () => {
        this.api.uploadImageWithProgress(PebShopContainer.Images, file).subscribe((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress: {
              this.uploadProgress = event.loaded;
              this.cdr.detectChanges();
              break;
            }
            case HttpEventType.Response: {
              this.form.patchValue({ picture: event.body.blobName || reader.result as string });
              this.isLoading = false;
              this.uploadProgress = 0;
              this.cdr.detectChanges();
              break;
            }
            default: break;
          }
        });
      };
    }
  }

  onLoad() {
    const logo: HTMLImageElement = this.logoEl.nativeElement;
    const logoWrapper: HTMLImageElement = this.logoWrapperEl.nativeElement;
    this.isLargeThenParent = logo.width >= logoWrapper.clientWidth || logo.height >= logoWrapper.clientHeight;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();
    this.form.disable();
    const body = this.form.value;
    if (body.picture === '') {
      delete body.picture;
    }
    body.name = body.name?.trim().toLowerCase();

    const validation$ = body.name !== this.envService.businessData?.name.trim().toLowerCase() ?
      this.apiShop.validateShopName(body.name).pipe(
        map(({ result }) => {
          if (!result) {
            this.isLoading = false;
            this.form.get('name').setErrors({ unique: true });
            this.cdr.detectChanges();
          }
          return result;
        }),
      ) : of(true);
    validation$.pipe(
      filter(valid  => !!valid),
      switchMap(() => this.apiShop.createShop(body)),
      tap(
        (shop: any) => {
          this.messageBus.emit('shop.created', shop.id);
          this.created.emit(shop.id);
          this.platformHeader?.setFullHeader();
        },
        () => this.form.enable(),
      ),
      finalize(() => {
        this.isLoading = false;
      }),
      takeUntil(this.destroyed$),
    ).subscribe();
  }
}

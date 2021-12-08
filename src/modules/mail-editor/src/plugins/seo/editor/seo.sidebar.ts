import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';
import { merge } from 'rxjs';

import { PebPageId, PebPageShort, PebPageVariant, PebShopRoute } from '@pe/builder-core';
import { AbstractComponent } from '@pe/builder-editor';

@Component({
  selector: 'peb-mail-editor-seo-sidebar',
  templateUrl: 'seo.sidebar.html',
  styleUrls: [
    '../../../../../base-plugins/sidebars.scss',
    './seo.sidebar.scss',
  ],
})
export class PebEditorMailSeoSidebarComponent extends AbstractComponent implements OnInit {
  @Input() page: PebPageShort;
  @Input() url: string;
  @Input() routing: PebShopRoute[];

  @Output() changeTitle = new EventEmitter<any>();
  @Output() changeUrl = new EventEmitter<string>();
  @Output() changeDescription = new EventEmitter<string>();
  @Output() changeShowInSearchResults = new EventEmitter<boolean>();
  @Output() changeCanonicalUrl = new EventEmitter<string>();
  @Output() changeMarkupData = new EventEmitter<string>();
  @Output() changeCustomMetaTags = new EventEmitter<string>();

  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    const { description, showInSearchResults, canonicalUrl, markupData, customMetaTags } = this.page.data?.seo ?? {};
    const initialValue = {
      description,
      showInSearchResults,
      canonicalUrl,
      markupData,
      customMetaTags,
      title: this.page.name,
      url: this.url,
    };

    // TODO: Move everything to behaviour;
    this.form = this.formBuilder.group({
      title: [initialValue.title, { updateOn: 'blur' }],
      url: [
        initialValue.url,
        {
          validators: [Validators.pattern(/^[\w\s\/\-\_]+$/), this.routingUrlValidator(this.routing, this.page?.id)],
          updateOn: 'blur',
        },
      ],
      description: [initialValue.description, { updateOn: 'blur' }],
      showInSearchResults: [initialValue.showInSearchResults, { updateOn: 'blur' }],
      canonicalUrl: [
        initialValue.canonicalUrl,
        { validators: [Validators.pattern(/^[\w\s\/\-\_]+$/)], updateOn: 'blur' },
      ],
      markupData: [initialValue.markupData, { updateOn: 'blur' }],
      customMetaTags: [initialValue.customMetaTags, { updateOn: 'blur' }],
    });


    if (this.page.variant === PebPageVariant.Front) {
      this.form.controls.url.disable();
    }

    merge(
      this.form.get('title').valueChanges.pipe(
        tap((value) => {
          this.changeTitle.emit({ name: value });
        }),
      ),
      this.form.get('url').valueChanges.pipe(
        tap((value) => {
          if (this.form.get('url').valid) {
            this.changeUrl.emit(value);
          }
        }),
      ),
      this.form.get('description').valueChanges.pipe(
        tap(value => this.changeDescription.emit(value)),
      ),
      this.form.get('showInSearchResults').valueChanges.pipe(
        tap(value => this.changeShowInSearchResults.emit(value)),
      ),
      this.form.get('canonicalUrl').valueChanges.pipe(
        tap((value) => {
          if (this.form.get('canonicalUrl').valid) {
            this.changeCanonicalUrl.emit(value);
          }
        }),
      ),
      this.form.get('markupData').valueChanges.pipe(
        tap(value => this.changeMarkupData.emit(value)),
      ),
      this.form.get('customMetaTags').valueChanges.pipe(
        tap(value => this.changeCustomMetaTags.emit(value)),
      ),
    ).pipe(
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  private routingUrlValidator(routing: PebShopRoute[], currentPageId: PebPageId): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const occupied = routing.filter(route => route.url === control.value && route.pageId !== currentPageId);
      return occupied.length ? { occupied: { value: control.value } } : null;
    };
  }
}

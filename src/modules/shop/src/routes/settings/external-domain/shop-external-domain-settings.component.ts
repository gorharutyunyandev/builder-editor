import { ChangeDetectionStrategy, Component, Inject, OnInit, Optional } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

import { PebEditorApi } from '@pe/builder-api';
import { PePlatformHeaderService } from '@pe/platform-header';

import { AbstractComponent } from '../../../misc/abstract.component';
import { PEB_SHOP_HOST } from '../../../constants';

@Component({
  selector: 'peb-shop-external-domain-settings',
  templateUrl: './shop-external-domain-settings.component.html',
  styleUrls: ['./shop-external-domain-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebShopExternalDomainSettingsComponent extends AbstractComponent implements OnInit {
  form: FormGroup;
  shopDeploy = this.activatedRoute.parent.snapshot.data?.shop?.accessConfig;
  loading: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apiService: PebEditorApi,
    private location: Location,
    @Optional() private platformHeader: PePlatformHeaderService,
    @Optional() @Inject(PEB_SHOP_HOST) private pebShopHost: string,
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      ownDomain: this.formBuilder.control(this.shopDeploy?.ownDomain, {
        validators: [
          Validators.required,
          domainValidator,
          ownDomainValidator(this.pebShopHost),
        ],
        updateOn: 'change',
      }),
    });
    this.form.get('ownDomain').valueChanges.pipe(
      takeUntil(this.destroyed$),
    ).subscribe();
    this.platformHeader?.setShortHeader({
      title: 'External domain',
    });
  }

  onSubmit() {
    this.form.disable();
    this.loading = true;

    const body = {
      internalDomain: this.shopDeploy?.internalDomain,
      isLive: this.shopDeploy?.isLive,
      isLocked: this.shopDeploy?.isLocked,
      isPrivate: this.shopDeploy?.isPrivate,
      ownDomain: this.shopDeploy?.ownDomain,
      privateMessage: this.shopDeploy?.privateMessage,
      ...this.form.value,
    };


    this.apiService.updateShopDeploy(
      this.activatedRoute.parent.snapshot.data.shop.id,
      body,
    ).pipe(
      tap((accessConfig) => {
        this.activatedRoute.parent.snapshot.data = {
          ...this.activatedRoute.parent.snapshot.data,
          shop: {
            ...this.activatedRoute.parent.snapshot.data.shop,
            accessConfig,
          },
        };
        this.loading = false;
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        this.platformHeader?.setFullHeader();
      }),
      catchError((e) => {
        this.form.enable();
        alert(e.error.message);
        this.loading = false;
        return EMPTY;
      }),
      takeUntil(this.destroyed$),
    ).subscribe();
  }
}

function domainValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const regExp = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
  if (!regExp.test(control.value)) {
    return { domain: true };
  }

  return null;
}

function ownDomainValidator(shopHost: string): ValidatorFn {
  return (control: FormControl) => {
    if (new RegExp(shopHost, 'i').test(control.value)) {
      return { ownDomain: 'The domain you entered was not valid' };
    }
    return null;
  };
}

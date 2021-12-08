import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import {
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { PebShopAccessConfig, PebShopsApi } from '@pe/builder-api';
import { PePlatformHeaderService } from '@pe/platform-header';
import { PebEnvService } from '@pe/builder-core';

import { AbstractComponent } from '../../../misc/abstract.component';

@Component({
  selector: 'peb-shop-internal-domain-settings',
  templateUrl: './shop-internal-domain-settings.component.html',
  styleUrls: ['./shop-internal-domain-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebShopInternalDomainSettingsComponent extends AbstractComponent implements OnInit {

  form: FormGroup;
  private initialShopAccessConfig$ = new BehaviorSubject<PebShopAccessConfig>(null);

  constructor(
    private formBuilder: FormBuilder,
    private apiShopsService: PebShopsApi,
    @Optional() private platformHeader: PePlatformHeaderService,
    private envService: PebEnvService,
  ) {
    super();
  }

  get dateAdded$(): Observable<string> {
    return this.initialShopAccessConfig$.pipe(
      filter(config => !!config),
      map(config => new Date(config.createdAt).toISOString().slice(0, 19).replace(/-/g, '/').replace('T', ' ')),
    );
  }

  ngOnInit() {
    this.platformHeader?.setShortHeader({
      title: 'payever domain',
    });

    this.form = this.formBuilder.group({
      internalDomain: this.formBuilder.control('', {
        validators: [Validators.required, domainValidator()],
      }),
    });

    this.apiShopsService.getSingleShop(this.envService.shopId).pipe(
      tap((shop) => {
        this.initialShopAccessConfig$.next(shop.accessConfig);

        this.form.get('internalDomain').setValue(shop.accessConfig.internalDomain);
        this.form.get('internalDomain').setValidators([
          Validators.required,
          domainValidator(shop.accessConfig.internalDomain),
        ]);
      }),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.form.disable();

    this.apiShopsService.updateShopAccessConfig(this.envService.shopId, this.form.value).pipe(
      tap(() => this.form.enable()),
      takeUntil(this.destroyed$),
    ).subscribe();
  }
}

function domainValidator(initialValue?: string): ValidatorFn {
  return (control: AbstractControl) => {
    if (!/^[A-Za-z0-9\d_-]*$/.test(control.value)) {
      return { domain: true };
    }

    if ((initialValue && initialValue === control.value) || !control.dirty) {
      return { theSameValue: true };
    }

    return null;
  };
}

import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { PePlatformHeaderService } from '@pe/platform-header';

import { AbstractComponent } from '../../../misc/abstract.component';

@Component({
  selector: 'peb-shop-connect-existing-domain',
  templateUrl: './connect-existing-domain.component.html',
  styleUrls: ['./connect-existing-domain.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebShopConnectExistingDomainComponent extends AbstractComponent implements OnInit {
  form: FormGroup;
  shopDeploy = this.activatedRoute.parent.snapshot.data?.shop?.accessConfig;
  loading: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    @Optional() private platformHeader: PePlatformHeaderService,
  ) {
    super();
  }

  ngOnInit() {
    this.platformHeader?.setShortHeader({
      title: 'Connect existing domain',
    });
    // this.form = this.formBuilder.group({
    //   ownDomain: this.formBuilder.control(this.shopDeploy?.ownDomain, {
    //     validators: [
    //       Validators.required,
    //       domainValidator,
    //       ownDomainValidator(this.pebShopHost),
    //     ],
    //     updateOn: 'change',
    //   }),
    // });
    // this.form.get('ownDomain').valueChanges.pipe(
    //   takeUntil(this.destroyed$),
    // ).subscribe();

  }

  onSubmit() {
  }
}

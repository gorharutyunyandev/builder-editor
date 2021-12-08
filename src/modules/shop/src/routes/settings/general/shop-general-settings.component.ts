import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { PebShopsApi } from '@pe/builder-api';
import { PebEnvService } from '@pe/builder-core';

import { AbstractComponent } from '../../../misc/abstract.component';

@Component({
  selector: 'peb-shop-general-settings',
  templateUrl: './shop-general-settings.component.html',
  styleUrls: ['./shop-general-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebShopGeneralSettingsComponent extends AbstractComponent {

  domains$ = this.pebShopsApi.getAllDomains(this.envService.shopId);
  isLive$ = this.pebShopsApi.checkIsLive(this.envService.shopId);

  constructor(
    private pebShopsApi: PebShopsApi,
    private envService: PebEnvService,
  ) {
    super();
  }

  onChangeIsLiveStatus(isLive: boolean) {
    this.pebShopsApi.patchIsLive(this.envService.shopId, isLive).pipe(
      takeUntil(this.destroyed$),
    ).subscribe();
  }

}

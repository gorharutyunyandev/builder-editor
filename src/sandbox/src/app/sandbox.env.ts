import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { BusinessInterface, PebEnvService } from '@pe/builder-core';

const DEFAULT_BUSINESS_ID = 'd74c23df-bfec-4341-b418-e579be0f58b7';
const DEFAULT_SHOP_ID = '9be6673f-cb0a-4d0b-9825-59a5d4460881';

@Injectable()
export class SandboxEnv implements PebEnvService {

  businessId = DEFAULT_BUSINESS_ID;
  protected shopId$: BehaviorSubject<string> = new BehaviorSubject<string>(DEFAULT_SHOP_ID);
  protected terminalId$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  get shopId(): string {
    return this.shopId$.value;
  }

  set shopId(value: string) {
    this.shopId$.next(value);
  }

  get terminalId(): string {
    return this.terminalId$.value;
  }

  set terminalId(value: string) {
    this.terminalId$.next(value);
  }

  get channelId(): string {
    return 'SANDBOX_CHANNEL';
  }

  businessData: BusinessInterface;
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'peb-video-icon',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 22" fill="#C9C9C9" width="55px" height="50px">
      <path d="M0 0h24v24H0V0z" fill="none"/>
      <path d="M9 7v8l7-4zm12-4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebVideoIcon {

}

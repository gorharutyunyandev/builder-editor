import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'peb-image-icon',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 68 68">
      <path fill="#C9C9C9" d="M7.556 0C3.4 0 0 3.4 0 7.556v52.888C0 64.6 3.4 68 7.556 68h52.888C64.6 68 68 64.6 68 60.444V7.556C68 3.4 64.6 0 60.444 0zm15.488 36.002c.756-1.02 2.267-1.02 3.023-.038l11.71 15.074 7.934-9.558c.793-.944 2.229-.907 2.947.076l9.406 12.088c.983 1.247.114 3.06-1.473 3.06H11.296c-1.55 0-2.456-1.775-1.512-3.022zM42.026 18.84c2.955 0 5.351 2.396 5.351 5.351s-2.396 5.351-5.35 5.351c-2.956 0-5.352-2.396-5.352-5.35 0-2.956 2.396-5.352 5.351-5.352z"/>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebImageIcon {

}

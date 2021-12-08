import { Component, Inject } from '@angular/core';

import { PebScreen } from '@pe/builder-core';

import { OverlayData, OVERLAY_DATA } from '../../overlay.data';

@Component({
  selector: 'peb-editor-screen-dialog',
  templateUrl: 'screen.dialog.html',
  styleUrls: ['./screen.dialog.scss'],
})
export class PebEditorScreenDialogComponent {

  PebScreen = PebScreen;

  constructor(
    @Inject(OVERLAY_DATA) public overlayData: OverlayData,
  ) {}

  setScreen(screen: PebScreen) {
    this.overlayData.emitter.next(screen);
  }
}

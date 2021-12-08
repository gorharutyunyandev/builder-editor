import { Component, Inject, OnInit } from '@angular/core';

import { PebPageType } from '@pe/builder-core';
import { EditorSidebarTypes, PebEditorState } from '@pe/builder-editor';

import { OverlayData, OVERLAY_DATA } from '../../overlay.data';
import { MailEditorSidebarTypes } from '../../../mail-editor.state';

@Component({
  selector: 'peb-mail-editor-view-dialog',
  templateUrl: 'view.dialog.html',
  styleUrls: ['./view.dialog.scss'],
})
export class PebEditorViewDialogComponent implements OnInit {
  // TODO(@dmlukichev): Make it better as you wanted and ping Berezin
  option = { ...EditorSidebarTypes, ...MailEditorSidebarTypes };

  options: { [key in EditorSidebarTypes | MailEditorSidebarTypes]: { disabled: boolean; active: boolean;} } = {
    [EditorSidebarTypes.Navigator]: {
      disabled: false,
      active: false,
    },
    [EditorSidebarTypes.Inspector]: {
      disabled: false,
      active: false,
    },
    [MailEditorSidebarTypes.EditMasterPages]: {
      disabled: false,
      active: false,
    },
    [EditorSidebarTypes.Layers]: {
      disabled: false,
      active: false,
    },
  };
  private state: PebEditorState;

  ngOnInit() {
    if (this.state.pagesView === PebPageType.Master) {
      this.options[MailEditorSidebarTypes.EditMasterPages].active = true;
    }
    this.options[EditorSidebarTypes.Navigator].active = this.state.sidebarsActivity[EditorSidebarTypes.Navigator];
    this.options[EditorSidebarTypes.Inspector].active = this.state.sidebarsActivity[EditorSidebarTypes.Inspector];
    this.options[EditorSidebarTypes.Layers].active = this.state.sidebarsActivity[EditorSidebarTypes.Layers];
  }

  constructor(
    @Inject(OVERLAY_DATA) public data: OverlayData,
  ) {
    this.state = data.data;
  }

  setValue(value: EditorSidebarTypes | MailEditorSidebarTypes): void {
    if (!this.options[value].disabled) {
      this.data.emitter.next(value);
    }
  }
}

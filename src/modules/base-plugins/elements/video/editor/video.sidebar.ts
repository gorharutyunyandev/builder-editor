import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';

import { MediaType } from '@pe/builder-core';
import {
  EditorVideoForm,
  PebAbstractSidebar,
  PebEditorElementPropertyAlignment,
  PebEditorElementVideo,
  SnackbarErrorService,
  VideoSubTab,
} from '@pe/builder-editor';

@Component({
  selector: 'peb-editor-video-sidebar',
  templateUrl: './video.sidebar.html',
  styleUrls: [
    './video.sidebar.scss',
    '../../../sidebars.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebEditorVideoSidebarComponent extends PebAbstractSidebar {

  MediaType = MediaType;
  VideoSubTab = VideoSubTab;

  alignment: PebEditorElementPropertyAlignment;

  @Input() component: PebEditorElementVideo;

  @ViewChild(EditorVideoForm) editorVideoForm: EditorVideoForm;

  constructor(
    private cdr: ChangeDetectorRef,
    private snackbarErrorService: SnackbarErrorService,
  ) {
    super();
  }

  openSnackbarError(data): void {
    this.snackbarErrorService.openSnackbarError(data);
  }
}

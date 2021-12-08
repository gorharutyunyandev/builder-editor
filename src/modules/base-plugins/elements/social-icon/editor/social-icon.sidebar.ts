import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PebElementDef, PebElementStyles } from '@pe/builder-core';
import { MediaService, PebEditorApi } from '@pe/builder-api';
import {
  FillType,
  PebEditorElement,
  PebEditorElementPropertyAlignment,
  SelectOption,
  SidebarBasic,
} from '@pe/builder-editor';

@Component({
  selector: 'peb-editor-social-icon-sidebar',
  templateUrl: './social-icon.sidebar.html',
  styleUrls: [
    './social-icon.sidebar.scss',
    '../../../sidebars.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebEditorSocialIconSidebarComponent extends SidebarBasic {

  @Input() component: PebEditorElement;
  @Input() element: PebElementDef;
  @Input() styles: PebElementStyles;

  alignment: PebEditorElementPropertyAlignment;

  readonly gridColors = ['#00a2ff', '#61d835', '#ee220d', '#f8ba00', '#ef5fa7', '#000000'];
  readonly fillTypes: SelectOption[] = [{ name: FillType.ColorFill }];

  constructor(
    api: PebEditorApi,
    mediaService: MediaService,
    dialog: MatDialog,
  ) {
    super(api, mediaService, dialog);
  }
}

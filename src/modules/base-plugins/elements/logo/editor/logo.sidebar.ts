import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

import { PebAbstractSidebar, PebEditorElementLogo, PebEditorElementPropertyAlignment } from '@pe/builder-editor';

import { predefinedStyles } from '../../image';

@Component({
  selector: 'peb-editor-logo-sidebar',
  templateUrl: 'logo.sidebar.html',
  styleUrls: [
    './logo.sidebar.scss',
    '../../../sidebars.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebEditorLogoSidebarComponent extends PebAbstractSidebar {
  @Input() component: PebEditorElementLogo;
  @Input() logoSrc?: string;

  predefinedStyles = predefinedStyles;
  alignment: PebEditorElementPropertyAlignment;
  onStyleChange(styles) {
    this.component.border.form.patchValue(styles.border);
    this.component.shadow.form.patchValue(styles.shadow);
  }
}

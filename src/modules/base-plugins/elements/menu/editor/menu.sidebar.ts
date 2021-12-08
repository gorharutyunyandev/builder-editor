import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PebAbstractSidebar, PebEditorElementMenu, PebEditorElementPropertyAlignment } from '@pe/builder-editor';

@Component({
  selector: 'peb-editor-menu-sidebar',
  templateUrl: 'menu.sidebar.html',
  styleUrls: ['./menu.sidebar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebEditorMenuSidebarComponent extends PebAbstractSidebar {
  @Input() component: PebEditorElementMenu;

  alignment: PebEditorElementPropertyAlignment;
}

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import {
  PebAbstractSidebar,
  PebEditorElementPropertyAlignment,
  PebEditorElementText,
  PebEditorTextMaker,
} from '@pe/builder-editor';

@Component({
  selector: 'peb-editor-text-sidebar',
  templateUrl: 'text.sidebar.html',
  styleUrls: ['./text.sidebar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebEditorTextSidebarComponent extends PebAbstractSidebar implements OnInit {
  @Input() component: PebEditorElementText;

  palette = ['#00a2ff', '#61d835', '#ee220d', '#f8ba00', '#ef5fa7', '#000000'].map(color => ({
    color,
    placeholder: 'Text',
  }));

  editMode$: Observable<boolean>;

  alignment: PebEditorElementPropertyAlignment;


  get backgroundControl(): FormControl {
    return this.component.background?.form.get('bgColor') as FormControl;
  }

  ngOnInit(): void {
    this.editMode$ = (this.component.target as PebEditorTextMaker).active$;
  }
}

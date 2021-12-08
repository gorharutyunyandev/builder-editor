import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
} from '@angular/core';

import { PebEditorTabComponent } from './tab.component';

@Component({
  selector: 'peb-editor-sidebar-tabs',
  template: `
    <div class="tabs">
      <div class="tab" *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active]="tab.active">
        {{ tab.title }}
      </div>
    </div>
    <div class="tab__wrapper">
        <div class="tab-content">
          <ng-content></ng-content>
        </div>
    </div>
  `,
  styleUrls: ['./tabs.component.scss'],
})
export class PebEditorTabsComponent implements AfterContentInit, OnChanges {
  @Input() set disabledScrollTabTitle(title: string) {
    this.disabledScrollTabTitleVariable = title;
    if (this.tabs) {
      const activeTabs = this.tabs.filter(tab => tab.active);
      this.disableScroll = activeTabs[0].title === title;
    }
  }

  @Input() activeTabIndex = 0;

  @ContentChildren(PebEditorTabComponent) tabs: QueryList<PebEditorTabComponent>;

  disableScroll = false;
  private disabledScrollTabTitleVariable: string;

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter(tab => tab.active);
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.toArray()[this.activeTabIndex]);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.activeTabIndex?.currentValue && this.tabs) {
      this.selectTab(this.tabs.toArray()[changes.activeTabIndex.currentValue]);
    }
  }

  selectTab(tab: any): void {
    this.tabs.toArray().forEach((t: PebEditorTabComponent) => t.active = false);
    tab.active = true;
    this.disableScroll = this.disabledScrollTabTitleVariable === tab.title;
  }
}

const HIDE_WARNING = { QueryList };

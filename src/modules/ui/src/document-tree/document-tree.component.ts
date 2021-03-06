import { animate, state, style, transition, trigger } from '@angular/animations';
import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { fromPairs } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { PebElementDef, PebElementType } from '@pe/builder-core';

@Component({
  selector: 'peb-ui-document-tree',
  templateUrl: './document-tree.component.html',
  styleUrls: ['./document-tree.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        opacity: 1,
      })),
      state('closed', style({
        opacity: 0.5,
      })),
      transition('open <=> closed', [
        animate('5s'),
      ]),
    ]),
  ],
})
export class PebDocumentTreeComponent implements OnInit, OnChanges {
  @Input() document: PebElementDef;
  @Input() screen: any; // PebScreen
  @Input() editor: any; // EditorState

  documentSubject$ = new BehaviorSubject<PebElementDef>(null);

  treeControl = new NestedTreeControl<PebElementDef>((node) => {
    return node.children;
  });
  dataSource = new ArrayDataSource(this.documentSubject$.pipe(
    map(val => [...val.children]),
  ));

  detailedNodes = [];

  expandedNodes = [];

  mappedPebElementType = fromPairs(Object.keys(PebElementType).map(
    key => [
      PebElementType[key],
      key === PebElementType.Document ? 'Page' : key,
    ],
  ));

  constructor() {
  }

  ngOnInit() {
    this.documentSubject$.next(this.document);
    this.expandedNodes = [this.document.id, ...this.document.children.map(node => node.id)];
  }

  ngOnChanges(changes) {
    this.documentSubject$.next(this.document);
  }

  hasChildren(i: number, node: PebElementDef) {
    return node.children && node.children.length > 0;
  }

  isDetailed(node: PebElementDef): boolean {
    return this.detailedNodes.includes(node.id);
  }

  isExpanded(node: PebElementDef): boolean {
    return this.expandedNodes.includes(node.id);
  }

  isVisible(node: PebElementDef): boolean {
    if (!node) {
      return false;
    }

    return node.style && node.style.display && node.style.display[this.screen] && node.style.display[this.screen] !== 'none';
  }

  visibleChildren(node: PebElementDef): number {
    return node.children.filter(child => this.isVisible(child)).length;
  }

  expandNode(node: PebElementDef) {
    this.expandedNodes = [...this.expandedNodes, node.id];
  }

  collapseNode(node: PebElementDef) {
    this.expandedNodes = this.expandedNodes.filter(id => id !== node.id);
  }

  toggleDetailed(node: PebElementDef) {
    if (this.detailedNodes.includes(node.id)) {
      this.detailedNodes = this.detailedNodes.filter(id => id !== node.id);
    } else {
      this.detailedNodes.push(node.id);
    }
  }

  markSelected(node: PebElementDef): void {
    if (!this.isVisible(node) || node.type === 'document') {
      return;
    }
    this.editor.selectedElements = [node.id];
  }
}

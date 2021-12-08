import { PebElementId, PebScreen } from '@pe/builder-core';

export interface PebDOMRect {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  offsetLeft: number;
  offsetTop: number;
}

export interface PebMargins {
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
}

export interface MaxPossibleDimensions {
  size: number;
  spaceStart: number;
  spaceEnd: number;
  start: number;
  end: number;
}

export interface PebEditorCommand {
  type: string;
  params?: any;
}

export type elementManipulation = 'delete' | 'copy' | 'paste';
export type sectionManipulation = 'moveUp' | 'moveDown' | 'removeSectionAfterMove' | 'markMovedSection';

export interface ElementManipulation {
  selectedElements?: PebElementId[];
  type: elementManipulation;
  screen?: PebScreen;
}

export interface SectionManipulation {
  selectedElements?: PebElementId[];
  type?: sectionManipulation;
  lastMovedSection?: PebElementId;
  screen?: PebScreen;
}

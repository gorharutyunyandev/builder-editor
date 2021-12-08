import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input } from '@angular/core';

import { PebElementType } from '@pe/builder-core';

import { PebEditorElement } from '../../renderer/editor-element';
import { PebAbstractEditor } from '../../root/abstract-editor';

export const THREE_ADD_SECTION_ANCHORS_MIN_SIZE = 20;

type AddSectionAnchorsVariant = 'default'|'invalid'|'hidden';

export const colorForAddSectionControl = (variant: AddSectionAnchorsVariant) => ({
  default: '#067AF1',
  invalid : '#ff1744',
  hidden: 'transparent',
}[variant]);

export enum AddSectionAnchorType {
  TopCenter = 'top-center',
  BottomCenter = 'bottom-center',
}

const SECTION_ADD_SECTION_ANCHOR_SIZE = {
  width: 20,
  height: 20,
};

@Component({
  selector: 'peb-editor-controls-add-section',
  templateUrl: './element-add-section.control.html',
  styleUrls: ['./element-add-section.control.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebEditorElementAddSectionControl {
  AddSectionAnchorType = AddSectionAnchorType;

  PebElementType = PebElementType;

  @Input()
  component: PebEditorElement;

  @Input()
  variant: 'default'|'invalid'|'hidden' = 'default';

  dimensions: {
    width: number;
    height: number;
    top: number;
    left: number;
  };

  anchorSize = 9;

  points = [];

  SECTION_ADD_SECTION_ANCHOR_SIZE = SECTION_ADD_SECTION_ANCHOR_SIZE;

  constructor(
    private elementRef: ElementRef,
    public cdr: ChangeDetectorRef,
  ) {}

  static construct(editor: PebAbstractEditor, element: PebEditorElement) {
    const control = editor.createControl(PebEditorElementAddSectionControl);

    control.instance.component = element;
    control.instance.detectChanges();

    element.controlsSlot.insert(control.hostView);
    element.controls.addsection = control;

    return control;
  }

  get elementDefinition() {
    return this.component.definition ?? (this.component as any)?.element; /* element or maker */
  }

  detectChanges() {
    // TODO: check
    if (!this.component?.nativeElement) {
      return;
    }

    const elementNode = this.component.nativeElement;
    const elementDs = elementNode.getBoundingClientRect();

    const borderWidth = elementNode.style.borderWidth ? parseInt(elementNode.style.borderWidth, 10) : 0;

    this.dimensions = {
      width: elementDs.width,
      height: elementDs.height,
      top: 0 - borderWidth,
      left: 0 - borderWidth,
    };

    this.points = this.createElementPoints();

    this.cdr.detectChanges();
  }

  get nativeElement() {
    return this.elementRef.nativeElement;
  }

  get elementId() {
    return this.elementDefinition.id;
  }

  get width() {
    return this.dimensions?.width;
  }

  get height() {
    return this.dimensions?.height;
  }

  get top() {
    return this.dimensions?.top;
  }

  get left() {
    return this.dimensions?.left;
  }

  get canShowThreeXAnchors() {
    return this.anchorSize * 3 <= this.width;
  }

  get canShowThreeYAnchors() {
    return this.anchorSize * 3 <= this.height;
  }

  get color() {
    return colorForAddSectionControl(this.variant);
  }

  addSection($event: Event, anchor_type: string) {
    $event.preventDefault();
    $event.stopPropagation();
    const after:boolean = (anchor_type === AddSectionAnchorType.BottomCenter)? true: false
    if ([PebElementType.Section].includes(this.elementDefinition.type)) { // Section element
      // ToDo: Add section
      // this.component.section.initialValue.isFirstSection = false;
      // this.component.section.form.get('newElement').patchValue(false);
    }
    
  }

  private createElementPoints() {
    const { width, height } = this.dimensions;

    const points = [
      {
        type: AddSectionAnchorType.TopCenter,
        x: (width / 2) - (
          // TODO: move sections anchor to own control
          [PebElementType.Section].includes(this.elementDefinition.type) ? SECTION_ADD_SECTION_ANCHOR_SIZE.width / 2 : 0
        ),
        y: 0,
        shown: width > THREE_ADD_SECTION_ANCHORS_MIN_SIZE,
      },
      {
        type: AddSectionAnchorType.BottomCenter,
        x: (width / 2) - (
          [PebElementType.Section].includes(this.elementDefinition.type) ? SECTION_ADD_SECTION_ANCHOR_SIZE.width / 2 : 0
        ),
        y: height,
        shown: width > THREE_ADD_SECTION_ANCHORS_MIN_SIZE,
      },
    ];

    return points;
  }
}

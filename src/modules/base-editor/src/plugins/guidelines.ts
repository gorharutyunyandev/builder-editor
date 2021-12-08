import { inRange } from 'lodash';

import {
  PebElementDef,
  PebElementType,
  pebFilterElementsDeep,
  PebScreen,
  PEB_DESKTOP_CONTENT_WIDTH
} from '@pe/builder-core';

import { PebEditorRenderer } from '../renderer/editor-renderer';
import { PebEditorElement } from '../renderer/editor-element';
import { PebDOMRect } from '../editor.typings';

const GUIDELINE_THICKNESS = 1;

const MAGNETIZING_THRESHOLD = 5;

export interface PebGuideline {
  top: number;
  left: number;
  width: number;
  height: number;
  type: PebGuidelineAxis;
}

export enum GuidelineMagnetizeType {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
  horizontal = 'horizontal',
  vertical = 'vertical',
}

export interface GuidelineCandidate extends PebGuideline {
  magnetizeType: GuidelineMagnetizeType;
}

export interface GuidelineWithMovement extends PebGuideline {
  dx: number;
  dy: number;
}

export enum PebGuidelineAxis {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

export interface Movement {
  dx: number;
  dy: number;
}

export interface PebGuidelineWithSections {
  [key: string /** SECTION ID */]: PebGuideline[];
}

export type PebGuidelineWithType = {
  [index in GuidelineMagnetizeType]: PebGuideline;
};

export type PebMovementWithMagnitizeType = {
  [index in GuidelineMagnetizeType]: number;
};

export function getMagnetizedGuidelines(
  guidelines: PebGuidelineWithSections,
  movement: Movement,
  initialRect: PebDOMRect,
  forSections: string[],
  scale: number,
): { left: GuidelineWithMovement, top: GuidelineWithMovement } {

  const nextPosition = {
    x: Math.round(initialRect.left + movement.dx),
    y: Math.round(initialRect.top + movement.dy),
  };

  const nextRect: PebDOMRect = {
    ...initialRect,
    width: initialRect.width,
    height: initialRect.height,
    top: nextPosition.y,
    right: (nextPosition.x + initialRect.width),
    bottom: (nextPosition.y + initialRect.height),
    left: nextPosition.x,
  };

  const guidelineCandidates: PebGuidelineWithType = getGuidelineCandidates(
    guidelines,
    forSections,
    nextRect,
  );

  const movementCandidates: GuidelineWithMovement[] = getMovementCandidates(
    guidelineCandidates,
    movement,
    nextRect,
  );

  const left = movementCandidates.filter(candidate => candidate.dx !== null).sort((a, b) => a.dx - b.dx)[0];
  const top = movementCandidates.filter(candidate => candidate.dy !== null).sort((a, b) => a.dy - b.dy)[0];

  return {
    left,
    top,
  };
}

export function getGuidelines(
  renderer: PebEditorRenderer,
  elementId: string,
): { [key: string /** sectionID */]: PebGuideline[] } {

  const sections: PebElementDef[] = renderer.element.children.filter((el) => {
    const component = renderer.getElementComponent(el.id);

    if (!component) {
      return false;
    }

    return component.styles?.display !== 'none' && component.definition.type === PebElementType.Section;
  });

  const documentElement = renderer.getElementComponent(renderer.element.id);

  if (!documentElement) {
    return {};
  }

  const documentRect = documentElement.getAbsoluteElementRect();

  const elements = pebFilterElementsDeep(renderer.getElementComponent(elementId).definition);

  const ignoreIds = [
    elementId,
    ...(elements?.length ? elements.map(child => child.id) : []),
  ];

  const guidelines = sections.reduce(
    (acc, section) => {

      const sectionElement = renderer.getElementComponent(section.id);

      if (!sectionElement) {
        return {};
      }

      const sectionRect = sectionElement.getAbsoluteElementRect();
      const { screen } = renderer.options;

      return {
        ...acc,
        [sectionElement.definition.id]: [
          {
            left: 0,
            top: documentRect.top,
            height: documentRect.height,
            width: GUIDELINE_THICKNESS,
            type: PebGuidelineAxis.vertical,
          },
          {
            left: ((screen === PebScreen.Desktop ? PEB_DESKTOP_CONTENT_WIDTH : sectionRect.width) / 2),
            top: documentRect.top,
            height: documentRect.height,
            width: GUIDELINE_THICKNESS,
            type: PebGuidelineAxis.vertical,
          },
          {
            left: (screen === PebScreen.Desktop ? PEB_DESKTOP_CONTENT_WIDTH : sectionRect.width),
            top: documentRect.top,
            height: documentRect.height,
            width: GUIDELINE_THICKNESS,
            type: PebGuidelineAxis.vertical,
          },
          {
            left: 0,
            top: sectionRect.top,
            height: GUIDELINE_THICKNESS,
            width: (screen === PebScreen.Desktop ? PEB_DESKTOP_CONTENT_WIDTH : sectionRect.width),
            type: PebGuidelineAxis.horizontal,
          },
          {
            left: 0,
            top: (sectionRect.top + (sectionRect.height / 2)),
            height: GUIDELINE_THICKNESS,
            width: (screen === PebScreen.Desktop ? PEB_DESKTOP_CONTENT_WIDTH : sectionRect.width),
            type: PebGuidelineAxis.horizontal,
          },
          {
            left: 0,
            top: (sectionRect.top + sectionRect.height),
            height: GUIDELINE_THICKNESS,
            width: (screen === PebScreen.Desktop ? PEB_DESKTOP_CONTENT_WIDTH : sectionRect.width),
            type: PebGuidelineAxis.horizontal,
          },
          ...pebFilterElementsDeep(section)
            .reduce(
              (accumulator, el) => {
                if (ignoreIds.find(id => id === el.id)) {
                  return accumulator;
                }

                const elementRect = renderer.getElementComponent(el.id)?.getAbsoluteElementRect();

                if (!elementRect) {
                  return accumulator;
                }

                return [
                  ...accumulator,
                  {
                    left: elementRect.left,
                    top: 0,
                    height: documentRect.height,
                    width: GUIDELINE_THICKNESS,
                    type: PebGuidelineAxis.vertical,
                  },
                  {
                    left: elementRect.right,
                    top: 0,
                    height: documentRect.height,
                    width: GUIDELINE_THICKNESS,
                    type: PebGuidelineAxis.vertical,
                  },
                  {
                    left: (elementRect.left + (elementRect.width / 2)),
                    top: 0,
                    height: documentRect.height,
                    width: GUIDELINE_THICKNESS,
                    type: PebGuidelineAxis.vertical,
                  },
                  {
                    left: 0,
                    top: elementRect.top,
                    height: GUIDELINE_THICKNESS,
                    width: (screen === PebScreen.Desktop ? PEB_DESKTOP_CONTENT_WIDTH : documentRect.width),
                    type: PebGuidelineAxis.horizontal,
                  },
                  {
                    left: 0,
                    top: elementRect.bottom,
                    height: GUIDELINE_THICKNESS,
                    width: (screen === PebScreen.Desktop ? PEB_DESKTOP_CONTENT_WIDTH : documentRect.width),
                    type: PebGuidelineAxis.horizontal,
                  },
                  {
                    left: 0,
                    top: (elementRect.top + (elementRect.height / 2)),
                    height: GUIDELINE_THICKNESS,
                    width: (screen === PebScreen.Desktop ? PEB_DESKTOP_CONTENT_WIDTH : documentRect.width),
                    type: PebGuidelineAxis.horizontal,
                  },
                ];
              },
              [],
            ),
        ],
      };
    },
    {},
  );

  return guidelines;
}

function getGuidelineCandidates(
  guidelines: PebGuidelineWithSections,
  forSections: string[],
  nextRect: PebDOMRect,
): PebGuidelineWithType {
  const guidelineCandidates: PebGuidelineWithType =
    forSections.reduce(
      (acc, sectionId) => ([...acc, ...(guidelines[sectionId] ? guidelines[sectionId] : [])]),
      [],
    ).reduce(
      (acc, guideline) => {
        const magnetizeType = checkGuidelineCandidateType(guideline, nextRect);

        if (magnetizeType && !acc[magnetizeType]) {
          return {
            ...acc,
            [magnetizeType]: guideline,
          };
        }

        return acc;
      },
      {
        [GuidelineMagnetizeType.top]: null,
        [GuidelineMagnetizeType.right]: null,
        [GuidelineMagnetizeType.bottom]: null,
        [GuidelineMagnetizeType.left]: null,
        [GuidelineMagnetizeType.horizontal]: null,
        [GuidelineMagnetizeType.vertical]: null,
      },
    );

  return guidelineCandidates;
}

function checkGuidelineCandidateType(guideline: PebGuideline, nextRect: PebDOMRect): GuidelineMagnetizeType {
  if (
    guideline.type === PebGuidelineAxis.horizontal
    && inRange(nextRect.top, guideline.top - MAGNETIZING_THRESHOLD, guideline.top + MAGNETIZING_THRESHOLD)
  ) {
    return GuidelineMagnetizeType.top;
  }

  if (
    guideline.type === PebGuidelineAxis.horizontal
    && inRange(
    nextRect.top + nextRect.height,
    guideline.top - MAGNETIZING_THRESHOLD,
    guideline.top + MAGNETIZING_THRESHOLD,
    )
  ) {
    return GuidelineMagnetizeType.bottom;
  }

  if (
    guideline.type === PebGuidelineAxis.horizontal
    && inRange(
    nextRect.top + (nextRect.height / 2),
    guideline.top - MAGNETIZING_THRESHOLD,
    guideline.top + MAGNETIZING_THRESHOLD,
    )
  ) {
    return GuidelineMagnetizeType.horizontal;
  }

  if (
    guideline.type === PebGuidelineAxis.vertical
    && inRange(nextRect.left, guideline.left - MAGNETIZING_THRESHOLD, guideline.left + MAGNETIZING_THRESHOLD)
  ) {
    return GuidelineMagnetizeType.left;
  }

  if (
    guideline.type === PebGuidelineAxis.vertical
    && inRange(nextRect.right, guideline.left - MAGNETIZING_THRESHOLD, guideline.left + MAGNETIZING_THRESHOLD)
  ) {
    return GuidelineMagnetizeType.right;
  }

  if (
    guideline.type === PebGuidelineAxis.vertical
    && inRange(
    nextRect.left + (nextRect.width / 2),
    guideline.left - MAGNETIZING_THRESHOLD,
    guideline.left + MAGNETIZING_THRESHOLD,
    )
  ) {
    return GuidelineMagnetizeType.vertical;
  }
}

function getMovementCandidates(
  guidelineCandidates: PebGuidelineWithType,
  movement: { dx: number; dy: number; },
  nextRect: PebDOMRect,
): GuidelineWithMovement[] {

  const magnetizedMovement: GuidelineWithMovement[] =
    Object.entries(guidelineCandidates).reduce(
      (acc, [key, value]) => {

        if (!value) {
          return acc;
        }

        if (key === GuidelineMagnetizeType.left) {
          return [
            ...acc,
            {
              ...value,
              dx: movement.dx - (nextRect.left - guidelineCandidates[GuidelineMagnetizeType.left].left),
              dy: null,
            },
          ];
        }

        if (key === GuidelineMagnetizeType.vertical) {
          return [
            ...acc,
            {
              ...value,
              dx: movement.dx - (
                nextRect.left
                - guidelineCandidates[GuidelineMagnetizeType.vertical].left
                + (nextRect.width / 2)
              ),
              dy: null,
            },
          ];
        }

        if (key === GuidelineMagnetizeType.right) {
          return [
            ...acc,
            {
              ...value,
              dx: movement.dx - (
                nextRect.left
                - guidelineCandidates[GuidelineMagnetizeType.right].left
                + nextRect.width
              ),
              dy: null,
            },
          ];
        }

        if (key === GuidelineMagnetizeType.top) {
          return [
            ...acc,
            {
              ...value,
              dx: null,
              dy: movement.dy - (nextRect.top - guidelineCandidates[GuidelineMagnetizeType.top].top),
            },
          ];
        }

        if (key === GuidelineMagnetizeType.horizontal) {
          return [
            ...acc,
            {
              ...value,
              dx: null,
              dy: movement.dy - (
                nextRect.top
                - guidelineCandidates[GuidelineMagnetizeType.horizontal].top
                + (nextRect.height / 2)
              ),
            },
          ];
        }

        if (key === GuidelineMagnetizeType.bottom) {
          return [
            ...acc,
            {
              ...value,
              dx: null,
              dy: movement.dy - (
                nextRect.top
                - guidelineCandidates[GuidelineMagnetizeType.bottom].top
                + nextRect.height
              ),
            },
          ];
        }

        return acc;
      },
      [],
    );

  return magnetizedMovement;
}


export function getParentSectionsForGuidelines(
  element: PebEditorElement,
  renderer: PebEditorRenderer,
): string[] {
  let currentElement: PebEditorElement = element;
  let parentSection: PebEditorElement = null;
  while (currentElement && !parentSection) {

    if (!currentElement.parent) {
      currentElement = null;
      continue;
    }

    if (currentElement.parent.definition.type === PebElementType.Section) {
      parentSection = currentElement.parent;
      continue;
    }

    currentElement = currentElement.parent;
  }

  const parentSectionIndex = renderer.element.children.findIndex(el => el.id === parentSection.definition.id);

  // TODO: check if its't display: none
  const guidelineSections = [
    parentSection.definition.id,
    ...(renderer.element.children[parentSectionIndex - 1]
        ? [renderer.element.children[parentSectionIndex - 1].id]
        : []
    ),
    ...(renderer.element.children[parentSectionIndex + 1]
        ? [renderer.element.children[parentSectionIndex + 1].id]
        : []
    ),
  ];

  return guidelineSections;
}

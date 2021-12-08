import { Inject, Injectable, Injector, NgZone } from '@angular/core';
import { combineLatest, fromEvent, merge, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { pebCreateLogger } from '@pe/builder-core';
import { PebRenderer } from '@pe/builder-renderer';

import { PebAbstractEditor } from '../root/abstract-editor';
import { PebEditorState } from './editor.state';
import { EDITOR_ENABLED_MAKERS, PebEditorEvents, PEB_EDITOR_STATE } from '../editor.constants';
import { PebEditorStore } from './editor.store';

const log = pebCreateLogger('editor:behaviors');

@Injectable()
export class PebEditorBehaviors {
  constructor(
    @Inject(EDITOR_ENABLED_MAKERS) private enabledMakers: any[],
    private store: PebEditorStore,
    @Inject(PEB_EDITOR_STATE) private state: PebEditorState,
    private zone: NgZone,
    private injector: Injector,
  ) { }

  readonly pageEmpty$ = combineLatest([
    this.store.snapshot$,
    this.store.activePageId$,
  ]).pipe(
    filter(([snapshot, activePageId]) =>
      !snapshot || !activePageId,
    ),
  );

  initEvents(editor: PebAbstractEditor, renderer: PebRenderer): PebEditorEvents {
    const bindOutside = <T>(target, event): Observable<T> => this.zone.runOutsideAngular(
      () => fromEvent(target, event),
    );
    const filterAnchorControlsEvents = (evt: MouseEvent) => {
      return renderer.shadowRoot
        .elementsFromPoint(evt.pageX, evt.pageY)
        .filter((el: HTMLElement) =>
          (el.tagName.toLowerCase() === 'circle' || el.tagName.toLowerCase() === 'svg') && el.classList.contains('anchor'))
        .length > 0;
    };

    const rendererNode = renderer.nativeElement;
    const contentContainerNode = editor.contentContainer.nativeElement;

    return {
      window: {
        click$: bindOutside<MouseEvent>(window, 'click'),
        dblclick$: bindOutside<MouseEvent>(window, 'dblclick'),
        mousemove$: bindOutside<MouseEvent>(window, 'mousemove'),
        mouseout$: bindOutside<MouseEvent>(window, 'mouseout'),
        mousedown$: bindOutside<MouseEvent>(window, 'mousedown'),
        mouseup$: bindOutside<MouseEvent>(window, 'mouseup'),
        mouseleave$: bindOutside<MouseEvent>(window, 'mouseleave'),
        keydown$: bindOutside<KeyboardEvent>(window, 'keydown'),
        keyup$: bindOutside<KeyboardEvent>(window, 'keyup'),
      },
      renderer: {
        click$: bindOutside<MouseEvent>(rendererNode, 'click'),
        dblclick$: bindOutside<MouseEvent>(rendererNode, 'dblclick'),
        mousemove$: bindOutside<MouseEvent>(rendererNode, 'mousemove'),
        mouseout$: bindOutside<MouseEvent>(rendererNode, 'mouseout'),
        mousedown$: bindOutside<MouseEvent>(rendererNode, 'mousedown').pipe(
          filter((evt: MouseEvent) => !filterAnchorControlsEvents(evt)),
        ),
        mouseup$: bindOutside<MouseEvent>(rendererNode, 'mouseup'),
        mouseleave$: bindOutside<MouseEvent>(rendererNode, 'mouseleave'),
      },
      contentContainer: {
        click$: bindOutside<MouseEvent>(contentContainerNode, 'click'),
        dblclick$: bindOutside<MouseEvent>(contentContainerNode, 'dblclick'),
        mousemove$: bindOutside<MouseEvent>(contentContainerNode, 'mousemove'),
        mouseout$: bindOutside<MouseEvent>(contentContainerNode, 'mouseout'),
        mousedown$: bindOutside<MouseEvent>(contentContainerNode, 'mousedown').pipe(
          filter((evt: MouseEvent) => !filterAnchorControlsEvents(evt)),
        ),
        mouseup$: bindOutside<MouseEvent>(contentContainerNode, 'mouseup'),
        mouseleave$: merge(
          bindOutside<MouseEvent>(contentContainerNode, 'mouseleave'),
          // bindOutside<MouseEvent>(toolbarNode, 'mouseenter'),
        ),
      },
      controls: {
        anchorMousedown$: bindOutside<MouseEvent>(rendererNode, 'mousedown').pipe(
          filter(filterAnchorControlsEvents),
        ),
      },
    };
  }
}

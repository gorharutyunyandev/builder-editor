import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
} from '@angular/core';
import { isArray } from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';



import { PebElementContext, PebElementDef, PebElementStyles } from '@pe/builder-core';
import { PebAbstractElement, PebRendererOptions } from '@pe/builder-renderer';
import { PebEditorRenderer } from '../renderer/editor-renderer';

@Component({
  selector: 'peb-element-maker-abstract',
  template: '',
})
export abstract class PebAbstractMaker extends PebAbstractElement implements OnDestroy, AfterViewInit {
  @Input() element: PebElementDef;
  @Input() styles: PebElementStyles;
  @Input() context: PebElementContext<any>;
  @Input() options: PebRendererOptions;

  @Output() changeElement = new EventEmitter<any>();
  @Output() changeStyle = new EventEmitter<any>();
  @Output() changeElementFinal = new EventEmitter<any>();
  @Output() changeStyleFinal = new EventEmitter<any>();

  childSlots: QueryList<any>;

  limits: {
    width: number,
    height: number,
  };

  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.applyStyles();
  }

  private abstractElementRef = this.injector.get(ElementRef);
  private abstractRenderer = this.injector.get(Renderer2);

  private editorRenderer = this.injector.get(PebEditorRenderer);
  
  get nativeElement() {
    return this.abstractElementRef.nativeElement;
  }

  get parent() {
    return this.editorRenderer.getElementComponent((this.element as any).parent.id)?.target;
  }

  protected abstract get elements(): { [key: string]: HTMLElement | HTMLElement[]};

  protected abstract get mappedStyles(): any;

  applyStyles() {
    if (this.elements) {
      Object.entries(this.elements).forEach(([name, element]) => {
        if (element) {
          const elementStyles =
            this.mappedStyles
            && this.mappedStyles[name]
              ? this.mappedStyles[name]
              : {};

          const elementsArr = isArray(element) ? element : [element];
          elementsArr.forEach(elem => Object.entries(elementStyles).forEach(
            ([prop, value]) => this.abstractRenderer.setStyle(elem, prop, value),
          ));
        }
      });
    }
  }

}

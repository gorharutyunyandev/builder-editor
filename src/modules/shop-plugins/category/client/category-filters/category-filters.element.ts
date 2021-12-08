import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

import { PebElementContext, PebElementContextState, PebElementDef, PebElementStyles } from '@pe/builder-core';
import { PebAbstractElement, PebRendererOptions } from '@pe/builder-renderer';

@Component({
  selector: 'peb-element-shop-category-filters',
  templateUrl: './category-filters.element.html',
  styleUrls: ['./category-filters.element.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebShopCategoryFiltersElement extends PebAbstractElement implements AfterViewInit {
  @Input() context: PebElementContext<any>;
  @Input() styles: PebElementStyles;
  @Input() options: PebRendererOptions;
  @Input() element: PebElementDef;

  @Output() toggleVariant: EventEmitter<any> = new EventEmitter();
  @Output() toggleCategory: EventEmitter<any> = new EventEmitter();
  @Output() toggleShownFilters: EventEmitter<any> = new EventEmitter();

  PebElementContextState = PebElementContextState;

  get elements(): { [key: string]: HTMLElement | HTMLElement[] } {
    return {
      host: this.nativeElement,
    };
  }

  get mappedStyles() {
    return {
      host: {
        borderColor: this.styles?.borderColor,
      },
    };
  }

  onToggleShownFilters(): void {
    if (!this.options.interactions) {
      return;
    }

    this.toggleShownFilters.emit();
  }

  onToggleVariant(value): void {
    if (!this.options.interactions) {
      return;
    }

    this.toggleVariant.emit(value);
  }

  onToggleCategory(value): void {
    if (!this.options.interactions) {
      return;
    }

    this.toggleCategory.emit(value);
  }

  // TODO: return after checking renderer's styling.
  ngAfterViewInit() {
    this.applyStyles();
  }

  @HostBinding('class')
  get hostClass() {
    return `screen-${this.options.screen}`;
  }
}

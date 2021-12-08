import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { animate, AnimationFactory, AnimationPlayer, style } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { PebElementDef, PebElementStyles, transformStyleProperty } from '@pe/builder-core';
import { PebAbstractElement, PebRendererOptions } from '@pe/builder-renderer';

import { PebRightArrowIcon } from './icons/right-arrow.icon';
import { PebLeftArrowIcon } from './icons/left-arrow.icon';

export interface PebElementCarousel extends PebElementDef {
  data: {
    images: string[];
  };
}

@Component({
  selector: 'peb-element-carousel',
  templateUrl: './carousel.element.html',
  styleUrls: ['./carousel.element.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebCarouselElement extends PebAbstractElement implements OnInit {
  @Input() element: PebElementDef;
  @Input() styles: PebElementStyles;
  @Input() options: PebRendererOptions;

  @ViewChild('spinnerWrapper') spinnerWrapperRef: ElementRef<HTMLElement>;

  private player: AnimationPlayer;
  private readonly controlsSize = 42;
  private readonly fontSize = 13;

  private readonly currentSlideSubject$ = new BehaviorSubject<number>(0);
  readonly currentSlide$ = this.currentSlideSubject$.asObservable();

  set currentSlide(val: number) {
    this.currentSlideSubject$.next(val);
  }

  get currentSlide() {
    return this.currentSlideSubject$.value;
  }

  @ViewChild('carousel') private carousel: ElementRef;
  @ViewChildren('control') private controls: QueryList<ElementRef>;
  @ViewChildren('controlIcon') private controlsIcons: QueryList<PebLeftArrowIcon | PebRightArrowIcon>;

  get elements(): { [key: string]: HTMLElement | HTMLElement[] } {
    return {
      host: this.nativeElement,
      wrapper: this.carousel ? this.carousel.nativeElement : null,
      controls: this.controls ? this.controls.toArray().map(a => a.nativeElement) : null,
      controlsIcons: this.controlsIcons ? this.controlsIcons.toArray().map(a => a.elementRef.nativeElement) : null,
      spinnerWrapper: this.spinnerWrapperRef?.nativeElement,
    };
  }

  get mappedStyles() {
    const styles = this.styles;
    const { scale } = this.options;

    return {
      host: {
        width: transformStyleProperty(styles.width ?? '100%', scale),
        height: transformStyleProperty(styles.height ?? '100%', scale),
      },
      wrapper: {
        width: this.getCarouselWidth(),
      },
      controls: {
        width: transformStyleProperty(this.controlsSize, scale),
        height: transformStyleProperty(this.controlsSize, scale),
      },
      controlsIcons: {
        width: transformStyleProperty(9, scale),
        height: transformStyleProperty(16, scale),
      },
      spinnerWrapper: {
        fontSize: transformStyleProperty(this.fontSize, scale),
      },
    };
  }

  ngOnInit() {
    this.currentSlide$.pipe(
      tap(() => {
        if (this.carousel) {
          this.transitionCarousel();
        }
      }),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  getImage(src: string) {
    return this.sanitizer.bypassSecurityTrustStyle(`url('${src}')`);
  }

  getCarouselWidth() {
    if (!this.element.data.images || !this.element.data.images.length) {
      return;
    }
    return `calc(100% * ${this.element.data.images.length})`;
  }

  nextSlide(event: Event) {
    event.preventDefault();

    if (this.currentSlide === this.element.data.images.length - 1) {
      const arr = [...this.element.data.images];
      const first = arr.shift();
      this.element.data.images = [...arr, first];

      this.currentSlide = this.currentSlide - 1;
      this.transitionCarousel(0);
    }

    this.currentSlide = (this.currentSlide + 1) % this.element.data.images.length;
    this.transitionCarousel();
  }

  previousSlide(event: Event) {
    event.preventDefault();

    if (this.currentSlide === 0) {
      const last = this.element.data.images.pop();
      this.element.data.images = [last, ...this.element.data.images];

      this.currentSlide = this.currentSlide + 1;
      this.transitionCarousel(0);
    }

    this.currentSlide = (this.currentSlide - 1 + this.element.data.images.length) % this.element.data.images.length;
    this.transitionCarousel();
  }

  transitionCarousel(time?: number) {
    const offset = this.currentSlide * this.nativeElement.offsetWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset, time);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }

  private buildAnimation(offset: number, time: number) {
    return this.animationBuilder.build([
      animate(time !== undefined ? time : '250ms ease-in', style({ transform: `translateX(-${offset}px)` })),
    ]);
  }
}

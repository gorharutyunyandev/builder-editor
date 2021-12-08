import { Injectable } from '@angular/core';

import { pebFontFamilies } from '@pe/builder-core';

import * as WebFont from 'webfontloader';

const defaultWeights = '400,700';

@Injectable({ providedIn: 'root' })
export class FontLoaderService {
  constructor() {
    this.registerInitialFonts();
  }
  private registerInitialFonts() {
    const fonts = pebFontFamilies.map(font => `${font.value}:${defaultWeights}`);
    localStorage.setItem('fonts', JSON.stringify(fonts));
  }
  public renderFontLoader(context = null) {
    const fonts = this.getFonts();
    if (!fonts) {
      return;
    }

    if (fonts.length > 0) {
      WebFont.load({
        context,
        google: {
          families: fonts,
        },
      });
    }
  }

  private getFonts(): string[] {
    return JSON.parse(localStorage.getItem('fonts') ?? '[]');
  }

  public registerFont(newFont: string) {
    const fonts = this.getFonts();
    if (!fonts) {
      return;
    }

    const nextFont = `${newFont}:${defaultWeights}`;
    if (!fonts.includes(nextFont)) {
      fonts.push(nextFont);
    }

    localStorage.setItem('fonts', JSON.stringify(fonts));
    this.renderFontLoader();
  }
}

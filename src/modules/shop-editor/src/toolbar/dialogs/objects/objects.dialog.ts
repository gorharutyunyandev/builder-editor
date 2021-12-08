import { Component, Inject } from '@angular/core';

import { PebElementSocialIconType, PebElementType } from '@pe/builder-core';
import { PebShapeVariant } from '@pe/builder-base-plugins';
import { PebCartVariant } from '@pe/builder-shop-plugins';

import { OverlayData, OVERLAY_DATA } from '../../overlay.data';

enum Categories {
  Objects = 'Objects',
  Buttons = 'Buttons',
  Menu = 'Menu',
  // Disable these categories
  // Map = 'Map',
  // Search = 'Search',
  Cart = 'Cart',
  Misc = 'Misc',
  SocialMediaIcons = 'Social',
}

const defaultIconStyle = {
  width: 24,
  height: 24,
};

const OBJECT_CATEGORIES: {[index in Categories]: ObjectCategory[]} = {
  [Categories.Objects]: [
    ...Object
      .values(PebShapeVariant)
      .map<ObjectCategory>((shape: string) => ({ variant: shape, type: PebElementType.Shape })),
    // { variant: PebElementType.Line, type: PebElementType.Line } as any,
  ],
  [Categories.Buttons]: [
    {
      variant: PebElementType.Button,
      type: PebElementType.Button,
      style: {
        borderRadius: '0',
      },
    },
    {
      variant: `${PebElementType.Button}--rounded`,
      type: PebElementType.Button,
      style: {
        borderRadius: '15',
      },
    },
  ],
  [Categories.Menu]: [
    {
      variant: PebElementType.Menu,
      type: PebElementType.Menu,
      icon: 'menu',
    },
  ],
  [Categories.Cart]: [
    ...Object
      .values(PebCartVariant)
      .map<ObjectCategory>((shape: string) => ({ variant: shape, type: PebElementType.Cart })),
  ],
  [Categories.Misc]: [
    { variant: PebElementType.Logo, type: PebElementType.Logo },
  ],
  [Categories.SocialMediaIcons]: [
    {
      variant: PebElementSocialIconType.Instagram,
      type: PebElementType.SocialIcon,
      data: { link: '', type: PebElementSocialIconType.Instagram },
      style: defaultIconStyle,
    },
    {
      variant: PebElementSocialIconType.Facebook,
      type: PebElementType.SocialIcon,
      data: { link: '', type: PebElementSocialIconType.Facebook },
      style: defaultIconStyle,
    },
    {
      variant: PebElementSocialIconType.Youtube,
      type: PebElementType.SocialIcon,
      data: { link: '', type: PebElementSocialIconType.Youtube },
      style: defaultIconStyle,
    },
    {
      variant: PebElementSocialIconType.LinkedIn,
      type: PebElementType.SocialIcon,
      data: { link: '', type: PebElementSocialIconType.LinkedIn },
      style: defaultIconStyle,
    },
    {
      variant: PebElementSocialIconType.Google,
      type: PebElementType.SocialIcon,
      data: { link: '', type: PebElementSocialIconType.Google },
      style: defaultIconStyle,
    },
    {
      variant: PebElementSocialIconType.Twitter,
      type: PebElementType.SocialIcon,
      data: { link: '', type: PebElementSocialIconType.Twitter },
      style: defaultIconStyle,
    },
    {
      variant: PebElementSocialIconType.Telegram,
      type: PebElementType.SocialIcon,
      data: { link: '', type: PebElementSocialIconType.Telegram },
      style: defaultIconStyle,
    },
    {
      variant: PebElementSocialIconType.Messenger,
      type: PebElementType.SocialIcon,
      data: { link: '', type: PebElementSocialIconType.Messenger },
      style: defaultIconStyle,
    },
    {
      variant: PebElementSocialIconType.Pinterest,
      type: PebElementType.SocialIcon,
      data: { link: '', type: PebElementSocialIconType.Pinterest },
      style: defaultIconStyle,
    },
    {
      variant: PebElementSocialIconType.Dribble,
      type: PebElementType.SocialIcon,
      data: { link: '', type: PebElementSocialIconType.Dribble },
      style: defaultIconStyle,
    },
    {
      variant: PebElementSocialIconType.TikTok,
      type: PebElementType.SocialIcon,
      data: { link: '', type: PebElementSocialIconType.TikTok },
      style: defaultIconStyle,
    },
    {
      variant: PebElementSocialIconType.WhatsApp,
      type: PebElementType.SocialIcon,
      data: { link: '', type: PebElementSocialIconType.WhatsApp },
      style: defaultIconStyle,
    },
    {
      variant: PebElementSocialIconType.Mail,
      type: PebElementType.SocialIcon,
      data: { link: '', type: PebElementSocialIconType.Mail },
      style: defaultIconStyle,
    },
  ],
};

export interface ObjectCategory {
  type: PebElementType;
  variant?: string;
  style?: any;
  icon?: string;
  data?: any;
  setAfter?: boolean;
}

interface Category {
  name: string;
  objects: ObjectCategory[];
}

@Component({
  selector: 'peb-shop-editor-objects-dialog',
  templateUrl: 'objects.dialog.html',
  styleUrls: ['./objects.dialog.scss'],
})
export class PebEditorObjectsDialogComponent {
  readonly categories: Category[] = Object.values(Categories)
    .map((category: Categories) => {
      return {
        name: category,
        objects: OBJECT_CATEGORIES[category],
      };
    });
  readonly socialIconType = PebElementSocialIconType;
  readonly elementType = PebElementType;

  searchObject = '';
  selectedCategory: Category = this.categories[0];

  constructor(
    @Inject(OVERLAY_DATA) public data: OverlayData,
  ) {}

  onSearchObject(searchValue: string): void {
    // TODO: Implement searching objects by `searchValue`
  }

  choseCategory(category: Category): void {
    this.selectedCategory = category;
  }

  addObject(objectCategory: ObjectCategory): void {
    this.data.emitter.next(objectCategory);
  }
}

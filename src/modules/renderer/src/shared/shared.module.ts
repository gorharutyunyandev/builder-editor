import { NgModule } from '@angular/core';

import { PebRendererControlsSlot } from './slots/controls.slot';
import { PebRendererChildrenSlot } from './slots/children.slot';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { CurrencySignPipe } from './pipes/currency-sign.pipe';
import { CurrencyFormatterPipe } from './pipes/currency-formatter.pipe';
import { PebProductIcon } from '../elements/icons/product.icon';
import { PebPlusIcon } from '../elements/icons/plus.icon';
import { PebFiltersIcon } from '../elements/icons/filters.icon';
import { PebImageIcon } from '../elements/icons/image.icon';
import { PebVideoIcon } from '../elements/icons/video.icon';
import { PebGridIcon } from '../elements/icons/grid.icon';
import { PebMobileFilterIcon } from '../elements/icons/mobile-filter.icon';
import { PebSortByIcon } from '../elements/icons/sort-by.icon';
import { PebMagnifierIcon } from '../elements/icons/magnifier.icon';
import { PebDefaultProductIcon } from '../elements/icons/default-product.icon';
import { PebNoLogoIcon } from '../elements/icons/no-logo.icon';
import { PebSocialInstagramIcon } from '../elements/icons/social-instagram.icon';
import { PebSocialFacebookIcon } from '../elements/icons/social-facebook.icon';
import { PebSocialYoutubeIcon } from '../elements/icons/social-youtube.icon';
import { PebSocialLinkedInIcon } from '../elements/icons/social-linkedin.icon';
import { PebSocialGoogleIcon } from '../elements/icons/social-google.icon';
import { PebSocialTwitterIcon } from '../elements/icons/social-twitter.icon';
import { PebSocialTelegramIcon } from '../elements/icons/social-telegram.icon';
import { PebSocialMessengerIcon } from '../elements/icons/social-messenger.icon';
import { PebSocialPinterestIcon } from '../elements/icons/social-pinterest.icon';
import { PebSocialDribbleIcon } from '../elements/icons/social-dribble.icon';
import { PebSocialTikTokIcon } from '../elements/icons/social-tik-tok.icon';
import { PebSocialWhatsappIcon } from '../elements/icons/social-whatsapp.icon';
import { PebSocialMailIcon } from '../elements/icons/social-mail.icon';

const pipes = [
  SafeHtmlPipe,
  SafeUrlPipe,
  CurrencySignPipe,
  CurrencyFormatterPipe,
];

const ICONS = [
  PebProductIcon,
  PebPlusIcon,
  PebFiltersIcon,
  PebImageIcon,
  PebVideoIcon,
  PebGridIcon,
  PebMobileFilterIcon,
  PebSortByIcon,
  PebMagnifierIcon,
  PebDefaultProductIcon,
  PebNoLogoIcon,
  PebSocialInstagramIcon,
  PebSocialFacebookIcon,
  PebSocialYoutubeIcon,
  PebSocialLinkedInIcon,
  PebSocialGoogleIcon,
  PebSocialTwitterIcon,
  PebSocialTelegramIcon,
  PebSocialMessengerIcon,
  PebSocialPinterestIcon,
  PebSocialDribbleIcon,
  PebSocialTikTokIcon,
  PebSocialWhatsappIcon,
  PebSocialMailIcon,
];

@NgModule({
  declarations: [
    PebRendererControlsSlot,
    PebRendererChildrenSlot,
    ...pipes,
    ...ICONS,
  ],
  exports: [
    PebRendererControlsSlot,
    PebRendererChildrenSlot,
    ...pipes,
    ...ICONS,
  ],
})
export class PebRendererSharedModule {}

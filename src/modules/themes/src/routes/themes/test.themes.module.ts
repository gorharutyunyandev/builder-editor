import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PebThemesRootComponent } from '../../root/root-themes.component';
import { PebThemesComponent } from './themes.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PebThemesComponent,
    PebThemesRootComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class TestThemesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { OverlayModule as CdkOverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxHmCarouselModule } from 'ngx-hm-carousel';
import { MatButtonModule } from '@angular/material/button';

import { ColorPickerModule } from '@pe/color-picker';

import { PebEditorIconsModule } from '../misc/icons/_icons.module';
import { PebEditorCarouselComponent } from './_old/carousel/carousel.component';
import { PebEditorNumberInputComponent } from './_old/number-input/number-input.component';
import { PebEditorSliderComponent } from './_old/slider/slider.component';
import { PebEditorAnglePickerComponent } from './_old/angle-picker/angle-picker.component';
import { PebEditorBorderSelectComponent } from './_old/border-select/border-select.component';
import { PebEditorArrangeTabComponent } from './_old/arrange-tab/arrange-tab.component';
import { PebEditorSelectComponent } from './_old/select/select.component';
import { PebEditorMediaTabComponent } from './_old/media-tab/media-tab.component';
import { PebEditorGradientPickerComponent } from './_old/gradient-picker/gradient-picker.component';
import { PebEditorColorPickerComponent } from './_old/color-picker/color-picker.component';
import { PebEditorColorPaletteComponent } from './_old/color-palette/color-palette.component';
import { PebEditorSVGBorderSelectComponent } from './_old/svg-border-select/svg-border-select.component';
import { PebEditorAccordionDirective } from './_old/accordion/accordion.directive';
import { ClickAndHoldDirective } from '../misc/directives/click-and-hold.directive';
import { SidebarNumberInput } from './inputs/number/number.input';
import { SidebarTextInput } from './inputs/text/text.input';
import { EditorAlignmentForm } from './forms/alignment/alignment.form';
import { EditorDimensionsForm } from './forms/dimensions/dimensions.form';
import { EditorProportionDimensionsForm } from './forms/proportion-dimensions/proportion-dimensions.form';
import { EditorPositionForm } from './forms/position/position.form';
import { EditorImageForm } from './forms/image/image.form';
import { EditorVideoForm } from './forms/video/video.form';
import { SidebarFileInput } from './inputs/file/file.input';
import { EditorOpacityForm } from './forms/opacity/opacity.form';
import { SidebarSliderInput } from './inputs/slider/slider.input';
import { PebEditorSidebarStylePresetsComponent } from './presets/style/style.presets';
import { PebEditorExpandablePanelComponent } from './ui/expandable-panel/expandable-panel.component';
import { EditorShadowForm } from './forms/shadow/shadow.form';
import { EditorBackgroundForm } from './forms/background/background.form';
import { EditorFontForm } from './forms/font/font.form';
import { PebEditorDynamicFieldsComponent } from './ui/dynamic-fields/dynamic-fields.component';
import { EditorMenuRoutesForm } from './forms/menu-routes/menu-routes.form';
import { SidebarSelectInput } from './inputs/select/select.input';
import { SidebarOptionSelect } from './inputs/select/select.option';
import { PebEditorDynamicFieldComponent } from './ui/dynamic-fields/dynamic-field.component';
import { EditorProportionsForm } from './forms/proportions/proportions.form';
import { EditorBorderForm } from './forms/border/border.form';
import { SidebarCheckboxInput } from './inputs/checkbox/checkbox.input';
import { SidebarColorPickerSpectrumPaletteInput } from './inputs/color-picker-spectrum-palette/color-picker-spectrum-palette.input';
import { ColorPickerOverlayComponent } from './inputs/color-picker-spectrum-palette/color-picker-spectrum-palette-overlay/color-picker-overlay.component';
import { EditorCategoriesForm } from './forms/categories/categories.form';
import { ButtonToggleInput } from './inputs/button-toggle/button-toggle.input';
import { EditorJustifyInput } from './inputs/justify/justify.input';
import { EditorTextLinkForm } from './forms/text-link/text-link.form';
import { EditorLinkForm } from './forms/link/link.form';
import { EditorStudioMediaForm } from './forms/studio-media/studio-media.form';
import { EditorRotationForm } from './forms/rotation-form/rotation.form';
import { EditorImageAdjustmentForm } from './forms/image-adjustment/image-adjustment.form';
import { EditorDescriptionForm } from './forms/description/description.form';
import { PebEditorTabComponent, PebEditorTabsComponent } from './ui';

import 'hammerjs';
import { NgScrollbarModule } from 'ngx-scrollbar';

const components = [
  PebEditorAnglePickerComponent,
  PebEditorBorderSelectComponent,
  PebEditorCarouselComponent,
  PebEditorNumberInputComponent,
  PebEditorSliderComponent,
  PebEditorArrangeTabComponent,
  PebEditorSelectComponent,
  PebEditorMediaTabComponent,
  PebEditorGradientPickerComponent,
  PebEditorColorPickerComponent,
  PebEditorColorPaletteComponent,
  PebEditorSVGBorderSelectComponent,
  PebEditorAccordionDirective,
  ClickAndHoldDirective,
  PebEditorSidebarStylePresetsComponent,
  PebEditorExpandablePanelComponent,
  PebEditorDynamicFieldsComponent,
  PebEditorDynamicFieldComponent,
  ColorPickerOverlayComponent,
];

const inputs = [
  SidebarNumberInput,
  SidebarFileInput,
  SidebarSliderInput,
  SidebarTextInput,
  SidebarSelectInput,
  SidebarOptionSelect,
  SidebarCheckboxInput,
  SidebarColorPickerSpectrumPaletteInput,
  ButtonToggleInput,
];

const forms = [
  EditorAlignmentForm,
  EditorDimensionsForm,
  EditorPositionForm,
  EditorProportionDimensionsForm,
  EditorRotationForm,
  EditorImageForm,
  EditorVideoForm,
  EditorOpacityForm,
  EditorShadowForm,
  EditorBackgroundForm,
  EditorFontForm,
  EditorJustifyInput,
  EditorMenuRoutesForm,
  EditorProportionsForm,
  EditorBorderForm,
  EditorCategoriesForm,
  EditorTextLinkForm,
  EditorLinkForm,
  EditorStudioMediaForm,
  EditorImageAdjustmentForm,
  EditorDescriptionForm,
];

const old = [
  PebEditorTabsComponent,
  PebEditorTabComponent,
];

@NgModule({
  declarations: [
    components,
    ...inputs,
    ...forms,
    ...old,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxHmCarouselModule,
    PebEditorIconsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    CdkOverlayModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    ColorPickerModule,
    NgScrollbarModule,
  ],
  exports: [
    components,
    ...inputs,
    ...forms,
    ...old,
  ],
})
export class PebEditorSharedModule {}

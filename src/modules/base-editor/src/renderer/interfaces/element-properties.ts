import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

import { PebInteractionType, PebInteractionWithPayload, PebLink, PebPageVariant } from '@pe/builder-core';
import { PebProductCategory } from '@pe/builder-api';

import { AlignType } from '../../behaviors/sidebars/_deprecated-sidebars/sidebar.utils';
import { SelectOption } from '../../shared/_old/select/select.component';
import { SidebarSelectOption } from '../../shared/inputs/select/select.input';
import { ShadowStyles } from '../../shared/forms/shadow/shadow.interfaces';
import { VideoSubTab } from '../editor-element';
import { CategoryTypeOption } from '../../shared/forms/categories/categories.form.constants';
import { FilterStyles } from '../../shared/forms/image-filter/image-filter.interfaces';

export interface PebAlignment {
  align: AlignType;
}

export interface PebBorderStyles {
  hasBorder: boolean;
  borderStyle: string;
  borderColor: string;
  borderWidth: number;
  borderImage?: string;
}

export interface PebRange {
  min: number;
  max: number;
}

export interface PebDimensions {
  width: number;
  height: number;
}

export interface PebLimitsDimension {
  width: BehaviorSubject<PebRange>;
  height: BehaviorSubject<PebRange>;
}

export interface PebPosition {
  x: number;
  y: number;
}

export interface PebLimitsPosition {
  x: BehaviorSubject<PebRange>;
  y: BehaviorSubject<PebRange>;
}

export interface PebBackground {
  bgColor: string;
  bgColorGradientAngle: number;
  bgColorGradientStart: string;
  bgColorGradientStop: string;
  file: File;
  bgImage: string;
  fillType: SelectOption;
  imageSize: SelectOption;
  imageScale: number;
}

export interface PebFont {
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  fontSize: number;
  color: string;
}

export interface PebSection {
  name: string;
  sticky: boolean;
  default: boolean;
  isFirstSection: boolean;
  newElement: boolean;
}

export interface PebVideo {
  videoSubTab: VideoSubTab;
  sourceOptions: SelectOption[];
  sourceType: SelectOption;
  source: string;
  preview: string;
  file: string;
  autoplay: boolean;
  controls: boolean;
  loop: boolean;
  sound: boolean;
}

export interface PebImageAdjustment {
  exposure?: number;
  saturation?: number;
}

export interface PebDescription {
  description: string;
}

export interface PebProductCategoryProperty {
  type: CategoryTypeOption;
  categories: PebProductCategory[];
}

export interface PebPropertyLink {
  link: string;
}

export interface PebEditorElementPropertyLinksOptions {
  linkTypes: SidebarSelectOption[];
  [PebInteractionType.NavigateInternal]: SidebarSelectOption[];
}

export interface PebEditorElementPropertyAlignment extends PebEditorElementProperty<PebAlignment> {
}

export interface PebEditorElementProperty<T> {
  initialValue: T;
  form: FormGroup;
  update: () => void;
  submit: Subject<any>;
}

export interface PebEditorElementPropertyDimensions extends PebEditorElementProperty<PebDimensions> {
  limits: PebLimitsDimension;
  activate: () => void;
}

export interface PebEditorElementPropertyPosition extends PebEditorElementProperty<PebPosition> {
  limits: PebLimitsPosition;
}

export interface PebEditorElementPropertyBorder extends PebEditorElementProperty<PebBorderStyles> {
}

export interface PebEditorElementPropertyBackground extends PebEditorElementProperty<PebBackground> {
}

export interface PebEditorElementPropertyCart extends PebEditorElementProperty<{}> {
}

export interface PebEditorElementPropertyFont extends PebEditorElementProperty<PebFont> {
  options: {
    fontFamilies: SidebarSelectOption[],
  };
}

export interface PebEditorElementPropertyLogo extends PebEditorElementProperty<{ file: string, src: string }> {
}

export interface PebEditorElementPropertyMenuRoutes extends PebEditorElementProperty<{ menuRoutes: PebLink[] }> {
  options: {
    variants: SidebarSelectOption[],
    [PebPageVariant.Default]: SidebarSelectOption[],
    [PebPageVariant.Category]: SidebarSelectOption[],
  };
}

export interface PebEditorElementPropertyOpacity extends PebEditorElementProperty<{ opacity: number }> {
}

export interface PebEditorElementPropertyLinks extends PebEditorElementProperty<PebInteractionWithPayload<string>> {
  options: PebEditorElementPropertyLinksOptions;
}

export interface PebEditorElementPropertyProportions extends PebEditorElementProperty<{ objectFit: string }> {
}

export interface PebEditorElementPropertySection extends PebEditorElementProperty<PebSection> {
}

export interface PebEditorElementPropertyFilter extends PebEditorElementProperty<FilterStyles> {
}

export interface PebEditorElementPropertyShadow extends PebEditorElementProperty<ShadowStyles> {
}

export interface PebEditorElementPropertyVideo extends PebEditorElementProperty<PebVideo> {
}

export interface PebEditorElementPropertyCategory extends PebEditorElementProperty<PebProductCategoryProperty> {
}

export interface PebEditorElementPropertyLink extends PebEditorElementProperty<PebPropertyLink> {

}

export interface PebEditorElementPropertyImageAdjustment extends PebEditorElementProperty<PebImageAdjustment> {
}

export interface PebEditorElementPropertyDescription extends PebEditorElementProperty<PebDescription> {
}


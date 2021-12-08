import { inject, InjectionToken, Injector, Type } from '@angular/core';
import { Observable } from 'rxjs';

import { PebRendererConfig } from '@pe/builder-renderer';

import { PebEditorAbstractToolbar } from './root/abstract-toolbar';
import { PebEditorAbstractNavigation } from './root/abstract-navigation';
import { PebEditorState } from './services/editor.state';

type Toolbar = new (injector: Injector) => PebEditorAbstractToolbar;
type Navigation = new (injector: Injector) => PebEditorAbstractNavigation;

export interface PebEditorUiConfig {
  toolbar: Toolbar;
  navigation: Navigation;
}

export interface PebEditorConfig extends PebRendererConfig {
  ui?: PebEditorUiConfig;
  makers?: { [element: string]: any };
  plugins?: any[];
  state?: Type<PebEditorState>;
}

export interface AfterGlobalInit<T = any> {
  afterGlobalInit: () => Observable<T>;
}

export interface AfterPageInit<T = any> {
  afterPageInit: () => Observable<T>;
}

export const EDITOR_ENABLED_MAKERS = new InjectionToken<{ [element: string]: any }>('EDITOR_ENABLED_MAKERS');

export const EDITOR_CONFIG_UI = new InjectionToken<PebEditorUiConfig>('EDITOR_CONFIG_UI');

export const PEB_EDITOR_STATE = new InjectionToken<PebEditorState>('EDITOR_STATE');

export const PEB_EDITOR_CONFIG = new InjectionToken<PebEditorConfig>('EDITOR_CONFIG');

export const PEB_EDITOR_PLUGINS = new InjectionToken<Array<AfterGlobalInit | AfterPageInit>>('EDITOR_PLUGINS');

export const PEB_EDITOR_EVENTS = new InjectionToken<PebEditorEvents>('EDITOR_EVENTS');

export interface PebEditorEvents {
  window: {
    click$: Observable<MouseEvent>;
    dblclick$: Observable<MouseEvent>;
    mousemove$: Observable<MouseEvent>;
    mouseout$: Observable<MouseEvent>;
    mousedown$: Observable<MouseEvent>;
    mouseup$: Observable<MouseEvent>;
    mouseleave$: Observable<MouseEvent>;
    keydown$: Observable<KeyboardEvent>;
    keyup$: Observable<KeyboardEvent>;
  };
  renderer: {
    click$: Observable<MouseEvent>;
    dblclick$: Observable<MouseEvent>;
    mousemove$: Observable<MouseEvent>;
    mouseout$: Observable<MouseEvent>;
    mousedown$: Observable<MouseEvent>;
    mouseup$: Observable<MouseEvent>;
    mouseleave$: Observable<MouseEvent>;
  };
  contentContainer: {
    click$: Observable<MouseEvent>;
    dblclick$: Observable<MouseEvent>;
    mousemove$: Observable<MouseEvent>;
    mouseout$: Observable<MouseEvent>;
    mousedown$: Observable<MouseEvent>;
    mouseup$: Observable<MouseEvent>;
    mouseleave$: Observable<MouseEvent>;
  };
  controls: {
    anchorMousedown$: Observable<MouseEvent>;
  };
}

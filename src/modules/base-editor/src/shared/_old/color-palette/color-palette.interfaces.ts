export interface PebEditorColorPaletteItem {
  color: string;
  placeholder?: string;
}

export const isColorPaletteItem = (value: string | PebEditorColorPaletteItem): value is PebEditorColorPaletteItem =>
  typeof value !== 'string';

import { ExecCommand } from '../text-editor.interface';

export const fontFamilyTransform = {
  change: (doc: Document, value: string) => doc.execCommand(ExecCommand.FontName, false, value),
  get: (doc: Document) => {
    const font = doc.queryCommandValue(ExecCommand.FontName);
    return font ? font.replace(/['"]+/g, '') : null;
  },
};

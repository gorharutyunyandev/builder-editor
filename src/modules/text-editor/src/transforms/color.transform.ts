import { ExecCommand } from '../text-editor.interface';
import { rgbToHex } from './utils.transform';

export const colorTransform = {
  change: (doc: Document, value: string) => doc.execCommand(ExecCommand.ForeColor, false, value),
  get: (doc: Document) => rgbToHex(doc.queryCommandValue(ExecCommand.ForeColor)),
};

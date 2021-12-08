import { ExecCommand } from '../text-editor.interface';

export const underlineTransform = {
  toggle: (doc: Document) => doc.execCommand(ExecCommand.Underline),
  get: (doc: Document) => doc.queryCommandState(ExecCommand.Underline),
};

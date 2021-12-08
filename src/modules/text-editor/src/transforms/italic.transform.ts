import { ExecCommand } from '../text-editor.interface';

export const italicTransform = {
  toggle: (doc: Document) => doc.execCommand(ExecCommand.Italic),
  get: (doc: Document) => doc.queryCommandState(ExecCommand.Italic),
};

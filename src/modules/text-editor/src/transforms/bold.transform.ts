import { ExecCommand } from '../text-editor.interface';

export const boldTransform = {
  toggle: (doc: Document) => doc.execCommand(ExecCommand.Bold),
  get: (doc: Document) => doc.queryCommandState(ExecCommand.Bold),
};

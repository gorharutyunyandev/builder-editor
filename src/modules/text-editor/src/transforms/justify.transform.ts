import { ExecCommand, TextJustify } from '../text-editor.interface';

export const justifyTransform = {
  change: (doc: Document, value: TextJustify) => {
    switch (value) {
      case TextJustify.Left:
        doc.execCommand(ExecCommand.JustifyLeft);
        break;
      case TextJustify.Center:
        doc.execCommand(ExecCommand.JustifyCenter);
        break;
      case TextJustify.Right:
        doc.execCommand(ExecCommand.JustifyRight);
        break;
      case TextJustify.Full:
        doc.execCommand(ExecCommand.JustifyFull);
        break;
    }
  },
  get: (doc: Document) => {
    if (doc.queryCommandState(ExecCommand.JustifyLeft)) {
      return TextJustify.Left;
    }

    if (doc.queryCommandState(ExecCommand.JustifyCenter)) {
      return TextJustify.Center;
    }

    if (doc.queryCommandState(ExecCommand.JustifyRight)) {
      return TextJustify.Right;
    }

    if (doc.queryCommandState(ExecCommand.JustifyFull)) {
      return TextJustify.Full;
    }

    return null;
  },
};

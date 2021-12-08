import { ExecCommand } from '../text-editor.interface';
import { getParentElementByTag, getParentElementWithFontSize } from './utils.transform';

export const fontSizeTransform = {
  change: (doc: Document, value: number) => {
    doc.execCommand(ExecCommand.FontSize, false, '1');
    let parentNode: HTMLElement = getParentElementByTag(doc, 'FONT');

    const sel = doc.getSelection();

    if (sel.focusNode.nodeName === 'BODY') {
      return;
    }
    if (!parentNode) {
      if (!sel?.rangeCount) {
        return;
      }

      const font = document.createElement('FONT');
      const range = sel.getRangeAt(0);
      font.appendChild(range.extractContents());
      range.insertNode(font);

      parentNode = font;
    }

    parentNode.removeAttribute('size');
    parentNode.style.fontSize = `${value}px`;

    const fontElements = Array.from(parentNode.querySelectorAll('font'));
    fontElements.forEach((el) => {
      if (el.getAttribute('size') !== '1') {
        return;
      }
      el.removeAttribute('size');
      el.style.fontSize = `${value}px`;
    });
  },
  get: (doc: Document) => {
    const font = getParentElementWithFontSize(doc, 'FONT');

    if (!font) {
      return parseFloat(doc.body.style.fontSize);
    }

    return font?.style?.fontSize ? parseFloat(font.style.fontSize) : null;
  },
};

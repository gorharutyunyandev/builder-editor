export function rgbToHex(rgb: string): string {
  if (!rgb) {
    return null;
  }

  const sep = rgb.indexOf(',') > -1 ? ',' : ' ';
  const result = rgb.substr(4).split(')')[0].split(sep);

  let r = (+result[0]).toString(16);
  let g = (+result[1]).toString(16);
  let b = (+result[2]).toString(16);

  if (r.length === 1) {
    r = `0${r}`;
  }
  if (g.length === 1) {
    g = `0${g}`;
  }
  if (b.length === 1) {
    b = `0${b}`;
  }

  return `#${r}${g}${b}`;
}

export const saveSelection = (doc: Document) => {
  const range = doc.getSelection().getRangeAt(0);
  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(doc.body);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  const start = preSelectionRange.toString().length;

  return { start, end: start + range.toString().length };
};

export const restoreSelection = (doc: Document, savedSel: { start: number, end: number }) => {
  let charIndex = 0;
  const range = doc.createRange();
  range.setStart(doc.body, 0);
  range.collapse(true);
  const nodeStack: Node[] = [doc.body];
  let node = nodeStack.pop();
  let foundStart = false;
  let stop = false;

  while (!stop && !!node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const nextCharIndex = charIndex + (node as Text).length;
      if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
        range.setStart(node, savedSel.start - charIndex);
        foundStart = true;
      }
      if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
        range.setEnd(node, savedSel.end - charIndex);
        stop = true;
      }
      charIndex = nextCharIndex;
    } else {
      let i = node.childNodes.length;
      while (i > 0) {
        i -= 1;
        nodeStack.push(node.childNodes[i]);
      }
    }
    node = nodeStack.pop();
  }

  const sel = doc.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
};

export function getParentElementByTag<T extends HTMLElement>(doc: Document, tag: string): T {
  let parentEl = null;
  const sel = doc.getSelection();

  if (sel?.rangeCount) {
    parentEl = sel.getRangeAt(0).commonAncestorContainer;

    if (parentEl.nodeType !== 1) {
      parentEl = parentEl.parentNode;
    }
  }

  while (parentEl) {
    if (parentEl.nodeName === tag.toUpperCase()) {
      break;
    }

    parentEl = parentEl.parentNode;
  }

  return parentEl;
}

export function getParentElementWithFontSize(doc: Document, tag: string): HTMLElement {
  let parentEl = null;
  const sel = doc.getSelection();

  if (sel?.rangeCount) {
    parentEl = sel.getRangeAt(0).commonAncestorContainer;

    if (parentEl.nodeType !== 1) {
      parentEl = parentEl.parentNode;
    }
  }

  while (parentEl) {
    if (parentEl.nodeName === tag.toUpperCase() && parentEl.style.fontSize) {
      break;
    }

    parentEl = parentEl.parentNode;
  }

  return parentEl;
}

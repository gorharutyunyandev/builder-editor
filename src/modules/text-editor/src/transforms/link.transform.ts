import { PebInteractionType, PebInteractionWithPayload, pebLinkDatasetLink } from '@pe/builder-core';
import { uuid } from '@pe/dom-to-image/lib/utils';

import { ExecCommand } from '../text-editor.interface';
import { getParentElementByTag, restoreSelection, saveSelection } from './utils.transform';


export interface PebInteractionTextLink extends PebInteractionWithPayload<string> {
  id?: string;
}

function updateLink(link: HTMLAnchorElement, value: PebInteractionTextLink) {
  link.style.setProperty('color', '#067af1');
  link.setAttribute('href', '#');
  if (value.id) {
    link.setAttribute(pebLinkDatasetLink.id, value.id);
  } else {
    link.removeAttribute(pebLinkDatasetLink.id);
  }
  link.setAttribute(pebLinkDatasetLink.type, value.type);
  link.setAttribute(pebLinkDatasetLink.payload, value.payload);
}

function setLink(doc: Document, value: PebInteractionTextLink) {
  const parentLink = getParentElementByTag(doc, 'A');
  const id = parentLink?.getAttribute(pebLinkDatasetLink.id) ?? uuid();
  if (!parentLink) {
    doc.execCommand(ExecCommand.Underline);
    doc.execCommand(ExecCommand.CreateLink, false, `#${id}`);
    const newLinks = doc.querySelectorAll<HTMLAnchorElement>(`a[href="#${id}"]`);
    newLinks.forEach((link) => {
      updateLink(link, { ...value, id });
    });
  } else {
    const sameLinks = doc.querySelectorAll<HTMLAnchorElement>(`a[${pebLinkDatasetLink.id}="${id}"]`);
    sameLinks.forEach((link) => {
      updateLink(link, { ...value, id });
    });
  }
}

export function removeLink(link: HTMLAnchorElement): void {
  const nodeToReplace = link.parentElement.nodeName.toLowerCase() === 'u' ? link.parentElement : link;
  const childNodes = Array.from(link.childNodes);
  nodeToReplace.replaceWith(...childNodes);
}

export function unsetLink(doc: Document): void {
  const sel = doc.getSelection();
  const savedSelection = saveSelection(doc);

  doc.querySelectorAll('a').forEach((link) => {
    if (sel.containsNode(link, true)) {
      if (link.hasAttribute(pebLinkDatasetLink.id)) {
        const id = link.getAttribute(pebLinkDatasetLink.id);
        const sameLinks = doc.querySelectorAll<HTMLAnchorElement>(`a[${pebLinkDatasetLink.id}="${id}"]`);
        sameLinks.forEach((linkNode) => {
          removeLink(linkNode);
        });
      } else {
        removeLink(link);
      }
    }
  });

  restoreSelection(doc, savedSelection);
}

export const linkTransform = {
  change: (doc: Document, value: PebInteractionWithPayload<string>) => value ? setLink(doc, value) : unsetLink(doc),
  get: (doc: Document): PebInteractionTextLink | null => {
    const sel = doc.getSelection();
    const links = Array.from(doc.querySelectorAll('a')).filter(node => sel.containsNode(node, true));

    if (links.length) {
      const link = links[0];
      const result: PebInteractionTextLink = {
        id: link.getAttribute(pebLinkDatasetLink.id),
        type: link.getAttribute(pebLinkDatasetLink.type) as PebInteractionType,
        payload: link.getAttribute(pebLinkDatasetLink.payload),
      };

      return result;
    }

    return null;
  },
};

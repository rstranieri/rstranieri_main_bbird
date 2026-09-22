/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-press. Base: cards. Source: https://www.bat.com/
 * Generated: 2026-09-22
 *
 * Content model (xwalk, container "cards-press" with "cards-press-item"):
 * one row per item, 1 column (text only, no image).
 *   Cell 1: text (richtext) -> <!-- field:text --> tag/date meta, heading, description
 *
 * Source: a .batcom-list--oneColumn with <li class="cmp-list__item"> children.
 * Each item has a meta line (.cmp-list__item-tag + .cmp-list__item-date),
 * a heading (.cmp-list__item-title) and a description (.cmp-list__item-description).
 * No images.
 */
export default function parse(element, { document }) {
  const c = (name) => document.createComment(` field:${name} `);

  const items = [...element.querySelectorAll('li.cmp-list__item')];
  const cells = [];

  items.forEach((item) => {
    const tag = item.querySelector('.cmp-list__item-tag');
    const date = item.querySelector('.cmp-list__item-date');
    const heading = item.querySelector('.cmp-list__item-title, h1, h2, h3, h4');
    const description = item.querySelector('.cmp-list__item-description');

    const contentCell = [c('text')];

    const metaParts = [];
    if (tag && tag.textContent.trim()) metaParts.push(tag.textContent.trim());
    if (date && date.textContent.trim()) metaParts.push(date.textContent.trim());
    if (metaParts.length) {
      const p = document.createElement('p');
      p.textContent = metaParts.join(' | ');
      contentCell.push(p);
    }
    if (heading && heading.textContent.trim()) {
      const h = document.createElement('h4');
      h.textContent = heading.textContent.trim();
      contentCell.push(h);
    }
    if (description && description.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      contentCell.push(p);
    }

    if (contentCell.length === 1) return;

    cells.push([contentCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-press', cells });
  element.replaceWith(block);
}

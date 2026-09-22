/* eslint-disable */
/* global WebImporter */
/**
 * Parser for teaser-stage. Base: teaser. Source: https://www.bat.com/
 * Generated: 2026-09-22
 *
 * Content model (xwalk, model "teaser-stage"): single row, 2 columns.
 *   Cell 1: image (reference) -> <!-- field:image --> (imageAlt collapses into <img alt>)
 *   Cell 2: text (richtext)   -> <!-- field:text --> eyebrow, heading, body, CTA link
 *
 * Source: a full-width band .batcom-teaser-corp-stage with a background
 * .cmp-teaser__image, plus .cmp-teaser__pretitle, .cmp-teaser__title,
 * .cmp-teaser__description and .cmp-teaser__action-link.
 */
export default function parse(element, { document }) {
  const c = (name) => document.createComment(` field:${name} `);

  const img = element.querySelector('.cmp-teaser__image img, img');
  const pretitle = element.querySelector('.cmp-teaser__pretitle');
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, h4');
  const description = element.querySelector('.cmp-teaser__description');
  const link = element.querySelector('.cmp-teaser__action-link, a[href]');

  const contentCell = [c('text')];

  if (pretitle && pretitle.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = pretitle.textContent.trim();
    contentCell.push(p);
  }
  if (heading && heading.textContent.trim()) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    contentCell.push(h);
  }
  if (description) {
    [...description.querySelectorAll('p')].forEach((p) => {
      if (p.textContent.trim()) {
        const np = document.createElement('p');
        np.textContent = p.textContent.trim();
        contentCell.push(np);
      }
    });
    if (!description.querySelector('p') && description.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      contentCell.push(p);
    }
  }
  if (link && link.getAttribute('href')) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', link.getAttribute('href'));
    a.textContent = link.textContent.trim();
    p.append(a);
    contentCell.push(p);
  }

  if (!img && contentCell.length === 1) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const imageCell = [];
  if (img) imageCell.push(c('image'), img);

  const cells = [[imageCell, contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'teaser-stage', cells });
  element.replaceWith(block);
}

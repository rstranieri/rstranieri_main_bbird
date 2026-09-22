/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-topic. Base: cards. Source: https://www.bat.com/
 * Generated: 2026-09-22
 *
 * Content model (xwalk, container "cards-topic" with "cards-topic-item"):
 * one row per card, 2 columns.
 *   Cell 1: image (reference) -> <!-- field:image --> (imageAlt collapses into <img alt>)
 *   Cell 2: text (richtext)   -> <!-- field:text --> category tag, heading, description, link
 *
 * Source: the matched element is a grid container holding several
 * .batcom-teaser-corp--vertical cards. Each card becomes one row so the whole
 * grid renders as a single cards-topic block. If no child cards are found the
 * element itself is treated as a single card (defensive fallback).
 */
export default function parse(element, { document }) {
  const c = (name) => document.createComment(` field:${name} `);

  const buildCardRow = (card) => {
    const img = card.querySelector('.cmp-teaser__image img, img');
    const pretitle = card.querySelector('.cmp-teaser__pretitle');
    const heading = card.querySelector('.cmp-teaser__title, h1, h2, h3, h4');
    const description = card.querySelector('.cmp-teaser__description');
    const link = card.querySelector('.cmp-teaser__action-link, a[href]');

    const contentCell = [c('text')];

    if (pretitle && pretitle.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = pretitle.textContent.trim();
      contentCell.push(p);
    }
    if (heading && heading.textContent.trim()) {
      const h = document.createElement('h3');
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

    const imageCell = [];
    if (img) imageCell.push(c('image'), img);

    if (!img && contentCell.length === 1) return null;
    return [imageCell, contentCell];
  };

  let cards = [...element.querySelectorAll('.batcom-teaser-corp--vertical')];
  // Fallback: the matched element is itself a single card.
  if (!cards.length) cards = [element];

  const cells = cards.map(buildCardRow).filter(Boolean);

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-topic', cells });
  element.replaceWith(block);
}

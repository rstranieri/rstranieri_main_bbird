/* eslint-disable */
/* global WebImporter */
/**
 * Parser for teaser-transaction. Base: teaser. Source: https://www.vusevapor.com/
 * Generated: 2026-09-22
 *
 * Content model (xwalk, container "teaser-transaction" with
 * "teaser-transaction-item"): one row per promo tile, 2 columns.
 *   Cell 1: image (reference) -> <!-- field:image --> background (imageAlt collapses into <img alt>)
 *   Cell 2: text  (richtext)  -> <!-- field:text --> heading, body text, CTA link
 *
 * Source: .teaser.cmp-teaser--background-image-height-teaser. The matched
 * element may itself be a single tile, or a wrapper containing several tiles;
 * each .cmp-teaser becomes one row. Background is
 * <picture.cmp-teaser__background-picture> img; heading .cmp-teaser__title,
 * body .cmp-teaser__description, CTA .cmp-teaser__action-link.
 */
export default function parse(element, { document }) {
  const c = (name) => document.createComment(` field:${name} `);
  const clean = (s) => (s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

  const buildTileRow = (tile) => {
    const img = tile.querySelector('.cmp-teaser__background-picture img, .cmp-teaser__background-img, picture img');
    const heading = tile.querySelector('.cmp-teaser__title, h1, h2, h3, h4');
    const description = tile.querySelector('.cmp-teaser__description');
    const cta = tile.querySelector('.cmp-teaser__action-link[href], a[href]');

    const headingText = heading ? clean(heading.textContent) : '';

    const contentCell = [c('text')];
    if (headingText) {
      const h = document.createElement('h3');
      h.textContent = headingText;
      contentCell.push(h);
    }
    if (description) {
      const paras = [...description.querySelectorAll('p')];
      if (paras.length) {
        paras.forEach((p) => {
          const t = clean(p.textContent);
          if (t) {
            const np = document.createElement('p');
            np.textContent = t;
            contentCell.push(np);
          }
        });
      } else {
        const t = clean(description.textContent);
        if (t) {
          const np = document.createElement('p');
          np.textContent = t;
          contentCell.push(np);
        }
      }
    }
    if (cta && cta.getAttribute('href')) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', cta.getAttribute('href'));
      a.textContent = clean(cta.textContent) || 'Learn More';
      p.append(a);
      contentCell.push(p);
    }

    if (!img && contentCell.length === 1) return null;

    const imageCell = [];
    if (img) imageCell.push(c('image'), img);

    return [imageCell, contentCell];
  };

  // Collect every teaser tile. If the matched element is itself a single
  // teaser (no nested .cmp-teaser), treat it as one tile.
  let tiles = [...element.querySelectorAll('.cmp-teaser')];
  if (!tiles.length) tiles = [element];

  const cells = tiles.map(buildTileRow).filter(Boolean);

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'teaser-transaction', cells });
  element.replaceWith(block);
}

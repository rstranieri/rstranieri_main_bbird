import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Promo teaser: a compact card with an optional eyebrow label, image,
 * heading/date text and a single call-to-action link.
 * Authored as a single row containing an image cell and a content cell.
 * @param {Element} block The teaser-promo block element
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cells = [...row.children];
  const mediaCell = cells.find((c) => c.querySelector('picture'));
  const contentCell = cells.find((c) => c !== mediaCell) || cells[0];

  if (mediaCell) {
    mediaCell.classList.add('teaser-promo-media');
    const img = mediaCell.querySelector('img');
    if (img) {
      const picture = mediaCell.querySelector('picture');
      picture.replaceWith(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]));
    }
  }

  if (contentCell) {
    contentCell.classList.add('teaser-promo-content');
    // First short <p> before any heading acts as an eyebrow label.
    const heading = contentCell.querySelector('h1, h2, h3, h4, h5, h6');
    const firstP = contentCell.querySelector('p');
    if (firstP && heading && firstP.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING
      && !firstP.classList.contains('button-container')) {
      firstP.classList.add('teaser-promo-eyebrow');
    }
  }
}

import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Stage teaser: a full-width band with a background image and overlaid
 * eyebrow, heading, body text and a call-to-action button.
 * Authored as a single row: image cell + content cell.
 * @param {Element} block The teaser-stage block element
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cells = [...row.children];
  const mediaCell = cells.find((c) => c.querySelector('picture'));
  const contentCell = cells.find((c) => c !== mediaCell) || cells[0];

  if (mediaCell) {
    mediaCell.classList.add('teaser-stage-media');
    const img = mediaCell.querySelector('img');
    if (img) {
      const picture = mediaCell.querySelector('picture');
      picture.replaceWith(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '1600' }]));
    }
  }

  if (contentCell) {
    contentCell.classList.add('teaser-stage-content');
    const heading = contentCell.querySelector('h1, h2, h3, h4, h5, h6');
    const firstP = contentCell.querySelector('p');
    if (firstP && heading && (firstP.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING)
      && !firstP.classList.contains('button-container')) {
      firstP.classList.add('teaser-stage-eyebrow');
    }
  }
}

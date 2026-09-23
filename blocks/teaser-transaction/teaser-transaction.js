import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Transaction teasers: a row of promo tiles, each a background image with
 * overlaid text and a call-to-action (e.g. Text Sign-Up, Offers, Store Locator).
 * Each authored row becomes one tile (image cell + content cell).
 * @param {Element} block The teaser-transaction block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cells = [...row.children];
    const mediaCell = cells.find((c) => c.querySelector('picture, img')) || cells[0];
    const contentCell = cells.find((c) => c !== mediaCell) || cells[1] || cells[0];

    const img = mediaCell && mediaCell.querySelector('img');
    if (img) {
      const imageDiv = document.createElement('div');
      imageDiv.className = 'teaser-transaction-image';
      imageDiv.append(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]));
      li.append(imageDiv);
    }

    const body = document.createElement('div');
    body.className = 'teaser-transaction-body';
    if (contentCell && contentCell !== mediaCell) {
      while (contentCell.firstChild) body.append(contentCell.firstChild);
    }
    li.append(body);
    ul.append(li);
  });

  block.replaceChildren(ul);
}

import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Product cards: a scrollable row of product/flavor tiles, each a product
 * image with the product/flavor name (and optional link) beneath.
 * Each authored row becomes one tile (image cell + content cell).
 * @param {Element} block The cards-product block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cells = [...row.children];
    // The media cell is whichever cell carries an image (a <picture> or a bare
    // <img> — local images are not always wrapped by the decoration pipeline).
    const mediaCell = cells.find((c) => c.querySelector('picture, img')) || cells[0];
    const contentCell = cells.find((c) => c !== mediaCell) || cells[1] || cells[0];

    const img = mediaCell && mediaCell.querySelector('img');
    if (img) {
      const imageDiv = document.createElement('div');
      imageDiv.className = 'cards-product-image';
      imageDiv.append(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '600' }]));
      li.append(imageDiv);
    }

    const body = document.createElement('div');
    body.className = 'cards-product-body';
    if (contentCell && contentCell !== mediaCell) {
      while (contentCell.firstChild) body.append(contentCell.firstChild);
    }
    li.append(body);
    ul.append(li);
  });

  block.replaceChildren(ul);
}

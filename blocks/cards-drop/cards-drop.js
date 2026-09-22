import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Drop cards: a horizontal row of article/reward cards, each an image with a
 * linked title beneath it. Each authored row becomes one card
 * (image cell + content cell with the title/link).
 * @param {Element} block The cards-drop block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cells = [...row.children];
    const mediaCell = cells.find((c) => c.querySelector('picture')) || cells[0];
    const contentCell = cells.find((c) => c !== mediaCell) || cells[1] || cells[0];

    if (mediaCell && mediaCell.querySelector('picture')) {
      const imageDiv = document.createElement('div');
      imageDiv.className = 'cards-drop-image';
      const img = mediaCell.querySelector('img');
      if (img) {
        imageDiv.append(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '600' }]));
      }
      li.append(imageDiv);
    }

    const body = document.createElement('div');
    body.className = 'cards-drop-body';
    if (contentCell && contentCell !== mediaCell) {
      while (contentCell.firstChild) body.append(contentCell.firstChild);
    }
    li.append(body);
    ul.append(li);
  });

  block.replaceChildren(ul);
}

import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Feature cards: a row of icon + title + description cells (e.g. the Vuse Pro
 * "Key Features" grid — Larger Pod, Pod Design, Alto Compatability, Liquids
 * Blended in the USA). Each authored row is one feature (icon cell + text cell).
 * @param {Element} block The feature-cards block element
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
      const iconDiv = document.createElement('div');
      iconDiv.className = 'feature-cards-icon';
      iconDiv.append(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '200' }]));
      li.append(iconDiv);
    }

    const body = document.createElement('div');
    body.className = 'feature-cards-body';
    if (contentCell && contentCell !== mediaCell) {
      while (contentCell.firstChild) body.append(contentCell.firstChild);
    }
    li.append(body);
    ul.append(li);
  });

  block.replaceChildren(ul);
}

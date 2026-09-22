import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Topic cards: a responsive grid of image cards, each with a category
 * eyebrow tag, image, heading, short description and a single link.
 * Each authored row becomes one card (image cell + content cell).
 * @param {Element} block The cards-topic block element
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
      imageDiv.className = 'cards-topic-image';
      const img = mediaCell.querySelector('img');
      if (img) {
        imageDiv.append(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]));
      }
      li.append(imageDiv);
    }

    const body = document.createElement('div');
    body.className = 'cards-topic-body';
    if (contentCell) {
      // First short <p> before the heading is the category eyebrow.
      const heading = contentCell.querySelector('h1, h2, h3, h4, h5, h6');
      const firstP = contentCell.querySelector('p');
      if (firstP && heading && (firstP.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING)
        && !firstP.classList.contains('button-container')) {
        firstP.classList.add('cards-topic-tag');
      }
      while (contentCell.firstChild) body.append(contentCell.firstChild);
    }
    li.append(body);
    ul.append(li);
  });

  block.replaceChildren(ul);
}

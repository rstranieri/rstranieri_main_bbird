import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * News cards: a list of story cards, each with an image, a category tag,
 * a date, a heading and a short description.
 * Each authored row becomes one card (image cell + content cell).
 * @param {Element} block The cards-news block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cells = [...row.children];
    const mediaCell = cells.find((c) => c.querySelector('picture'));
    const contentCell = cells.find((c) => c !== mediaCell) || cells[cells.length - 1];

    if (mediaCell && mediaCell.querySelector('picture')) {
      const imageDiv = document.createElement('div');
      imageDiv.className = 'cards-news-image';
      const img = mediaCell.querySelector('img');
      if (img) {
        imageDiv.append(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '600' }]));
      }
      li.append(imageDiv);
    }

    const body = document.createElement('div');
    body.className = 'cards-news-body';
    if (contentCell) {
      // First short <p> before the heading is a tag/date meta line.
      const heading = contentCell.querySelector('h1, h2, h3, h4, h5, h6');
      const firstP = contentCell.querySelector('p');
      if (firstP && heading && (firstP.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING)
        && !firstP.classList.contains('button-container')) {
        firstP.classList.add('cards-news-meta');
      }
      while (contentCell.firstChild) body.append(contentCell.firstChild);
    }
    li.append(body);
    ul.append(li);
  });

  block.replaceChildren(ul);
}

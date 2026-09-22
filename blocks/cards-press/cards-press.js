/**
 * Press-release cards: a text-only list of items, each with a category tag +
 * date meta line, a heading and a short description. No images.
 * Each authored row becomes one item.
 * @param {Element} block The cards-press block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const contentCell = [...row.children].find((c) => c.textContent.trim()) || row.firstElementChild;

    const body = document.createElement('div');
    body.className = 'cards-press-body';
    if (contentCell) {
      const heading = contentCell.querySelector('h1, h2, h3, h4, h5, h6');
      const firstP = contentCell.querySelector('p');
      if (firstP && heading && (firstP.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING)
        && !firstP.classList.contains('button-container')) {
        firstP.classList.add('cards-press-meta');
      }
      while (contentCell.firstChild) body.append(contentCell.firstChild);
    }
    li.append(body);
    ul.append(li);
  });

  block.replaceChildren(ul);
}

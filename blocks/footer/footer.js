import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment (skip if aem-embed already provided content)
  if (block.textContent === '') {
    const footerMeta = getMetadata('footer');
    const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/content/footer';
    const fragment = await loadFragment(footerPath);
    if (!fragment) return;

    block.textContent = '';
    const footer = document.createElement('div');
    while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
    block.append(footer);
  }

  // BAT footer: first N sections are content columns; the final section is the
  // legal bar (legal links + copyright). Group the columns into a grid wrapper
  // and mark the legal bar so CSS can lay each out.
  const root = block.querySelector('.footer') || block.firstElementChild;
  const sections = [...(root ? root.querySelectorAll(':scope > .section') : [])];
  if (root && sections.length >= 2) {
    const legal = sections[sections.length - 1];
    const columns = sections.slice(0, -1);

    const grid = document.createElement('div');
    grid.className = 'footer-columns';
    columns.forEach((sec) => {
      sec.classList.add('footer-column');
      grid.append(sec);
    });

    legal.classList.add('footer-legal');
    root.prepend(grid);
    root.append(legal);
  }
}

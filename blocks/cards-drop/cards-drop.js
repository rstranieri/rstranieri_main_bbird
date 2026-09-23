import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Drop cards: a horizontal carousel of article/reward (quiz) cards, each an
 * image with a linked title beneath it. Each authored row becomes one card
 * (image cell + content cell with the title/link). The cards scroll
 * horizontally with scroll-snap and prev/next arrow controls, mirroring the
 * source site's Glide carousel.
 * @param {Element} block The cards-drop block element
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
      imageDiv.className = 'cards-drop-image';
      imageDiv.append(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '600' }]));
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

  // Build the carousel: a scrollable track (the <ul>) inside a viewport, with
  // prev/next arrow controls.
  const viewport = document.createElement('div');
  viewport.className = 'cards-drop-viewport';
  ul.classList.add('cards-drop-track');
  viewport.append(ul);

  const mkArrow = (dir) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `cards-drop-arrow cards-drop-arrow--${dir}`;
    btn.setAttribute('aria-label', dir === 'prev' ? 'Previous' : 'Next');
    return btn;
  };
  const prev = mkArrow('prev');
  const next = mkArrow('next');

  const scrollByCards = (direction) => {
    const card = ul.querySelector('li');
    if (!card) return;
    const step = card.getBoundingClientRect().width + 24; // card width + gap
    ul.scrollBy({ left: direction * step, behavior: 'smooth' });
  };
  prev.addEventListener('click', () => scrollByCards(-1));
  next.addEventListener('click', () => scrollByCards(1));

  // Toggle arrow availability at the scroll extremes.
  const updateArrows = () => {
    const maxScroll = ul.scrollWidth - ul.clientWidth - 1;
    prev.disabled = ul.scrollLeft <= 0;
    next.disabled = ul.scrollLeft >= maxScroll;
  };
  ul.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);

  block.replaceChildren(prev, viewport, next);

  // Re-evaluate once layout settles and again as each card image loads (image
  // dimensions change scrollWidth, so an early check can wrongly disable Next).
  updateArrows();
  requestAnimationFrame(updateArrows);
  ul.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', updateArrows, { once: true });
  });
}

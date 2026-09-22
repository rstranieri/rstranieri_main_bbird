import { createOptimizedPicture } from '../../scripts/aem.js';

const AUTOPLAY_MS = 7000;

/**
 * Hero carousel: each authored row becomes a slide.
 * A slide row contains an image plus heading / description / link content.
 * Renders a rotating, full-bleed hero with dot indicators and prev/next controls.
 * @param {Element} block The hero-carousel block element
 */
export default function decorate(block) {
  const slides = [...block.children];
  if (!slides.length) return;

  const track = document.createElement('div');
  track.className = 'hero-carousel-track';

  slides.forEach((row, idx) => {
    const slide = document.createElement('div');
    slide.className = 'hero-carousel-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${idx + 1} of ${slides.length}`);
    if (idx !== 0) slide.setAttribute('aria-hidden', 'true');

    // Separate the image (background) from the text content.
    const picture = row.querySelector('picture');
    const media = document.createElement('div');
    media.className = 'hero-carousel-media';
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        picture.replaceWith(createOptimizedPicture(img.src, img.alt || '', idx === 0, [{ width: '1600' }]));
      }
      media.append(row.querySelector('picture') || picture);
    }

    const content = document.createElement('div');
    content.className = 'hero-carousel-content';
    [...row.children].forEach((cell) => {
      [...cell.childNodes].forEach((node) => {
        if (node.nodeType === 1 && node.querySelector && node.querySelector('picture')) return;
        content.append(node);
      });
    });

    slide.append(media, content);
    track.append(slide);
  });

  // Controls
  const nav = document.createElement('div');
  nav.className = 'hero-carousel-nav';
  const dots = slides.map((_, idx) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-carousel-dot';
    dot.setAttribute('aria-label', `Show slide ${idx + 1}`);
    if (idx === 0) dot.classList.add('is-active');
    nav.append(dot);
    return dot;
  });

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'hero-carousel-arrow hero-carousel-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'hero-carousel-arrow hero-carousel-next';
  next.setAttribute('aria-label', 'Next slide');

  block.replaceChildren(track, prev, next, nav);

  const slideEls = [...track.children];
  let current = 0;
  let timer;

  const show = (idx) => {
    current = (idx + slideEls.length) % slideEls.length;
    slideEls.forEach((s, i) => {
      s.classList.toggle('is-active', i === current);
      if (i === current) s.removeAttribute('aria-hidden');
      else s.setAttribute('aria-hidden', 'true');
    });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    track.style.transform = `translateX(-${current * 100}%)`;
  };

  const start = () => {
    if (slideEls.length < 2) return;
    stop();
    timer = setInterval(() => show(current + 1), AUTOPLAY_MS);
  };
  function stop() { if (timer) clearInterval(timer); }

  dots.forEach((dot, idx) => dot.addEventListener('click', () => { show(idx); start(); }));
  prev.addEventListener('click', () => { show(current - 1); start(); });
  next.addEventListener('click', () => { show(current + 1); start(); });
  block.addEventListener('mouseenter', stop);
  block.addEventListener('mouseleave', start);

  slideEls[0].classList.add('is-active');
  if (slideEls.length < 2) {
    nav.remove();
    prev.remove();
    next.remove();
  } else {
    start();
  }
}

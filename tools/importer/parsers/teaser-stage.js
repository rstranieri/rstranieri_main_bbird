/* eslint-disable */
/* global WebImporter */
/**
 * Parser for teaser-stage. Base: teaser. Source: https://www.vusevapor.com/
 * Generated: 2026-09-22
 *
 * Content model (xwalk, model "teaser-stage"): single row, 2 columns.
 *   Cell 1: image (reference) -> <!-- field:image --> background (imageAlt collapses into <img alt>)
 *   Cell 2: text  (richtext)  -> <!-- field:text --> eyebrow, heading, body, CTA link
 *
 * Source: two shapes are supported.
 *   1. .cmp-section--background-img — background in <picture.cmp-section__background-picture>,
 *      heading/description in .cmp-text blocks (desktop + mobile duplicates), CTA in .cmp-button a.
 *   2. section.cmp-gallery-parallax — background URL in a .cmp-gallery-parallax__img
 *      data-desktop-image attribute (no <img>), heading .cmp-gallery-parallax__caption-title,
 *      description .cmp-gallery-parallax__caption-description, no CTA.
 * Desktop/mobile duplicate text nodes are de-duplicated by trimmed text; empty
 * (&nbsp;) paragraphs are dropped.
 */
export default function parse(element, { document }) {
  const c = (name) => document.createComment(` field:${name} `);
  const clean = (s) => (s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

  // --- Background image ---------------------------------------------------
  let img = element.querySelector('.cmp-section__background-picture img, .cmp-section__background-img');
  if (!img) {
    // gallery-parallax: build an <img> from the data-desktop-image attribute.
    const parallaxImg = element.querySelector('.cmp-gallery-parallax__img[data-desktop-image], .cmp-gallery-parallax__img[data-mobile-image]');
    const bgUrl = parallaxImg && (parallaxImg.getAttribute('data-desktop-image')
      || parallaxImg.getAttribute('data-mobile-image'));
    if (bgUrl) {
      img = document.createElement('img');
      img.setAttribute('src', bgUrl);
      img.setAttribute('alt', '');
    }
  }

  // --- Heading ------------------------------------------------------------
  const headingEl = element.querySelector(
    '.cmp-gallery-parallax__caption-title, .cmp-text h1, .cmp-text h2, h1, h2, h3',
  );
  const headingText = headingEl ? clean(headingEl.textContent) : '';

  // --- Description (dedupe desktop/mobile copies, drop empties) -----------
  const descTexts = [];
  const seen = new Set();
  const descNodes = element.querySelectorAll(
    '.cmp-gallery-parallax__caption-description, .cmp-text p',
  );
  descNodes.forEach((p) => {
    const t = clean(p.textContent);
    if (!t) return;
    if (seen.has(t)) return;
    if (headingText && t === headingText) return; // skip paragraph repeating heading
    seen.add(t);
    descTexts.push(t);
  });

  // --- CTA ----------------------------------------------------------------
  const cta = element.querySelector('.cmp-button a[href], a[role="button"][href], .cmp-teaser__action-link[href]');

  // Empty-block guard.
  if (!img && !headingText && !descTexts.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Build cells.
  const imageCell = [];
  if (img) imageCell.push(c('image'), img);

  const contentCell = [c('text')];
  if (headingText) {
    const h = document.createElement('h2');
    h.textContent = headingText;
    contentCell.push(h);
  }
  descTexts.forEach((t) => {
    const p = document.createElement('p');
    p.textContent = t;
    contentCell.push(p);
  });
  if (cta && cta.getAttribute('href')) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', cta.getAttribute('href'));
    a.textContent = clean(cta.textContent) || cta.getAttribute('aria-label') || 'Learn More';
    p.append(a);
    contentCell.push(p);
  }

  const cells = [[imageCell, contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'teaser-stage', cells });
  element.replaceWith(block);
}

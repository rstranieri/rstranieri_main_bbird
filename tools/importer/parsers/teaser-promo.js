/* eslint-disable */
/* global WebImporter */
/**
 * Parser for teaser-promo. Base: teaser. Source: https://www.bat.com/
 * Generated: 2026-09-22
 *
 * Content model (xwalk, model "teaser-promo"): single row, 2 columns.
 *   Cell 1: image (reference)   -> <!-- field:image --> (imageAlt collapses into <img alt>)
 *   Cell 2: text (richtext)     -> <!-- field:text --> eyebrow, heading/date and CTA link
 *
 * Source: an experience-fragment promo layered on the hero. It contains an
 * eyebrow (.small "Coming soon"), a linked image, two text lines
 * (title + date), a body <h3> and a "Register now" link.
 */
export default function parse(element, { document }) {
  const c = (name) => document.createComment(` field:${name} `);

  const img = element.querySelector('img');

  // Eyebrow label (e.g. "Coming soon").
  const eyebrow = element.querySelector('.hero-carousel-xf-override span, .small');

  // Title + date text lines (the two plain <p> siblings after the image block).
  const textCells = [...element.querySelectorAll('.cmp-text > p, .cmp-text > h3')];
  // Body heading (the descriptive <h3>).
  const bodyHeading = element.querySelector('h3');
  // CTA link.
  const link = element.querySelector('a[href]:not(.cmp-image__link)') || element.querySelector('a[href]');

  const contentCell = [];
  // Track text already added so the eyebrow paragraph isn't repeated by textCells.
  const seen = new Set();

  if (eyebrow) {
    const text = eyebrow.textContent.trim();
    const p = document.createElement('p');
    p.textContent = text;
    contentCell.push(p);
    seen.add(text);
  }

  // Title line: first non-eyebrow text paragraph that is not the body heading and not the link.
  textCells.forEach((el) => {
    const text = el.textContent.trim();
    if (!text) return;
    if (el.querySelector && el.querySelector('a')) return; // handled as link
    if (bodyHeading && el === bodyHeading) return; // handled below
    if (seen.has(text)) return;
    seen.add(text);
    const p = document.createElement('p');
    p.textContent = text;
    contentCell.push(p);
  });

  if (bodyHeading && bodyHeading.textContent.trim()) {
    const h = document.createElement('h3');
    h.textContent = bodyHeading.textContent.trim();
    contentCell.push(h);
  }

  if (link) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', link.getAttribute('href'));
    a.textContent = link.textContent.trim() || 'Register now';
    p.append(a);
    contentCell.push(p);
  }

  if (!img && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const imageCell = [];
  if (img) imageCell.push(c('image'), img);

  const cells = [[imageCell, [c('text'), ...contentCell]]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'teaser-promo', cells });
  element.replaceWith(block);
}

/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-video. Base: hero. Source: https://www.vusevapor.com/
 * Generated: 2026-09-22
 *
 * Content model (xwalk, model "hero-video"): single row, 2 columns.
 *   Cell 1 (media): video (aem-content) -> <!-- field:video --> (anchor to the .mp4)
 *                   image (reference)   -> <!-- field:image --> optional poster (imageAlt collapses into <img alt>)
 *   Cell 2 (text):  text  (richtext)    -> <!-- field:text --> headline + CTA link
 *
 * Source: .cmp-hero-banner--videoBackground. The background video URL lives in
 * <video><source src="....mp4"> (desktop preferred). The headline text is stored
 * in the data-text attribute of an (otherwise empty) .cmp-hero-banner__headline1
 * span; the CTA is .cmp-hero-banner__ctas a.cmp-button.
 */
export default function parse(element, { document }) {
  const c = (name) => document.createComment(` field:${name} `);

  // --- Media: background video URL ---------------------------------------
  // Prefer the desktop <source>, else any .mp4 source, else a .mp4 anchor.
  const desktopSource = element.querySelector(
    'video.cmp-hero-banner__video-background__video--desktop source[src], source[src*=".mp4"]',
  );
  const anyMp4 = element.querySelector('source[src*=".mp4"], a[href*=".mp4"]');
  const videoUrl = (desktopSource && desktopSource.getAttribute('src'))
    || (anyMp4 && (anyMp4.getAttribute('src') || anyMp4.getAttribute('href')))
    || '';

  // Optional poster / fallback image.
  const posterImg = element.querySelector('.cmp-hero-banner__poster img, picture img, img');

  // --- Content: headline + CTA -------------------------------------------
  const headlineSpan = element.querySelector('.cmp-hero-banner__headline1[data-text], .cmp-hero-banner__headline1');
  const headlineText = headlineSpan
    ? (headlineSpan.getAttribute('data-text') || headlineSpan.textContent || '').trim()
    : (element.querySelector('h1, .cmp-hero-banner__headline')?.textContent || '').trim();

  const cta = element.querySelector('.cmp-hero-banner__ctas a[href], a.cmp-button[href], a[role="button"][href]');

  // Empty-block guard.
  if (!videoUrl && !posterImg && !headlineText) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Media row. Prefer a poster image. The background-video URL is carried on a
  // data-video attribute of the block (NOT as link text in a table cell) — a
  // long .mp4 URL inside a markdown table cell gets escaped into literal text by
  // the md2da roundtrip, so we keep it out of the table entirely. The block JS
  // reads data-video (or a poster image) to build the background at render time.
  const mediaCell = [c('image')];
  if (posterImg) mediaCell.push(posterImg);

  const contentCell = [c('text')];
  if (headlineText) {
    const h1 = document.createElement('h1');
    h1.textContent = headlineText;
    contentCell.push(h1);
  }
  if (cta && cta.getAttribute('href')) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', cta.getAttribute('href'));
    a.textContent = (cta.textContent || '').trim() || cta.getAttribute('aria-label') || 'Learn More';
    p.append(a);
    contentCell.push(p);
  }

  // Single-column rows keep the markdown table narrow and roundtrip-safe.
  const cells = [[mediaCell], [contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  if (videoUrl) block.setAttribute('data-video', videoUrl);
  element.replaceWith(block);
}

import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Video hero: a full-bleed background video (or image fallback) with an
 * overlaid headline and a call-to-action.
 * Authored as a single row: a media cell (a link to the video file, or an
 * image) + a content cell (heading + link).
 * @param {Element} block The hero-video block element
 */
export default function decorate(block) {
  if (!block.firstElementChild) return;

  // The block may be authored either as one row with two cells (media | text)
  // or as two single-column rows (media, then text) — the importer emits the
  // latter to keep the markdown table narrow. Flatten to the innermost cells
  // and pick the media cell (has an image/picture/mp4 link) vs the content cell
  // (everything else, e.g. the headline + CTA).
  const rows = [...block.children];
  let cells = rows.flatMap((r) => [...r.children]);
  // A single-column row wraps its content in one extra <div>; unwrap those.
  cells = cells.map((c) => (
    c.children.length === 1 && c.firstElementChild.tagName === 'DIV' ? c.firstElementChild : c
  ));

  const mediaCell = cells.find((c) => c.querySelector('picture, img, a[href*=".mp4"]')) || cells[0];
  const contentCell = cells.find((c) => c !== mediaCell && (
    c.querySelector('h1, h2, h3, a, p') || (c.textContent || '').trim()
  )) || null;

  const media = document.createElement('div');
  media.className = 'hero-video-media';

  // Video source: an author can point at an .mp4 either via a link or the block's
  // data-video attribute. Otherwise fall back to the bundled hero video served
  // from the repo (a raw .mp4 URL in a table cell gets mangled by the md2da
  // roundtrip, and Document Authoring only ingests <img> refs — not videos — so
  // the video is committed to /videos/ and referenced by absolute path here).
  const picture = mediaCell?.querySelector('picture');
  const img = mediaCell?.querySelector('img');
  const videoLink = mediaCell?.querySelector('a[href$=".mp4"], a[href*=".mp4"]');
  let videoUrl = '';
  if (videoLink) {
    videoUrl = videoLink.getAttribute('href');
  } else if (block.dataset.video) {
    videoUrl = block.dataset.video;
  } else {
    // This block is purpose-built for the Vuse full-bleed video hero.
    videoUrl = '/videos/hero-desktop.mp4';
  }

  if (/\.mp4(\?|$)/i.test(videoUrl)) {
    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.muted = true;
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    if (img) video.setAttribute('poster', img.src);
    video.src = videoUrl;
    media.append(video);
  } else if (picture && img) {
    picture.replaceWith(createOptimizedPicture(img.src, img.alt || '', true, [{ width: '1600' }]));
    media.append(mediaCell.querySelector('picture') || picture);
  }

  const content = document.createElement('div');
  content.className = 'hero-video-content';
  if (contentCell) {
    while (contentCell.firstChild) content.append(contentCell.firstChild);
  }

  block.replaceChildren(media, content);
}

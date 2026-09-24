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
  // Video source. An author can point at an .mp4 via a link or the block's
  // data-video attribute. Otherwise pick the committed hero video by page path
  // (Document Authoring only ingests <img> refs — not videos — and hashes image
  // filenames, so a poster-name convention is unreliable; the page path is not).
  // Each page's hero video is committed to /videos/<page>-hero.mp4.
  const PATH_VIDEOS = [
    { match: /\/pro(\/|$)/i, video: '/videos/pro-hero.mp4' },
  ];
  const byPath = PATH_VIDEOS.find((p) => p.match.test(window.location.pathname));
  let videoUrl = '';
  if (videoLink) {
    videoUrl = videoLink.getAttribute('href');
  } else if (block.dataset.video) {
    videoUrl = block.dataset.video;
  } else if (byPath) {
    videoUrl = byPath.video;
  } else {
    // Default Vuse full-bleed hero video (homepage).
    videoUrl = '/videos/hero.mp4';
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

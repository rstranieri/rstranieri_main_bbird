import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Video hero: a full-bleed background video (or image fallback) with an
 * overlaid headline and a call-to-action.
 * Authored as a single row: a media cell (a link to the video file, or an
 * image) + a content cell (heading + link).
 * @param {Element} block The hero-video block element
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cells = [...row.children];
  const mediaCell = cells[0];
  const contentCell = cells[1] || cells[0];

  const media = document.createElement('div');
  media.className = 'hero-video-media';

  // Video source: an anchor/text pointing at an .mp4 (authors paste the URL).
  const videoLink = mediaCell?.querySelector('a[href$=".mp4"], a[href*=".mp4"]');
  const videoUrl = videoLink ? videoLink.getAttribute('href') : (mediaCell?.textContent || '').trim();
  const picture = mediaCell?.querySelector('picture');
  const img = mediaCell?.querySelector('img');

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
  if (contentCell && contentCell !== mediaCell) {
    while (contentCell.firstChild) content.append(contentCell.firstChild);
  }

  block.replaceChildren(media, content);
}

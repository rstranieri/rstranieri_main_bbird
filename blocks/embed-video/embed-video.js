import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Video embed: a poster image with a play overlay and an optional title.
 * Authored as a single row: image (poster) cell + content cell containing a
 * link to the video and optional overlay text. Clicking the poster swaps in
 * the video (native <video> for direct/HLS files, otherwise an iframe).
 * @param {Element} block The embed-video block element
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cells = [...row.children];
  const mediaCell = cells.find((c) => c.querySelector('picture'));
  const contentCell = cells.find((c) => c !== mediaCell) || cells[cells.length - 1];

  const link = block.querySelector('a[href]');
  const videoUrl = link ? link.getAttribute('href') : '';

  const figure = document.createElement('div');
  figure.className = 'embed-video-poster';

  if (mediaCell) {
    const img = mediaCell.querySelector('img');
    if (img) {
      figure.append(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '1200' }]));
    }
  }

  const overlay = document.createElement('div');
  overlay.className = 'embed-video-overlay';
  if (contentCell) {
    [...contentCell.childNodes].forEach((node) => {
      if (node.nodeType === 1 && node.tagName === 'P' && node.querySelector('a')) return;
      overlay.append(node.cloneNode(true));
    });
  }

  const playButton = document.createElement('button');
  playButton.type = 'button';
  playButton.className = 'embed-video-play';
  playButton.setAttribute('aria-label', 'Play video');

  const play = () => {
    if (!videoUrl) return;
    const isFile = /\.(mp4|webm|m3u8)(\?|$)/i.test(videoUrl);
    let media;
    if (isFile) {
      media = document.createElement('video');
      media.setAttribute('controls', '');
      media.setAttribute('autoplay', '');
      media.setAttribute('playsinline', '');
      media.src = videoUrl;
    } else {
      media = document.createElement('iframe');
      media.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      media.setAttribute('allowfullscreen', '');
      media.setAttribute('title', 'Embedded video');
      media.src = videoUrl;
    }
    media.className = 'embed-video-media';
    figure.replaceChildren(media);
  };

  playButton.addEventListener('click', play);
  figure.append(overlay, playButton);
  block.replaceChildren(figure);
}

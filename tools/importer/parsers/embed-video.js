/* eslint-disable */
/* global WebImporter */
/**
 * Parser for embed-video. Base: embed. Source: https://www.bat.com/
 * Generated: 2026-09-22
 *
 * Content model (xwalk, model "embed-video"): single row, 2 columns.
 *   Cell 1: image (reference) -> <!-- field:image --> poster (imageAlt collapses into <img alt>)
 *   Cell 2: text (richtext)   -> <!-- field:text --> overlay title + a link to the video
 *
 * Source: a .batcom-video with a <video src> (HLS .m3u8), a poster is not
 * present as an <img> so the image cell stays empty. The overlay title comes
 * from .batcom-video__title / .batcom-video__info-title; the video src becomes
 * the CTA link.
 */
export default function parse(element, { document }) {
  const c = (name) => document.createComment(` field:${name} `);

  const poster = element.querySelector('.batcom-video__info img, picture img, img');
  const title = element.querySelector('.batcom-video__title, .batcom-video__info-title, h1, h2, h3, h4');
  const pretitle = element.querySelector('.batcom-video__text--pretitle, .batcom-video__info-pre-title');
  const description = element.querySelector('.batcom-video__text--description, .batcom-video__info-text p');
  const videoEl = element.querySelector('video[src], source[src]');
  const linkEl = element.querySelector('a[href]');
  const videoSrc = videoEl ? videoEl.getAttribute('src') : (linkEl ? linkEl.getAttribute('href') : '');

  const titleText = title ? title.textContent.trim() : '';

  const contentCell = [c('text')];
  if (pretitle && pretitle.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = pretitle.textContent.trim();
    contentCell.push(p);
  }
  if (titleText) {
    const h = document.createElement('h3');
    h.textContent = titleText;
    contentCell.push(h);
  }
  if (description && description.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    contentCell.push(p);
  }
  if (videoSrc) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', videoSrc);
    a.textContent = titleText || 'Watch video';
    p.append(a);
    contentCell.push(p);
  }

  if (!videoSrc && contentCell.length === 1) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const imageCell = [];
  if (poster) imageCell.push(c('image'), poster);

  const cells = [[imageCell, contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-video', cells });
  element.replaceWith(block);
}

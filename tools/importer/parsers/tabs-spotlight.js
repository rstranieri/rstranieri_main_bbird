/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-spotlight. Base: tabs. Source: https://www.bat.com/
 * Generated: 2026-09-22
 *
 * Content model (xwalk, container "tabs-spotlight" with "tabs-spotlight-item"):
 * one row per tab, 2 columns.
 *   Cell 1: label (text)      -> <!-- field:label -->  the tab label
 *   Cell 2: content (richtext)-> <!-- field:content --> the panel content (a video teaser)
 *
 * Source: a .cmp-tabs with an <ol class="cmp-tabs__tablist"> of tab labels and
 * matching .cmp-tabs__tabpanel panels. Each panel holds a .batcom-video with a
 * pretitle, title, description and a <video src> (HLS .m3u8).
 */
export default function parse(element, { document }) {
  const c = (name) => document.createComment(` field:${name} `);

  const labels = [...element.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')];
  const panels = [...element.querySelectorAll('.cmp-tabs__tabpanel')];

  const count = Math.max(labels.length, panels.length);
  const cells = [];

  for (let i = 0; i < count; i += 1) {
    const labelEl = labels[i];
    const panel = panels[i];
    const label = labelEl ? labelEl.textContent.trim() : `Tab ${i + 1}`;

    const contentCell = [c('content')];

    if (panel) {
      const video = panel.querySelector('.batcom-video');
      const scope = video || panel;
      const pretitle = scope.querySelector('.batcom-video__info-pre-title, .batcom-video__text--pretitle');
      const title = scope.querySelector('.batcom-video__info-title, .batcom-video__title, h1, h2, h3, h4');
      const description = scope.querySelector('.batcom-video__info-text p, .batcom-video__text--description, p');
      const videoEl = scope.querySelector('video[src], source[src]');
      const videoSrc = videoEl ? videoEl.getAttribute('src') : '';

      if (pretitle && pretitle.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = pretitle.textContent.trim();
        contentCell.push(p);
      }
      if (title && title.textContent.trim()) {
        const h = document.createElement('h3');
        h.textContent = title.textContent.trim();
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
        a.textContent = (title && title.textContent.trim()) || 'Watch video';
        p.append(a);
        contentCell.push(p);
      }
    }

    cells.push([[c('label'), document.createTextNode(label)], contentCell]);
  }

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-spotlight', cells });
  element.replaceWith(block);
}

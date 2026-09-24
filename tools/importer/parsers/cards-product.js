/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-product. Base: cards. Source: https://www.vusevapor.com/
 * Generated: 2026-09-22
 *
 * Content model (xwalk, container "cards-product" with "cards-product-item"):
 * one row per product tile, 2 columns.
 *   Cell 1: image (reference) -> <!-- field:image --> product image (imageAlt collapses into <img alt>)
 *   Cell 2: text  (richtext)  -> <!-- field:text --> product/flavor name, optional link
 *
 * Source: #carousel-exclude-pro / #carousel-include-pro .cmp-carousel with
 * .cmp-carousel-slide items. Each slide holds a .cmp-image whose product name
 * lives in the [data-title] attribute (and the link's aria-label); the tile
 * links via a.cmp-image__link. The picture uses <source srcset> (no <img> in
 * the redesigned markup), so the image URL is read from data-asset / srcset.
 */
export default function parse(element, { document }) {
  const c = (name) => document.createComment(` field:${name} `);

  const buildTileRow = (slide) => {
    const imageCmp = slide.querySelector('.cmp-image');
    const link = slide.querySelector('a.cmp-image__link[href], a[href]');

    // Product name: prefer the image data-title, else the link aria-label.
    const name = (imageCmp && imageCmp.getAttribute('data-title'))
      || (link && link.getAttribute('aria-label'))
      || '';

    // Image URL: an <img src>, else data-asset, else the <source srcset>.
    let imgEl = slide.querySelector('picture img, img');
    if (!imgEl) {
      const src = (imageCmp && imageCmp.getAttribute('data-asset'))
        || (slide.querySelector('picture source[srcset]')
          && slide.querySelector('picture source[srcset]').getAttribute('srcset'))
        || '';
      if (src) {
        imgEl = document.createElement('img');
        imgEl.setAttribute('src', src.split(',')[0].trim().split(' ')[0]);
        imgEl.setAttribute('alt', name.trim());
      }
    } else if (name.trim() && !imgEl.getAttribute('alt')) {
      imgEl.setAttribute('alt', name.trim());
    }

    const contentCell = [c('text')];
    if (name.trim()) {
      const p = document.createElement('p');
      if (link && link.getAttribute('href')) {
        const a = document.createElement('a');
        a.setAttribute('href', link.getAttribute('href'));
        a.textContent = name.trim();
        p.append(a);
      } else {
        p.textContent = name.trim();
      }
      contentCell.push(p);
    }

    if (!imgEl && contentCell.length === 1) return null;

    const imageCell = [];
    if (imgEl) imageCell.push(c('image'), imgEl);

    return [imageCell, contentCell];
  };

  let slides = [...element.querySelectorAll('.cmp-carousel-slide')];
  if (!slides.length) slides = [...element.querySelectorAll('li')];
  if (!slides.length) slides = [element];

  const cells = slides.map(buildTileRow).filter(Boolean);

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}

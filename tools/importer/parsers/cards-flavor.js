/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-flavor. Base: cards (renders as a cards-product block).
 * Source: https://www.vusevapor.com/pro.html
 *
 * Cards convention: one row per card, two cells.
 *   Cell 1: image (reference) -> <!-- field:image --> the flavor pack image
 *           (empty cell still included if no image is present)
 *   Cell 2: text  (richtext)  -> <!-- field:text -->
 *             Title       (h3, styled as heading)
 *             Description (paragraph, optional)
 *             CTA         (linked text, optional)
 *
 * Source: the Pro page "product-cards" section holds .cmp-product-card items,
 * each with a .cmp-product-card__flavorImage (pack shot), a
 * .cmp-product-card__flavor_title and a .cmp-product-card__flavor_description.
 */
export default function parse(element, { document }) {
  const c = (name) => document.createComment(` field:${name} `);

  const buildCard = (card) => {
    const title = card.querySelector('.cmp-product-card__flavor_title');
    const desc = card.querySelector('.cmp-product-card__flavor_description');
    const link = card.querySelector('a[href]');

    const titleText = (title && title.textContent.trim())
      || (link && link.getAttribute('aria-label')) || '';

    // Image: an <img>, else a <source srcset>, else data-asset.
    let imgEl = card.querySelector('picture img, img');
    if (!imgEl) {
      const srcset = card.querySelector('picture source[srcset]');
      const dataAsset = card.querySelector('.cmp-image[data-asset]');
      const src = (srcset && srcset.getAttribute('srcset'))
        || (dataAsset && dataAsset.getAttribute('data-asset')) || '';
      if (src) {
        imgEl = document.createElement('img');
        imgEl.setAttribute('src', src.split(',')[0].trim().split(' ')[0]);
        imgEl.setAttribute('alt', titleText);
      }
    } else if (titleText && !imgEl.getAttribute('alt')) {
      imgEl.setAttribute('alt', titleText);
    }

    // Text cell: title (heading), optional description, optional CTA.
    const contentCell = [c('text')];
    if (titleText) {
      const h = document.createElement('h3');
      h.textContent = titleText;
      contentCell.push(h);
    }
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      contentCell.push(p);
    }
    if (link && link.getAttribute('href') && (link.textContent || '').trim()) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      a.textContent = link.textContent.trim();
      p.append(a);
      contentCell.push(p);
    }

    if (!imgEl && contentCell.length === 1) return null;

    // Image cell is always included, even when empty.
    const imageCell = imgEl ? [c('image'), imgEl] : [c('image')];

    return [imageCell, contentCell];
  };

  let cards = [...element.querySelectorAll('.cmp-product-card')];
  cards = cards.filter((card) => !card.querySelector('.cmp-product-card'));
  if (!cards.length) cards = [element];

  const cells = cards.map(buildCard).filter(Boolean);
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Reuse the cards-product block so the flavor cards inherit its styling.
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}

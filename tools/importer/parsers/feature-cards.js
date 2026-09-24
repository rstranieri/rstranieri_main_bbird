/* eslint-disable */
/* global WebImporter */
/**
 * Parser for feature-cards. Base: cards. Source: https://www.vusevapor.com/pro.html
 *
 * Content model (xwalk, container "feature-cards" with "feature-cards-item"):
 * one row per feature, 2 columns.
 *   Cell 1: image (reference) -> <!-- field:image --> the feature icon
 *   Cell 2: text  (richtext)  -> <!-- field:text --> feature title + description
 *
 * Source: the Pro page's "Key Features" section (.cmp-section.key-features). Each
 * feature is an icon image (.image .cmp-image) followed by a title (.text h3) and
 * a description (.text p) in document order. We walk the section's leaf image/text
 * components, start a new feature at each icon, and attach the following text
 * blocks to it. The intro "Key Features" heading (a lone .text with no preceding
 * icon) is left in place as default content.
 */
export default function parse(element, { document }) {
  const c = (name) => document.createComment(` field:${name} `);

  // Leaf icon images and text components, in document order.
  const nodes = [...element.querySelectorAll('.image, .text')].filter((n) => (
    // keep only leaf-level image/text components (not wrappers containing them)
    !n.querySelector('.image, .text')
  ));

  // Resolve an icon <img> from an .image component. The Pro page lazy-loads
  // images (data-cmp-lazy) so there's no <img> at parse time — fall back to the
  // component's data-asset / <source srcset> / data-cmp-src to build one.
  const resolveIcon = (imageComp) => {
    const existing = imageComp.querySelector('img');
    if (existing && existing.getAttribute('src')) return existing;
    const cmp = imageComp.querySelector('.cmp-image') || imageComp;
    const srcset = imageComp.querySelector('source[srcset]');
    const src = cmp.getAttribute('data-asset')
      || (srcset && srcset.getAttribute('srcset').split(',')[0].trim().split(' ')[0])
      || cmp.getAttribute('data-cmp-src')
      || '';
    if (!src) return null;
    const img = document.createElement('img');
    img.setAttribute('src', src);
    img.setAttribute('alt', cmp.getAttribute('data-title') || '');
    return img;
  };

  const features = [];
  let current = null;
  nodes.forEach((node) => {
    if (node.classList.contains('image')) {
      const icon = resolveIcon(node);
      if (icon) {
        current = { icon, texts: [] };
        features.push(current);
      }
    } else if (current && node.classList.contains('text')) {
      const txt = (node.textContent || '').trim();
      // A feature is a title + a single description; cap at two text blocks so a
      // trailing paragraph from the following section isn't absorbed into the
      // last card.
      if (txt && current.texts.length < 2) current.texts.push(node);
    }
  });

  const cells = features.map((f) => {
    const imageCell = [c('image'), f.icon];

    const contentCell = [c('text')];
    f.texts.forEach((t) => {
      // preserve heading vs paragraph: first text block is the title (h3)
      const heading = t.querySelector('h1, h2, h3, h4, h5, h6');
      const el = document.createElement(heading ? 'h3' : 'p');
      el.textContent = (t.textContent || '').trim();
      contentCell.push(el);
    });

    return [imageCell, contentCell];
  }).filter((row) => row[0].length > 1);

  if (!cells.length) {
    // Nothing recognised — leave the section untouched.
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'feature-cards', cells });
  element.replaceWith(block);
}

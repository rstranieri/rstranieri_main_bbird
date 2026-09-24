/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-drop. Base: cards. Source: https://www.vusevapor.com/
 * Generated: 2026-09-22
 *
 * Content model (xwalk, container "cards-drop" with "cards-drop-item"):
 * one row per card, 2 columns.
 *   Cell 1: image (reference) -> <!-- field:image --> (imageAlt collapses into <img alt>)
 *   Cell 2: text  (richtext)  -> <!-- field:text --> linked title, optional description, CTA
 *
 * Source: .article-list.cmp-article-list__redesign holds a Glide carousel whose
 * slides each contain an .article-teaser (image + title link + optional
 * description + action link). Each teaser becomes one card row.
 */
export default function parse(element, { document }) {
  const c = (name) => document.createComment(` field:${name} `);

  const buildCardRow = (card) => {
    const img = card.querySelector('.article-teaser__image img, img');
    const titleLink = card.querySelector('.article-teaser__title-link, .article-teaser__title a[href]');
    const description = card.querySelector('.article-teaser__description');
    const actionLink = card.querySelector('.article-teaser__action-link');
    // Reward points badge (e.g. "+25 PTS") and category label (e.g. "Quiz")
    // overlaid on the card image on the source site.
    const points = card.querySelector('.article-teaser__articleInfo--articlePoints');
    const category = card.querySelector('.article-teaser__category');

    // Content cell: a linked heading, optional description, optional CTA.
    const contentCell = [c('text')];

    // Emit category + points first as distinct marker paragraphs; the block JS
    // lifts these onto the image as overlay badges. Category is prefixed with a
    // bullet marker and points keep their "+NN PTS" form so the JS can detect
    // them without colliding with real body copy.
    if (category && (category.textContent || '').trim()) {
      const p = document.createElement('p');
      p.textContent = `● ${category.textContent.trim()}`;
      contentCell.push(p);
    }
    if (points && (points.textContent || '').trim()) {
      const p = document.createElement('p');
      p.textContent = points.textContent.trim();
      contentCell.push(p);
    }

    if (titleLink && (titleLink.textContent || '').trim()) {
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.setAttribute('href', titleLink.getAttribute('href'));
      a.textContent = titleLink.textContent.trim();
      h3.append(a);
      contentCell.push(h3);
    }
    if (description && (description.textContent || '').trim()) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      contentCell.push(p);
    }
    if (actionLink && actionLink.getAttribute('href')) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', actionLink.getAttribute('href'));
      a.textContent = (actionLink.textContent || '').trim() || 'Read More';
      p.append(a);
      contentCell.push(p);
    }

    // Skip cards with no usable content.
    if (!img && contentCell.length === 1) return null;

    const imageCell = [];
    if (img) imageCell.push(c('image'), img);

    return [imageCell, contentCell];
  };

  // Each slide/teaser is one card. Prefer the article-teaser wrappers.
  let cards = [...element.querySelectorAll('.article-teaser')];
  if (!cards.length) cards = [...element.querySelectorAll('.glide__slide, li')];
  if (!cards.length) cards = [element];

  const cells = cards.map(buildCardRow).filter(Boolean);

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-drop', cells });
  element.replaceWith(block);
}

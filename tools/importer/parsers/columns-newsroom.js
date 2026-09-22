/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-newsroom. Base: columns. Source: https://www.bat.com/
 * Generated: 2026-09-22
 *
 * Content model (xwalk, "columns-newsroom", behaviour columns): single row,
 * 2 column cells. Columns blocks carry only default content and take NO field
 * hints (per hinting rules). Left cell = "Latest stories and features",
 * right cell = "Latest press releases".
 *
 * Source: a .batcom-columncontrol with two .columncontrol__column cells, each
 * holding a .cmp-title heading and a .batcom-list of items
 * (tag/date meta, .cmp-list__item-title heading, description).
 */
export default function parse(element, { document }) {
  const columns = [...element.querySelectorAll('.columncontrol__column')];

  const buildColumn = (col) => {
    const content = [];

    const title = col.querySelector('.cmp-title__text, .cmp-title h1, .cmp-title h2, .cmp-title h3');
    if (title && title.textContent.trim()) {
      const h = document.createElement('h2');
      h.textContent = title.textContent.trim();
      content.push(h);
    }

    const items = [...col.querySelectorAll('li.cmp-list__item')];
    items.forEach((item) => {
      const tag = item.querySelector('.cmp-list__item-tag');
      const date = item.querySelector('.cmp-list__item-date');
      const heading = item.querySelector('.cmp-list__item-title, h1, h2, h3, h4');
      const description = item.querySelector('.cmp-list__item-description');
      const link = item.querySelector('a.cmp-list__item-link[href], a[href]');

      const metaParts = [];
      if (tag && tag.textContent.trim()) metaParts.push(tag.textContent.trim());
      if (date && date.textContent.trim()) metaParts.push(date.textContent.trim());
      if (metaParts.length) {
        const p = document.createElement('p');
        p.textContent = metaParts.join(' | ');
        content.push(p);
      }
      if (heading && heading.textContent.trim()) {
        const h = document.createElement('h4');
        if (link && link.getAttribute('href')) {
          const a = document.createElement('a');
          a.setAttribute('href', link.getAttribute('href'));
          a.textContent = heading.textContent.trim();
          h.append(a);
        } else {
          h.textContent = heading.textContent.trim();
        }
        content.push(h);
      }
      if (description && description.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = description.textContent.trim();
        content.push(p);
      }
    });

    return content;
  };

  const cells = [];
  if (columns.length) {
    cells.push(columns.map((col) => buildColumn(col)));
  }

  if (!cells.length || cells[0].every((cell) => !cell.length)) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-newsroom', cells });
  element.replaceWith(block);
}

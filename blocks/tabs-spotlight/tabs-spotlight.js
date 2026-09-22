import { toClassName } from '../../scripts/aem.js';

/**
 * Spotlight tabs: a self-contained tab switcher. Each authored row is one tab —
 * the first cell holds the tab label, the remaining cell(s) hold the panel content
 * (e.g. a video teaser). Renders a tablist plus switchable panels.
 * @param {Element} block The tabs-spotlight block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const tablist = document.createElement('div');
  tablist.className = 'tabs-spotlight-list';
  tablist.setAttribute('role', 'tablist');

  const panels = document.createElement('div');
  panels.className = 'tabs-spotlight-panels';

  const buttons = [];
  const panelEls = [];

  rows.forEach((row, idx) => {
    const cells = [...row.children];
    const label = (cells[0]?.textContent || `Tab ${idx + 1}`).trim();
    const id = `${toClassName(label) || `tab-${idx + 1}`}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabs-spotlight-tab';
    button.setAttribute('role', 'tab');
    button.id = `tab-${id}`;
    button.setAttribute('aria-controls', `panel-${id}`);
    button.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    button.classList.toggle('is-active', idx === 0);
    button.textContent = label;

    const panel = document.createElement('div');
    panel.className = 'tabs-spotlight-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.id = `panel-${id}`;
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.setAttribute('aria-hidden', idx === 0 ? 'false' : 'true');
    // Panel content = every cell after the label cell.
    cells.slice(1).forEach((cell) => {
      while (cell.firstChild) panel.append(cell.firstChild);
    });

    button.addEventListener('click', () => {
      buttons.forEach((b) => {
        b.setAttribute('aria-selected', 'false');
        b.classList.remove('is-active');
      });
      panelEls.forEach((p) => p.setAttribute('aria-hidden', 'true'));
      button.setAttribute('aria-selected', 'true');
      button.classList.add('is-active');
      panel.setAttribute('aria-hidden', 'false');
    });

    buttons.push(button);
    panelEls.push(panel);
    tablist.append(button);
    panels.append(panel);
  });

  block.replaceChildren(tablist, panels);
}

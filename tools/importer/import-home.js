/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroVideoParser from './parsers/hero-video.js';
import cardsDropParser from './parsers/cards-drop.js';
import teaserStageParser from './parsers/teaser-stage.js';
import cardsProductParser from './parsers/cards-product.js';
import teaserTransactionParser from './parsers/teaser-transaction.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/vuse-cleanup.js';
import sectionsTransformer from './transformers/vuse-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-video': heroVideoParser,
  'cards-drop': cardsDropParser,
  'teaser-stage': teaserStageParser,
  'cards-product': cardsProductParser,
  'teaser-transaction': teaserTransactionParser,
};

// PAGE TEMPLATE CONFIGURATION - embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'Vuse homepage',
  urls: ['https://www.vusevapor.com/'],
  blocks: [
    { name: 'hero-video', instances: ['.cmp-hero-banner--videoBackground'] },
    { name: 'cards-drop', instances: ['.article-list.cmp-article-list__redesign'] },
    { name: 'teaser-stage', instances: ['.cmp-section--background-img', 'section.cmp-gallery-parallax'] },
    { name: 'cards-product', instances: ['#carousel-exclude-pro.cmp-carousel', '#carousel-include-pro.cmp-carousel'] },
    { name: 'teaser-transaction', instances: ['.teaser.cmp-teaser--background-image-height-teaser'] },
  ],
  sections: [
    { id: 'sec-hero-1', name: 'Hero — Vapor Done Right', selector: ['.cmp-hero-banner--videoBackground[id=\'627732359\']'], style: 'dark', blocks: ['hero-video'], defaultContent: [] },
    { id: 'sec-hero-2', name: 'Hero #2', selector: ['.cmp-hero-banner--videoBackground[id=\'1120845041\']'], style: 'dark', blocks: ['hero-video'], defaultContent: [] },
    { id: 'sec-find-your-flavor', name: 'Find Your Flavor CTA', selector: ['.button.cmp-button--vusePro-btn'], style: 'light', blocks: [], defaultContent: [] },
    { id: 'sec-the-drop', name: 'The Drop', selector: ['.section.cmp-section--alignment-left.cmp-section--small-padding'], style: 'light', blocks: ['cards-drop'], defaultContent: [] },
    { id: 'sec-all-access-rewards', name: 'All Access Rewards banner', selector: ['.cmp-section--background-img'], style: 'accent', blocks: ['teaser-stage'], defaultContent: [] },
    { id: 'sec-americas-1-vape', name: 'America\'s #1 Vape', selector: ['.headline.title.cmp-title--color-blue-gradient.cmp-title--align-center.cmp-title--large'], style: 'light', blocks: [], defaultContent: [] },
    { id: 'sec-simple-sleek-stylish', name: 'Simple. Sleek. Stylish.', selector: ['section.cmp-gallery-parallax'], style: 'dark', blocks: ['teaser-stage'], defaultContent: [] },
    { id: 'sec-product-carousels', name: 'Product carousels', selector: ['#carousel-exclude-pro.cmp-carousel', '#carousel-include-pro.cmp-carousel'], style: 'light', blocks: ['cards-product'], defaultContent: [] },
    { id: 'sec-find-a-store', name: 'Find A Store CTA', selector: ['a[href=\'/store-locator.html\']'], style: 'light', blocks: [], defaultContent: [] },
    { id: 'sec-transaction-teasers', name: 'Transaction teasers', selector: ['.section.cmp-section--no-padding .teaser.cmp-teaser--background-image-height-teaser'], style: 'light', blocks: ['teaser-transaction'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then section breaks/metadata
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup (+ section breaks while section elements still exist)
    executeTransformers('beforeTransform', main, payload);

    // 2. Discover blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip already-replaced/detached elements)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section metadata anchored to markers)
    executeTransformers('afterTransform', main, payload);

    // 5. Built-in WebImporter rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path — map root/homepage URL to /index
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};

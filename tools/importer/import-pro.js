/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroVideoParser from './parsers/hero-video.js';
import cardsFlavorParser from './parsers/cards-flavor.js';
import teaserStageParser from './parsers/teaser-stage.js';
import featureCardsParser from './parsers/feature-cards.js';
import teaserTransactionParser from './parsers/teaser-transaction.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/vuse-cleanup.js';
import sectionsTransformer from './transformers/vuse-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-video': heroVideoParser,
  'cards-flavor': cardsFlavorParser,
  'teaser-stage': teaserStageParser,
  'feature-cards': featureCardsParser,
  'teaser-transaction': teaserTransactionParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'pro',
  description: 'Vuse Pro product page',
  urls: ['https://www.vusevapor.com/pro.html'],
  blocks: [
    { name: 'hero-video', instances: ['.cmp-hero-banner--videoBackground'] },
    { name: 'cards-flavor', instances: ['.cmp-section.product-cards'] },
    { name: 'teaser-stage', instances: ['.cmp-section--background-img'] },
    { name: 'feature-cards', instances: ['.cmp-section.key-features'] },
    { name: 'teaser-transaction', instances: ['.teaser.cmp-teaser--background-image-height-teaser'] },
  ],
  sections: [
    { id: 'sec-hero', name: 'Hero — Pro', selector: ['.cmp-hero-banner--videoBackground'], style: 'dark', blocks: ['hero-video'], defaultContent: [] },
    { id: 'sec-page-headline', name: 'Quality Flavors headline', selector: ['.cmp-section.page-headline'], style: 'light', blocks: [], defaultContent: ['.cmp-section.page-headline h1', '.cmp-section.page-headline h2'] },
    { id: 'sec-flavor-cards', name: 'Flavor product cards', selector: ['.cmp-section.product-cards'], style: 'grey', blocks: ['cards-flavor'], defaultContent: [] },
    { id: 'sec-flavor-bands', name: 'Per-flavor bands', selector: ['.cmp-section--background-img'], style: 'dark', blocks: ['teaser-stage'], defaultContent: [] },
    { id: 'sec-key-features', name: 'Key Features', selector: ['.cmp-section.key-features'], style: 'light', blocks: ['feature-cards'], defaultContent: ['.cmp-section.key-features h1'] },
    { id: 'sec-transaction-teasers', name: 'Transaction teasers', selector: ['.teaser.cmp-teaser--background-image-height-teaser'], style: 'light', blocks: ['teaser-transaction'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

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

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

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

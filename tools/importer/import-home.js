/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCarouselParser from './parsers/hero-carousel.js';
import teaserPromoParser from './parsers/teaser-promo.js';
import cardsTopicParser from './parsers/cards-topic.js';
import teaserStageParser from './parsers/teaser-stage.js';
import columnsNewsroomParser from './parsers/columns-newsroom.js';
import cardsNewsParser from './parsers/cards-news.js';
import cardsPressParser from './parsers/cards-press.js';
import tabsSpotlightParser from './parsers/tabs-spotlight.js';
import embedVideoParser from './parsers/embed-video.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/bat-cleanup.js';
import sectionsTransformer from './transformers/bat-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-carousel': heroCarouselParser,
  'teaser-promo': teaserPromoParser,
  'cards-topic': cardsTopicParser,
  'teaser-stage': teaserStageParser,
  'columns-newsroom': columnsNewsroomParser,
  'cards-news': cardsNewsParser,
  'cards-press': cardsPressParser,
  'tabs-spotlight': tabsSpotlightParser,
  'embed-video': embedVideoParser,
};

// PAGE TEMPLATE CONFIGURATION - embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: '',
  urls: ['https://www.bat.com/'],
  blocks: [
    { name: 'hero-carousel', instances: ['.corp-hero-carousel.carousel'] },
    { name: 'teaser-promo', instances: ['.corp-hero-carousel__experience-fragment'] },
    { name: 'cards-topic', instances: ['.columncontrol__base.columncontrol__grid--lt4'] },
    { name: 'teaser-stage', instances: ['.batcom-teaser.batcom-teaser-corp-stage'] },
    { name: 'columns-newsroom', instances: ['.batcom-columncontrol.columncontrol--home.columncontrol--large-height'] },
    { name: 'cards-news', instances: ['.batcom-list.batcom-layout--twoColumns.batcom-list--news-and-stories'] },
    { name: 'cards-press', instances: ['.batcom-list.batcom-layout--oneColumn.batcom-list--news-and-stories'] },
    { name: 'tabs-spotlight', instances: ['.batcom-tabs.tabs.panelcontainer'] },
    { name: 'embed-video', instances: ['.batcom-video'] },
  ],
  sections: [
    { id: 'rc1c2c2', name: 'Hero carousel', selector: ['.batcom-container.batcom-container--full-page-width.batcom-container--noSpacing'], style: null, blocks: ['hero-carousel', 'teaser-promo'], defaultContent: [] },
    { id: 'rc1c2c3', name: 'Our transformation', selector: ['.batcom-container.batcom-space--smallBottom.aem-GridColumn--laptop--none.aem-GridColumn--offset--laptop--0'], style: 'light', blocks: ['cards-topic', 'teaser-stage'], defaultContent: [] },
    { id: 'rc1c2c5', name: 'Latest stories and features / Latest press releases', selector: ['.batcom-columncontrol.columncontrol--home.columncontrol--large-height'], style: 'dark', blocks: ['columns-newsroom', 'cards-news', 'cards-press'], defaultContent: [] },
    { id: 'rc1c2c6', name: 'In the spotlight', selector: ['.batcom-container.batcom-container--background-full-page-width.batcom-container--primary-light'], style: 'grey', blocks: ['tabs-spotlight', 'embed-video'], defaultContent: [] },
    { id: 'rc1c2c7', name: 'Latest results, reports and research', selector: ['.batcom-container.container.responsivegrid.batcom-space--largeBottom.aem-GridColumn--default--12:nth-of-type(7)'], style: 'grey', blocks: ['cards-topic'], defaultContent: [] },
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

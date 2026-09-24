/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document: document2 }) {
    var _a;
    const c = (name) => document2.createComment(` field:${name} `);
    const desktopSource = element.querySelector(
      'video.cmp-hero-banner__video-background__video--desktop source[src], source[src*=".mp4"]'
    );
    const anyMp4 = element.querySelector('source[src*=".mp4"], a[href*=".mp4"]');
    const videoUrl = desktopSource && desktopSource.getAttribute("src") || anyMp4 && (anyMp4.getAttribute("src") || anyMp4.getAttribute("href")) || "";
    const posterImg = element.querySelector(".cmp-hero-banner__poster img, picture img, img");
    const headlineSpan = element.querySelector(".cmp-hero-banner__headline1[data-text], .cmp-hero-banner__headline1");
    const headlineText = headlineSpan ? (headlineSpan.getAttribute("data-text") || headlineSpan.textContent || "").trim() : (((_a = element.querySelector("h1, .cmp-hero-banner__headline")) == null ? void 0 : _a.textContent) || "").trim();
    const cta = element.querySelector('.cmp-hero-banner__ctas a[href], a.cmp-button[href], a[role="button"][href]');
    if (!videoUrl && !posterImg && !headlineText) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const mediaCell = [c("image")];
    if (posterImg) mediaCell.push(posterImg);
    const contentCell = [c("text")];
    if (headlineText) {
      const h1 = document2.createElement("h1");
      h1.textContent = headlineText;
      contentCell.push(h1);
    }
    if (cta && cta.getAttribute("href")) {
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.setAttribute("href", cta.getAttribute("href"));
      a.textContent = (cta.textContent || "").trim() || cta.getAttribute("aria-label") || "Learn More";
      p.append(a);
      contentCell.push(p);
    }
    const cells = [[mediaCell], [contentCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-video", cells });
    if (videoUrl) block.setAttribute("data-video", videoUrl);
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-drop.js
  function parse2(element, { document: document2 }) {
    const c = (name) => document2.createComment(` field:${name} `);
    const buildCardRow = (card) => {
      const img = card.querySelector(".article-teaser__image img, img");
      const titleLink = card.querySelector(".article-teaser__title-link, .article-teaser__title a[href]");
      const description = card.querySelector(".article-teaser__description");
      const actionLink = card.querySelector(".article-teaser__action-link");
      const contentCell = [c("text")];
      if (titleLink && (titleLink.textContent || "").trim()) {
        const h3 = document2.createElement("h3");
        const a = document2.createElement("a");
        a.setAttribute("href", titleLink.getAttribute("href"));
        a.textContent = titleLink.textContent.trim();
        h3.append(a);
        contentCell.push(h3);
      }
      if (description && (description.textContent || "").trim()) {
        const p = document2.createElement("p");
        p.textContent = description.textContent.trim();
        contentCell.push(p);
      }
      if (actionLink && actionLink.getAttribute("href")) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.setAttribute("href", actionLink.getAttribute("href"));
        a.textContent = (actionLink.textContent || "").trim() || "Read More";
        p.append(a);
        contentCell.push(p);
      }
      if (!img && contentCell.length === 1) return null;
      const imageCell = [];
      if (img) imageCell.push(c("image"), img);
      return [imageCell, contentCell];
    };
    let cards = [...element.querySelectorAll(".article-teaser")];
    if (!cards.length) cards = [...element.querySelectorAll(".glide__slide, li")];
    if (!cards.length) cards = [element];
    const cells = cards.map(buildCardRow).filter(Boolean);
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-drop", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/teaser-stage.js
  function parse3(element, { document: document2 }) {
    const c = (name) => document2.createComment(` field:${name} `);
    const clean = (s) => (s || "").replace(/ /g, " ").replace(/\s+/g, " ").trim();
    let img = element.querySelector(".cmp-section__background-picture img, .cmp-section__background-img");
    if (!img) {
      const parallaxImg = element.querySelector(".cmp-gallery-parallax__img[data-desktop-image], .cmp-gallery-parallax__img[data-mobile-image]");
      const bgUrl = parallaxImg && (parallaxImg.getAttribute("data-desktop-image") || parallaxImg.getAttribute("data-mobile-image"));
      if (bgUrl) {
        img = document2.createElement("img");
        img.setAttribute("src", bgUrl);
        img.setAttribute("alt", "");
      }
    }
    const headingEl = element.querySelector(
      ".cmp-gallery-parallax__caption-title, .cmp-text h1, .cmp-text h2, h1, h2, h3"
    );
    const headingText = headingEl ? clean(headingEl.textContent) : "";
    const descTexts = [];
    const seen = /* @__PURE__ */ new Set();
    const descNodes = element.querySelectorAll(
      ".cmp-gallery-parallax__caption-description, .cmp-text p"
    );
    descNodes.forEach((p) => {
      const t = clean(p.textContent);
      if (!t) return;
      if (seen.has(t)) return;
      if (headingText && t === headingText) return;
      seen.add(t);
      descTexts.push(t);
    });
    const cta = element.querySelector('.cmp-button a[href], a[role="button"][href], .cmp-teaser__action-link[href]');
    if (!img && !headingText && !descTexts.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = [];
    if (img) imageCell.push(c("image"), img);
    const contentCell = [c("text")];
    if (headingText) {
      const h = document2.createElement("h2");
      h.textContent = headingText;
      contentCell.push(h);
    }
    descTexts.forEach((t) => {
      const p = document2.createElement("p");
      p.textContent = t;
      contentCell.push(p);
    });
    if (cta && cta.getAttribute("href")) {
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.setAttribute("href", cta.getAttribute("href"));
      a.textContent = clean(cta.textContent) || cta.getAttribute("aria-label") || "Learn More";
      p.append(a);
      contentCell.push(p);
    }
    const cells = [[imageCell, contentCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "teaser-stage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse4(element, { document: document2 }) {
    const c = (name) => document2.createComment(` field:${name} `);
    const buildTileRow = (slide) => {
      const imageCmp = slide.querySelector(".cmp-image");
      const link = slide.querySelector("a.cmp-image__link[href], a[href]");
      const name = imageCmp && imageCmp.getAttribute("data-title") || link && link.getAttribute("aria-label") || "";
      let imgEl = slide.querySelector("picture img, img");
      if (!imgEl) {
        const src = imageCmp && imageCmp.getAttribute("data-asset") || slide.querySelector("picture source[srcset]") && slide.querySelector("picture source[srcset]").getAttribute("srcset") || "";
        if (src) {
          imgEl = document2.createElement("img");
          imgEl.setAttribute("src", src.split(",")[0].trim().split(" ")[0]);
          imgEl.setAttribute("alt", name.trim());
        }
      } else if (name.trim() && !imgEl.getAttribute("alt")) {
        imgEl.setAttribute("alt", name.trim());
      }
      const contentCell = [c("text")];
      if (name.trim()) {
        const p = document2.createElement("p");
        if (link && link.getAttribute("href")) {
          const a = document2.createElement("a");
          a.setAttribute("href", link.getAttribute("href"));
          a.textContent = name.trim();
          p.append(a);
        } else {
          p.textContent = name.trim();
        }
        contentCell.push(p);
      }
      if (!imgEl && contentCell.length === 1) return null;
      const imageCell = [];
      if (imgEl) imageCell.push(c("image"), imgEl);
      return [imageCell, contentCell];
    };
    let slides = [...element.querySelectorAll(".cmp-carousel-slide")];
    if (!slides.length) slides = [...element.querySelectorAll("li")];
    if (!slides.length) slides = [element];
    const cells = slides.map(buildTileRow).filter(Boolean);
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/teaser-transaction.js
  function parse5(element, { document: document2 }) {
    const c = (name) => document2.createComment(` field:${name} `);
    const clean = (s) => (s || "").replace(/ /g, " ").replace(/\s+/g, " ").trim();
    const buildTileRow = (tile) => {
      const img = tile.querySelector(".cmp-teaser__background-picture img, .cmp-teaser__background-img, picture img");
      const heading = tile.querySelector(".cmp-teaser__title, h1, h2, h3, h4");
      const description = tile.querySelector(".cmp-teaser__description");
      const cta = tile.querySelector(".cmp-teaser__action-link[href], a[href]");
      const headingText = heading ? clean(heading.textContent) : "";
      const contentCell = [c("text")];
      if (headingText) {
        const h = document2.createElement("h3");
        h.textContent = headingText;
        contentCell.push(h);
      }
      if (description) {
        const paras = [...description.querySelectorAll("p")];
        if (paras.length) {
          paras.forEach((p) => {
            const t = clean(p.textContent);
            if (t) {
              const np = document2.createElement("p");
              np.textContent = t;
              contentCell.push(np);
            }
          });
        } else {
          const t = clean(description.textContent);
          if (t) {
            const np = document2.createElement("p");
            np.textContent = t;
            contentCell.push(np);
          }
        }
      }
      if (cta && cta.getAttribute("href")) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.setAttribute("href", cta.getAttribute("href"));
        a.textContent = clean(cta.textContent) || "Learn More";
        p.append(a);
        contentCell.push(p);
      }
      if (!img && contentCell.length === 1) return null;
      const imageCell = [];
      if (img) imageCell.push(c("image"), img);
      return [imageCell, contentCell];
    };
    let tiles = [...element.querySelectorAll(".cmp-teaser")];
    if (!tiles.length) tiles = [element];
    const cells = tiles.map(buildTileRow).filter(Boolean);
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "teaser-transaction", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/vuse-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Modal disruptor popup (cleaned.html: 4954 xf wrapper, 4972 grid col, cmp-modal-disruptor)
        ".cmp-experiencefragment--modal-disruptor",
        ".modal-disruptor",
        ".cmp-modal-disruptor",
        // Tobacco-preferences update reminder modal + its survey form (4499 grid col, 4884 <form>)
        ".tobacco-preferences-update-reminder",
        ".cmp-tobacco-preferences-update-reminder",
        ".cmp-form",
        // Camera capture modal used by the loyalty code-entry widget (780)
        ".cmp-camera"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Global header / navigation (cleaned.html: 368 <header>, 371 .cmp-header, 392 .cmp-navigation)
        "header",
        ".cmp-header",
        ".cmp-navigation",
        // Footer (4140 .cmp-experiencefragment--footer, 4166 .cmp-footer)
        "footer",
        ".cmp-experiencefragment--footer",
        ".cmp-footer",
        // Surgeon general warning / announcement bars (137, 169 announcement-flavors, 188 .cmp-announcement)
        ".surgeon-general-warning",
        ".cmp-surgeon-general-warning",
        ".cmp-announcement",
        // Authenticated-container membership UI wrapper (336 .authenticated-container, 340 .cmp-authenticated-container)
        ".authenticated-container",
        ".cmp-authenticated-container",
        // Loyalty Plus widgets (3925 enrollment, 488 rewardstatus, 479 rewardscontainer, 839 activity-feed, 705 codeentry)
        ".cmp-lplus-enrollment",
        ".cmp-lplus-rewardstatus",
        ".cmp-lplus-bonus",
        ".cmp-lplus-codeentry",
        ".rewardscontainer",
        ".cmp-activity-feed",
        // Safe non-authorable noise (none present in this page, kept for other pages on the same site)
        "script",
        "style",
        "noscript",
        "iframe",
        "link"
      ]);
      element.querySelectorAll("[data-cmp-data-layer], [data-cmp-clickable]").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
        el.removeAttribute("data-cmp-clickable");
      });
    }
  }

  // tools/importer/transformers/vuse-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "hero-video": parse,
    "cards-drop": parse2,
    "teaser-stage": parse3,
    "cards-product": parse4,
    "teaser-transaction": parse5
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "Vuse homepage",
    urls: ["https://www.vusevapor.com/"],
    blocks: [
      { name: "hero-video", instances: [".cmp-hero-banner--videoBackground"] },
      { name: "cards-drop", instances: [".article-list.cmp-article-list__redesign"] },
      { name: "teaser-stage", instances: [".cmp-section--background-img", "section.cmp-gallery-parallax"] },
      { name: "cards-product", instances: ["#carousel-exclude-pro.cmp-carousel", "#carousel-include-pro.cmp-carousel"] },
      { name: "teaser-transaction", instances: [".teaser.cmp-teaser--background-image-height-teaser"] }
    ],
    sections: [
      { id: "sec-hero-1", name: "Hero \u2014 Vapor Done Right", selector: [".cmp-hero-banner--videoBackground[id='627732359']"], style: "dark", blocks: ["hero-video"], defaultContent: [] },
      { id: "sec-hero-2", name: "Hero #2", selector: [".cmp-hero-banner--videoBackground[id='1120845041']"], style: "dark", blocks: ["hero-video"], defaultContent: [] },
      { id: "sec-find-your-flavor", name: "Find Your Flavor CTA", selector: [".button.cmp-button--vusePro-btn"], style: "light", blocks: [], defaultContent: [] },
      { id: "sec-the-drop", name: "The Drop", selector: [".section.cmp-section--alignment-left.cmp-section--small-padding"], style: "light", blocks: ["cards-drop"], defaultContent: [] },
      { id: "sec-all-access-rewards", name: "All Access Rewards banner", selector: [".cmp-section--background-img"], style: "accent", blocks: ["teaser-stage"], defaultContent: [] },
      { id: "sec-americas-1-vape", name: "America's #1 Vape", selector: [".headline.title.cmp-title--color-blue-gradient.cmp-title--align-center.cmp-title--large"], style: "light", blocks: [], defaultContent: [] },
      { id: "sec-simple-sleek-stylish", name: "Simple. Sleek. Stylish.", selector: ["section.cmp-gallery-parallax"], style: "dark", blocks: ["teaser-stage"], defaultContent: [] },
      { id: "sec-product-carousels", name: "Product carousels", selector: ["#carousel-exclude-pro.cmp-carousel", "#carousel-include-pro.cmp-carousel"], style: "light", blocks: ["cards-product"], defaultContent: [] },
      { id: "sec-find-a-store", name: "Find A Store CTA", selector: ["a[href='/store-locator.html']"], style: "light", blocks: [], defaultContent: [] },
      { id: "sec-transaction-teasers", name: "Transaction teasers", selector: [".section.cmp-section--no-padding .teaser.cmp-teaser--background-image-height-teaser"], style: "light", blocks: ["teaser-transaction"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
  var import_home_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();

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

  // tools/importer/parsers/hero-carousel.js
  function parse(element, { document: document2 }) {
    const c = (name) => document2.createComment(` field:${name} `);
    const imageSwiper = element.querySelector(".corp-hero-carousel__image-swiper .swiper-wrapper");
    const imageSlides = imageSwiper ? [...imageSwiper.children].filter((s) => s.querySelector("img")) : [...element.querySelectorAll(".corp-hero-carousel__image-image")].map((img) => img);
    const contentSwiper = element.querySelector(".corp-hero-carousel__teaser__content-swiper .swiper-wrapper");
    const contentSlides = contentSwiper ? [...contentSwiper.children] : [...element.querySelectorAll(".corp-hero-carousel__teaser__title")].map((h) => h.closest("div"));
    const count = Math.max(imageSlides.length, contentSlides.length);
    const cells = [];
    for (let i = 0; i < count; i += 1) {
      const imgSlide = imageSlides[i];
      const contentSlide = contentSlides[i];
      const img = imgSlide ? imgSlide.tagName === "IMG" ? imgSlide : imgSlide.querySelector("img") : null;
      const heading = contentSlide && contentSlide.querySelector(".corp-hero-carousel__teaser__title, h1, h2, h3");
      const description = contentSlide && contentSlide.querySelector(".corp-hero-carousel__teaser__description, p");
      const link = contentSlide && contentSlide.querySelector("a[href]");
      if (!img && !heading && !description) continue;
      const cell = [];
      if (img) cell.push(c("image"), img);
      if (heading) {
        const h = document2.createElement("h2");
        h.textContent = heading.textContent.trim();
        cell.push(c("heading"), h);
      }
      if (description) {
        const p = document2.createElement("p");
        p.textContent = description.textContent.trim();
        cell.push(c("text"), p);
      }
      if (link) {
        const a = document2.createElement("a");
        a.setAttribute("href", link.getAttribute("href"));
        a.textContent = link.textContent.trim();
        cell.push(c("link"), a);
      }
      cells.push([cell]);
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/teaser-promo.js
  function parse2(element, { document: document2 }) {
    const c = (name) => document2.createComment(` field:${name} `);
    const img = element.querySelector("img");
    const eyebrow = element.querySelector(".hero-carousel-xf-override span, .small");
    const textCells = [...element.querySelectorAll(".cmp-text > p, .cmp-text > h3")];
    const bodyHeading = element.querySelector("h3");
    const link = element.querySelector("a[href]:not(.cmp-image__link)") || element.querySelector("a[href]");
    const contentCell = [];
    const seen = /* @__PURE__ */ new Set();
    if (eyebrow) {
      const text = eyebrow.textContent.trim();
      const p = document2.createElement("p");
      p.textContent = text;
      contentCell.push(p);
      seen.add(text);
    }
    textCells.forEach((el) => {
      const text = el.textContent.trim();
      if (!text) return;
      if (el.querySelector && el.querySelector("a")) return;
      if (bodyHeading && el === bodyHeading) return;
      if (seen.has(text)) return;
      seen.add(text);
      const p = document2.createElement("p");
      p.textContent = text;
      contentCell.push(p);
    });
    if (bodyHeading && bodyHeading.textContent.trim()) {
      const h = document2.createElement("h3");
      h.textContent = bodyHeading.textContent.trim();
      contentCell.push(h);
    }
    if (link) {
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.setAttribute("href", link.getAttribute("href"));
      a.textContent = link.textContent.trim() || "Register now";
      p.append(a);
      contentCell.push(p);
    }
    if (!img && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = [];
    if (img) imageCell.push(c("image"), img);
    const cells = [[imageCell, [c("text"), ...contentCell]]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "teaser-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-topic.js
  function parse3(element, { document: document2 }) {
    const c = (name) => document2.createComment(` field:${name} `);
    const buildCardRow = (card) => {
      const img = card.querySelector(".cmp-teaser__image img, img");
      const pretitle = card.querySelector(".cmp-teaser__pretitle");
      const heading = card.querySelector(".cmp-teaser__title, h1, h2, h3, h4");
      const description = card.querySelector(".cmp-teaser__description");
      const link = card.querySelector(".cmp-teaser__action-link, a[href]");
      const contentCell = [c("text")];
      if (pretitle && pretitle.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = pretitle.textContent.trim();
        contentCell.push(p);
      }
      if (heading && heading.textContent.trim()) {
        const h = document2.createElement("h3");
        h.textContent = heading.textContent.trim();
        contentCell.push(h);
      }
      if (description) {
        [...description.querySelectorAll("p")].forEach((p) => {
          if (p.textContent.trim()) {
            const np = document2.createElement("p");
            np.textContent = p.textContent.trim();
            contentCell.push(np);
          }
        });
        if (!description.querySelector("p") && description.textContent.trim()) {
          const p = document2.createElement("p");
          p.textContent = description.textContent.trim();
          contentCell.push(p);
        }
      }
      if (link && link.getAttribute("href")) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.setAttribute("href", link.getAttribute("href"));
        a.textContent = link.textContent.trim();
        p.append(a);
        contentCell.push(p);
      }
      const imageCell = [];
      if (img) imageCell.push(c("image"), img);
      if (!img && contentCell.length === 1) return null;
      return [imageCell, contentCell];
    };
    let cards = [...element.querySelectorAll(".batcom-teaser-corp--vertical")];
    if (!cards.length) cards = [element];
    const cells = cards.map(buildCardRow).filter(Boolean);
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-topic", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/teaser-stage.js
  function parse4(element, { document: document2 }) {
    const c = (name) => document2.createComment(` field:${name} `);
    const img = element.querySelector(".cmp-teaser__image img, img");
    const pretitle = element.querySelector(".cmp-teaser__pretitle");
    const heading = element.querySelector(".cmp-teaser__title, h1, h2, h3, h4");
    const description = element.querySelector(".cmp-teaser__description");
    const link = element.querySelector(".cmp-teaser__action-link, a[href]");
    const contentCell = [c("text")];
    if (pretitle && pretitle.textContent.trim()) {
      const p = document2.createElement("p");
      p.textContent = pretitle.textContent.trim();
      contentCell.push(p);
    }
    if (heading && heading.textContent.trim()) {
      const h = document2.createElement("h2");
      h.textContent = heading.textContent.trim();
      contentCell.push(h);
    }
    if (description) {
      [...description.querySelectorAll("p")].forEach((p) => {
        if (p.textContent.trim()) {
          const np = document2.createElement("p");
          np.textContent = p.textContent.trim();
          contentCell.push(np);
        }
      });
      if (!description.querySelector("p") && description.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = description.textContent.trim();
        contentCell.push(p);
      }
    }
    if (link && link.getAttribute("href")) {
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.setAttribute("href", link.getAttribute("href"));
      a.textContent = link.textContent.trim();
      p.append(a);
      contentCell.push(p);
    }
    if (!img && contentCell.length === 1) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = [];
    if (img) imageCell.push(c("image"), img);
    const cells = [[imageCell, contentCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "teaser-stage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-newsroom.js
  function parse5(element, { document: document2 }) {
    const columns = [...element.querySelectorAll(".columncontrol__column")];
    const buildColumn = (col) => {
      const content = [];
      const title = col.querySelector(".cmp-title__text, .cmp-title h1, .cmp-title h2, .cmp-title h3");
      if (title && title.textContent.trim()) {
        const h = document2.createElement("h2");
        h.textContent = title.textContent.trim();
        content.push(h);
      }
      const items = [...col.querySelectorAll("li.cmp-list__item")];
      items.forEach((item) => {
        const tag = item.querySelector(".cmp-list__item-tag");
        const date = item.querySelector(".cmp-list__item-date");
        const heading = item.querySelector(".cmp-list__item-title, h1, h2, h3, h4");
        const description = item.querySelector(".cmp-list__item-description");
        const link = item.querySelector("a.cmp-list__item-link[href], a[href]");
        const metaParts = [];
        if (tag && tag.textContent.trim()) metaParts.push(tag.textContent.trim());
        if (date && date.textContent.trim()) metaParts.push(date.textContent.trim());
        if (metaParts.length) {
          const p = document2.createElement("p");
          p.textContent = metaParts.join(" | ");
          content.push(p);
        }
        if (heading && heading.textContent.trim()) {
          const h = document2.createElement("h4");
          if (link && link.getAttribute("href")) {
            const a = document2.createElement("a");
            a.setAttribute("href", link.getAttribute("href"));
            a.textContent = heading.textContent.trim();
            h.append(a);
          } else {
            h.textContent = heading.textContent.trim();
          }
          content.push(h);
        }
        if (description && description.textContent.trim()) {
          const p = document2.createElement("p");
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
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-newsroom", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse6(element, { document: document2 }) {
    const c = (name) => document2.createComment(` field:${name} `);
    const items = [...element.querySelectorAll("li.cmp-list__item")];
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".cmp-list__item-image img, img");
      const tag = item.querySelector(".cmp-list__item-tag");
      const date = item.querySelector(".cmp-list__item-date");
      const heading = item.querySelector(".cmp-list__item-title, h1, h2, h3, h4");
      const description = item.querySelector(".cmp-list__item-description");
      const contentCell = [c("text")];
      const metaParts = [];
      if (tag && tag.textContent.trim()) metaParts.push(tag.textContent.trim());
      if (date && date.textContent.trim()) metaParts.push(date.textContent.trim());
      if (metaParts.length) {
        const p = document2.createElement("p");
        p.textContent = metaParts.join(" | ");
        contentCell.push(p);
      }
      if (heading && heading.textContent.trim()) {
        const h = document2.createElement("h4");
        h.textContent = heading.textContent.trim();
        contentCell.push(h);
      }
      if (description && description.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = description.textContent.trim();
        contentCell.push(p);
      }
      if (contentCell.length === 1 && !img) return;
      const imageCell = [];
      if (img) imageCell.push(c("image"), img);
      cells.push([imageCell, contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-press.js
  function parse7(element, { document: document2 }) {
    const c = (name) => document2.createComment(` field:${name} `);
    const items = [...element.querySelectorAll("li.cmp-list__item")];
    const cells = [];
    items.forEach((item) => {
      const tag = item.querySelector(".cmp-list__item-tag");
      const date = item.querySelector(".cmp-list__item-date");
      const heading = item.querySelector(".cmp-list__item-title, h1, h2, h3, h4");
      const description = item.querySelector(".cmp-list__item-description");
      const contentCell = [c("text")];
      const metaParts = [];
      if (tag && tag.textContent.trim()) metaParts.push(tag.textContent.trim());
      if (date && date.textContent.trim()) metaParts.push(date.textContent.trim());
      if (metaParts.length) {
        const p = document2.createElement("p");
        p.textContent = metaParts.join(" | ");
        contentCell.push(p);
      }
      if (heading && heading.textContent.trim()) {
        const h = document2.createElement("h4");
        h.textContent = heading.textContent.trim();
        contentCell.push(h);
      }
      if (description && description.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = description.textContent.trim();
        contentCell.push(p);
      }
      if (contentCell.length === 1) return;
      cells.push([contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-press", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-spotlight.js
  function parse8(element, { document: document2 }) {
    const c = (name) => document2.createComment(` field:${name} `);
    const labels = [...element.querySelectorAll(".cmp-tabs__tablist > li.cmp-tabs__tab")];
    const panels = [...element.querySelectorAll(".cmp-tabs__tabpanel")];
    const count = Math.max(labels.length, panels.length);
    const cells = [];
    for (let i = 0; i < count; i += 1) {
      const labelEl = labels[i];
      const panel = panels[i];
      const label = labelEl ? labelEl.textContent.trim() : `Tab ${i + 1}`;
      const contentCell = [c("content")];
      if (panel) {
        const video = panel.querySelector(".batcom-video");
        const scope = video || panel;
        const pretitle = scope.querySelector(".batcom-video__info-pre-title, .batcom-video__text--pretitle");
        const title = scope.querySelector(".batcom-video__info-title, .batcom-video__title, h1, h2, h3, h4");
        const description = scope.querySelector(".batcom-video__info-text p, .batcom-video__text--description, p");
        const videoEl = scope.querySelector("video[src], source[src]");
        const videoSrc = videoEl ? videoEl.getAttribute("src") : "";
        if (pretitle && pretitle.textContent.trim()) {
          const p = document2.createElement("p");
          p.textContent = pretitle.textContent.trim();
          contentCell.push(p);
        }
        if (title && title.textContent.trim()) {
          const h = document2.createElement("h3");
          h.textContent = title.textContent.trim();
          contentCell.push(h);
        }
        if (description && description.textContent.trim()) {
          const p = document2.createElement("p");
          p.textContent = description.textContent.trim();
          contentCell.push(p);
        }
        if (videoSrc) {
          const p = document2.createElement("p");
          const a = document2.createElement("a");
          a.setAttribute("href", videoSrc);
          a.textContent = title && title.textContent.trim() || "Watch video";
          p.append(a);
          contentCell.push(p);
        }
      }
      cells.push([[c("label"), document2.createTextNode(label)], contentCell]);
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-spotlight", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-video.js
  function parse9(element, { document: document2 }) {
    const c = (name) => document2.createComment(` field:${name} `);
    const poster = element.querySelector(".batcom-video__info img, picture img, img");
    const title = element.querySelector(".batcom-video__title, .batcom-video__info-title, h1, h2, h3, h4");
    const pretitle = element.querySelector(".batcom-video__text--pretitle, .batcom-video__info-pre-title");
    const description = element.querySelector(".batcom-video__text--description, .batcom-video__info-text p");
    const videoEl = element.querySelector("video[src], source[src]");
    const linkEl = element.querySelector("a[href]");
    const videoSrc = videoEl ? videoEl.getAttribute("src") : linkEl ? linkEl.getAttribute("href") : "";
    const titleText = title ? title.textContent.trim() : "";
    const contentCell = [c("text")];
    if (pretitle && pretitle.textContent.trim()) {
      const p = document2.createElement("p");
      p.textContent = pretitle.textContent.trim();
      contentCell.push(p);
    }
    if (titleText) {
      const h = document2.createElement("h3");
      h.textContent = titleText;
      contentCell.push(h);
    }
    if (description && description.textContent.trim()) {
      const p = document2.createElement("p");
      p.textContent = description.textContent.trim();
      contentCell.push(p);
    }
    if (videoSrc) {
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.setAttribute("href", videoSrc);
      a.textContent = titleText || "Watch video";
      p.append(a);
      contentCell.push(p);
    }
    if (!videoSrc && contentCell.length === 1) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = [];
    if (poster) imageCell.push(c("image"), poster);
    const cells = [[imageCell, contentCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "embed-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/bat-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        "#onetrust-pc-sdk",
        ".onetrust-pc-dark-filter",
        // Flyout/search close buttons leave stray "Close" text in content.
        ".batcom-flyout__closebutton",
        ".corp-search-bar__close"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Global header / mega-nav (header XF + header element + nav)
        ".cmp-experiencefragment--header",
        "header.batcom-header",
        "nav.cmp-navigationcorp",
        // Breadcrumb
        "nav.cmp-breadcrumb",
        // Header search widget
        ".batcom-search",
        // Global footer (footer XF)
        ".cmp-experiencefragment--footer",
        // Live UK share-price ticker (homepage + footer variants)
        ".batcom-shareprice--home",
        ".batcom-shareprice",
        // Scripts, styles, links and other non-authorable noise
        "script",
        "style",
        "noscript",
        "iframe",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/bat-sections.js
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
    "hero-carousel": parse,
    "teaser-promo": parse2,
    "cards-topic": parse3,
    "teaser-stage": parse4,
    "columns-newsroom": parse5,
    "cards-news": parse6,
    "cards-press": parse7,
    "tabs-spotlight": parse8,
    "embed-video": parse9
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "",
    urls: ["https://www.bat.com/"],
    blocks: [
      { name: "hero-carousel", instances: [".corp-hero-carousel.carousel"] },
      { name: "teaser-promo", instances: [".corp-hero-carousel__experience-fragment"] },
      { name: "cards-topic", instances: [".columncontrol__base.columncontrol__grid--lt4"] },
      { name: "teaser-stage", instances: [".batcom-teaser.batcom-teaser-corp-stage"] },
      { name: "columns-newsroom", instances: [".batcom-columncontrol.columncontrol--home.columncontrol--large-height"] },
      { name: "cards-news", instances: [".batcom-list.batcom-layout--twoColumns.batcom-list--news-and-stories"] },
      { name: "cards-press", instances: [".batcom-list.batcom-layout--oneColumn.batcom-list--news-and-stories"] },
      { name: "tabs-spotlight", instances: [".batcom-tabs.tabs.panelcontainer"] },
      { name: "embed-video", instances: [".batcom-video"] }
    ],
    sections: [
      { id: "rc1c2c2", name: "Hero carousel", selector: [".batcom-container.batcom-container--full-page-width.batcom-container--noSpacing"], style: null, blocks: ["hero-carousel", "teaser-promo"], defaultContent: [] },
      { id: "rc1c2c3", name: "Our transformation", selector: [".batcom-container.batcom-space--smallBottom.aem-GridColumn--laptop--none.aem-GridColumn--offset--laptop--0"], style: "light", blocks: ["cards-topic", "teaser-stage"], defaultContent: [] },
      { id: "rc1c2c5", name: "Latest stories and features / Latest press releases", selector: [".batcom-columncontrol.columncontrol--home.columncontrol--large-height"], style: "dark", blocks: ["columns-newsroom", "cards-news", "cards-press"], defaultContent: [] },
      { id: "rc1c2c6", name: "In the spotlight", selector: [".batcom-container.batcom-container--background-full-page-width.batcom-container--primary-light"], style: "grey", blocks: ["tabs-spotlight", "embed-video"], defaultContent: [] },
      { id: "rc1c2c7", name: "Latest results, reports and research", selector: [".batcom-container.container.responsivegrid.batcom-space--largeBottom.aem-GridColumn--default--12:nth-of-type(7)"], style: "grey", blocks: ["cards-topic"], defaultContent: [] }
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

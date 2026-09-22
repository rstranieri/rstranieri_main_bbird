/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-carousel. Base: hero. Source: https://www.bat.com/
 * Generated: 2026-09-22
 *
 * Content model (xwalk, model "hero-carousel"): one authored row per slide.
 * Each slide is a single cell holding the fields:
 *   image (reference)  -> <!-- field:image -->  (imageAlt collapses into <img alt>)
 *   heading (text)     -> <!-- field:heading -->
 *   text (richtext)    -> <!-- field:text -->
 *   link (aem-content) -> <!-- field:link -->   (linkText collapses into anchor text)
 *
 * Source: the BAT hero is two parallel Swiper tracks — an image track
 * (.corp-hero-carousel__image-swiper) and a text track
 * (.corp-hero-carousel__teaser__content-swiper). Slides are paired by index.
 */
export default function parse(element, { document }) {
  const c = (name) => document.createComment(` field:${name} `);

  // Image slides (in DOM order) — direct children of the image swiper wrapper.
  const imageSwiper = element.querySelector('.corp-hero-carousel__image-swiper .swiper-wrapper');
  const imageSlides = imageSwiper
    ? [...imageSwiper.children].filter((s) => s.querySelector('img'))
    : [...element.querySelectorAll('.corp-hero-carousel__image-image')].map((img) => img);

  // Content slides — title / description / link per slide.
  const contentSwiper = element.querySelector('.corp-hero-carousel__teaser__content-swiper .swiper-wrapper');
  const contentSlides = contentSwiper
    ? [...contentSwiper.children]
    : [...element.querySelectorAll('.corp-hero-carousel__teaser__title')].map((h) => h.closest('div'));

  const count = Math.max(imageSlides.length, contentSlides.length);
  const cells = [];

  for (let i = 0; i < count; i += 1) {
    const imgSlide = imageSlides[i];
    const contentSlide = contentSlides[i];

    const img = imgSlide
      ? (imgSlide.tagName === 'IMG' ? imgSlide : imgSlide.querySelector('img'))
      : null;
    const heading = contentSlide && contentSlide.querySelector('.corp-hero-carousel__teaser__title, h1, h2, h3');
    const description = contentSlide && contentSlide.querySelector('.corp-hero-carousel__teaser__description, p');
    const link = contentSlide && contentSlide.querySelector('a[href]');

    if (!img && !heading && !description) continue;

    const cell = [];
    if (img) cell.push(c('image'), img);
    if (heading) {
      // Normalise to a real heading element.
      const h = document.createElement('h2');
      h.textContent = heading.textContent.trim();
      cell.push(c('heading'), h);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      cell.push(c('text'), p);
    }
    if (link) {
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      a.textContent = link.textContent.trim();
      cell.push(c('link'), a);
    }
    cells.push([cell]);
  }

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-carousel', cells });
  element.replaceWith(block);
}

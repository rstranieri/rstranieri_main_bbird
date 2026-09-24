/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Vuse (vusevapor.com) site-wide cleanup.
 *
 * Removes non-authorable site chrome so only the main content of the 10
 * marketing sections remains. All selectors below were verified against
 * migration-work/cleaned.html (line references in comments).
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / modals / popups and the sign-up survey form — removed early so
    // they never interfere with block parsing or leak overlay markup.
    WebImporter.DOMUtils.remove(element, [
      // Modal disruptor popup (cleaned.html: 4954 xf wrapper, 4972 grid col, cmp-modal-disruptor)
      '.cmp-experiencefragment--modal-disruptor',
      '.modal-disruptor',
      '.cmp-modal-disruptor',
      // Tobacco-preferences update reminder modal + its survey form (4499 grid col, 4884 <form>)
      '.tobacco-preferences-update-reminder',
      '.cmp-tobacco-preferences-update-reminder',
      '.cmp-form',
      // Camera capture modal used by the loyalty code-entry widget (780)
      '.cmp-camera',
    ]);

    // --- De-duplication of responsive + geo-targeted variants ---
    // The source ships every module twice-or-more: a mobile-only copy
    // (.d-md-none, hidden >=768px) alongside the desktop copy (.d-md-block),
    // plus per-US-state geo variants of whole sections (.cmp-section.d-none
    // carrying at_XX state classes). Importing all of them produces duplicated
    // headings, paragraphs, the Offers tile, and the hero. Keep exactly one
    // canonical (desktop) copy of each.

    // 1. Drop mobile-only duplicate nodes (desktop .d-md-block copy is kept).
    WebImporter.DOMUtils.remove(element, ['.d-md-none']);

    // 2. For groups that repeat as geo/state variants, keep only the FIRST
    //    occurrence and remove the rest.
    const dedupeKeepFirst = (selector) => {
      const nodes = element.querySelectorAll(selector);
      for (let i = 1; i < nodes.length; i += 1) {
        nodes[i].remove();
      }
    };
    // One video hero (target design shows a single device+wordmark video hero).
    dedupeKeepFirst('.cmp-hero-banner--videoBackground');
    // One Offers transaction tile (two per-state offers-tile sections exist).
    dedupeKeepFirst('.cmp-section.offers-tile');

    // 3. The Drop intro ships two layout variants in the same section: a
    //    (desktop) logo + "exclusive content drops" + Explore More group, and a
    //    second group with the Drop_Mobile_Cards image, a duplicate "The Drop"
    //    <h1>, and a "premium content from Vuse" line. Keep the first, drop the
    //    second: remove the duplicate mobile-cards image and every text
    //    component after the first that repeats the intro copy/heading.
    element.querySelectorAll('img[src*="Drop_Mobile_Cards"]').forEach((img) => {
      const wrapper = img.closest('.image') || img.closest('.cmp-image') || img;
      wrapper.remove();
    });
    let seenDropHeading = 0;
    let seenIntroCopy = 0;
    element.querySelectorAll('.text').forEach((t) => {
      const txt = (t.textContent || '').trim();
      const isDropHeading = /^the drop$/i.test(txt) && t.querySelector('h1, h2');
      const isIntroCopy = /watch, play and earn points/i.test(txt);
      if (isDropHeading) {
        seenDropHeading += 1;
        if (seenDropHeading > 1) t.remove();
      } else if (isIntroCopy) {
        seenIntroCopy += 1;
        if (seenIntroCopy > 1) t.remove();
      }
    });

    // 4. The Drop header cleanup. The source header carries a "The Drop" wordmark
    //    logo image and an "Explore More" CTA that the live homepage no longer
    //    shows, and it orders the intro copy BEFORE the heading. Remove the logo
    //    + CTA, and move the "The Drop" heading ABOVE the intro line so the order
    //    reads: heading → "Watch, play and earn points…" → quiz carousel.
    element.querySelectorAll('img[src*="TheDrop-Logo"]').forEach((img) => {
      const wrapper = img.closest('.image') || img.closest('.cmp-image') || img;
      wrapper.remove();
    });
    element.querySelectorAll('.button').forEach((btn) => {
      if (/explore more/i.test((btn.textContent || '').trim())) btn.remove();
    });
    const dropHeading = [...element.querySelectorAll('.text')].find(
      (t) => /^the drop$/i.test((t.textContent || '').trim()) && t.querySelector('h1, h2'),
    );
    const introCopy = [...element.querySelectorAll('.text')].find(
      (t) => /watch, play and earn points/i.test(t.textContent || ''),
    );
    if (dropHeading && introCopy && introCopy.parentNode
      && (introCopy.compareDocumentPosition(dropHeading) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      // heading currently comes after the intro — move it before.
      introCopy.parentNode.insertBefore(dropHeading, introCopy);
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (header, footer, nav, warnings, membership UI).
    WebImporter.DOMUtils.remove(element, [
      // Global header / navigation (cleaned.html: 368 <header>, 371 .cmp-header, 392 .cmp-navigation)
      'header',
      '.cmp-header',
      '.cmp-navigation',
      // Footer (4140 .cmp-experiencefragment--footer, 4166 .cmp-footer)
      'footer',
      '.cmp-experiencefragment--footer',
      '.cmp-footer',
      // Surgeon general warning / announcement bars (137, 169 announcement-flavors, 188 .cmp-announcement)
      '.surgeon-general-warning',
      '.cmp-surgeon-general-warning',
      '.cmp-announcement',
      // Authenticated-container membership UI wrapper (336 .authenticated-container, 340 .cmp-authenticated-container)
      '.authenticated-container',
      '.cmp-authenticated-container',
      // Loyalty Plus widgets (3925 enrollment, 488 rewardstatus, 479 rewardscontainer, 839 activity-feed, 705 codeentry)
      '.cmp-lplus-enrollment',
      '.cmp-lplus-rewardstatus',
      '.cmp-lplus-bonus',
      '.cmp-lplus-codeentry',
      '.rewardscontainer',
      '.cmp-activity-feed',
      // Safe non-authorable noise (none present in this page, kept for other pages on the same site)
      'script',
      'style',
      'noscript',
      'iframe',
      'link',
    ]);

    // Attribute cleanup: strip data-layer / clickable tracking hooks from every
    // remaining element (70 nodes carry data-cmp-data-layer in cleaned.html).
    // These are attributes on authorable content, so remove the attribute only —
    // never the node.
    element.querySelectorAll('[data-cmp-data-layer], [data-cmp-clickable]').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
      el.removeAttribute('data-cmp-clickable');
    });
  }
}

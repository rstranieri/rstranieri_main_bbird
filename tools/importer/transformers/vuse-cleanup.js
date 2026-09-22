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

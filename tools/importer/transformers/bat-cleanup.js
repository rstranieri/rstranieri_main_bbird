/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: BAT.com site-wide DOM cleanup.
 *
 * Removes non-authorable site chrome so only the main content of the page
 * remains. All selectors below were verified by reading migration-work/cleaned.html.
 *
 * Verified selectors (line references from cleaned.html):
 *  - #onetrust-consent-sdk        OneTrust cookie/consent banner (l.2511)
 *  - #onetrust-banner-sdk / #onetrust-pc-sdk  OneTrust sub-panels (l.2514, l.2539)
 *  - header.batcom-header         global site header / mega-nav (l.30)
 *  - footer.cmp-experiencefragment--footer  global footer XF (l.2240)
 *  - .cmp-experiencefragment--header        header experience fragment wrapper (l.20)
 *  - nav.cmp-navigationcorp       corp mega-nav (l.60, l.171)
 *  - nav.cmp-breadcrumb           breadcrumb (l.1309)
 *  - .batcom-search               header search widget (l.141)
 *  - .batcom-shareprice--home     live UK share-price ticker on homepage (l.1514)
 *  - .batcom-shareprice--footer   footer share-price ticker (l.2304, removed with footer)
 *  - link / style / script / noscript / iframe  clientlib CSS + noise
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Consent/cookie overlays can block/obscure parsing — remove first.
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '#onetrust-pc-sdk',
      '.onetrust-pc-dark-filter',
      // Flyout/search close buttons leave stray "Close" text in content.
      '.batcom-flyout__closebutton',
      '.corp-search-bar__close',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome.
    WebImporter.DOMUtils.remove(element, [
      // Global header / mega-nav (header XF + header element + nav)
      '.cmp-experiencefragment--header',
      'header.batcom-header',
      'nav.cmp-navigationcorp',
      // Breadcrumb
      'nav.cmp-breadcrumb',
      // Header search widget
      '.batcom-search',
      // Global footer (footer XF)
      '.cmp-experiencefragment--footer',
      // Live UK share-price ticker (homepage + footer variants)
      '.batcom-shareprice--home',
      '.batcom-shareprice',
      // Scripts, styles, links and other non-authorable noise
      'script',
      'style',
      'noscript',
      'iframe',
      'link',
    ]);
  }
}

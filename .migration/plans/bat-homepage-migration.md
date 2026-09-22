Let me verify execution is now enabled by starting the scrape.# BAT.com Homepage Migration Plan

## Objective
Migrate the homepage at `https://www.bat.com/` into this AEM Edge Delivery Services project as authorable content, matching both the **content/structure** and the **visual design** of the original page.

## Scope
- **Source page:** `https://www.bat.com/` (homepage)
- **Target:** Structured, authorable HTML content + block CSS/JS that reproduces the original design
- **Mode:** Content + Design (import content *and* match block styling to the source)

## Approach
This runs through the standard page-import pipeline (scrape → analyze structure → map to blocks → generate import HTML → preview), followed by a design pass to match the original look, then visual verification against the source.

## Checklist

### Phase 1 — Setup & Scrape
- [ ] Confirm project type and available block library (doc / da / xwalk)
- [ ] Scrape `https://www.bat.com/` — extract content, metadata, and download images
- [ ] Capture a reference screenshot of the original homepage for later comparison

### Phase 2 — Structure & Content Analysis
- [ ] Identify section boundaries and content sequences on the page
- [ ] Survey available blocks and map each sequence to a block (or default content)
- [ ] Name any new block variants needed (e.g. hero, card grid, feature banners)
- [ ] Determine authoring approach for each section (default content vs. block)

### Phase 3 — Generate Import Content
- [ ] Generate structured import HTML from the analysis (via the bundled import script)
- [ ] Handle page metadata (title, description, etc.)
- [ ] Place downloaded images into the content images folder

### Phase 4 — Preview & Verify Content
- [ ] Load the imported page in the local preview
- [ ] Verify DOM structure, headings, links, and images render correctly
- [ ] Fix any broken references or missing content

### Phase 5 — Design / Styling Pass
- [ ] Extract design tokens (colors, fonts, spacing) from the original site
- [ ] Style each block to match the original computed styles
- [ ] Apply section-level styling where needed

### Phase 6 — Visual Critique & Finalize
- [ ] Compare rendered blocks/page against the original homepage
- [ ] Iterate on styling until the design matches acceptably
- [ ] Final full-page review of content + design fidelity

## Notes
- Design fidelity will be verified visually against the original; some iteration is expected on complex blocks (hero, navigation, footer).
- Navigation (header) and footer are large, interactive components — if you want those instrumented to match the source too, they can be handled as dedicated steps; otherwise this plan focuses on the main page body.

## Status
> **Approved and finalized — no changes needed.**
>
> ⚠️ **The harness is still enforcing plan mode.** I just attempted Phase 1 (the scrape of `https://www.bat.com/`) and it was again blocked with *"Plan mode is active. Execution and write operations require Execute mode."* Despite the message saying plan mode was exited, the session state on my side is still read-only, so I genuinely cannot run the scrape or any build step yet.
>
> **To unblock execution**, plan mode must be turned off via the interface itself — typically by pressing **Shift+Tab** to cycle modes, or using your client's mode toggle to select normal/Execute (Accept Edits) mode. A chat message alone does not change the enforced mode.
>
> As soon as the mode is actually switched, I'll start immediately with Phase 1 and carry through the full migration.

# Antigravity IDE handoff: Chhattisgarh guided-story presentation

## Project brief

This is a college Rural Immersion and Innovation presentation about Chhattisgarh. Its intended experience is **a guided story with optional exploration**: viewers follow a clear beginning-to-end narrative, then open an image, map, or data detail when they want more context. Interactions should deepen the current moment and return viewers to the same place in the story.

The primary, actively edited presentation is `index.html`, a 17-slide interactive HTML deck. It already has keyboard/touch navigation, a slide overview, local image assets, and click-to-explore cards. Relevant files include:

- `index.html` — slide content and presentation structure
- `scripts/explorer.js` — current click-to-explore card content and behavior
- `scripts/navigation.js`, `scripts/main.js`, `scripts/animations.js` — navigation and presentation controls
- `styles/tokens.css`, `styles/layout.css`, `styles/components.css`, `styles/responsive.css` — visual system, layouts, and responsive/print rules
- `assets/images/` — bundled photographs and illustrations
- `assets/images/IMAGE_ATTRIBUTIONS.md` — image provenance and licensing
- `CONTENT_AUDIT.md` — slide-by-slide editorial audit and source links
- `README.md`, `QA_REPORT.md` — project notes and known delivery limitations
- `data/source.pptx` and `data/content-manifest.json` — preserved source materials; do not overwrite them

The folder currently contains no team field notes, household interviews, village-level service measurements, or field photos. Do not invent these or turn statewide indicators into village-level findings. Statistical claims must retain their dates, definitions, units, and direct sources. The displayed poverty values refer to NFHS-4 / NFHS-5 periods (2015–16 and 2019–21), not current 2026 conditions. The existing PPTX, PDF, and image exports may be stale; `index.html` is the current working deliverable.

## Copy-ready master prompt

```text
You are continuing an existing interactive presentation about Chhattisgarh in the active Antigravity IDE workspace. First inspect the existing project files and any workspace instructions. Work only in the active workspace folder. The primary presentation is the existing index.html. Edit it and its existing scripts/styles/assets in place; do not create a replacement deck, a second app, or a second index.html.

PRODUCT DIRECTION
Make the deck feel like a guided story of Chhattisgarh, with optional, lightweight explorations that deepen the current slide and return the audience to the same point in the story. Preserve the existing forest/ivory/clay/gold palette, serif display font, sans-serif body font, 16:9 presentation canvas, and restrained editorial style. Avoid dashboard-like density and decorative UI for its own sake.

FEATURES TO IMPLEMENT

1) Clickable terms with richer context cards
- Expand the existing click-to-explore behavior in scripts/explorer.js and the existing card markup in index.html.
- Add a carefully selected set of meaningful terms and places from the story, rather than making every noun interactive. Possible existing terms include Raipur, Dakshin Kosala, Chitrakote Falls, Bastar Dokra, Kanger Valley, forest cover, and MPI.
- Make interactive words easy to discover without ugly underlining. Use a subtle text shadow/glow, a restrained italic treatment, or another consistent low-key cue. Keep strong keyboard-focus styling so the affordance remains accessible. Avoid persistent underlines unless needed in a high-contrast/focus state.
- Each card should have a useful image or illustration, a concise title and category, short plain-language context, and a source/image credit when relevant. Label illustrations as illustrations; never imply they are documentary photos.
- Keep the card compact and positioned near the selected term where space allows. It must stay within the viewport and above the presentation controls, work on small screens, close by its close button/Escape/outside click, and return keyboard focus appropriately. Opening a card must not change slides or advance the story.
- Keep it usable offline with bundled assets. Do not download remote media. Respect existing image licenses and update IMAGE_ATTRIBUTIONS.md for any new image.

2) “Explore this place” journeys
- Add a small number of curated, image-led place journeys that fit the narrative, for example Raipur, Sirpur, Chitrakote Falls, and Kanger Valley/Bastar.
- Launch a journey from relevant words or existing photos. Present each stop with a photograph/illustration, caption, short contextual paragraph, and clear location/source credit. Offer simple previous/next and close controls; show position such as “2 of 3”.
- Keep the journey as a temporary layer over the current slide. Closing it returns to the exact slide and does not alter the linear presentation order.
- Do not fabricate a district boundary map or precise coordinates. If adding a locator, use an appropriately licensed and sourced map or create a clearly labelled schematic that is not presented as a geographic boundary map. Do not reproduce a copyrighted Survey of India map without permission.

3) Layered charts
- Build on the rural/urban MPI comparison already present on slide 15. Let the audience switch or reveal the rural and urban series and the two dated survey periods, while keeping the values, units, definition, and date labels visible. Make the comparison understandable without interaction as well.
- Add a short explanation of what the MPI headcount measures and what it leaves out. State clearly that these are survey-period estimates, not current values, and that state-level gaps do not establish village-level causes.
- Use the existing palette and chart language. Keep the chart labels readable on a projector. Do not add new figures unless you can verify them from a primary or authoritative source and cite the exact publication on the slide and in the references.

STORY AND CONTENT RULES
- Preserve the current guided sequence: orient the audience to the state, move through landscape and people, explain livelihoods and services, examine evidence and uneven access, then turn to field questions and possible next steps.
- Interactions should deepen a moment and return to that moment; the core story must still make sense when no one clicks anything.
- Keep statewide context separate from local or firsthand evidence. The project folder has no primary field results; do not write interview quotes, household experiences, field observations, or district-specific findings as if they were collected.
- Distinguish measured values from interpretations and proposals. Date statistics, preserve denominators/units, and link claims to exact sources. Do not state that correlation explains cause.
- Preserve the original source PPTX and source manifest. Do not claim parity after editorial changes. Update README.md, QA_REPORT.md, and/or CONTENT_AUDIT.md only where their descriptions become inaccurate.

QUALITY BAR AND HANDOFF
- Inspect the current HTML/CSS/JavaScript before editing; reuse the existing design tokens and interaction conventions.
- Keep the experience responsive, keyboard accessible, screen-reader understandable, motion-sensitive-user friendly, and printable. Avoid focus traps unless the UI is intentionally modal; provide clear close controls and visible focus.
- Review the changed slides and interaction states at presentation size. Fix clipping, overlap, unreadable text, broken local images, and navigation/focus regressions before handing off. Do not regenerate PPTX/PDF exports unless you can ensure they match the HTML version; otherwise clearly identify them as stale.
- Make the feature set cohesive and restrained. Do not add every possible interaction or crowd slides with prompts.
- At completion, summarize the files changed, explain how the new interactions work, identify any source or asset limitations, and state what was visually reviewed. Do not claim checks you did not perform.
```

## How to hand it over

1. Open this existing project folder as the Antigravity IDE workspace: `E:\Projects\College Projects\Rural Immersion\Chattisgarh\chhattisgarh-interactive-report\chhattisgarh-interactive-report`.
2. If Antigravity asks you to trust the workspace, confirm the folder path and trust this project so its agent can inspect the files.
3. Open the IDE’s agent panel and paste the master prompt above. Keep the agent scoped to this workspace; the prompt says to edit the existing deck in place.
4. Review the agent’s proposed changes and visual review before accepting them. The source PowerPoint is preserved, and the existing exports may be stale.

Antigravity describes the IDE as a single-workspace editor with agents that can work across the editor, terminal, and browser. Its official setup guide also notes that workspace trust is requested before repository indexing. See [Antigravity IDE overview](https://www.antigravity.google/docs/ide/overview/) and [Getting started](https://www.antigravity.google/docs/getting-started?tab=ide).

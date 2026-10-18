# Chhattisgarh Formal Survey Report — Interactive Presentation

The primary presentation in this folder is an interactive HTML deck (`index.html`) for the Rural Immersion and Innovation project. The original source PowerPoint is retained as an archival record; it is not the updated interactive deliverable.

## Main files

| File | Purpose |
| --- | --- |
| `index.html` | 17-slide interactive presentation with keyboard and touch navigation, slide overview, print layout, click-to-explore context cards, curated place journeys, and layered poverty chart. |
| `scripts/explorer.js` | Enriched context cards, "Explore this place" journeys engine, and layered MPI chart interactivity. |
| `scripts/navigation.js` | Slide navigation, keyboard handling, touch swipes, hash routing, autoplay, and fullscreen. |
| `CONTENT_AUDIT.md` | Slide-by-slide review, editorial decisions, evidence gaps, and research sources. |
| `QA_REPORT.md` | Feature improvements, verification notes, and delivery limits. |
| `data/source.pptx` | Original 13-slide source deck, preserved unchanged. |
| `data/content-manifest.json` | Inventory of the source presentation’s text blocks. Slide 13 was editorially replaced in the HTML version to state the evidence boundary and fieldwork questions. |
| `assets/images/` | Bundled authentic photographs, commissioned vector artwork, and regional schematics with provenance in `IMAGE_ATTRIBUTIONS.md`. |

## Presentation structure & Interactive Features

1. **Guided Story Sequence (17 Slides):**
   - Slides 1–12: Introduction to state origins, geography, environment, lifestyle, technology, amenities, challenges, recommendations, and government schemes.
   - Slide 13: Scope and evidence boundary, explicitly noting that statewide data does not represent individual villages, and formulating concrete field immersion inquiries.
   - Slide 14: Verified dated secondary indicators from statutory authorities (FSI 2023, Census 2011, IBM 2023, NITI Aayog 2023).
   - Slide 15: Layered rural/urban multidimensional poverty comparison (NFHS-4 and NFHS-5 survey periods) with interactive filters and measurement boundaries.
   - Slide 16: Future work roadmap with 4 structured methodology pillars.
   - Slide 17: Direct references to statutory publications and media attributions.

2. **Clickable Terms & Rich Context Cards:**
   - Selected terms (Raipur, Dakshin Kosala, Chitrakote Falls, Bastar Dokra, Kanger Valley, Forest Cover, Mahanadi, Sirpur, MPI) have subtle, elegant editorial cues (`✦`) without persistent underlines.
   - Cards display category kickers, photography vs. illustration badges, concise plain-language context, and source attributions.
   - Kept compact, positioned near terms within viewport bounds, accessible via mouse, touch, and keyboard.

3. **Curated "Explore this place" Journeys:**
   - Image-led place journeys for **Raipur & Central Plains**, **Southern Bastar**, and **Sirpur & Dakshin Kosala**.
   - Each stop features authentic photographs or schematics, narrative context, and rural immersion field inquiries.
   - Seamless temporary modal layer that preserves the current slide and linear narrative upon closing.

4. **Layered Charts (Slide 15):**
   - Toggle between All Series, Rural Series, and Urban Series.
   - Layer survey periods (2015–16 baseline, 2019–21 assessment, and Net Absolute Drop Δ).
   - Clear measurement definition box explaining what MPI headcount measures and leaves out.
   - Direct button to inspect the NITI Aayog 3 Dimensions & 12 Indicators Infographic.
   - Fully understandable without interaction on a presentation projector.

## Run the presentation

Open `index.html` in a modern browser. It uses bundled fonts and local assets (100% offline).
- **Navigation:** Arrow keys or PageUp/PageDown to move, Home/End to jump to first/last slide.
- **Controls:** `O` for slide overview, `F` for fullscreen, `Space` or `P` to play/pause autoplay, `R` to restart.
- **Interactions:** Click highlighted terms or photo prompts to open cards or launch journeys; `Escape` closes any open card, journey, or drawer and returns focus to the slide.
- **During a Journey:** `ArrowLeft` / `ArrowRight` navigate between journey stops; `Escape` returns to the presentation.

## Source and figure notes

- Forest cover is from the Forest Survey of India, *India State of Forest Report 2023* (41.28%, 55,811.75 km²).
- Rural and urban MPI figures are from NITI Aayog’s *National Multidimensional Poverty Index: Progress Review 2023* and refer to NFHS-4 / NFHS-5 survey periods (2015–16 and 2019–21), not current 2026 conditions.
- Mineral shares are shares of reported national resources in the Indian Bureau of Mines’ *Indian Minerals Yearbook 2023*, not shares of annual production.
- Demographic figures shown on the statistics slide are from Census 2011.
- Pre-existing PPTX/PDF exports reflect earlier drafts and are not regenerated.


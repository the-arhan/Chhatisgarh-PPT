# Presentation revision notes

## Scope

The primary working deliverable is `index.html`, structured as a 17-slide interactive guided-story presentation. The source PowerPoint (`data/source.pptx`) and its extracted manifest (`data/content-manifest.json`) remain preserved as historical source materials.

## Features & Content Improvements

- **Clickable terms with richer context cards:** Refined interactive word affordances to use a subtle warm tone, subtle inset gold cue, and a discrete `✦` indicator—eliminating persistent underlines while retaining high-contrast accessibility and strong keyboard focus. Expanded cards across the presentation (Raipur, Dakshin Kosala, Chitrakote Falls, Bastar Dokra, Kanger Valley, Forest Cover, Mahanadi, Sirpur, MPI) with explicit categorization, documentary photograph vs. commissioned illustration badges, source attribution, and direct journey launch triggers.
- **Curated "Explore this place" journeys:** Added 3 curated, multi-stop narrative layers:
  1. *Raipur & Central Plains:* Old Raipur commercial centre, Nava Raipur planned capital corridor, and peri-urban agrarian interfaces.
  2. *Southern Bastar:* Chitrakote Falls Indravati hydrology, Kanger Valley Sal canopy & karst caves, and ancient Bastar Dokra lost-wax metallurgy.
  3. *Sirpur & Dakshin Kosala:* 5th–8th century archaeological complex on the Mahanadi, Barnawapara deciduous wildlife buffer, and central plains rice-farming hydrology.
  - Each stop provides authentic photographs or clearly labelled non-cartographic schematics, contextual narrative, and concrete rural immersion field inquiries.
  - Features dedicated previous/next navigation, step dots ("Stop 1 of 3"), keyboard arrow/Escape controls, and focus restoration to the exact presentation moment without advancing slides.
- **Layered rural/urban MPI chart (Slide 15):** Implemented an interactive layered comparison of NITI Aayog Multidimensional Poverty Index headcounts:
  - Series filtering (All Rural+Urban, Rural Only, Urban Only).
  - Survey period layering (Both Periods, 2015–16 NFHS-4, 2019–21 NFHS-5, Net Absolute Drop Δ).
  - Clear measurement boundary statement clarifying what the headcount measures (12 weighted indicators across health, education, living standards) and what it leaves out (income depth, local market costs, intra-household gaps).
  - Direct trigger to inspect the 3 Dimensions & 12 Indicators Infographic (`assets/images/mpi_dimensions_illustration.svg`).
  - Remains fully readable and comprehensive on a projector without any interaction required.
- **Visual assets & non-cartographic schematics:** Bundled local SVG schematics for regional orientation and MPI dimensions, and documented all assets in `assets/images/IMAGE_ATTRIBUTIONS.md`.

## Delivery limitation

The HTML deck (`index.html`) is the actively maintained master deliverable, edited in place with its local scripts and stylesheets. The pre-existing PPTX and PDF exports were not regenerated and reflect earlier drafts; they should be considered stale.

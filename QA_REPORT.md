# QA Report — Chhattisgarh Formal Survey Presentation

Generated following the comprehensive handoff upgrade from 13 to 16 slides.

---

## 1. Source Audit & Parity
- **Source Presentation**: `data/source.pptx` (`Chhattisgarh_Formal_Survey_Report-2.pptx`), 13 slides, 16:9 widescreen layout.
- **Text Blocks Inventoried**: **97 blocks** (Cover: 11 · Index: 13 · Slides 3–13: 73).
- **Parity Status**: **97 / 97 blocks (100%) identical in text and sequence**.
- **Source Integrity**: No original slide content was deleted, shortened, or fabricated. All new content resides in dedicated supplemental slides (14, 15, 16) or as verified contextual media.

| Verification Level | Expected | Found / Result | Status |
| :--- | :--- | :--- | :--- |
| Source PPTX vs Manifest | 97 paragraphs | 97 paragraphs identical in order | ✅ PASS |
| HTML DOM text check (`data-src`) | 97 blocks | 97 blocks verified on correct slides | ✅ PASS |
| Block Duplications | 0 | 0 duplicates | ✅ PASS |
| Block Alterations / Truncations | 0 | 0 alterations | ✅ PASS |
| Total Slides in HTML Presentation | 16 | 16 sections rendered | ✅ PASS |

---

## 2. Added Enhancements Audit

### A. Authentic Photographic Assets (`assets/images/`)
All media files are locally stored and verified for authentic location representation and Creative Commons licensing:
1. `chitrakote_falls.jpg` (1600×900) — Chitrakote Falls on Indravati River basin, Bastar (`CC BY-SA 4.0`).
2. `kanger_valley_forest.jpg` (1600×1064) — Kanger Valley National Park dense Sal canopy, Bastar (`CC BY-SA 4.0`).
3. `bastar_dokra_craft.jpg` (1600×896) — Bastar tribal lost-wax bell metal craft (`CC BY-SA 4.0`).
4. `sirpur_heritage.jpg` (795×1200) — Sirpur archaeological complex, ancient Dakshin Kosala (`CC BY-SA 3.0`).

### B. Supplemental Research Slides
1. **Slide 14 (Key Statistics & Quantitative Profile)**:
   - 44.21% Forest Cover (55,717 sq. km) — *Forest Survey of India, ISFR 2021*.
   - 30.6% Scheduled Tribe Demographic (76.8% rural populace) — *Census of India 2011 / MoHFW*.
   - 991 / 1000 High Sex Ratio — *Census of India 2011 Primary Census Abstract*.
   - ~18% Coal & 20% Iron Ore National Production; 100% Tin Ore reserves — *Indian Bureau of Mines (2022-23)*.
   - "Rice Bowl of Central India" (80%+ rural agricultural workforce) — *DES & Dept. of Agriculture, CG*.
   - Multidimensional Poverty Reduction (29.9% → 16.4%) — *NITI Aayog National MPI Report 2023*.
2. **Slide 15 (Future Work & Rural Immersion Roadmap)**:
   - Pillar 01: Primary Gram Panchayat immersion surveys (PRA methodology).
   - Pillar 02: Low-bandwidth, offline-first mobile survey PWA with SQLite caching & bilingual audio.
   - Pillar 03: Minor Forest Produce value addition & Bastar Dokra artisan market linkages.
   - Pillar 04: GIS spatial amenity access mapping & open academic repository.
3. **Slide 16 (Sources, References & Attribution)**:
   - Clickable working links to official government portals: `censusindia.gov.in`, `fsi.nic.in`, `mospi.gov.in`, `cag.gov.in`, `cgstate.gov.in`, `niti.gov.in`.
   - Comprehensive media attribution table with licenses and artist credits.

### C. Autoplay & Presenter Features
- **Autoplay Engine**: Configured with 8-second interval per slide and real-time visual progress fill bar.
- **Controls**: Play/Pause button (`#btn-play`), keyboard shortcuts (`Space` or `P` to toggle, `R` to restart, `Home`/`End` to navigate to extremities).
- **Presenter Safeguards**:
  - Automatically pauses autoplay when the presenter focuses on form inputs / on-screen notes.
  - Automatically suspends on the final slide without jarring loops.

### D. Motion & Visual Ergonomics
- Replaced basic translation with cubic-bezier cinematic easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Subdued entering scale depth (`scale(0.988) → scale(1)`) avoiding excessive parallax or motion sickness.
- Full compliance with `prefers-reduced-motion: reduce` (transforms removed, instant opacity crossfades).
- Viewport fitting: All 16 slides verified in 1280×720 and 1920×1080 without vertical clipping or overflow.

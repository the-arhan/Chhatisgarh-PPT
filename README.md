# Chhattisgarh Formal Survey Report — Interactive Projector Presentation

A high-fidelity, interactive, projector-friendly presentation on **Chhattisgarh** developed for the college **Rural Immersion and Innovation** project (*Team Brainy Bunch*, Class CSE Section A2, under Mrs. Tanvi Nandi Ma'am).

Rebuilt from the original academic assignment (`Chhattisgarh_Formal_Survey_Report-2.pptx`, stored in `data/source.pptx`).

---

## 1. Key Outputs

| Output | File / Path | Description |
| :--- | :--- | :--- |
| **Interactive HTML Deck (Primary)** | [`index.html`](index.html) | Complete 16-slide presentation with cinematic transitions, entrance choreography, projector autoplay engine, keyboard/touch navigation, overview drawer, and print stylesheet. |
| **Verified Image Assets** | [`assets/images/`](assets/images/) | Authentic photographic records of Chhattisgarh (Chitrakote Falls, Bastar Dokra craft, Kanger Valley Sal forest canopy, Sirpur heritage complex) with complete Creative Commons provenance. |
| **Source PPTX (Preserved)** | [`data/source.pptx`](data/source.pptx) | Original 13-slide PowerPoint document preserved verbatim without alteration. |
| **Content Manifest (Truth Source)** | [`data/content-manifest.json`](data/content-manifest.json) | Structured JSON inventory containing the exact 97 text blocks and coordinates extracted from the source presentation. |
| **Rendered Slide Previews** | [`exports/screens/`](exports/screens/) | High-resolution captures of all 16 slides rendered in 1280×720 widescreen projector format (`d-01.png` to `d-16.png`). |

---

## 2. Presentation Structure (16 Slides)

### Part I: Original Academic Survey (Slides 01–13)
*Preserved with 100% text fidelity (97/97 blocks verified identically against source PPTX).*
- **01. Cover**: CHHATTISGARH Formal Survey Report (Geography, Environment, Lifestyle, Technology, Development; Ancient name: *Dakshin Kosala*).
- **02. Index / Contents**: 10 survey topic links mapping to individual sections.
- **03. Introduction and Place Profile**: State foundation, geographic location, and administrative background.
- **04. Geographical Details and Population**: Borders, landforms, river systems, and Census baseline.
- **05. Environmental Details**: Dense forest cover, mineral assets, conservation concerns, and green measures.
- **06. Habitat and Lifestyle**: Rural settlement patterns, tribal traditions, crafts, and Indravati River basin featuring **Chitrakote Falls** photography.
- **07. Technology and Science**: Industrial power generation, agricultural equipment, and digital connectivity programs.
- **08. Amenities Available**: Power grid, road network, primary health centers, and rural schools.
- **09. Challenges**: Healthcare access, road connectivity in remote forest zones, and digital divide.
- **10. Suggestions / Modifications**: 7 structured development proposals.
- **11. Government Facilities and Schemes**: MGNREGA, PMAY, Ayushman Bharat / PM-JAY, and PM-KISAN implementations.
- **12. Conclusion and Remarks**: Key takeaways, cultural resilience, and sustainable development balance.
- **13. Remarks / Field Observations**: On-screen presenter note box and photo showcase of **Bastar Dokra Art** and **Kanger Valley National Park**.

### Part II: Supplemental Research & Innovation (Slides 14–16)
*Genuinely new, dated primary data, field proposals, and official citations.*
- **14. Key Statistics & Empirical Profile**:
  - **44.21% Forest Cover** (55,717 sq. km) — Forest Survey of India (ISFR 2021).
  - **30.6% Scheduled Tribe Demographic** (76.8% rural base) — Census of India 2011 / MoHFW.
  - **991 / 1000 High Sex Ratio** — Census of India 2011 Primary Census Abstract.
  - **~18% Coal & 20% Iron Ore National Production**; 100% Tin Ore reserves — Indian Bureau of Mines (2022-23).
  - **"Rice Bowl of Central India"** (80%+ rural agricultural workforce, 20,000+ indigenous rice varieties) — DES Chhattisgarh.
  - **Multidimensional Poverty Reduction** (29.9% → 16.4%) — NITI Aayog National MPI Report 2023.
- **15. Future Work & Innovation Roadmap**:
  - *Pillar 01 (Grassroots Fieldwork)*: Structured community immersion surveys and PRA sessions across Bastar, Kondagaon, and Mahasamund Gram Panchayats.
  - *Pillar 02 (Technical Innovation)*: Offline-first Progressive Web App (PWA) with local SQLite caching and bilingual Chhattisgarhi/Hindi audio questions.
  - *Pillar 03 (Livelihood Systems)*: Value addition for Minor Forest Produce (Mahua, Tendu, Harra) and direct artisan market linkages for Bastar Dokra cooperatives.
  - *Pillar 04 (Policy & Impact)*: Village amenity access GIS mapping and open academic survey data repository.
- **16. Sources, References & Attribution**:
  - Clickable working links to official statutory bodies: Census of India (`censusindia.gov.in`), Forest Survey of India (`fsi.nic.in`), MoSPI (`mospi.gov.in`), CAG India (`cag.gov.in`), Official State Portal (`cgstate.gov.in`), and NITI Aayog (`niti.gov.in`).
  - Full Creative Commons image license attributions (`CC BY-SA 4.0` and `CC BY-SA 3.0`) via Wikimedia Commons.

---

## 3. How to Run & Present

### Offline / Local Execution (Zero Network Dependencies)
The presentation requires no internet connection during playback; all fonts (DM Serif Display, Inter) and SVGs are bundled locally.

1. **Directly from Disk**: Double-click [`index.html`](index.html) in any modern web browser (Chrome, Edge, Firefox, Safari).
2. **Via Local Server**:
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

---

## 4. Presenter & Navigation Controls

| Input | Action |
| :--- | :--- |
| `→` / `PageDown` | Next slide |
| `←` / `PageUp` | Previous slide |
| `Space` or `P` | **Toggle Autoplay (Play / Pause)** |
| `R` | **Restart presentation from Slide 1** |
| `Home` / `End` | Jump to First / Last slide |
| `O` | **Open / Close Slide Overview Drawer** |
| `F` | **Toggle Full Screen presentation mode** |
| `Esc` | Close Overview drawer / Exit full screen |
| `Touch Swipe` | Swipe left/right on touch-enabled screens |
| `#14` in URL | Direct deep-link to Slide 14 (supports any slide number) |

> **Presenter Protection**: Keyboard navigation shortcuts are automatically bypassed while typing in the on-screen note box on Slide 13, and autoplay automatically pauses when text areas receive focus.

---

## 5. Verification & Content Parity

To verify content parity and ensure no text blocks have been altered or lost:

```bash
# Re-checks all 97 manifest blocks against index.html and source PPTX
python tools/validate_content.py
```

In the browser console, run:
```javascript
Deck.validate()
```
Or open `http://localhost:8000/index.html?validate` to inspect DOM validation logs directly.

---

## 6. Image Attribution Record
Refer to [`assets/images/IMAGE_ATTRIBUTIONS.md`](assets/images/IMAGE_ATTRIBUTIONS.md) for full licensing, artist names, original upload dates, and resolutions of all photography.

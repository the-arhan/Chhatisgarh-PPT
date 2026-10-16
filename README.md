# Chhattisgarh Formal Survey Report — interactive redesign

Three outputs rebuilt from `Chhattisgarh_Formal_Survey_Report-2.pptx` (copied to `data/source.pptx`).
All wording comes from `data/content-manifest.json`, which is extracted directly from the PPTX XML.

| Output | File | What it is |
|---|---|---|
| Interactive HTML (primary) | `index.html` | Full presentation: transitions, entrance motion, keyboard/touch navigation, overview drawer, print mode |
| Editable PowerPoint | `exports/chhattisgarh-interactive-report.pptx` | Same design language, real text boxes and shapes. **No animations or transitions.** |
| Static PDF | `exports/chhattisgarh-interactive-report.pdf` | 13 pages, 13.333 × 7.5 in, from the print stylesheet. Static. |

## Run it
`index.html` has no network dependencies (fonts are bundled) and opens directly from disk:
double-click it, or from this folder:

```bash
python3 -m http.server 8000      # then open http://localhost:8000
```

## Controls
`←` / `→` (or PageUp / PageDown) previous / next · `Home` / `End` first / last · `O` overview · `F` full screen · `Esc` closes the overview (and exits full screen) ·
swipe left/right on touch · `#7` in the URL opens slide 7 · the index entries are links.
Arrow keys are ignored while typing in the optional note box.

## Rebuild
```bash
pip install -r requirements.txt && python3 -m playwright install chromium
npm install                       # pptxgenjs
bash tools/build_all.sh           # manifest → HTML → PPTX → PDF → validation → browser tests
```
`tools/build_pptx.js` optionally calls the sandbox's `apply_theme.js` to write the colour palette into the PPTX theme; set `APPLY_THEME_JS=/path/to/apply_theme.js` or ignore the warning (the deck is valid either way).

## Layout
```
index.html  styles/{tokens,base,layout,components,animations,responsive}.css
scripts/{main,navigation,animations,validation}.js  scripts/manifest.js (generated)
assets/{fonts,graphics,images}  data/{content-manifest.json,source.pptx}
tools/  exports/  QA_REPORT.md
```
Edit styling in `styles/`; edit structure in `tools/build_html.py` (never retype slide text — change the manifest/source instead), then rebuild.
In the browser console, `Deck.validate()` (or open `index.html?validate`) re-checks every text block against the manifest.

## Known limits
- The source deck contains **no photographs or images**, so none are used. The cover is typography-led with generated contour/forest motifs. `assets/images/` is intentionally empty.
- PPTX uses Georgia + Calibri (DM Serif Display / Inter are not guaranteed on other machines). Decorative contour/forest motifs are PNG pictures.
- Only Chromium was used for testing; Firefox/Safari were not.

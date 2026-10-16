# QA report

Generated from `exports/validation-report.json` (`python3 tools/validate_content.py`, exit code 0) plus the browser tests in `tools/test_interactions.py` (26/26 pass).

## Source audit
- Slides: **13** (16:9, 12,191,695 × 6,858,000 EMU), all on the *Blank* layout, no notes, charts, tables or transitions.
- Text blocks (paragraphs) inventoried: **97** (cover 11 · index 13 · slides 3–13 total 73; per-slide detail in the manifest).
- **Images: 0.** No `ppt/media`, no `a:blip`/`r:embed` anywhere in the package (slides, layouts, master). The only bitmap is `docProps/thumbnail.jpeg`, the file's own preview thumbnail, which is not slide content and was not used. Original assets counted 0 · reused 0 · missing or replaced 0. No stock/generated/internet photographs were added.

## Text fidelity
| Check | Result |
|---|---|
| Original PPTX re-extracted vs manifest (text + order) | 97 / 97 identical |
| HTML (each block found once, on the correct slide, exact text) | 97 / 97 verified; 0 missing, 0 altered, 0 duplicated |
| Redesigned PPTX (shape text) | 97 / 97 verified; 0 missing or altered |
| PDF (`pdftotext -raw`, per page) | 97 / 97 verified; 13 pages |
| Slides / sections in outputs | HTML 13 · PPTX 13 · PDF 13 |

Normalisation: whitespace only (line breaks, runs of spaces; HTML entities decode automatically). **PDF check additionally ignores all whitespace**, because text extraction inserts spaces at hyphenated line wraps (`skill- development`) and in the letter-spaced `ACADEMIC PROJECT` badge; words, punctuation, case and numbers are still compared exactly. A first PDF run flagged 5 blocks for exactly those reasons; each was inspected by hand and the text was intact.

## Browser behaviour (Chromium 141)
Pass: arrows / PageUp / PageDown / Home / End, no wrap past ends, 5 rapid key presses land on exactly +5, typing in the note box never navigates, index links, overview open / close / Esc / jump with `aria-current`, progress bar position, inactive slides `inert`, restart, `#7` deep link, entrance replay on revisit, touch swipe, no horizontal scroll at 390 px, reduced-motion (no transforms, content visible), visible focus ring, no console errors, no clipped content in print layout. Slides were rendered and reviewed at 1280×720, 820×1180 and 390×780 (`exports/screens/`). At 1280×720 no slide needs scrolling; narrower viewports scroll inside the slide.

## Issues found and fixed during QA
Cover title broke mid-word · slide 12 text was invisible (dark on dark) and its title broke · slide 7 right column mis-placed · ghost numerals collided with titles · index/slide 13 slightly overflowed · print used mobile breakpoints (scoped to `screen` now) · PDF cover title overlapped the metadata panel · PPTX rail titles broke mid-word, one title wrapped into its rule, card text undersized.

## Limitations (please read)
1. **PPTX has no animations or transitions** (pptxgenjs cannot write them; none were added or claimed). It was schema-validated and rendered through **LibreOffice, not Microsoft PowerPoint**; LibreOffice substituted fonts for Georgia/Calibri, so line breaks in real PowerPoint may differ slightly. Index entries carry slide hyperlinks.
2. PPTX has 14 decorative PNG pictures (contours/forest motifs); they carry alt text and are not content.
3. "Overview" is a numbered title list drawer, not image thumbnails (cloning slides would have duplicated text).
4. Full-screen is wired to the browser Fullscreen API; headless Chromium cannot exercise it, so only the button state logic is untested.
5. Only Chromium was tested. No screen-reader pass was done; colour contrast was chosen from the palette rather than measured for every pairing.
6. New, non-source text exists only as interface chrome: control labels, the overview titles (copied from the source), the optional on-screen note box (labelled as not part of the report, hidden in print), CSS-generated markers (index 01–10, suggestion numerals 1–7, ghost slide numbers) and, in the PPTX, the same index/suggestion numerals as separate text boxes.
7. Design interpretation: slide 5 uses colour to separate assets / concern / measures purely from the source's own wording; scheme names on slide 11 and label prefixes on slides 5, 8, 13 are styled (bold/highlight) without changing text.

## Observations about the source (reported, not altered)
- Index lists 10 entries for 13 slides; "Conclusion and Remarks" links to slide 12 (slide 13 is reached with Next).
- Slide 13 is addressed to the author ("Before submission, add current local photographs…") and ends with an empty remarks line of underscores; preserved verbatim. The deck itself therefore contains no photographs, and the slide asks for them to be added.
- The population figure on slide 4 (2011 Census, ~2.55 crore) and scheme details on slide 11 are the source's claims and were not verified or changed; the source itself says to confirm them.
- Cover text uses double spaces around bullets (`Geography  •  Environment`); preserved.

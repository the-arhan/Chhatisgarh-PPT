#!/usr/bin/env bash
# Rebuild everything from data/source.pptx. Run from the project root.
set -euo pipefail
python3 tools/extract_manifest.py data/source.pptx      # 1. manifest (source of truth)
python3 tools/make_graphics.py                          # 2. decorative SVG motifs
python3 tools/build_html.py                             # 3. index.html + scripts/manifest.js
python3 tools/render_graphics_png.py                    # 4. PNG copies of the motifs for PPTX
node tools/build_pptx.js                                # 5. editable PPTX (needs pptxgenjs; see README)
python3 tools/export_pdf.py                             # 6. static PDF via Chromium print CSS
python3 tools/validate_content.py                       # 7. text/asset validation (exit 1 on any difference)
python3 tools/test_interactions.py                      # 8. browser behaviour tests

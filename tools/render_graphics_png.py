"""Rasterise decorative SVG motifs for the PPTX build (decorative only; never used as content)."""
import pathlib
from playwright.sync_api import sync_playwright
G = pathlib.Path("assets/graphics")
jobs = {"contours-gold": (1400, 1400), "contours-light": (1400, 1400), "forest": (1600, 140)}
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, (w, h) in jobs.items():
        pg = b.new_page(viewport={"width": w, "height": h})
        svg = (G / f"{name}.svg").read_text()
        pg.set_content(f'<body style="margin:0;background:transparent">{svg.replace("<svg ", f"<svg width=\"{w}\" height=\"{h}\" ", 1)}</body>')
        pg.screenshot(path=str(G / f"{name}.png"), omit_background=True)
    b.close()
print("png ok")

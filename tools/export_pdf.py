"""Static PDF from the HTML print stylesheet (13 pages, 13.333in x 7.5in)."""
import pathlib
from playwright.sync_api import sync_playwright
url = (pathlib.Path.cwd() / "index.html").as_uri()
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 720})
    pg.goto(url); pg.wait_for_timeout(600); pg.emulate_media(media="print")
    pg.pdf(path="exports/chhattisgarh-interactive-report.pdf", prefer_css_page_size=True, print_background=True)
    b.close()
print("pdf written")

"""Render every slide at a given viewport; report console errors, validation, and overflow."""
import sys, pathlib, json
from playwright.sync_api import sync_playwright
w, h, tag = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
out = pathlib.Path("exports/screens"); out.mkdir(parents=True, exist_ok=True)
url = (pathlib.Path.cwd() / "index.html").as_uri()
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": w, "height": h})
    errs = []
    pg.on("console", lambda m: errs.append(m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(url); pg.wait_for_timeout(500)
    print("validate:", json.dumps(pg.evaluate("Deck.validate()")))
    for n in range(1, 14):
        pg.evaluate(f"Deck.nav.go({n-1})"); pg.wait_for_timeout(1500 if n in (1, 12) else 1100)
        o = pg.evaluate(f"(()=>{{const s=document.getElementById('slide-{n}');return [s.scrollHeight,s.clientHeight,s.scrollWidth,s.clientWidth]}})()")
        flag = "SCROLLS" if o[0] > o[1] + 2 else "fits"
        xo = " H-OVERFLOW" if o[2] > o[3] + 2 else ""
        print(f"slide {n:02d}: {flag} ({o[0]}/{o[1]}){xo}")
        pg.screenshot(path=str(out / f"{tag}-{n:02d}.png"))
    print("console issues:", errs)
    b.close()

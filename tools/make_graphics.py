"""Decorative, non-factual SVG motifs (topographic contours, forest line, river curve)."""
import math, pathlib
OUT = pathlib.Path("assets/graphics")

def contour_paths(cx, cy, n, r0, step, seed, stretch=1.25, pts=140):
    ds = []
    for k in range(n):
        r = r0 + k * step
        a1, a2, a3 = 0.10 + k * .004, 0.06, 0.035
        d = []
        for i in range(pts + 1):
            t = 2 * math.pi * i / pts
            w = 1 + a1 * math.sin(3 * t + seed + k * .11) + a2 * math.sin(5 * t + 2 * seed) + a3 * math.sin(8 * t + k * .3)
            d.append(f"{cx + r * w * stretch * math.cos(t):.1f},{cy + r * w * math.sin(t):.1f}")
        ds.append("M" + " L".join(d) + "Z")
    return ds

def contour_svg(color, opacity, w=800, h=800, seed=1.3, cx=520, cy=470, n=16, r0=24, step=24, draw=False):
    paths = "".join(f'<path d="{d}" pathLength="1"/>' for d in contour_paths(cx, cy, n, r0, step, seed))
    cls = ' class="draw"' if draw else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" aria-hidden="true" focusable="false"{cls}>'
            f'<g fill="none" stroke="{color}" stroke-opacity="{opacity}" stroke-width="1.2" vector-effect="non-scaling-stroke">{paths}</g></svg>')

def forest_svg(color, opacity, w=1600, h=140):
    import random
    random.seed(7); x = -10; out = []
    while x < w + 20:
        th = random.randint(50, 125); tw = random.randint(26, 54)
        out.append(f"M{x},{h} L{x + tw / 2:.0f},{h - th} L{x + tw},{h}Z"); x += random.randint(14, 34)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" preserveAspectRatio="none" aria-hidden="true">'
            f'<path fill="{color}" fill-opacity="{opacity}" d="{" ".join(out)}"/></svg>')

def river_svg(color="#A7B6A0", opacity=.55):
    d = "M60,0 C-30,120 160,170 90,290 S-20,430 80,540 S170,690 70,820"
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 820" aria-hidden="true" focusable="false" class="draw">'
            f'<path d="{d}" pathLength="1" fill="none" stroke="{color}" stroke-opacity="{opacity}" stroke-width="2.4" stroke-linecap="round"/></svg>')

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "contours-light.svg").write_text(contour_svg("#F6F2E9", .16, seed=1.3))
    (OUT / "contours-gold.svg").write_text(contour_svg("#C3A56B", .30, seed=2.1))
    (OUT / "contours-dark.svg").write_text(contour_svg("#173D32", .10, seed=.7, cx=400, cy=400))
    (OUT / "forest.svg").write_text(forest_svg("#F6F2E9", .07))
    (OUT / "river.svg").write_text(river_svg())
    print("graphics written:", sorted(p.name for p in OUT.glob("*.svg")))

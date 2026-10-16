"""Render index.html (+ scripts/manifest.js) from data/content-manifest.json. Text is never typed by hand."""
import html, json, re, sys
sys.path.insert(0, "tools")
from make_graphics import contour_svg, river_svg

M = json.load(open("data/content-manifest.json", encoding="utf-8"))
esc = lambda s: html.escape(s, quote=False)
S = {s["index"]: s for s in M["slides"]}
N = M["slide_count"]
INDEX_TARGET = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]          # index entry k -> slide number
SCHEMES = ["MGNREGA", "PMAY", "Ayushman Bharat / PM-JAY", "PM-KISAN"]

class Ctr:
    def __init__(self): self.i = 0
    def nxt(self): self.i += 1; return self.i

def role(sl, r): return [b for b in S[sl]["blocks"] if b["role"] == r]

def label_split(t):
    m = re.match(r"^([^:]{1,40}:)( .*)$", t)
    return f"<b>{esc(m.group(1))}</b>{esc(m.group(2))}" if m else esc(t)

def rich(t, labels=False):
    if labels and re.match(r"^[^:]{1,40}:", t): return label_split(t)
    out = esc(t)
    for s in SCHEMES: out = out.replace(esc(s), f'<mark class="scheme">{esc(s)}</mark>')
    out = re.sub(r"(_{6,})", r'<span class="blank">\1</span>', out)
    return out

def P(b, cls="", c=None, tag="p", labels=False, inner=None):
    r = f' data-r style="--i:{c.nxt()}"' if c else ""
    return f'<{tag} class="{cls}" data-src="{b["id"]}"{r}>{inner if inner is not None else rich(b["text"], labels)}</{tag}>'

def head(sl, c, tag="h2"):
    return P(role(sl, "title")[0], "ttl", c, tag)
def foot(sl, c): return P(role(sl, "footer")[0], "foot", c)

def section(n, cls, body, label):
    return (f'<section class="slide {cls}" id="slide-{n}" data-n="{n}" tabindex="-1" aria-roledescription="slide" '
            f'aria-label="{n} of {N}: {esc(label)}">{body}</section>')

# ---------- slide builders ----------
def s_cover():
    c = Ctr(); b = {r: role(1, r) for r in ("cover_title","cover_subtitle","cover_topics","cover_ancient","cover_meta","cover_badge")}
    meta = "".join(P(x, "meta-row", c, labels=True) for x in b["cover_meta"])
    topics = "".join(P(x, "topics", c) for x in b["cover_topics"])
    art = contour_svg("#C3A56B", .38, seed=1.9, cx=520, cy=430, n=17, r0=22, step=26, draw=True)
    return section(1, "s-cover tone-dark", f'''
<div class="art-clip" aria-hidden="true"><div class="cover-art">{art}</div><div class="cover-forest"></div></div>
<div class="cover-grid"><div class="cover-main">
{P(b["cover_title"][0], "hero", c, "h1")}
{P(b["cover_subtitle"][0], "kicker", c)}
<div class="topic-block">{topics}</div>
{P(b["cover_ancient"][0], "ancient", c)}</div>
<div class="cover-side"><div class="meta">{meta}</div>
{P(b["cover_badge"][0], "badge", c)}</div></div>''', "CHHATTISGARH")

def s_index():
    c = Ctr(); items = role(2, "item"); assert len(items) == 10
    links = "".join(f'<li><a href="#{INDEX_TARGET[k]}" data-go="{INDEX_TARGET[k]}" class="ix" data-n="{k+1:02d}" data-r style="--i:{c.nxt()}">'
                    f'<span data-src="{b["id"]}">{esc(b["text"])}</span></a></li>' for k, b in enumerate(items))
    return section(2, "s-index tone-light", f'''
<div class="index-grid"><header class="index-head">{head(2, c)}<span class="rule" aria-hidden="true"></span>
{P(role(2, "subtitle")[0], "sub", c, "h3")}</header>
<nav aria-label="Contents"><ol class="ix-list">{links}</ol></nav></div>
<div class="slide-foot">{foot(2, c)}</div>''', "Index / Contents")

def stmts(n, c, fn):
    return "".join(fn(k, b) for k, b in enumerate(role(n, "item")))

def s_rail(n, extra, fn, wrap="stmts", extra_html=""):
    c = Ctr()
    # reserve counter order: head, foot first
    t = head(n, c); f = foot(n, c)
    sub = P(role(n, "subtitle")[0], "sub", c, "h3") if role(n, "subtitle") else ""
    body = stmts(n, c, lambda k, b: fn(k, b, c))
    label = role(n, "title")[0]["text"]
    return section(n, f"frame-rail {extra}", f'''
<div class="frame"><aside class="rail" data-no="{n:02d}"><div class="rail-top">{t}<span class="rule" aria-hidden="true"></span>{sub}</div>{f}</aside>
<div class="rail-body"><div class="{wrap}">{body}</div>{extra_html}</div></div>''', label)

def s_top(n, extra, fn, wrap):
    c = Ctr(); t = head(n, c); f = foot(n, c)
    body = stmts(n, c, lambda k, b: fn(k, b, c))
    label = role(n, "title")[0]["text"]
    return section(n, f"frame-top {extra}", f'''
<div class="frame"><header class="top-head"><div>{t}<span class="rule" aria-hidden="true"></span></div>{f}</header>
<div class="{wrap}">{body}</div></div>''', label)

stmt = lambda k, b, c: P(b, "stmt" + (" lead" if k == 0 else ""), c)
def s_closing():
    c = Ctr(); t = head(12, c, "h2"); f = foot(12, c)
    its = role(12, "item")
    cls = ["c-lead", "c-lead", "c-body", "c-body"]
    body = "".join(P(b, "stmt " + cls[k], c) for k, b in enumerate(its))
    art = contour_svg("#C3A56B", .30, seed=3.1, cx=300, cy=520, n=15, r0=26, step=26, draw=True)
    return section(12, "s-close tone-dark", f'''
<div class="art-clip" aria-hidden="true"><div class="cover-art close-art">{art}</div><div class="cover-forest"></div></div>
<div class="close-grid"><header>{t}<span class="rule" aria-hidden="true"></span></header><div class="close-body">{body}</div></div>
<div class="slide-foot">{f}</div>''', "CONCLUSION")

def s_remarks():
    c = Ctr()
    extra = ('<aside class="annot" aria-labelledby="annot-l"><label id="annot-l" for="annot-t">Optional on-screen note '
             '<span>(added to this web version; not part of the source report)</span></label>'
             '<textarea id="annot-t" rows="3" placeholder="Type a note for this session only"></textarea></aside>')
    def fn(k, b, c): return P(b, "stmt" + (" remark" if k == 3 else ""), c, labels=(k == 3))
    return s_rail(13, "tone-remarks", fn, extra_html=extra)

def s_river():
    return s_rail(6, "habitat", stmt, extra_html=f'<div class="river">{river_svg()}</div>')

def build():
    sl = {}
    sl[1] = s_cover(); sl[2] = s_index()
    sl[3] = s_rail(3, "intro", stmt)
    sl[4] = s_top(4, "geo", stmt, "grid grid-2")
    def env(k, b, c): return P(b, f"stmt {['asset','asset','concern','measure'][k]}", c, labels=(k == 3))
    sl[5] = s_rail(5, "env", env)
    sl[6] = s_river()
    def tech(k, b, c): return P(b, "card " + ("dark" if k >= 3 else "light"), c)
    sl[7] = s_top(7, "tech", tech, "grid grid-tech")
    def amen(k, b, c): return P(b, "card" + (" note" if k == 4 else ""), c, labels=(k < 4))
    sl[8] = s_top(8, "amen", amen, "grid grid-amen")
    sl[9] = s_rail(9, "chal", stmt)
    sl[10] = s_top(10, "sugg", lambda k, b, c: P(b, "rec", c), "grid grid-rec")
    sl[11] = s_rail(11, "schemes", stmt)
    sl[12] = s_closing(); sl[13] = s_remarks()
    return sl

sl = build()
chrome_icons = {
 "prev": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>',
 "next": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>',
 "grid": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>',
 "full": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
 "home": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11l8-7 8 7M6 10v10h12V10"/></svg>',
 "print": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V4h10v5M7 17H4v-7h16v7h-3M7 14h10v6H7z"/></svg>'}
ov = "".join(f'<li><button type="button" class="ov-item" data-go="{n}"><span class="ov-n">{n:02d}</span>'
             f'<span class="ov-t">{esc(next(b["text"] for b in S[n]["blocks"] if b["role"] in ("title","cover_title")))}</span></button></li>' for n in range(1, N + 1))
page = f'''<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Chhattisgarh Formal Survey Report — Interactive Presentation</title>
<meta name="description" content="Interactive redesign of the Chhattisgarh Formal Survey Report.">
<meta name="theme-color" content="#102C26">
<link rel="stylesheet" href="styles/tokens.css">
<link rel="stylesheet" href="styles/base.css">
<link rel="stylesheet" href="styles/layout.css">
<link rel="stylesheet" href="styles/components.css">
<link rel="stylesheet" href="styles/animations.css">
<link rel="stylesheet" href="styles/responsive.css">
<script>document.documentElement.className="js";</script>
</head>
<body>
<a class="skip" href="#deck">Skip to presentation</a>
<main id="deck" class="deck" data-dir="1" aria-live="off">
{chr(10).join(sl[n] for n in range(1, N + 1))}
</main>
<nav class="chrome" aria-label="Presentation controls">
  <div class="progress" role="progressbar" aria-label="Presentation progress" aria-valuemin="1" aria-valuemax="{N}" aria-valuenow="1"><i></i></div>
  <div class="chrome-l">
    <button type="button" class="ctl" id="btn-overview" aria-label="Open slide overview" aria-expanded="false" aria-controls="overview">{chrome_icons["grid"]}<span class="lbl">Overview</span></button>
    <button type="button" class="ctl" id="btn-home" aria-label="Return to cover">{chrome_icons["home"]}</button>
  </div>
  <div class="chrome-c">
    <button type="button" class="ctl" id="btn-prev" aria-label="Previous slide">{chrome_icons["prev"]}</button>
    <p class="counter" id="counter" aria-live="polite" aria-atomic="true"><span id="c-cur">01</span> / <span id="c-tot">{N:02d}</span></p>
    <button type="button" class="ctl" id="btn-next" aria-label="Next slide">{chrome_icons["next"]}</button>
  </div>
  <div class="chrome-r">
    <button type="button" class="ctl" id="btn-print" aria-label="Print or save as PDF">{chrome_icons["print"]}</button>
    <button type="button" class="ctl" id="btn-full" aria-label="Enter full screen" aria-pressed="false">{chrome_icons["full"]}<span class="lbl">Full screen</span></button>
  </div>
</nav>
<aside id="overview" class="overview" aria-label="Slide overview" hidden>
  <div class="ov-head"><h2>Slides</h2><button type="button" class="ctl" id="ov-close" aria-label="Close slide overview">✕</button></div>
  <ol class="ov-list">{ov}</ol>
</aside>
<div class="scrim" id="scrim" hidden></div>
<script src="scripts/manifest.js"></script>
<script src="scripts/animations.js"></script>
<script src="scripts/navigation.js"></script>
<script src="scripts/validation.js"></script>
<script src="scripts/main.js"></script>
</body>
</html>'''
open("index.html", "w", encoding="utf-8").write(page)
open("scripts/manifest.js", "w", encoding="utf-8").write("window.CONTENT_MANIFEST = " + json.dumps(M, ensure_ascii=False) + ";\n")
print("index.html written:", len(page), "bytes")

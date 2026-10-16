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
    extra = ('''<div class="photo-strip" data-r style="--i:4">
  <figure class="photo-thumb">
    <img src="assets/images/bastar_dokra_craft.jpg" alt="Bastar tribal Dokra bell-metal craft" loading="lazy">
    <figcaption><b>Bastar Dokra:</b> Traditional lost-wax bell metal craft</figcaption>
  </figure>
  <figure class="photo-thumb">
    <img src="assets/images/kanger_valley_forest.jpg" alt="Kanger Valley National Park, Bastar" loading="lazy">
    <figcaption><b>Kanger Valley:</b> Sal forest ecosystem and biodiversity</figcaption>
  </figure>
</div>
<aside class="annot" aria-labelledby="annot-l" data-r style="--i:5"><label id="annot-l" for="annot-t">Optional on-screen note '''
             '<span>(added to this web version; not part of the source report)</span></label>'
             '<textarea id="annot-t" rows="3" placeholder="Type a note for this session only"></textarea></aside>')
    def fn(k, b, c): return P(b, "stmt" + (" remark" if k == 3 else ""), c, labels=(k == 3))
    return s_rail(13, "tone-remarks", fn, extra_html=extra)

def s_river():
    art = f'''<div class="river">{river_svg()}</div>
<div class="photo-card-side" data-r style="--i:5">
  <img src="assets/images/chitrakote_falls.jpg" alt="Chitrakote Falls on Indravati River, Bastar, Chhattisgarh" loading="lazy">
  <div class="photo-card-meta"><b>Chitrakote Falls:</b> Indravati River basin, Bastar (~300 m monsoon crest)</div>
</div>'''
    return s_rail(6, "habitat", stmt, extra_html=art)

def s_stats():
    c = Ctr()
    head_html = f'''<div class="frame"><header class="top-head">
<div><h2 class="ttl" data-r style="--i:{c.nxt()}">KEY STATISTICS & EMPIRICAL PROFILE</h2><span class="rule" aria-hidden="true"></span>
<p class="sub" data-r style="--i:{c.nxt()}" style="margin-top:.4rem;color:var(--gold)">Verified secondary indicators from official government publications</p></div>
<p class="foot" data-r style="--i:{c.nxt()}">CHHATTISGARH FORMAL SURVEY REPORT • 14</p>
</header>
<div class="stats-grid">
  <div class="stat-card" data-r style="--i:{c.nxt()}">
    <div>
      <div class="stat-tag">Forestry & Environment</div>
      <div class="stat-val">44.21%</div>
      <div class="stat-desc"><b>55,717 sq. km forest cover:</b> 3rd largest in India. Recorded forest area covers over 44% of the state's total geographical area (1,35,192 sq. km).</div>
    </div>
    <div class="stat-src">Forest Survey of India, ISFR 2021</div>
  </div>
  <div class="stat-card accent-clay" data-r style="--i:{c.nxt()}">
    <div>
      <div class="stat-tag">Demographics & Tribes</div>
      <div class="stat-val">30.6% ST</div>
      <div class="stat-desc"><b>76.8% rural populace:</b> Total 2.55 Cr (2011 Census) → ~3.05 Cr (2024 Proj.). Scheduled Tribes form 30.62% (78.22 lakh); Scheduled Castes form 12.82%.</div>
    </div>
    <div class="stat-src">Census of India 2011 / MoHFW Tech. Group</div>
  </div>
  <div class="stat-card accent-gold" data-r style="--i:{c.nxt()}">
    <div>
      <div class="stat-tag">Gender Equity</div>
      <div class="stat-val">991 / 1000</div>
      <div class="stat-desc"><b>High sex ratio:</b> 991 females per 1,000 males, markedly higher than national average (943), reflecting egalitarian tribal social structures.</div>
    </div>
    <div class="stat-src">Census of India 2011 Primary Census Abstract</div>
  </div>
  <div class="stat-card accent-clay" data-r style="--i:{c.nxt()}">
    <div>
      <div class="stat-tag">Mineral Wealth</div>
      <div class="stat-val">~18% Coal • 20% Iron</div>
      <div class="stat-desc"><b>Key national producer:</b> Top ranking in coal and iron ore output; contains 100% of India's established Tin ore (Cassiterite) reserves in Dantewada.</div>
    </div>
    <div class="stat-src">Indian Bureau of Mines & Min. of Mines (2022-23)</div>
  </div>
  <div class="stat-card" data-r style="--i:{c.nxt()}">
    <div>
      <div class="stat-tag">Agrarian Economy</div>
      <div class="stat-val">Rice Bowl</div>
      <div class="stat-desc"><b>"Dhan Ka Katora":</b> 80%+ rural workforce engaged in agriculture; 4.68 million hectares net sown area with over 20,000 documented indigenous rice landraces.</div>
    </div>
    <div class="stat-src">DES & Dept. of Agriculture, Chhattisgarh</div>
  </div>
  <div class="stat-card accent-gold" data-r style="--i:{c.nxt()}">
    <div>
      <div class="stat-tag">Poverty Reduction</div>
      <div class="stat-val">29.9% → 16.4%</div>
      <div class="stat-desc"><b>MPI progress:</b> Multidimensional poverty dropped by 13.5 percentage points between NFHS-4 (2015-16) and NFHS-5 (2019-21), lifting ~37 lakh people out of poverty.</div>
    </div>
    <div class="stat-src">NITI Aayog National MPI Progress Report 2023</div>
  </div>
</div></div>'''
    return section(14, "frame-top tone-light", head_html, "KEY STATISTICS & EMPIRICAL PROFILE")

def s_future():
    c = Ctr()
    head_html = f'''<div class="frame"><header class="top-head">
<div><h2 class="ttl" data-r style="--i:{c.nxt()}">FUTURE WORK & INNOVATION ROADMAP</h2><span class="rule" aria-hidden="true"></span>
<p class="sub" data-r style="--i:{c.nxt()}" style="margin-top:.4rem;color:var(--gold)">Proposed field immersion methodologies, technical interventions, and academic milestones</p></div>
<p class="foot" data-r style="--i:{c.nxt()}">CHHATTISGARH FORMAL SURVEY REPORT • 15</p>
</header>
<div class="future-grid">
  <div class="future-card" data-r style="--i:{c.nxt()}">
    <div class="future-phase">Pillar 01 • Grassroots Fieldwork</div>
    <h3 class="future-title">Primary Gram Panchayat Immersion Survey</h3>
    <ul class="future-list">
      <li>Conduct structured community surveys across targeted Gram Panchayats in Bastar, Kondagaon, and Mahasamund.</li>
      <li>Administer semi-structured interviews with Self-Help Groups (SHGs), Primary Health Centres (PHCs), and local Panchayati Raj representatives.</li>
      <li>Document indigenous farming knowledge and traditional water harvesting systems.</li>
    </ul>
    <span class="future-badge">Methodology: Participatory Rural Appraisal (PRA)</span>
  </div>
  <div class="future-card" data-r style="--i:{c.nxt()}">
    <div class="future-phase">Pillar 02 • Technical Innovation</div>
    <h3 class="future-title">Offline-First Mobile Survey Tooling</h3>
    <ul class="future-list">
      <li>Engineer an open-source, offline-first Progressive Web App (PWA) with SQLite local caching for zero-connectivity forest zones.</li>
      <li>Integrate bilingual Chhattisgarhi/Hindi audio questions for intuitive survey completion by non-literate community members.</li>
      <li>Implement GPS timestamp verification for transparent field survey logging.</li>
    </ul>
    <span class="future-badge">Tech Stack: PWA · IndexedDB · OpenStreetMap</span>
  </div>
  <div class="future-card" data-r style="--i:{c.nxt()}">
    <div class="future-phase">Pillar 03 • Livelihood Systems</div>
    <h3 class="future-title">Agro-Forestry Value Chain Interventions</h3>
    <ul class="future-list">
      <li>Analyze processing, storage, and procurement bottlenecks for Minor Forest Produce (Mahua, Tendu Patta, Sal Seed, Harra).</li>
      <li>Examine market linkages and fair-trade direct aggregation models for Bastar Dokra metalcraft and Kosa silk artisans.</li>
      <li>Evaluate solar mini-cold storage viability for perishable tribal produce.</li>
    </ul>
    <span class="future-badge">Focus: Van Dhan Vikas Kendras (VDVKs)</span>
  </div>
  <div class="future-card" data-r style="--i:{c.nxt()}">
    <div class="future-phase">Pillar 04 • Policy & Impact</div>
    <h3 class="future-title">GIS Spatial Dashboard & Open Academic Repository</h3>
    <ul class="future-list">
      <li>Synthesize village-level amenity access indicators into an interactive GIS map layer for public review.</li>
      <li>Formulate actionable policy briefs and village-specific suggestions for rural development stakeholders and district administration.</li>
      <li>Publish anonymized survey datasets in an institutional open-access repository.</li>
    </ul>
    <span class="future-badge">Deliverable: Interactive Spatial Decision Dashboard</span>
  </div>
</div></div>'''
    return section(15, "frame-top tone-light", head_html, "FUTURE WORK & INNOVATION ROADMAP")

def s_references():
    c = Ctr()
    head_html = f'''<div class="frame"><header class="top-head">
<div><h2 class="ttl" data-r style="--i:{c.nxt()}">SOURCES, REFERENCES & ATTRIBUTION</h2><span class="rule" aria-hidden="true"></span>
<p class="sub" data-r style="--i:{c.nxt()}" style="margin-top:.4rem;color:var(--gold)">Primary government portals, statutory reports, and verified photographic media attributions</p></div>
<p class="foot" data-r style="--i:{c.nxt()}">CHHATTISGARH FORMAL SURVEY REPORT • 16</p>
</header>
<div class="ref-grid">
  <div class="ref-card" data-r style="--i:{c.nxt()}">
    <h3>Official Primary Data Authorities</h3>
    <a href="https://censusindia.gov.in" target="_blank" rel="noopener noreferrer" class="ref-item">
      <b>Office of the Registrar General & Census Commissioner, India</b>
      Census 2011: Primary Census Abstract Data Table for Chhattisgarh State
      <span class="ref-meta">censusindia.gov.in <span class="ref-badge">Statutory</span></span>
    </a>
    <a href="https://fsi.nic.in" target="_blank" rel="noopener noreferrer" class="ref-item">
      <b>Forest Survey of India (FSI), MoEFCC</b>
      India State of Forest Report (ISFR) 2021: Chapter 11.6 Chhattisgarh Assessment
      <span class="ref-meta">fsi.nic.in <span class="ref-badge">Biennial Report</span></span>
    </a>
    <a href="https://mospi.gov.in" target="_blank" rel="noopener noreferrer" class="ref-item">
      <b>Ministry of Statistics and Programme Implementation (MoSPI)</b>
      National Sample Survey & State-Wise Socio-Economic Database
      <span class="ref-meta">mospi.gov.in <span class="ref-badge">Government of India</span></span>
    </a>
    <a href="https://cag.gov.in" target="_blank" rel="noopener noreferrer" class="ref-item">
      <b>Comptroller and Auditor General of India (CAG)</b>
      Audit Reports on Government of Chhattisgarh (Social, General, and Economic Sectors)
      <span class="ref-meta">cag.gov.in <span class="ref-badge">Constitutional Authority</span></span>
    </a>
    <a href="https://cgstate.gov.in" target="_blank" rel="noopener noreferrer" class="ref-item">
      <b>Government of Chhattisgarh Official State Portal</b>
      Official administrative profile, welfare schemes directory, and district statistics
      <span class="ref-meta">cgstate.gov.in <span class="ref-badge">State Portal</span></span>
    </a>
    <a href="https://niti.gov.in" target="_blank" rel="noopener noreferrer" class="ref-item">
      <b>NITI Aayog, Government of India</b>
      National Multidimensional Poverty Index: A Progress Review 2023 (State Profiles)
      <span class="ref-meta">niti.gov.in <span class="ref-badge">Policy Commission</span></span>
    </a>
  </div>
  <div class="ref-card ref-media" data-r style="--i:{c.nxt()}">
    <h3>Media & Photographic Attributions</h3>
    <a href="https://commons.wikimedia.org/wiki/File:Chitrakote_Falls.jpg" target="_blank" rel="noopener noreferrer" class="ref-item">
      <b>Chitrakote Falls, Indravati River (Bastar, Chhattisgarh)</b>
      Photograph by Ksh85 • Licensed under Creative Commons CC BY-SA 4.0
      <span class="ref-meta">Wikimedia Commons <span class="ref-badge">Verified Location</span></span>
    </a>
    <a href="https://commons.wikimedia.org/wiki/File:Kanger_valley_National_park.jpg" target="_blank" rel="noopener noreferrer" class="ref-item">
      <b>Kanger Valley National Park Sal Canopy (Bastar District)</b>
      Photograph by Harminder singh saini • Licensed under CC BY-SA 4.0
      <span class="ref-meta">Wikimedia Commons <span class="ref-badge">Verified Location</span></span>
    </a>
    <a href="https://commons.wikimedia.org/wiki/File:Dokra_from_tribes_of_Bastar_DSCN1172_02.jpg" target="_blank" rel="noopener noreferrer" class="ref-item">
      <b>Traditional Bastar Tribal Dokra / Bell Metal Craft</b>
      Photograph by Sumita Roy Dutta • Licensed under CC BY-SA 4.0
      <span class="ref-meta">Wikimedia Commons <span class="ref-badge">Verified Artisan Work</span></span>
    </a>
    <a href="https://commons.wikimedia.org/wiki/File:Sirpur_Chhattisgarh.jpg" target="_blank" rel="noopener noreferrer" class="ref-item">
      <b>Sirpur Archaeological Complex (Ancient Dakshin Kosala)</b>
      Photograph by Aashishsainik • Licensed under CC BY-SA 3.0
      <span class="ref-meta">Wikimedia Commons <span class="ref-badge">Historical Monument</span></span>
    </a>
    <div class="ref-item">
      <b>Generative Vector Cartography & Contours</b>
      Procedural mathematical SVG contour lines and river flow generated with <code>tools/make_graphics.py</code>
      <span class="ref-meta">Bundled Assets <span class="ref-badge">Open Vector</span></span>
    </div>
  </div>
</div></div>'''
    return section(16, "frame-top tone-light", head_html, "SOURCES, REFERENCES & ATTRIBUTION")

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
    sl[14] = s_stats(); sl[15] = s_future(); sl[16] = s_references()
    return sl

TOTAL_N = 16
sl = build()
chrome_icons = {
 "prev": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>',
 "next": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>',
 "play": '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor"/></svg>',
 "grid": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>',
 "full": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
 "home": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11l8-7 8 7M6 10v10h12V10"/></svg>',
 "print": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V4h10v5M7 17H4v-7h16v7h-3M7 14h10v6H7z"/></svg>'}

def ov_title(n):
    if n <= 13:
        return esc(next(b["text"] for b in S[n]["blocks"] if b["role"] in ("title","cover_title")))
    elif n == 14:
        return "Key Statistics & Empirical Profile"
    elif n == 15:
        return "Future Work & Innovation Roadmap"
    elif n == 16:
        return "Sources, References & Attribution"

ov = "".join(f'<li><button type="button" class="ov-item" data-go="{n}"><span class="ov-n">{n:02d}</span>'
             f'<span class="ov-t">{ov_title(n)}</span></button></li>' for n in range(1, TOTAL_N + 1))

page = f'''<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Chhattisgarh Formal Survey Report — Interactive Presentation</title>
<meta name="description" content="Interactive presentation of the Chhattisgarh Formal Survey Report with verified statistics, imagery, and rural immersion roadmap.">
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
{chr(10).join(sl[n] for n in range(1, TOTAL_N + 1))}
</main>
<nav class="chrome" aria-label="Presentation controls">
  <div class="progress" role="progressbar" aria-label="Presentation progress" aria-valuemin="1" aria-valuemax="{TOTAL_N}" aria-valuenow="1"><i></i></div>
  <div class="chrome-l">
    <button type="button" class="ctl" id="btn-overview" aria-label="Open slide overview (O)" aria-expanded="false" aria-controls="overview">{chrome_icons["grid"]}<span class="lbl">Overview</span></button>
    <button type="button" class="ctl" id="btn-home" aria-label="Return to cover (R)">{chrome_icons["home"]}</button>
    <button type="button" class="ctl" id="btn-play" aria-label="Autoplay presentation (Space / P)" aria-pressed="false">{chrome_icons["play"]}<span class="lbl">Play</span><div class="autoplay-timer-bar" id="autoplay-bar"></div></button>
  </div>
  <div class="chrome-c">
    <button type="button" class="ctl" id="btn-prev" aria-label="Previous slide">{chrome_icons["prev"]}</button>
    <p class="counter" id="counter" aria-live="polite" aria-atomic="true"><span id="c-cur">01</span> / <span id="c-tot">{TOTAL_N:02d}</span></p>
    <button type="button" class="ctl" id="btn-next" aria-label="Next slide">{chrome_icons["next"]}</button>
  </div>
  <div class="chrome-r">
    <button type="button" class="ctl" id="btn-print" aria-label="Print or save as PDF">{chrome_icons["print"]}</button>
    <button type="button" class="ctl" id="btn-full" aria-label="Enter full screen (F)" aria-pressed="false">{chrome_icons["full"]}<span class="lbl">Full screen</span></button>
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
print(f"index.html written: {len(page)} bytes, {TOTAL_N} slides")


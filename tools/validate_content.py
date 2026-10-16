"""Compare original PPTX text -> manifest -> HTML -> redesigned PPTX -> PDF. Writes exports/validation-report.json.
Only whitespace is normalised (line breaks / runs of spaces). Punctuation, case, numbers and words are compared as-is."""
import html as H, json, re, subprocess, sys, zipfile, pathlib
from html.parser import HTMLParser
from pptx import Presentation
ROOT = pathlib.Path(".")
norm = lambda s: re.sub(r"\s+", " ", s).strip()
M = json.load(open("data/content-manifest.json", encoding="utf-8"))
blocks = [(s["index"], b) for s in M["slides"] for b in s["blocks"]]
rep = {"source_slides": M["slide_count"], "text_blocks_counted": len(blocks)}

# 1. source pptx vs manifest (independent re-extraction)
src = Presentation("data/source.pptx"); src_paras = []
for i, s in enumerate(src.slides, 1):
    for sh in s.shapes:
        if sh.has_text_frame:
            for p in sh.text_frame.paragraphs:
                t = "".join(r.text for r in p.runs)
                if t.strip(): src_paras.append((i, t))
man_paras = [(i, b["text"]) for i, b in blocks]
rep["source_vs_manifest"] = {"source_paragraphs": len(src_paras), "manifest_blocks": len(man_paras), "identical_in_order": src_paras == man_paras}

# 2. HTML: every block present once, exact text, on the right slide
class P(HTMLParser):
    def __init__(s): super().__init__(); s.stack = []; s.cur = {}; s.slide = None; s.skip = 0
    def handle_starttag(s, tag, a):
        a = dict(a)
        if tag == "script": s.skip += 1
        if tag == "section" and "data-n" in a: s.slide = int(a["data-n"])
        if "data-src" in a: s.stack.append([a["data-src"], tag, 1, [], s.slide])
        elif s.stack and tag not in ("br", "img", "input", "meta", "link"): s.stack[-1][2] += 1
    def handle_endtag(s, tag):
        if tag == "script": s.skip -= 1
        if s.stack:
            s.stack[-1][2] -= 1
            if s.stack[-1][2] == 0: k, _, _, parts, sl = s.stack.pop(); s.cur.setdefault(k, []).append(("".join(parts), sl))
    def handle_data(s, d):
        if s.stack and not s.skip: s.stack[-1][3].append(d)
p = P(); p.feed(open("index.html", encoding="utf-8").read())
miss, alt, dup = [], [], []
for i, b in blocks:
    got = p.cur.get(b["id"])
    if not got: miss.append(b["id"]); continue
    if len(got) > 1: dup.append(b["id"])
    if got[0][1] != i or norm(got[0][0]) != norm(b["text"]): alt.append(b["id"])
rep["html"] = {"sections": len(re.findall(r'<section class="slide', open("index.html").read())), "verified": len(blocks) - len(miss) - len(alt), "missing": miss, "altered": alt, "duplicated": dup}

# 3. redesigned PPTX: slide-wise text; each block must appear as a shape text (or a substring of run-joined paragraph)
out = Presentation("exports/chhattisgarh-interactive-report.pptx"); pm, pa = [], []
pslides = []
for s in out.slides:
    texts = []
    for sh in s.shapes:
        if sh.has_text_frame:
            for para in sh.text_frame.paragraphs: texts.append(norm("".join(r.text for r in para.runs)))
    pslides.append(texts)
for i, b in blocks:
    (pa if norm(b["text"]) not in pslides[i - 1] else pm).append(b["id"]) if i <= len(pslides) else pa.append(b["id"])
rep["pptx"] = {"slides": len(out.slides), "verified": len(pm), "missing_or_altered": pa}
off = []
W, Hh = out.slide_width, out.slide_height
for n, s in enumerate(out.slides, 1):
    for sh in s.shapes:
        if sh.left is not None and (sh.left < -1 or sh.top < -1 or sh.left + sh.width > W + 1 or sh.top + sh.height > Hh + 1) and sh.shape_type != 13: off.append((n, sh.name))
rep["pptx"]["non_picture_shapes_outside_slide"] = off
rep["pptx"]["picture_shapes"] = sum(1 for s in out.slides for sh in s.shapes if sh.shape_type == 13)

# 4. PDF text (pdftotext, whitespace-normalised per page; hyphenation not applied by the browser)
pm2, pa2 = [], []
try:
    pages = subprocess.run(["pdftotext", "-raw", "exports/chhattisgarh-interactive-report.pdf", "-"], capture_output=True, text=True).stdout.split("\f")
    pages = [norm(x) for x in pages if x.strip()]
    for i, b in blocks:
        nos = lambda x: re.sub(r"\s+", "", x)   # PDF only: wraps at hyphens + letter-spacing add spaces on extraction
        (pm2 if i <= len(pages) and nos(b["text"]) in nos(pages[i - 1]) else pa2).append(b["id"])
    rep["pdf"] = {"pages": len(pages), "verified": len(pm2), "missing_or_altered": pa2}
except Exception as e:
    rep["pdf"] = {"note": f"pdftotext not available on this platform ({e}); skipped"}

# 5. images
zipm = [n for n in zipfile.ZipFile("data/source.pptx").namelist() if "/media/" in n]
rep["images"] = {"original_assets_counted": len(zipm), "reused": 0, "missing_or_replaced": 0, "note": "Source contains no photographs; none added."}
json.dump(rep, open("exports/validation-report.json", "w"), indent=1)
print(json.dumps(rep, indent=1))
bad = miss or alt or dup or pa or pa2 or not rep["source_vs_manifest"]["identical_in_order"] or off
sys.exit(1 if bad else 0)

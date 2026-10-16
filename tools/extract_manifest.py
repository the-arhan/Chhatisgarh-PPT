"""Phase 1: audit the source PPTX and write data/content-manifest.json (source of truth)."""
import json, sys, zipfile
from pptx import Presentation
SRC = sys.argv[1] if len(sys.argv) > 1 else "data/source.pptx"
OUT = "data/content-manifest.json"
prs = Presentation(SRC)
z = zipfile.ZipFile(SRC)
media = [n for n in z.namelist() if "/media/" in n]
blips = sum(z.read(n).count(b"a:blip") for n in z.namelist() if n.startswith("ppt/") and n.endswith(".xml"))
manifest = {
  "source_file": "Chhattisgarh_Formal_Survey_Report-2.pptx",
  "slide_size_emu": [prs.slide_width, prs.slide_height],
  "slide_count": len(prs.slides),
  "image_audit": {"ppt_media_files": media, "a_blip_references_in_ppt_xml": blips,
     "package_thumbnail_only": [n for n in z.namelist() if "thumbnail" in n],
     "note": "No photographs, logos or illustrations exist in the source package."},
  "slides": []}
for i, s in enumerate(prs.slides, 1):
    shapes = [sh for sh in s.shapes if sh.has_text_frame and sh.text_frame.text.strip()]
    blocks = []
    for sh in shapes:
        paras = [p for p in sh.text_frame.paragraphs if "".join(r.text for r in p.runs).strip()]
        for j, p in enumerate(paras):
            t = "".join(r.text for r in p.runs)
            assert t == p.text, (i, t, p.text)
            blocks.append({"id": f"s{i:02d}-b{len(blocks)+1:02d}", "shape": sh.name, "para": j,
                           "top": sh.top, "left": sh.left, "text": t})
    if i == 1:
        roles = ["cover_title","cover_subtitle","cover_topics","cover_topics","cover_ancient"]+["cover_meta"]*5+["cover_badge"]
    else:
        roles = []
        for b in blocks:
            if b["shape"] == "TextBox 2": roles.append("title")
            elif b["shape"] == "TextBox 4": roles.append("footer")
            elif b["top"] == 1143000: roles.append("subtitle")
            else: roles.append("item")
    assert len(roles) == len(blocks)
    for b, r in zip(blocks, roles): b["role"] = r
    manifest["slides"].append({"index": i, "layout": s.slide_layout.name, "shape_count": len(s.shapes),
        "picture_shapes": sum(1 for sh in s.shapes if sh.shape_type == 13),
        "has_notes": s.has_notes_slide, "blocks": blocks, "images": []})
json.dump(manifest, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
tot = sum(len(s["blocks"]) for s in manifest["slides"])
print("slides", manifest["slide_count"], "| text blocks", tot, "| media", len(media), "| blips", blips)
for s in manifest["slides"]:
    print(s["index"], sum(b["role"]=="item" for b in s["blocks"]), "items;", next(b["text"] for b in s["blocks"] if b["role"] in ("title","cover_title")))

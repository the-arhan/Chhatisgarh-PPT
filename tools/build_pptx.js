// Redesigned, fully editable PPTX. Text comes from data/content-manifest.json (never retyped).
const pptxgen = require("pptxgenjs");
// apply_theme.js only rewrites the theme colour palette inside the saved file; the deck is fully valid without it.
let applyTheme = async () => {};
try { ({ applyTheme } = require(process.env.APPLY_THEME_JS || "/mnt/skills/public/pptx/scripts/apply_theme.js")); } catch (e) { console.warn("apply_theme.js not found; PPTX theme palette left at Office defaults"); }
const M = require("../data/content-manifest.json");
const C = { forest: "173D32", ever: "102C26", ivory: "F6F2E9", paper: "FFFCF6", clay: "B96548", clayInk: "8F4630",
            gold: "C3A56B", slate: "303B37", sage: "A7B6A0", soft: "4A5752" };
const HEAD = "Georgia", BODY = "Calibri";
const THEME = { name: "Chhattisgarh Editorial", headFontFace: HEAD, bodyFontFace: BODY,
  colors: { dk1: C.slate, lt1: C.paper, dk2: C.forest, lt2: C.ivory, accent1: C.forest, accent2: C.clay, accent3: C.gold,
            accent4: C.sage, accent5: C.ever, accent6: C.clayInk, hlink: C.clayInk, folHlink: "7D6228" } };
const G = (n) => __dirname + "/../assets/graphics/" + n;
const W = 13.333, H = 7.5;
const pres = new pptxgen(); pres.layout = "LAYOUT_WIDE";
pres.title = "Chhattisgarh Formal Survey Report — redesigned"; pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };
const S = {}; M.slides.forEach((s) => (S[s.index] = s));
const role = (n, r) => S[n].blocks.filter((b) => b.role === r);
const SCHEMES = ["MGNREGA", "PMAY", "Ayushman Bharat / PM-JAY", "PM-KISAN"];

// text → runs preserving the exact string (only styling is split)
function runs(text, o, mode) {
  let parts = [{ t: text, s: {} }];
  if (mode === "label") { const m = text.match(/^([^:]{1,40}:)( .*)$/); if (m) parts = [{ t: m[1], s: { bold: true, color: o.labelColor || C.forest } }, { t: m[2], s: {} }]; }
  if (mode === "scheme") {
    const re = new RegExp("(" + SCHEMES.map((x) => x.replace(/[/-]/g, "\\$&")).join("|") + ")", "g");
    parts = text.split(re).filter((x) => x !== "").map((t) => ({ t, s: SCHEMES.includes(t) ? { bold: true, color: C.clayInk } : {} }));
  }
  return parts.map((p) => ({ text: p.t, options: Object.assign({}, p.s) }));
}
const lines = (t, size, w, ratio) => Math.max(1, Math.ceil((t.length * size * ratio) / 72 / w));
function tb(s, content, x, y, w, h, o) {
  s.addText(content, Object.assign({ x, y, w, h, margin: 0, isTextBox: true, valign: "top", fontFace: BODY, color: C.slate, fit: "none" }, o));
}
function dot(s, x, y, color, d = 0.14) { s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color }, line: { color, width: 0 } }); }
function bg(s, color) { s.background = { color }; }
function deco(s, img, x, y, w, h, tr) { s.addImage({ path: G(img), x, y, w, h, transparency: tr, altText: "Decorative topographic contour lines" }); }

// stack statements vertically, centred in [y0,y1]
function stack(s, items, x, w, y0, y1, fn, size, gap) {
  const hs = items.map((b, k) => { const sz = fn(k).size || size; const ratio = fn(k).serif ? 0.5 : 0.46; return lines(b.text, sz, w, ratio) * sz * 1.32 / 72 + 0.08; });
  const total = hs.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
  let y = y0 + Math.max(0, (y1 - y0 - total) / 2);
  items.forEach((b, k) => { fn(k, b, y, hs[k]); y += hs[k] + gap; });
}

function railSlide(n, opts = {}) {
  const s = pres.addSlide(); bg(s, C.ivory);
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 4.5, h: H, fill: { color: C.forest }, line: { color: C.forest, width: 0 } });
  deco(s, "contours-light.png", -1.4, 3.1, 7.4, 7.4, 45);
  const t = role(n, "title")[0], f = role(n, "footer")[0];
  tb(s, t.text, 0.5, 0.7, 3.8, 1.9, { fontFace: HEAD, fontSize: 24, color: C.ivory, objectName: `Title ${n}` });
  s.addShape(pres.ShapeType.rect, { x: 0.5, y: 2.55, w: 0.8, h: 0.05, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  const sub = role(n, "subtitle")[0];
  if (sub) tb(s, sub.text, 0.5, 2.85, 3.6, 0.5, { fontFace: HEAD, fontSize: 20, color: C.gold });
  tb(s, f.text, 0.5, 6.85, 3.8, 0.3, { fontSize: 10, color: C.sage, charSpacing: 1 });
  const items = role(n, "item"); const o2 = opts.item || (() => ({}));
  stack(s, items, 5.25, 7.0, 0.5, 7.0, (k, b, y, h) => {
    if (!b) return Object.assign({ size: k === 0 && opts.lead ? 22 : 18 }, o2(k), k === 0 && opts.lead ? { serif: true } : {});
    const st = Object.assign({ size: k === 0 && opts.lead ? 22 : 18 }, o2(k)); const lead = k === 0 && opts.lead;
    if (st.panel) s.addShape(pres.ShapeType.rect, { x: 4.95, y: y - 0.12, w: 7.7, h: h + 0.24, fill: { color: st.panel }, line: { color: st.panel, width: 0 } });
    dot(s, 5.0, y + 0.1, st.dot || C.clay);
    tb(s, runs(b.text, { labelColor: st.labelColor }, st.mode), 5.35, y, 7.0, h, { fontSize: st.size, fontFace: lead ? HEAD : BODY, color: st.color || (lead ? C.forest : C.slate), objectName: b.id });
  }, 18, opts.gap || 0.42);
  if (opts.extra) opts.extra(s);
  return s;
}
function topFrame(n) {
  const s = pres.addSlide(); bg(s, C.ivory);
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: 1.55, fill: { color: C.forest }, line: { color: C.forest, width: 0 } });
  deco(s, "contours-gold.png", 8.4, -2.6, 6.5, 6.5, 55);
  tb(s, role(n, "title")[0].text, 0.6, 0.45, 12.1, 0.7, { fontFace: HEAD, fontSize: 26, color: C.ivory, objectName: `Title ${n}` });
  s.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.2, w: 0.8, h: 0.05, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  tb(s, role(n, "footer")[0].text, 8.6, 1.2, 4.1, 0.25, { fontSize: 10, color: C.sage, align: "right", charSpacing: 1 });
  return s;
}
function card(s, b, x, y, w, h, o = {}) {
  const dark = o.dark; s.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color: dark ? C.forest : C.paper }, line: { color: dark ? C.forest : "E5E0D3", width: 0.5 } });
  s.addShape(pres.ShapeType.rect, { x, y, w, h: 0.05, fill: { color: o.accent || C.forest }, line: { color: o.accent || C.forest, width: 0 } });
  tb(s, runs(b.text, { labelColor: dark ? C.gold : C.forest }, o.mode), x + 0.3, y + 0.3, w - 0.6, h - 0.5, { fontSize: o.size || 17, fontFace: o.serif ? HEAD : BODY, color: dark ? C.ivory : C.slate, objectName: b.id, valign: o.mid ? "middle" : "top" });
}

// ---- 1 cover
{ const s = pres.addSlide(); bg(s, C.ever);
  deco(s, "contours-gold.png", 7.2, -1.6, 7.6, 7.6, 40);
  s.addImage({ path: G("forest.png"), x: 0, y: 6.45, w: W, h: 1.05, transparency: 0, altText: "Decorative forest silhouette" });
  const r = (x) => role(1, x);
  tb(s, r("cover_title")[0].text, 0.8, 1.0, 9.0, 1.2, { fontFace: HEAD, fontSize: 66, color: C.ivory, objectName: "Cover title" });
  tb(s, r("cover_subtitle")[0].text, 0.85, 2.3, 8, 0.6, { fontFace: HEAD, fontSize: 28, color: C.gold, charSpacing: 2 });
  s.addShape(pres.ShapeType.rect, { x: 0.85, y: 3.2, w: 0.04, h: 0.95, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  tb(s, r("cover_topics").map((b, i, a) => ({ text: b.text, options: { breakLine: i < a.length - 1 } })), 1.1, 3.2, 7, 0.95, { fontSize: 18, color: C.ivory, valign: "middle", paraSpaceAfter: 4 });
  tb(s, r("cover_ancient")[0].text, 0.85, 4.45, 7, 0.4, { fontFace: HEAD, italic: true, fontSize: 18, color: C.sage });
  const meta = r("cover_meta");
  s.addShape(pres.ShapeType.rect, { x: 8.6, y: 2.2, w: 4.1, h: 3.35, fill: { color: C.ever, transparency: 15 }, line: { color: C.ever, width: 0 } });
  s.addShape(pres.ShapeType.rect, { x: 8.6, y: 2.2, w: 0.04, h: 3.35, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  meta.forEach((b, i) => tb(s, runs(b.text, { labelColor: C.gold }, "label"), 8.9, 2.4 + i * 0.6, 3.7, 0.55, { fontSize: 13, color: C.ivory, objectName: b.id }));
  s.addShape(pres.ShapeType.rect, { x: 9.9, y: 5.85, w: 2.8, h: 0.4, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  tb(s, r("cover_badge")[0].text, 9.9, 5.85, 2.8, 0.4, { fontSize: 11, bold: true, color: C.ever, align: "center", valign: "middle", charSpacing: 3 });
}
// ---- 2 index
{ const s = pres.addSlide(); bg(s, C.ivory); const target = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  tb(s, role(2, "title")[0].text, 0.7, 0.7, 3.6, 1.4, { fontFace: HEAD, fontSize: 30, color: C.forest });
  s.addShape(pres.ShapeType.rect, { x: 0.7, y: 2.0, w: 0.8, h: 0.05, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  tb(s, role(2, "subtitle")[0].text, 0.7, 2.3, 3.6, 0.5, { fontFace: HEAD, fontSize: 20, color: C.clayInk });
  role(2, "item").forEach((b, k) => { const col = k < 5 ? 0 : 1, row = k % 5, x = 4.6 + col * 4.35, y = 0.9 + row * 1.15;
    tb(s, String(k + 1).padStart(2, "0"), x, y + 0.08, 0.5, 0.3, { fontSize: 11, bold: true, color: C.clayInk });
    tb(s, [{ text: b.text, options: { hyperlink: { slide: target[k], tooltip: "Go to slide " + target[k] } } }], x + 0.55, y, 3.7, 0.8, { fontFace: HEAD, fontSize: 15, color: C.forest, objectName: b.id });
    s.addShape(pres.ShapeType.line, { x, y: y + 0.88, w: 4.2, h: 0, line: { color: "D9D3C3", width: 0.75 } }); });
  tb(s, role(2, "footer")[0].text, 0.7, 6.95, 6, 0.25, { fontSize: 10, color: C.soft, charSpacing: 1 });
}
railSlide(3, { lead: true, item: (k) => ({ dot: k ? C.forest : C.clay }) });
// ---- 4
{ const s = topFrame(4); const it = role(4, "item");
  it.forEach((b, k) => card(s, b, 0.6 + (k % 2) * 6.2, 2.1 + Math.floor(k / 2) * 2.5, 5.9, 2.2, { accent: k === 3 ? C.clay : C.forest, size: 21, mid: true })); }
railSlide(5, { item: (k) => ({ dot: [C.sage, C.sage, C.clay, C.gold][k], panel: k === 2 ? "F0E3DA" : k === 3 ? C.forest : null, color: k === 3 ? C.ivory : null, labelColor: k === 3 ? C.gold : C.forest, mode: k === 3 ? "label" : null }), gap: 0.5 });
railSlide(6, { lead: true, item: (k) => ({ dot: k ? C.forest : C.clay }) });
// ---- 7
{ const s = topFrame(7); const it = role(7, "item");
  it.slice(0, 3).forEach((b, k) => card(s, b, 0.6, 1.95 + k * 1.75, 6.0, 1.55, { size: 17, accent: C.forest }));
  card(s, it[3], 6.9, 1.95, 5.8, 3.3, { dark: true, accent: C.gold, size: 22, serif: true, mid: true });
  card(s, it[4], 6.9, 5.45, 5.8, 1.55, { dark: true, accent: C.clay, size: 17 }); }
// ---- 8
{ const s = topFrame(8); const it = role(8, "item");
  it.slice(0, 3).forEach((b, k) => card(s, b, 0.6 + k * 4.1, 1.95, 3.9, 2.6, { size: 17, mode: "label" }));
  card(s, it[3], 0.6, 4.75, 6.0, 2.2, { size: 17, mode: "label", accent: C.gold });
  card(s, it[4], 6.9, 4.75, 5.8, 2.2, { size: 19, dark: true, accent: C.clay, mid: true }); }
railSlide(9, { lead: true, item: (k) => ({ dot: C.clay, color: k === 0 ? C.clayInk : null }) });
// ---- 10
{ const s = topFrame(10); const it = role(10, "item");
  it.forEach((b, k) => { const col = k < 4 ? 0 : 1, row = k < 4 ? k : k - 4, x = 0.6 + col * 6.2, y = 1.9 + row * 1.28;
    tb(s, String(k + 1), x, y, 0.5, 0.5, { fontFace: HEAD, fontSize: 24, color: C.clay });
    tb(s, b.text, x + 0.6, y, 5.4, 1.05, { fontSize: 17, objectName: b.id });
    s.addShape(pres.ShapeType.line, { x, y: y + 1.12, w: 5.9, h: 0, line: { color: "D9D3C3", width: 0.75 } }); }); }
railSlide(11, { lead: true, item: (k) => ({ dot: C.clay, mode: k === 1 ? "scheme" : null }) });
// ---- 12 closing
{ const s = pres.addSlide(); bg(s, C.ever);
  deco(s, "contours-gold.png", -2.4, 1.2, 7.4, 7.4, 45);
  s.addImage({ path: G("forest.png"), x: 0, y: 6.45, w: W, h: 1.05, altText: "Decorative forest silhouette" });
  tb(s, role(12, "title")[0].text, 0.7, 2.9, 4.8, 1.0, { fontFace: HEAD, fontSize: 44, color: C.ivory, objectName: "Title 12" });
  s.addShape(pres.ShapeType.rect, { x: 0.7, y: 3.95, w: 0.8, h: 0.05, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  const it = role(12, "item");
  stack(s, it, 6.1, 6.4, 0.5, 6.2, (k, b, y, h) => { if (!b) return { size: k < 2 ? 22 : 17, serif: k < 2 }; dot(s, 5.7, y + 0.1, C.gold);
    tb(s, b.text, 6.1, y, 6.4, h, { fontFace: k < 2 ? HEAD : BODY, fontSize: k < 2 ? 22 : 17, color: k < 2 ? C.ivory : "DDE5DE", objectName: b.id }); }, 17, 0.4);
  tb(s, role(12, "footer")[0].text, 0.7, 6.95, 6, 0.25, { fontSize: 10, color: C.sage, charSpacing: 1 });
}
// ---- 13
railSlide(13, { item: (k) => ({ dot: C.clay, mode: k === 3 ? "label" : null, size: k === 3 ? 16 : 18 }), gap: 0.35 });

pres.writeFile({ fileName: "exports/chhattisgarh-interactive-report.pptx" }).then(async (f) => {
  await applyTheme(f, THEME); console.log("wrote", f);
});

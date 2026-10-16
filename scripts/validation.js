/* In-browser content check: every manifest block must appear, unchanged, in the rendered DOM.
   Run from the console with Deck.validate(), or open index.html?validate */
(function () {
  const D = (window.Deck = window.Deck || {});
  const norm = (s) => s.replace(/\s+/g, " ").trim();
  D.validate = function () {
    const M = window.CONTENT_MANIFEST; const report = { total: 0, ok: 0, missing: [], altered: [], duplicates: [] };
    M.slides.forEach((s) => s.blocks.forEach((b) => {
      report.total++;
      const els = document.querySelectorAll(`[data-src="${b.id}"]`);
      if (!els.length) return report.missing.push(b.id);
      if (els.length > 1) report.duplicates.push(b.id);
      const sec = els[0].closest(".slide");
      if (Number(sec.dataset.n) !== s.index) return report.altered.push(b.id + " (wrong slide)");
      if (norm(els[0].textContent) !== norm(b.text)) report.altered.push(b.id); else report.ok++;
    }));
    return report;
  };
  if (/[?&]validate\b/.test(location.search)) window.addEventListener("load", () => console.log("[validate]", JSON.stringify(D.validate())));
})();

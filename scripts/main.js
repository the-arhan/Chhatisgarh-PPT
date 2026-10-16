/* Bootstrap: controls, overview drawer, print. */
(function () {
  const D = (window.Deck = window.Deck || {});
  const $ = (id) => document.getElementById(id);
  const drawer = $("overview"), scrim = $("scrim"), btn = $("btn-overview");
  let lastFocus = null;

  D.overview = {
    isOpen: () => !drawer.hidden,
    open() {
      lastFocus = document.activeElement;
      drawer.hidden = false; scrim.hidden = false; btn.setAttribute("aria-expanded", "true");
      const cur = drawer.querySelector('[aria-current="true"]') || drawer.querySelector("button");
      setTimeout(() => cur && cur.focus(), 30);
    },
    close() {
      if (drawer.hidden) return;
      drawer.hidden = true; scrim.hidden = true; btn.setAttribute("aria-expanded", "false");
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    },
    toggle() { this.isOpen() ? this.close() : this.open(); },
  };

  btn.addEventListener("click", () => D.overview.toggle());
  $("ov-close").addEventListener("click", () => D.overview.close());
  scrim.addEventListener("click", () => D.overview.close());
  $("btn-prev").addEventListener("click", D.nav.prev);
  $("btn-next").addEventListener("click", D.nav.next);
  $("btn-home").addEventListener("click", D.nav.first);
  $("btn-full").addEventListener("click", D.nav.toggleFullscreen);
  $("btn-print").addEventListener("click", () => window.print());
  drawer.addEventListener("keydown", (e) => {            // keep Tab inside the open drawer
    if (e.key !== "Tab") return;
    const f = drawer.querySelectorAll("button"); const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  });
  D.nav.init();
})();

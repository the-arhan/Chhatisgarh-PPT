/* Slide state, keyboard, touch, hash routing, fullscreen. */
(function () {
  const D = (window.Deck = window.Deck || {});
  const slides = Array.from(document.querySelectorAll(".slide"));
  const total = slides.length;
  const $ = (id) => document.getElementById(id);
  let cur = -1;

  const clamp = (n) => Math.max(0, Math.min(total - 1, n));
  const pad = (n) => String(n).padStart(2, "0");
  const progress = (i) => (total > 1 ? i / (total - 1) : 1);

  function updateUI() {
    $("c-cur").textContent = pad(cur + 1);
    document.querySelector(".progress i").style.transform = `scaleX(${progress(cur)})`;
    document.querySelector(".progress").setAttribute("aria-valuenow", String(cur + 1));
    $("btn-prev").disabled = cur === 0;
    $("btn-next").disabled = cur === total - 1;
    $("btn-home").disabled = cur === 0;
    document.querySelectorAll(".ov-item").forEach((b) => b.setAttribute("aria-current", String(Number(b.dataset.go) === cur + 1)));
  }

  // Autoplay Engine
  const DURATION_MS = 8000;
  let autoplaying = false;
  let autoTimer = null;
  let autoStart = 0;
  let animFrame = null;

  function setAutoplayUI(active) {
    const btn = $("btn-play");
    if (!btn) return;
    btn.setAttribute("aria-pressed", String(active));
    btn.setAttribute("aria-label", active ? "Pause presentation (Space / P)" : "Autoplay presentation (Space / P)");
    btn.classList.toggle("is-playing", active);
    const lbl = btn.querySelector(".lbl");
    if (lbl) lbl.textContent = active ? "Pause" : "Play";
    const bar = $("autoplay-bar");
    if (bar && !active) bar.style.width = "0%";
  }

  function tickProgress() {
    if (!autoplaying) return;
    const elapsed = Date.now() - autoStart;
    const pct = Math.min(100, (elapsed / DURATION_MS) * 100);
    const bar = $("autoplay-bar");
    if (bar) bar.style.width = pct + "%";
    if (elapsed < DURATION_MS) animFrame = requestAnimationFrame(tickProgress);
  }

  function queueNext() {
    clearTimeout(autoTimer);
    cancelAnimationFrame(animFrame);
    if (!autoplaying) return;
    autoStart = Date.now();
    tickProgress();
    autoTimer = setTimeout(() => {
      if (!autoplaying) return;
      if (cur < total - 1) {
        go(cur + 1);
        queueNext();
      } else {
        pause();
      }
    }, DURATION_MS);
  }

  function play() {
    if (autoplaying) return;
    if (cur >= total - 1) go(0);
    autoplaying = true;
    setAutoplayUI(true);
    queueNext();
  }

  function pause() {
    if (!autoplaying) return;
    autoplaying = false;
    clearTimeout(autoTimer);
    cancelAnimationFrame(animFrame);
    setAutoplayUI(false);
  }

  function togglePlay() {
    autoplaying ? pause() : play();
  }

  function restart() {
    go(0);
    if (autoplaying) queueNext();
  }

  /** Go to zero-based index. Returns true when the slide changed. */
  function go(i, opts = {}) {
    i = clamp(i);
    if (i === cur) return false;
    const dir = i > cur ? 1 : -1;
    const prev = slides[cur] || null;
    cur = i;
    D.anim.transition(prev, slides[cur], dir);
    updateUI();
    if (autoplaying) queueNext();
    if (!opts.silent) {
      history.replaceState(null, "", "#" + (cur + 1));
      if (opts.focus !== false) slides[cur].focus({ preventScroll: true });
    }
    return true;
  }

  D.nav = {
    go, total,
    next: () => go(cur + 1), prev: () => go(cur - 1),
    first: () => go(0), last: () => go(total - 1),
    current: () => cur,
    play, pause, toggleAutoplay: togglePlay, restart,
    isAutoplaying: () => autoplaying,
    toggleFullscreen() {
      if (document.fullscreenElement) return document.exitFullscreen();
      const el = document.documentElement;
      return (el.requestFullscreen ? el.requestFullscreen() : Promise.reject()).catch(() => { });
    },
  };

  const isTyping = (t) => !!(t && t.closest && t.closest("input,textarea,select,[contenteditable='true']"));

  document.addEventListener("focusin", (e) => {
    if (isTyping(e.target) && autoplaying) pause();
  });

  document.addEventListener("keydown", (e) => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
    const k = e.key;
    if (k === "Escape") { if (D.overview && D.overview.isOpen()) { D.overview.close(); e.preventDefault(); } return; }
    const map = { ArrowRight: D.nav.next, PageDown: D.nav.next, ArrowLeft: D.nav.prev, PageUp: D.nav.prev, Home: D.nav.first, End: D.nav.last };
    if (map[k]) { e.preventDefault(); map[k](); return; }
    if (k === "f" || k === "F") { e.preventDefault(); D.nav.toggleFullscreen(); }
    else if (k === "o" || k === "O") { e.preventDefault(); D.overview && D.overview.toggle(); }
    else if (k === " " || k === "p" || k === "P") { e.preventDefault(); D.nav.toggleAutoplay(); }
    else if (k === "r" || k === "R") { e.preventDefault(); D.nav.restart(); }
  });

  // Swipe (touch) — horizontal intent only, never from form fields
  let sx = 0, sy = 0, tracking = false;
  const deck = $("deck");
  deck.addEventListener("touchstart", (e) => { if (isTyping(e.target) || e.touches.length !== 1) return; tracking = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  deck.addEventListener("touchend", (e) => {
    if (!tracking) return; tracking = false;
    const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) (dx < 0 ? D.nav.next : D.nav.prev)();
  }, { passive: true });

  // Hash routing: #3 -> slide 3 (also supports #slide-3)
  const fromHash = () => { const m = location.hash.match(/(\d+)/); return m ? clamp(parseInt(m[1], 10) - 1) : 0; };
  window.addEventListener("hashchange", () => go(fromHash(), { focus: false }));
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-go]");
    if (!a) return;
    e.preventDefault();
    go(Number(a.dataset.go) - 1);
    if (D.overview) D.overview.close();
  });

  // Fullscreen button state
  document.addEventListener("fullscreenchange", () => {
    const on = !!document.fullscreenElement, b = $("btn-full");
    b.setAttribute("aria-pressed", String(on));
    b.setAttribute("aria-label", on ? "Exit full screen" : "Enter full screen");
  });

  D.nav.init = () => { slides.forEach((s) => { s.inert = true; s.setAttribute("aria-hidden", "true"); }); go(fromHash(), { silent: true }); };
})();

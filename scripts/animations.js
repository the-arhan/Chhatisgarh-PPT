/* Slide-state logic for transitions and entrance replay (CSS does the visual work). */
(function () {
  const D = (window.Deck = window.Deck || {});
  const LEAVE_MS = 700;
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timers = new WeakMap();

  D.anim = {
    reduced,
    /** Activate `next`, retire `prev`. dir: 1 forward, -1 backward. */
    transition(prev, next, dir) {
      const deck = next.parentElement;
      deck.dataset.dir = String(dir);
      if (prev && prev !== next) {
        clearTimeout(timers.get(prev));
        prev.classList.remove("is-active");
        prev.classList.add("is-leaving");
        prev.inert = true;
        prev.setAttribute("aria-hidden", "true");
        timers.set(prev, setTimeout(() => prev.classList.remove("is-leaving"), reduced() ? 200 : LEAVE_MS));
      }
      clearTimeout(timers.get(next));
      next.classList.remove("is-leaving");
      next.scrollTop = 0;
      next.inert = false;
      next.removeAttribute("aria-hidden");
      void next.offsetWidth; // flush styles so entrance + line-drawing replay predictably
      next.classList.add("is-active");
    },
  };
})();

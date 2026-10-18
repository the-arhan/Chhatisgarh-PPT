/* Click-to-explore context cards for selected people, places and ideas. */
(function () {
  const D = (window.Deck = window.Deck || {});
  const card = document.getElementById("explorer-card");
  const image = document.getElementById("explorer-image");
  const title = document.getElementById("explorer-title");
  const kicker = document.getElementById("explorer-kicker");
  const copy = document.getElementById("explorer-copy");
  const credit = document.getElementById("explorer-credit");
  const closeButton = document.getElementById("explorer-close");
  let activeTrigger = null;

  const entries = {
    "raipur": {
      title: "Raipur",
      kicker: "Capital city",
      image: "assets/images/raipur_city_illustration.svg",
      alt: "Illustration of a city skyline representing Raipur",
      copy: "Raipur is Chhattisgarh’s capital and a major centre for state government, education, trade and transport. The planned city of Nava Raipur Atal Nagar lies nearby.",
      credit: "Illustrative city artwork created for this presentation."
    },
    "dakshin-kosala": {
      title: "Dakshin Kosala",
      kicker: "History & heritage",
      image: "assets/images/sirpur_heritage.jpg",
      alt: "Archaeological remains at Sirpur in Chhattisgarh",
      copy: "Dakshin Kosala is the name used for an ancient region associated with parts of present-day Chhattisgarh and Odisha. Sirpur preserves important Buddhist, Hindu and Jain archaeological remains from this history.",
      credit: "Sirpur photograph: Aashishsainik · CC BY-SA 3.0"
    },
    "chitrakote": {
      title: "Chitrakote Falls",
      kicker: "Landscape · Bastar",
      image: "assets/images/chitrakote_falls.jpg",
      alt: "Chitrakote Falls on the Indravati River in Bastar",
      copy: "On the Indravati River near Jagdalpur, Chitrakote spreads across a broad horseshoe-shaped ledge. Monsoon flows make the waterfall especially dramatic.",
      credit: "Photograph: Ksh85 · CC BY-SA 4.0"
    },
    "dokra": {
      title: "Bastar Dokra",
      kicker: "Craft · Living tradition",
      image: "assets/images/bastar_dokra_craft.jpg",
      alt: "Bastar artisan Dokra bell-metal craft",
      copy: "Dokra is a hand-cast metal craft made with the lost-wax process. Bastar artisans shape wax models, form clay moulds and cast each piece individually, so every object has its own details.",
      credit: "Photograph: Sumita Roy Dutta · CC BY-SA 4.0"
    },
    "kanger": {
      title: "Kanger Valley National Park",
      kicker: "Forest · Biodiversity",
      image: "assets/images/kanger_valley_forest.jpg",
      alt: "Sal forest canopy in Kanger Valley National Park, Bastar",
      copy: "This protected landscape in Bastar brings together Sal forest, river valleys and limestone caves. It is one of the region’s best-known places for biodiversity and nature conservation.",
      credit: "Photograph: Harminder singh sahni · CC BY-SA 4.0"
    },
    "forest-cover": {
      title: "Forest cover",
      kicker: "A key state indicator",
      image: "assets/images/kanger_valley_forest.jpg",
      alt: "Sal forest canopy in Kanger Valley National Park",
      copy: "The Forest Survey of India’s 2023 report records 55,811.75 km², or 41.28% of Chhattisgarh’s geographical area, as forest cover. This is canopy measured from satellite imagery, distinct from the larger area legally recorded as forest land.",
      credit: "Forest Survey of India · India State of Forest Report 2023"
    }
  };

  document.querySelectorAll(".concept").forEach((trigger) => {
    trigger.title = "Open an image and more context";
  });

  function positionCard() {
    if (!activeTrigger || card.hidden) return;
    const anchor = activeTrigger.getBoundingClientRect();
    const box = card.getBoundingClientRect();
    const chrome = document.querySelector(".chrome");
    const safeBottom = window.innerHeight - (chrome ? chrome.getBoundingClientRect().height : 0) - 12;
    const margin = 12;
    const left = Math.max(margin, Math.min(window.innerWidth - box.width - margin, anchor.left + anchor.width / 2 - box.width / 2));
    let top = anchor.top - box.height - 10;
    if (top < margin) top = anchor.bottom + 10;
    if (top + box.height > safeBottom) top = Math.max(margin, safeBottom - box.height);
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
  }

  function close(options = {}) {
    if (!activeTrigger) return;
    const previous = activeTrigger;
    activeTrigger = null;
    previous.setAttribute("aria-expanded", "false");
    card.hidden = true;
    if (options.restoreFocus !== false && previous.isConnected) previous.focus({ preventScroll: true });
  }

  function open(trigger) {
    const item = entries[trigger.dataset.term];
    if (!item) return;
    if (activeTrigger === trigger) {
      close();
      return;
    }
    if (activeTrigger) activeTrigger.setAttribute("aria-expanded", "false");
    activeTrigger = trigger;
    trigger.setAttribute("aria-expanded", "true");
    image.src = item.image;
    image.alt = item.alt;
    kicker.textContent = item.kicker;
    title.textContent = item.title;
    copy.textContent = item.copy;
    credit.textContent = item.credit;
    card.hidden = false;
    positionCard();
    closeButton.focus({ preventScroll: true });
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".concept");
    if (trigger) {
      event.preventDefault();
      open(trigger);
      return;
    }
    if (activeTrigger && !card.contains(event.target)) close({ restoreFocus: false });
  });

  closeButton.addEventListener("click", () => close());
  window.addEventListener("resize", () => close({ restoreFocus: false }));
  D.explorer = { close, isOpen: () => !card.hidden };
})();

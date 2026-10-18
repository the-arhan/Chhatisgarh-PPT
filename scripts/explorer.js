/* Context cards, Curated Place Journeys, and Layered MPI Chart Engine. */
(function () {
  const D = (window.Deck = window.Deck || {});

  /* ==========================================================================
     1. CLICK-TO-EXPLORE CONTEXT CARDS
     ========================================================================== */
  const card = document.getElementById("explorer-card");
  const image = document.getElementById("explorer-image");
  const title = document.getElementById("explorer-title");
  const kicker = document.getElementById("explorer-kicker");
  const copy = document.getElementById("explorer-copy");
  const credit = document.getElementById("explorer-credit");
  const badge = document.getElementById("explorer-badge");
  const journeyBtn = document.getElementById("explorer-journey-btn");
  const closeButton = document.getElementById("explorer-close");
  let activeTrigger = null;

  const entries = {
    "raipur": {
      title: "Raipur",
      kicker: "Capital City · Central Plains",
      image: "assets/images/raipur_city_illustration.svg",
      alt: "Stylized cityscape illustration representing Raipur civic centre and skyline",
      badge: "Commissioned Illustration",
      copy: "Raipur is Chhattisgarh’s capital and principal hub for state administration, commerce, higher education, and transit. The 21st-century planned administrative capital, Nava Raipur Atal Nagar, lies 20 km to the southeast.",
      credit: "Illustrative artwork created for this presentation.",
      journeyId: "raipur",
      journeyLabel: "Explore Raipur Journey (3 stops) →"
    },
    "dakshin-kosala": {
      title: "Dakshin Kosala",
      kicker: "Ancient History & Heritage",
      image: "assets/images/sirpur_heritage.jpg",
      alt: "Archaeological temple remains at Sirpur in Chhattisgarh",
      badge: "Authentic Photograph",
      copy: "Dakshin Kosala ('South Kosala') is the historical name for the ancient territory spanning central Chhattisgarh and western Odisha. Historical centres along the Mahanadi, especially Sirpur, preserve prominent 5th–8th century Buddhist, Shaivite, and Jain archaeological monuments.",
      credit: "Sirpur photograph: Aashishsainik · CC BY-SA 3.0",
      journeyId: "sirpur",
      journeyLabel: "Explore Sirpur & Heritage Journey (3 stops) →"
    },
    "chitrakote": {
      title: "Chitrakote Falls",
      kicker: "Hydrology & Landscape · Bastar",
      image: "assets/images/chitrakote_falls.jpg",
      alt: "Chitrakote Falls cascading across the broad Indravati river ledge",
      badge: "Authentic Photograph",
      copy: "Often described as the 'Niagara of India', Chitrakote spans up to 300 metres across a horseshoe-shaped precipice during peak monsoon. The Indravati river drains the southern plateau before joining the Godavari, sustaining riparian ecosystems and tribal fisheries.",
      credit: "Photograph: Ksh85 · CC BY-SA 4.0",
      journeyId: "bastar",
      journeyLabel: "Explore Bastar Journey (3 stops) →"
    },
    "dokra": {
      title: "Bastar Dokra",
      kicker: "Living Craft Tradition · Metallurgy",
      image: "assets/images/bastar_dokra_craft.jpg",
      alt: "Bastar artisan Dokra bell-metal casting with intricate tribal motifs",
      badge: "Authentic Photograph",
      copy: "Dokra is an ancient non-ferrous lost-wax metal casting craft (cire perdue) practiced by indigenous Ghadwa artisans. Each piece begins with a clay core wrapped in fine beeswax coils, encased in riverbed silt, and cast with molten brass. Because the clay mold is broken to extract the piece, every object is one of a kind.",
      credit: "Photograph: Sumita Roy Dutta · CC BY-SA 4.0",
      journeyId: "bastar",
      journeyLabel: "Explore Bastar Journey (3 stops) →"
    },
    "kanger": {
      title: "Kanger Valley National Park",
      kicker: "Biodiversity · Sal Forest Sanctuary",
      image: "assets/images/kanger_valley_forest.jpg",
      alt: "High-canopy Sal forest in Kanger Valley National Park, Bastar",
      badge: "Authentic Photograph",
      copy: "A 200 sq. km protected biosphere sanctuary in Bastar, noted for dense Sal (Shorea robusta) forests, subterranean karst limestone formations (Kotumsar, Dandak caves), and deep gorges. It provides a critical habitat for the state bird, the Bastar Hill Myna.",
      credit: "Photograph: Harminder singh saini · CC BY-SA 4.0",
      journeyId: "bastar",
      journeyLabel: "Explore Bastar Journey (3 stops) →"
    },
    "forest-cover": {
      title: "Forest Cover (41.28%)",
      kicker: "State Environmental Benchmark",
      image: "assets/images/kanger_valley_forest.jpg",
      alt: "Satellite-assessed forest canopy in Chhattisgarh",
      badge: "Official State Assessment",
      copy: "The Forest Survey of India’s 2023 report records 55,811.75 km², or 41.28% of Chhattisgarh’s geographical area, as forest cover. This satellite-derived figure measures physical canopy density (>10%), distinct from the legally demarcated Recorded Forest Area (~44%).",
      credit: "Forest Survey of India · India State of Forest Report 2023",
      journeyId: "bastar",
      journeyLabel: "Explore Forest Journey (3 stops) →"
    },
    "sirpur": {
      title: "Sirpur Heritage Complex",
      kicker: "Archaeology · Ancient Shripura",
      image: "assets/images/sirpur_heritage.jpg",
      alt: "Excavated red brick temple complex and monastery at Sirpur",
      badge: "Authentic Photograph",
      copy: "Excavations along the Mahanadi River have uncovered over 40 archaeological complexes, including the 7th-century brick Lakshmana Temple, Buddhist viharas, and trading markets. Chinese scholar Xuanzang visited in 639 CE, chronicling flourishing interfaith monastic scholarship.",
      credit: "Photograph: Aashishsainik · CC BY-SA 3.0",
      journeyId: "sirpur",
      journeyLabel: "Explore Sirpur Journey (3 stops) →"
    },
    "mahanadi": {
      title: "Mahanadi River Basin",
      kicker: "Hydrological Lifeline · Central Plains",
      image: "assets/images/chhattisgarh_schematic_locator.svg",
      alt: "Schematic orientation showing the Mahanadi river basin across central Chhattisgarh",
      badge: "Schematic Diagram",
      copy: "Originating in Dhamtari district, the Mahanadi flows northeast across central Chhattisgarh before entering Odisha. Its fertile basin irrigates over 3.7 million hectares of paddy land, creating the agricultural backbone traditionally celebrated as the 'Rice Bowl of Central India'.",
      credit: "Schematic orientation diagram · Conceptual guide",
      journeyId: "sirpur",
      journeyLabel: "Explore Mahanadi & Heritage Journey (3 stops) →"
    },
    "mpi": {
      title: "Multidimensional Poverty Index (MPI)",
      kicker: "Composite Indicator · NITI Aayog / OPHI",
      image: "assets/images/mpi_dimensions_illustration.svg",
      alt: "Diagram illustrating the 3 dimensions and 12 indicators of the National MPI",
      badge: "Editorial Infographic",
      copy: "NITI Aayog’s National MPI evaluates 12 indicators across Health, Education, and Standard of Living. Chhattisgarh’s headcount dropped from 29.9% (NFHS-4, 2015–16) to 16.4% (NFHS-5, 2019–21). Rural poverty (19.71%) remained 4.3× higher than urban (4.59%). MPI measures surveyed deprivations, not individual village causes.",
      credit: "NITI Aayog National MPI Progress Review 2023 · NFHS-4 & NFHS-5",
      journeyId: null
    }
  };

  document.querySelectorAll(".concept").forEach((trigger) => {
    trigger.title = "Explore concept & context card";
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
    if (!activeTrigger && card.hidden) return;
    const previous = activeTrigger;
    activeTrigger = null;
    if (previous) previous.setAttribute("aria-expanded", "false");
    card.hidden = true;
    if (options.restoreFocus !== false && previous && previous.isConnected) {
      previous.focus({ preventScroll: true });
    }
  }

  function open(trigger) {
    let term = null;
    let btn = null;
    if (typeof trigger === "string") {
      term = trigger;
      btn = document.querySelector(`[data-term="${term}"]`);
    } else if (trigger && trigger.dataset) {
      term = trigger.dataset.term;
      btn = trigger;
    }
    const item = entries[term];
    if (!item) return;
    if (activeTrigger === btn && !card.hidden) {
      close();
      return;
    }
    // If a place journey is open, close it first
    if (D.journey && D.journey.isOpen()) D.journey.close({ restoreFocus: false });
    if (activeTrigger) activeTrigger.setAttribute("aria-expanded", "false");
    activeTrigger = btn;
    if (btn) btn.setAttribute("aria-expanded", "true");

    image.src = item.image;
    image.alt = item.alt;
    kicker.textContent = item.kicker;
    title.textContent = item.title;
    copy.textContent = item.copy;
    credit.textContent = item.credit;
    if (badge) {
      badge.textContent = item.badge || "Context Detail";
    }

    if (journeyBtn) {
      if (item.journeyId) {
        journeyBtn.hidden = false;
        journeyBtn.textContent = item.journeyLabel || "Explore place journey →";
        journeyBtn.dataset.journey = item.journeyId;
      } else {
        journeyBtn.hidden = true;
      }
    }

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
    if (journeyBtn && event.target === journeyBtn) {
      const jId = journeyBtn.dataset.journey;
      if (jId && D.journey) {
        close({ restoreFocus: false });
        D.journey.open(jId, 0, activeTrigger);
      }
      return;
    }
    if (activeTrigger && !card.contains(event.target)) {
      close({ restoreFocus: false });
    }
  });

  closeButton.addEventListener("click", () => close());
  window.addEventListener("resize", () => close({ restoreFocus: false }));
  D.explorer = { close, open, isOpen: () => !card.hidden };

  /* ==========================================================================
     2. "EXPLORE THIS PLACE" JOURNEYS ENGINE
     ========================================================================== */
  const journeyModal = document.getElementById("journey-modal");
  const journeyScrim = document.getElementById("journey-scrim");
  const jTitle = document.getElementById("journey-title");
  const jStepBadge = document.getElementById("journey-step-badge");
  const jImage = document.getElementById("journey-image");
  const jMediaBadge = document.getElementById("journey-media-badge");
  const jCredit = document.getElementById("journey-credit");
  const jStopKicker = document.getElementById("journey-stop-kicker");
  const jStopTitle = document.getElementById("journey-stop-title");
  const jStopCopy = document.getElementById("journey-stop-copy");
  const jInquiryText = document.getElementById("journey-inquiry-text");
  const jDots = document.getElementById("journey-dots");
  const jPrev = document.getElementById("journey-prev");
  const jNext = document.getElementById("journey-next");
  const jClose = document.getElementById("journey-close");
  const jReturn = document.getElementById("journey-return");

  let currentJourneyId = null;
  let currentStopIdx = 0;
  let journeyTrigger = null;

  const journeys = {
    "raipur": {
      title: "Raipur & Central Plains: Governance, Trade & Peri-Urban Interfaces",
      stops: [
        {
          title: "Historic Commercial Hub & Administrative Centre",
          kicker: "Central Raipur · Commercial Gateway",
          image: "assets/images/raipur_city_illustration.svg",
          alt: "Stylized cityscape artwork of Raipur skyline and civic tower",
          mediaBadge: "Commissioned Illustration",
          credit: "Stylized vector artwork created for this presentation.",
          copy: "Serving as Chhattisgarh's capital since state formation in 2000, Raipur is the primary economic and logistical hub of central India. From the traditional trading hubs of Gol Bazaar to modern transit corridors, Raipur links agricultural districts with national markets.",
          inquiry: "What institutional mechanisms enable rural artisans and paddy farmers from outlying blocks to access fair wholesale prices in the capital without excessive middleman commissions?"
        },
        {
          title: "Nava Raipur (Atal Nagar): Greenfield Planning",
          kicker: "Nava Raipur · Planned Capital Corridor",
          image: "assets/images/chhattisgarh_schematic_locator.svg",
          alt: "Schematic orientation showing Central Raipur and surrounding plains",
          mediaBadge: "Schematic Regional Diagram",
          credit: "Schematic regional diagram · Conceptual guide · Non-cartographic.",
          copy: "Located 20 km southeast of old Raipur, Nava Raipur is India's first 21st-century greenfield planned administrative capital. Housing the State Secretariat (Mahanadi Bhawan), Directorates (Indravati Bhawan), and premier institutions, it represents a planned modern infrastructure environment.",
          inquiry: "How does large-scale capital infrastructure land acquisition interact with surrounding peri-urban farming hamlets and sustainable local employment?"
        },
        {
          title: "Peri-Urban Agriculture & Market Convergence",
          kicker: "Plains Catchment · Livelihood Interfaces",
          image: "assets/images/barnawapara_forest.jpg",
          alt: "Vegetation and peri-urban landscape in central plains buffer",
          mediaBadge: "Field Context Photograph",
          credit: "State Forest Dept. Archive · Mixed deciduous plains buffer.",
          copy: "Connecting urban consumers and rural producers is an extensive peri-urban belt of smallholders supplying vegetables, milk, and seasonal labor. Weekly rural haats operate alongside modern retail outlets, showing the uneven pace of economic transformation.",
          inquiry: "How can producer collectives and direct-to-market channels reduce intermediary extraction for perishable farm produce in peri-urban belts?"
        }
      ]
    },
    "bastar": {
      title: "Southern Bastar: Forest Canopy, Waterfalls & Living Metallurgy",
      stops: [
        {
          title: "Chitrakote Falls: Hydrology of the Indravati",
          kicker: "Bastar District · Indravati River Basin",
          image: "assets/images/chitrakote_falls.jpg",
          alt: "Chitrakote Falls cascading across a wide ledge on the Indravati River",
          mediaBadge: "Authentic Documentary Photograph",
          credit: "Photograph: Ksh85 · Licensed under CC BY-SA 4.0",
          copy: "Dropping nearly 30 metres across a horseshoe-shaped ledge spanning up to 300 metres during monsoon, Chitrakote is a defining geological landmark. The Indravati river flows through the heart of the Bastar plateau before joining the Godavari, sustaining riparian forests and indigenous fisheries.",
          inquiry: "How do seasonal variations in river discharge impact local fishing livelihoods, water access, and sacred grove ecosystems (Devgudi)?"
        },
        {
          title: "Kanger Valley: Sal Canopy & Karst Ecosystems",
          kicker: "Bastar District · National Park Ecosystem",
          image: "assets/images/kanger_valley_forest.jpg",
          alt: "Tall Sal forest canopy in Kanger Valley National Park",
          mediaBadge: "Authentic Documentary Photograph",
          credit: "Photograph: Harminder singh saini · Licensed under CC BY-SA 4.0",
          copy: "Covering 200 sq. km of rugged terrain, Kanger Valley preserves high-canopy Sal (Shorea robusta) forests, teak stands, and subterranean karst limestone formations including Kotumsar Cave. The sanctuary is habitat to the Bastar Hill Myna, flying squirrels, and diverse non-timber forest produce species.",
          inquiry: "How effectively do Community Forest Rights under the Forest Rights Act (FRA 2006) support sustainable tribal NTFP collection like Mahua and Tendu?"
        },
        {
          title: "Bastar Dokra: Ancient Lost-Wax Metallurgy",
          kicker: "Bastar & Kondagaon · Artisan Tradition",
          image: "assets/images/bastar_dokra_craft.jpg",
          alt: "Intricate traditional Bastar Dokra lost-wax brass bell metal artifacts",
          mediaBadge: "Authentic Documentary Photograph",
          credit: "Photograph: Sumita Roy Dutta · Licensed under CC BY-SA 4.0",
          copy: "Dokra metalcraft has been practiced by indigenous Ghadwa artisans for centuries using the lost-wax technique (cire perdue). Artisans hand-mold beeswax strings around a clay core, coat it in fine river silt, bake it, and cast it with molten brass. Because each mold is broken open to release the sculpture, no two pieces are identical.",
          inquiry: "Why do artisan families face acute raw material debt (brass scrap, beeswax) despite premium urban retail valuations?"
        }
      ]
    },
    "sirpur": {
      title: "Sirpur & Dakshin Kosala: Archaeological Heritage on the Mahanadi",
      stops: [
        {
          title: "Sirpur Archaeological Complex: Ancient Confluence",
          kicker: "Mahasamund District · Ancient Dakshin Kosala",
          image: "assets/images/sirpur_heritage.jpg",
          alt: "Excavated red brick archaeological structures and monument at Sirpur",
          mediaBadge: "Authentic Documentary Photograph",
          credit: "Photograph: Aashishsainik · Licensed under CC BY-SA 3.0",
          copy: "Between the 5th and 8th centuries CE, Sirpur (ancient Shripura) flourished as the capital of Dakshin Kosala on the banks of the Mahanadi. Renowned for its 7th-century brick Lakshmana Temple, extensive Buddhist Viharas, and Shiva temples, Sirpur highlights ancient interfaith scholarship and riverine commerce.",
          inquiry: "How can historical monument conservation create inclusive local guiding and craft livelihoods for neighbouring village communities?"
        },
        {
          title: "Barnawapara Wildlife Sanctuary: Deciduous Buffer",
          kicker: "Mahasamund / Baloda Bazar · Deciduous Buffer",
          image: "assets/images/barnawapara_forest.jpg",
          alt: "Mixed deciduous forest and tree line at Barnawapara sanctuary",
          mediaBadge: "Authentic Documentary Photograph",
          credit: "Chhattisgarh Forest Department Archive · Fair academic use.",
          copy: "Spanning 245 sq. km in the transition zone between the Mahanadi plains and eastern uplands, Barnawapara preserves dry deciduous teak, sal, and bamboo. It sustains leopard, sloth bear, and gaur populations while providing ecological buffer services for surrounding agrarian settlements.",
          inquiry: "What mitigation strategies protect standing crops from wild ungulate grazing while maintaining safe wildlife corridors?"
        },
        {
          title: "Mahanadi Agrarian Basin: The Rice Heartland",
          kicker: "Central Plains · Hydrological Lifeline",
          image: "assets/images/chhattisgarh_schematic_locator.svg",
          alt: "Schematic orientation diagram of Chhattisgarh showing the central Mahanadi plains",
          mediaBadge: "Schematic Regional Diagram",
          credit: "Schematic regional diagram · Conceptual guide · Non-cartographic.",
          copy: "The Mahanadi River is the ecological lifeblood of central Chhattisgarh. Its expansive basin and network of tanks (talaabs) sustain over 3.7 million hectares of paddy cultivation. However, over 70% of cropped area remains dependent on timely monsoon rainfall, making irrigation equity a central public question.",
          inquiry: "What small-scale watershed and rainwater harvesting techniques can ensure winter cropping security for marginal farmers?"
        }
      ]
    }
  };

  function renderStop() {
    const journey = journeys[currentJourneyId];
    if (!journey) return;
    const stop = journey.stops[currentStopIdx];
    const totalStops = journey.stops.length;

    jTitle.textContent = journey.title;
    jStepBadge.textContent = `Stop ${currentStopIdx + 1} of ${totalStops}`;

    jImage.src = stop.image;
    jImage.alt = stop.alt;
    jMediaBadge.textContent = stop.mediaBadge;
    jCredit.textContent = stop.credit;

    jStopKicker.textContent = stop.kicker;
    jStopTitle.textContent = stop.title;
    jStopCopy.textContent = stop.copy;
    jInquiryText.textContent = stop.inquiry;

    jPrev.disabled = currentStopIdx === 0;
    jNext.disabled = currentStopIdx === totalStops - 1;

    // Render navigation dots
    jDots.innerHTML = "";
    journey.stops.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `journey-dot ${idx === currentStopIdx ? "is-active" : ""}`;
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-selected", String(idx === currentStopIdx));
      dot.setAttribute("aria-label", `Go to Stop ${idx + 1} of ${totalStops}: ${journey.stops[idx].title}`);
      dot.addEventListener("click", () => goToStop(idx));
      jDots.appendChild(dot);
    });
  }

  function goToStop(idx) {
    const journey = journeys[currentJourneyId];
    if (!journey) return;
    currentStopIdx = Math.max(0, Math.min(journey.stops.length - 1, idx));
    renderStop();
  }

  function openJourney(journeyId, stopIdx = 0, trigger = null) {
    if (!journeys[journeyId]) return;
    if (D.explorer) D.explorer.close({ restoreFocus: false });
    if (D.overview && D.overview.isOpen()) D.overview.close();

    currentJourneyId = journeyId;
    currentStopIdx = stopIdx;
    journeyTrigger = trigger || document.activeElement;

    renderStop();
    journeyModal.hidden = false;
    journeyScrim.hidden = false;
    document.body.classList.add("journey-open");
    jClose.focus({ preventScroll: true });
  }

  function closeJourney(options = {}) {
    if (journeyModal.hidden) return;
    journeyModal.hidden = true;
    journeyScrim.hidden = true;
    document.body.classList.remove("journey-open");

    const prev = journeyTrigger;
    journeyTrigger = null;
    currentJourneyId = null;

    if (options.restoreFocus !== false && prev && prev.isConnected) {
      prev.focus({ preventScroll: true });
    }
  }

  if (jPrev) jPrev.addEventListener("click", () => goToStop(currentStopIdx - 1));
  if (jNext) jNext.addEventListener("click", () => goToStop(currentStopIdx + 1));
  if (jClose) jClose.addEventListener("click", () => closeJourney());
  if (jReturn) jReturn.addEventListener("click", () => closeJourney());
  if (journeyScrim) journeyScrim.addEventListener("click", () => closeJourney());

  // Trap tab inside journey modal
  if (journeyModal) {
    journeyModal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const focusable = journeyModal.querySelectorAll("button:not([disabled])");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // Handle direct journey launch buttons across deck
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-launch-journey]");
    if (btn) {
      e.preventDefault();
      const jId = btn.dataset.launchJourney;
      openJourney(jId, 0, btn);
    }
  });

  D.journey = {
    open: openJourney,
    close: closeJourney,
    isOpen: () => !journeyModal.hidden,
    next: () => goToStop(currentStopIdx + 1),
    prev: () => goToStop(currentStopIdx - 1),
    goTo: goToStop
  };

  /* ==========================================================================
     3. LAYERED MPI CHART ENGINE (SLIDE 15)
     ========================================================================== */
  function initMpiChart() {
    const chartWrap = document.querySelector(".mpi-chart");
    if (!chartWrap) return;

    let activeSeries = "all";  // "all" | "rural" | "urban"
    let activePeriod = "both"; // "both" | "2015" | "2019" | "delta"

    const ruralRow = document.getElementById("mpi-row-rural");
    const urbanRow = document.getElementById("mpi-row-urban");
    const ruralBarOld = document.getElementById("mpi-bar-rural-old");
    const ruralBarRecent = document.getElementById("mpi-bar-rural-recent");
    const urbanBarOld = document.getElementById("mpi-bar-urban-old");
    const urbanBarRecent = document.getElementById("mpi-bar-urban-recent");
    const dynamicAnalysis = document.getElementById("mpi-dynamic-analysis");
    const liveAnnounce = document.getElementById("mpi-live-announce");

    function updateChartUI() {
      // 1. Update filter pill active states
      document.querySelectorAll("[data-mpi-series]").forEach((b) => {
        const isSel = b.dataset.mpiSeries === activeSeries;
        b.setAttribute("aria-pressed", String(isSel));
        b.classList.toggle("is-active", isSel);
      });

      document.querySelectorAll("[data-mpi-period]").forEach((b) => {
        const isSel = b.dataset.mpiPeriod === activePeriod;
        b.setAttribute("aria-pressed", String(isSel));
        b.classList.toggle("is-active", isSel);
      });

      // 2. Control row visibility based on activeSeries
      if (ruralRow) ruralRow.hidden = (activeSeries === "urban");
      if (urbanRow) urbanRow.hidden = (activeSeries === "rural");

      // 3. Control bar visibility & width based on activePeriod
      if (activePeriod === "both") {
        if (ruralBarOld) { ruralBarOld.hidden = false; ruralBarOld.style.setProperty("--value", "89.3%"); ruralBarOld.querySelector(".mpi-val").textContent = "35.73%"; }
        if (ruralBarRecent) { ruralBarRecent.hidden = false; ruralBarRecent.style.setProperty("--value", "49.3%"); ruralBarRecent.querySelector(".mpi-val").textContent = "19.71%"; }
        if (urbanBarOld) { urbanBarOld.hidden = false; urbanBarOld.style.setProperty("--value", "25.4%"); urbanBarOld.querySelector(".mpi-val").textContent = "10.17%"; }
        if (urbanBarRecent) { urbanBarRecent.hidden = false; urbanBarRecent.style.setProperty("--value", "11.5%"); urbanBarRecent.querySelector(".mpi-val").textContent = "4.59%"; }
      } else if (activePeriod === "2015") {
        if (ruralBarOld) { ruralBarOld.hidden = false; ruralBarOld.style.setProperty("--value", "89.3%"); ruralBarOld.querySelector(".mpi-val").textContent = "35.73% (NFHS-4)"; }
        if (ruralBarRecent) { ruralBarRecent.hidden = true; }
        if (urbanBarOld) { urbanBarOld.hidden = false; urbanBarOld.style.setProperty("--value", "25.4%"); urbanBarOld.querySelector(".mpi-val").textContent = "10.17% (NFHS-4)"; }
        if (urbanBarRecent) { urbanBarRecent.hidden = true; }
      } else if (activePeriod === "2019") {
        if (ruralBarOld) { ruralBarOld.hidden = true; }
        if (ruralBarRecent) { ruralBarRecent.hidden = false; ruralBarRecent.style.setProperty("--value", "49.3%"); ruralBarRecent.querySelector(".mpi-val").textContent = "19.71% (NFHS-5)"; }
        if (urbanBarOld) { urbanBarOld.hidden = true; }
        if (urbanBarRecent) { urbanBarRecent.hidden = false; urbanBarRecent.style.setProperty("--value", "11.5%"); urbanBarRecent.querySelector(".mpi-val").textContent = "4.59% (NFHS-5)"; }
      } else if (activePeriod === "delta") {
        // Delta view: show reduction magnitude
        if (ruralBarOld) { ruralBarOld.hidden = false; ruralBarOld.style.setProperty("--value", "89.3%"); ruralBarOld.querySelector(".mpi-val").textContent = "Base: 35.73%"; }
        if (ruralBarRecent) { ruralBarRecent.hidden = false; ruralBarRecent.style.setProperty("--value", "40.0%"); ruralBarRecent.querySelector(".mpi-val").textContent = "Drop: −16.02 pp (−44.8%)"; }
        if (urbanBarOld) { urbanBarOld.hidden = false; urbanBarOld.style.setProperty("--value", "25.4%"); urbanBarOld.querySelector(".mpi-val").textContent = "Base: 10.17%"; }
        if (urbanBarRecent) { urbanBarRecent.hidden = false; urbanBarRecent.style.setProperty("--value", "14.0%"); urbanBarRecent.querySelector(".mpi-val").textContent = "Drop: −5.58 pp (−54.9%)"; }
      }

      // 4. Update contextual dynamic explanation
      if (dynamicAnalysis) {
        if (activePeriod === "delta") {
          dynamicAnalysis.innerHTML = `
            <p class="mpi-highlight-stat">Rural drop: <b>−16.02 pp</b> &bull; Urban drop: <b>−5.58 pp</b></p>
            <p>Both sectors registered substantial reductions between 2015–16 and 2019–21. However, because rural poverty started from a much higher base, the rural headcount in 2019–21 (19.71%) remained <b>4.3 times</b> that of urban areas (4.59%).</p>
            <p>Statewide progress reflects accelerated improvements in sanitation, electricity, and clean fuel, yet village-level deprivations remain clustered.</p>
          `;
        } else if (activeSeries === "rural") {
          dynamicAnalysis.innerHTML = `
            <p class="mpi-highlight-stat">Rural headcount: <b>35.73% → 19.71%</b></p>
            <p>Rural areas saw approximately 16 out of every 100 residents exit multidimensional poverty across the survey periods.</p>
            <p>The remaining 19.71% rural deprivation is heavily concentrated in nutrition, cooking fuel, and housing quality, making rural immersion inquiry into service reliability essential.</p>
          `;
        } else if (activeSeries === "urban") {
          dynamicAnalysis.innerHTML = `
            <p class="mpi-highlight-stat">Urban headcount: <b>10.17% → 4.59%</b></p>
            <p>Urban centres benefit from denser municipal grid infrastructure, tap water access, and closer proximity to specialized secondary healthcare.</p>
            <p>However, the 4.59% headcount indicates persistent pockets of vulnerability in informal settlements and peri-urban wards with migrant labor.</p>
          `;
        } else if (activePeriod === "2015") {
          dynamicAnalysis.innerHTML = `
            <p class="mpi-highlight-stat">NFHS-4 Baseline (2015–16): <b>Over 1 in 3 rural residents</b> poor</p>
            <p>During 2015–16, rural multidimensional poverty stood at 35.73%, while urban stood at 10.17% (a 3.5× initial ratio).</p>
            <p>Major deficits at that baseline included unimproved sanitation, solid biomass cooking fuel, and maternal healthcare gaps.</p>
          `;
        } else if (activePeriod === "2019") {
          dynamicAnalysis.innerHTML = `
            <p class="mpi-highlight-stat">NFHS-5 Assessment (2019–21): <b>Persistent 4.3× rural/urban gap</b></p>
            <p>By 2019–21, rural poverty fell to 19.71% and urban to 4.59%.</p>
            <p>While absolute deprivation decreased across the state, the relative gap widened from 3.5× to 4.3×, demonstrating that poverty in Chhattisgarh is increasingly a rural phenomenon.</p>
          `;
        } else {
          dynamicAnalysis.innerHTML = `
            <p>In both survey periods, the rural headcount substantially exceeded the urban headcount. By 2019–21, the rural estimate was <b>4.3 times</b> the urban estimate.</p>
            <p>MPI identifies overlapping deprivations across 12 indicators in health, education, and living standards. It does not measure income depth or explain village-specific causes.</p>
          `;
        }
      }

      if (liveAnnounce) {
        liveAnnounce.textContent = `Showing ${activeSeries} series for ${activePeriod} period.`;
      }
    }

    document.querySelectorAll("[data-mpi-series]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeSeries = btn.dataset.mpiSeries;
        updateChartUI();
      });
    });

    document.querySelectorAll("[data-mpi-period]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activePeriod = btn.dataset.mpiPeriod;
        updateChartUI();
      });
    });

    D.mpiChart = {
      setSeries: (s) => { activeSeries = s; updateChartUI(); },
      setPeriod: (p) => { activePeriod = p; updateChartUI(); },
      reset: () => { activeSeries = "all"; activePeriod = "both"; updateChartUI(); }
    };
  }

  window.addEventListener("DOMContentLoaded", initMpiChart);
  // Also run immediately if DOM is already parsed
  if (document.readyState !== "loading") initMpiChart();
})();

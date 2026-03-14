if (typeof window.renderAboutSection === "function") {
  window.renderAboutSection("about-section-root");
}

if (typeof window.renderNichesSection === "function") {
  window.renderNichesSection("niches-section-root");
}

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

function initAmbientObjects() {
  const pageShell = document.querySelector(".page-shell");

  if (!pageShell) return;

  if (!pageShell.querySelector(".ambient-scene")) {
    const scene = document.createElement("div");
    scene.className = "ambient-scene";
    scene.setAttribute("aria-hidden", "true");
    scene.innerHTML = `
      <span class="ambient-orb ambient-orb--violet"></span>
      <span class="ambient-orb ambient-orb--amber"></span>
      <span class="ambient-orb ambient-orb--cyan"></span>
      <span class="ambient-grid"></span>
      <span class="ambient-star ambient-star--one"></span>
      <span class="ambient-star ambient-star--two"></span>
    `;
    pageShell.prepend(scene);
  }

  document.querySelectorAll(".hero").forEach((hero) => {
    if (hero.querySelector(".hero-orbit")) return;

    const orbit = document.createElement("div");
    orbit.className = "hero-orbit";
    orbit.setAttribute("aria-hidden", "true");
    orbit.innerHTML = `
      <span class="hero-orbit__ring"></span>
      <span class="hero-orbit__ring hero-orbit__ring--inner"></span>
      <span class="hero-orbit__trail"></span>
      <span class="hero-orbit__core"></span>
      <span class="hero-orbit__dot hero-orbit__dot--one"></span>
      <span class="hero-orbit__dot hero-orbit__dot--two"></span>
      <span class="hero-orbit__dot hero-orbit__dot--three"></span>
      <span class="hero-orbit__spark"></span>
    `;
    hero.appendChild(orbit);
  });

  if (prefersReducedMotion.matches) return;

  let frameId = null;

  function updateAmbientShift(clientX, clientY) {
    const bounds = pageShell.getBoundingClientRect();
    const offsetX = (clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (clientY - bounds.top) / bounds.height - 0.5;

    pageShell.style.setProperty("--ambient-shift-x", offsetX.toFixed(3));
    pageShell.style.setProperty("--ambient-shift-y", offsetY.toFixed(3));
  }

  pageShell.addEventListener("pointermove", (event) => {
    if (frameId) {
      window.cancelAnimationFrame(frameId);
    }

    frameId = window.requestAnimationFrame(() => {
      updateAmbientShift(event.clientX, event.clientY);
    });
  });

  pageShell.addEventListener("pointerleave", () => {
    pageShell.style.setProperty("--ambient-shift-x", "0");
    pageShell.style.setProperty("--ambient-shift-y", "0");
  });
}

function initMobileMenu() {
  const menuButton = document.querySelector(".mobile-menu");
  const topNav = document.querySelector(".top-nav");
  const navLinks = document.querySelector(".nav-links");
  const navCta = document.querySelector(".nav-cta");

  if (!menuButton || !topNav || !navLinks) return;

  const panel = document.createElement("div");
  const linkGroup = document.createElement("div");

  panel.className = "mobile-nav-panel";
  panel.id = "mobile-nav-panel";
  panel.setAttribute("aria-label", "Mobile navigation");
  panel.setAttribute("aria-hidden", "true");
  panel.hidden = true;

  linkGroup.className = "mobile-nav-panel__links";

  navLinks.querySelectorAll("a").forEach((link) => {
    const clone = link.cloneNode(true);
    clone.className = `mobile-nav-panel__link${link.classList.contains("active") ? " active" : ""}`;
    clone.addEventListener("click", closeMenu);
    linkGroup.appendChild(clone);
  });

  panel.appendChild(linkGroup);

  if (navCta) {
    const ctaClone = navCta.cloneNode(true);
    ctaClone.className = "mobile-nav-panel__cta";
    ctaClone.addEventListener("click", closeMenu);
    panel.appendChild(ctaClone);
  }

  topNav.insertAdjacentElement("afterend", panel);

  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-controls", panel.id);

  function openMenu() {
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    window.requestAnimationFrame(() => {
      panel.classList.add("is-open");
    });
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.textContent = "Close";
    document.body.classList.add("has-mobile-nav-open");
  }

  function closeMenu() {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Menu";
    document.body.classList.remove("has-mobile-nav-open");

    if (prefersReducedMotion.matches) {
      panel.hidden = true;
      return;
    }

    window.setTimeout(() => {
      if (!panel.classList.contains("is-open")) {
        panel.hidden = true;
      }
    }, 220);
  }

  menuButton.addEventListener("click", () => {
    if (panel.classList.contains("is-open")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!panel.classList.contains("is-open")) return;

    if (panel.contains(event.target) || menuButton.contains(event.target)) {
      return;
    }

    closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 560) {
      closeMenu();
    }
  });
}

function setRevealTargets(selector, options = {}) {
  const {
    baseDelay = 0,
    stagger = 0,
    textReveal = false,
    effect = "up",
  } = options;

  document.querySelectorAll(selector).forEach((element, index) => {
    element.setAttribute("data-reveal", effect);
    element.style.setProperty(
      "--reveal-delay",
      `${baseDelay + index * stagger}ms`,
    );

    if (textReveal) {
      element.setAttribute("data-text-reveal", "words");
    }
  });
}

function prepareTextReveal(element) {
  if (!element || element.dataset.textRevealReady === "true") return;

  const text = element.textContent.replace(/\s+/g, " ").trim();
  if (!text) return;

  element.dataset.textRevealReady = "true";
  element.setAttribute("aria-label", text);
  element.textContent = "";

  text.split(" ").forEach((word, index, words) => {
    const mask = document.createElement("span");
    const inner = document.createElement("span");

    mask.className = "word-mask";
    inner.className = "word-inner";
    inner.style.setProperty("--word-index", index);
    inner.textContent = word;
    inner.setAttribute("aria-hidden", "true");
    mask.appendChild(inner);
    element.appendChild(mask);

    if (index < words.length - 1) {
      element.appendChild(document.createTextNode(" "));
    }
  });
}

function hydrateAnimations() {
  setRevealTargets(".top-nav", { baseDelay: 0, effect: "zoom" });
  setRevealTargets(".badge", { baseDelay: 100, effect: "zoom" });
  setRevealTargets(".hero-orbit", { baseDelay: 120, effect: "zoom" });
  setRevealTargets(".hero h1", {
    baseDelay: 180,
    textReveal: true,
    effect: "soft",
  });
  setRevealTargets(".hero-copy", { baseDelay: 380, effect: "soft" });
  setRevealTargets(".hero-button", { baseDelay: 500, effect: "zoom" });
  setRevealTargets(".social-proof", { baseDelay: 620, effect: "soft" });

  setRevealTargets(".work-card", {
    baseDelay: 100,
    stagger: 140,
    effect: "soft",
  });
  setRevealTargets(".work-section__eyebrow", {
    baseDelay: 80,
    effect: "zoom",
  });
  setRevealTargets(".work-card__chip", {
    baseDelay: 180,
    stagger: 70,
    effect: "zoom",
  });
  setRevealTargets(".work-card__title", {
    baseDelay: 260,
    stagger: 120,
    textReveal: true,
    effect: "left",
  });

  setRevealTargets(".about-section__title-primary", {
    baseDelay: 100,
    textReveal: true,
    effect: "left",
  });
  setRevealTargets(".about-section__title-secondary", {
    baseDelay: 220,
    textReveal: true,
    effect: "right",
  });
  setRevealTargets(".about-section__block:nth-child(1) h3", {
    baseDelay: 260,
    textReveal: true,
    effect: "left",
  });
  setRevealTargets(".about-section__block:nth-child(1) p", {
    baseDelay: 340,
    effect: "left",
  });
  setRevealTargets(".about-section__block:nth-child(2) h3", {
    baseDelay: 340,
    textReveal: true,
    effect: "right",
  });
  setRevealTargets(".about-section__block:nth-child(2) p", {
    baseDelay: 420,
    effect: "right",
  });

  setRevealTargets(".niches-badge", { baseDelay: 100, effect: "zoom" });
  setRevealTargets(".niches-title-soft", {
    baseDelay: 180,
    textReveal: true,
    effect: "left",
  });
  setRevealTargets(".niches-title-strong", {
    baseDelay: 300,
    textReveal: true,
    effect: "right",
  });
  setRevealTargets(".niches-copy", { baseDelay: 420, effect: "soft" });
  setRevealTargets(".niche-chip", {
    baseDelay: 220,
    stagger: 55,
    effect: "zoom",
  });

  setRevealTargets(".footer-brand-block", { baseDelay: 80, effect: "left" });
  setRevealTargets(".footer-links-group", {
    baseDelay: 180,
    stagger: 120,
    effect: "right",
  });
  setRevealTargets(".footer-wordmark", { baseDelay: 180, effect: "zoom" });
  setRevealTargets(".footer-bottom", { baseDelay: 280, effect: "soft" });

  setRevealTargets(".page-kicker", { baseDelay: 100, effect: "zoom" });
  setRevealTargets(".page-section-title", {
    baseDelay: 160,
    textReveal: true,
    effect: "left",
  });
  setRevealTargets(".page-section-lead", { baseDelay: 260, effect: "soft" });
  setRevealTargets(".feature-panel", { baseDelay: 240, effect: "up" });
  setRevealTargets(".story-card", {
    baseDelay: 220,
    stagger: 90,
    effect: "up",
  });
  setRevealTargets(".project-card", {
    baseDelay: 220,
    stagger: 90,
    effect: "up",
  });
  setRevealTargets(".process-card", {
    baseDelay: 220,
    stagger: 90,
    effect: "up",
  });
  setRevealTargets(".newsletter-panel", { baseDelay: 220, effect: "soft" });
  setRevealTargets(".stat-chip", {
    baseDelay: 260,
    stagger: 60,
    effect: "zoom",
  });

  document.querySelectorAll("[data-text-reveal]").forEach(prepareTextReveal);
}

function startRevealObserver() {
  const revealNodes = document.querySelectorAll("[data-reveal]");
  if (!revealNodes.length) return;

  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function initPageAnimations() {
  hydrateAnimations();

  if (!prefersReducedMotion.matches) {
    document.documentElement.classList.add("js-motion");
  }

  window.requestAnimationFrame(startRevealObserver);
}

initMobileMenu();
initAmbientObjects();
initPageAnimations();

const timeNode = document.getElementById("riga-time");

function updateRigaTime() {
  if (!timeNode) return;
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Riga",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
  timeNode.textContent = time;
}

updateRigaTime();
setInterval(updateRigaTime, 30000);

(function () {
  const nichesMarkup = `
    <section class="niches-section" aria-labelledby="niches-title">
      <div class="niches-header">
        <p class="niches-badge">Niches</p>
        <h2 id="niches-title" class="niches-title">
          <span class="niches-title-soft">Each specialty is distinct.</span>
          <span class="niches-title-strong">We speak your industry's language.</span>
        </h2>
        <p class="niches-copy">
          No matter your field, our experience spans multiple niches, ensuring we
          understand your specific needs and challenges.
        </p>
      </div>

      <div class="niches-chip-list" role="list" aria-label="Industries we serve">
      </div>
    </section>
  `;

  window.renderNichesSection = function renderNichesSection(target) {
    const root = typeof target === "string" ? document.getElementById(target) : target;

    if (!root || root.childElementCount > 0) return;

    root.innerHTML = nichesMarkup;
  };
})();
(function () {
  const workMarkup = `
    <section class="work-section" aria-labelledby="work-section-title">
      <div class="work-section__intro">
        <p class="work-section__eyebrow">Team showcase</p>
      </div>

      <div class="work-section__grid">
        <article class="work-card work-card--member">
          <div class="work-card__media work-card__media--portrait">
            <img
              class="work-card__image work-card__image--primary"
              src="https://im-rahul.netlify.app/assets/rahul-CDcI9xUV.png"
              alt="Rahul - Developer"
            />
          </div>

          <div class="work-card__content">
            <h2 id="work-section-title" class="work-card__title">Rahul</h2>
            <p class="work-card__role-label">Role</p>
            <div class="work-card__meta">
              <span class="work-card__chip">Developer</span>
            </div>
          </div>
        </article>

        <article class="work-card work-card--member">
          <div class="work-card__media work-card__media--portrait">
            <img
              class="work-card__image work-card__image--primary"
              src="https://im-rahul.netlify.app/assets/rahul-CDcI9xUV.png"
              alt="Sarah - Designer"
            />
          </div>

          <div class="work-card__content">
            <h2 class="work-card__title">Sarah</h2>
            <p class="work-card__role-label">Role</p>
            <div class="work-card__meta">
              <span class="work-card__chip">Designer</span>
            </div>
          </div>
        </article>

        <article class="work-card work-card--member">
          <div class="work-card__media work-card__media--portrait">
            <img
              class="work-card__image work-card__image--primary"
              src="https://im-rahul.netlify.app/assets/rahul-CDcI9xUV.png"
              alt="Mike - Backend"
            />
          </div>

          <div class="work-card__content">
            <h2 class="work-card__title">Mike</h2>
            <p class="work-card__role-label">Role</p>
            <div class="work-card__meta">
              <span class="work-card__chip">Backend</span>
            </div>
          </div>
        </article>

        <article class="work-card work-card--member">
          <div class="work-card__media work-card__media--portrait">
            <img
              class="work-card__image work-card__image--primary"
              src="https://im-rahul.netlify.app/assets/rahul-CDcI9xUV.png"
              alt="Emma - PM"
            />
          </div>

          <div class="work-card__content">
            <h2 class="work-card__title">Emma</h2>
            <p class="work-card__role-label">Role</p>
            <div class="work-card__meta">
              <span class="work-card__chip">PM</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  `;

  window.renderWorkSection = function renderWorkSection(target) {
    const root =
      typeof target === "string" ? document.getElementById(target) : target;

    if (!root || root.childElementCount > 0) return;

    root.innerHTML = workMarkup;
  };
})();

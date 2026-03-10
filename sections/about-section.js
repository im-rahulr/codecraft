(function () {
  const aboutMarkup = `
    <section class="about-section" aria-labelledby="about-section-title">
      <div class="about-section__intro">
        <h2 id="about-section-title" class="about-section__title">
          <span class="about-section__title-primary">Designers. Builders.</span>
          <span class="about-section__title-secondary">Lifelong learners.</span>
        </h2>
      </div>

      <div class="about-section__content">
        <article class="about-section__block">
          <h3>Our Story</h3>
          <p>
            Founded with a passion for design and a commitment to innovation,
            our Studio has grown from a small team of enthusiasts to a leading
            design studio. Over the years, we've partnered with startups and
            companies at every stage, helping them scale by delivering
            cutting-edge digital products and solutions. Our journey is fueled
            by creativity, collaboration, and a relentless pursuit of
            excellence.
          </p>
        </article>

        <article class="about-section__block">
          <h3>About Us</h3>
          <p>
            At Studio, we believe in the power of design to drive success. Our
            team is a diverse group of creatives and strategists, all dedicated
            to turning your vision into reality. Whether it's crafting a brand
            identity, developing a seamless user experience, or building a
            scalable product, we bring a wealth of experience and a fresh
            perspective to every project.
          </p>
        </article>
      </div>
    </section>
  `;

  window.renderAboutSection = function renderAboutSection(target) {
    const root = typeof target === "string" ? document.getElementById(target) : target;

    if (!root || root.childElementCount > 0) return;

    root.innerHTML = aboutMarkup;
  };
})();
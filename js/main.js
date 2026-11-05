document.querySelectorAll(".quick-order-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    form.querySelector(".alert").classList.remove("d-none");
    form.querySelectorAll("input").forEach((input) => { input.disabled = true; });
    form.querySelector("button[type='submit']").disabled = true;
  });
});

const orderForm = document.querySelector(".order-form");

document.querySelectorAll(".site-footer .footer-copy").forEach((copy) => {
  if (!copy.textContent.includes("Групповые визиты") || copy.parentElement.querySelector(".footer-ticket")) return;

  const ticketLink = document.createElement("a");
  ticketLink.className = "btn btn-wave-primary footer-ticket";
  ticketLink.href = "order.html";
  ticketLink.textContent = "Купить билет";
  copy.insertAdjacentElement("afterend", ticketLink);
});

const scrollTopButton = document.createElement("button");
scrollTopButton.type = "button";
scrollTopButton.className = "scroll-top";
scrollTopButton.setAttribute("aria-label", "Вернуться наверх страницы");
scrollTopButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 11 6-6 6 6M6 19l6-6 6 6" /></svg>';
document.body.append(scrollTopButton);

const toggleScrollTopButton = () => {
  scrollTopButton.classList.toggle("is-visible", window.scrollY > 360);
};

window.addEventListener("scroll", toggleScrollTopButton, { passive: true });
toggleScrollTopButton();
scrollTopButton.addEventListener("click", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
});

if (orderForm) {
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!orderForm.checkValidity()) {
      orderForm.classList.add("was-validated");
      return;
    }
    document.querySelector("#orderSuccess").classList.remove("d-none");
    orderForm.reset();
    orderForm.classList.remove("was-validated");
  });
}

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("js-motion");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.dataset.visible = "";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  const revealTargets = document.querySelectorAll(
    ".reveal, .page-intro, main > section .alert, .zone-card, .product-image, .content-panel, .order-form, .order-aside, .accordion, .gallery-card, .gallery-card img"
  );
  revealTargets.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}

// Theme switcher: one persistent control for every page.
const themeToggleTarget = document.querySelector(".site-navbar .navbar-nav");

if (themeToggleTarget) {
  const themeItem = document.createElement("li");
  themeItem.className = "nav-item ms-lg-1 order-lg-last";
  themeItem.innerHTML = `
    <button class="theme-toggle" type="button" aria-label="Включить тёмную тему" aria-pressed="false">
      <svg class="theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path></svg>
      <svg class="theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"></path></svg>
    </button>`;

  const ticketItem = themeToggleTarget.querySelector(".nav-item.ms-lg-2");
  themeToggleTarget.insertBefore(themeItem, ticketItem || null);

  const themeButton = themeItem.querySelector(".theme-toggle");

  const syncThemeButton = () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    const actionLabel = isDark ? "Включить светлую тему" : "Включить тёмную тему";
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.setAttribute("aria-label", actionLabel);
    themeButton.setAttribute("title", actionLabel);
  };

  syncThemeButton();
  themeButton.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("aquawave-theme", nextTheme);
    syncThemeButton();
  });
}

// Mood filter for the zones catalogue.
const zoneFilter = document.querySelector("[data-zone-filter]");

if (zoneFilter) {
  const filterButtons = [...zoneFilter.querySelectorAll("[data-filter]")];
  const zoneCards = [...document.querySelectorAll(".zone-card-wrap[data-moods]")];

  const applyZoneFilter = (filter) => {
    zoneCards.forEach((card) => {
      const moods = card.dataset.moods.split(" ");
      const isVisible = filter === "all" || moods.includes(filter);
      card.hidden = !isVisible;
    });

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

  };

  zoneFilter.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (button) applyZoneFilter(button.dataset.filter);
  });

  applyZoneFilter("all");
}

// Scroll the photo gallery by one card with buttons or keyboard arrows.
const photoGallery = document.querySelector("[data-photo-gallery]");

if (photoGallery) {
  const gallerySection = photoGallery.closest("[data-photo-gallery-section]") || photoGallery;
  const previousButton = gallerySection.querySelector("[data-gallery-prev]");
  const nextButton = gallerySection.querySelector("[data-gallery-next]");

  const getScrollStep = () => {
    const firstCard = photoGallery.querySelector(".photo-gallery__item");
    const gap = Number.parseFloat(getComputedStyle(photoGallery).gap) || 0;
    return firstCard ? firstCard.getBoundingClientRect().width + gap : photoGallery.clientWidth * .8;
  };

  const updateGalleryControls = () => {
    const maxScroll = photoGallery.scrollWidth - photoGallery.clientWidth;
    previousButton.disabled = photoGallery.scrollLeft <= 2;
    nextButton.disabled = photoGallery.scrollLeft >= maxScroll - 2;
  };

  const scrollGallery = (direction, { immediate = false } = {}) => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const maxScroll = photoGallery.scrollWidth - photoGallery.clientWidth;
    const nextPosition = Math.min(maxScroll, Math.max(0, photoGallery.scrollLeft + direction * getScrollStep()));
    photoGallery.scrollTo({ left: nextPosition, behavior: immediate || reducedMotion ? "auto" : "smooth" });
  };

  previousButton.addEventListener("click", () => scrollGallery(-1));
  nextButton.addEventListener("click", () => scrollGallery(1));
  photoGallery.addEventListener("scroll", updateGalleryControls, { passive: true });
  gallerySection.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    scrollGallery(event.key === "ArrowLeft" ? -1 : 1, { immediate: true });
  });
  window.addEventListener("resize", updateGalleryControls);
  updateGalleryControls();
}

// Populate the gallery modal from the selected photograph.
const galleryModal = document.querySelector("#photoModal");

if (galleryModal) {
  galleryModal.addEventListener("show.bs.modal", (event) => {
    const trigger = event.relatedTarget;
    const image = galleryModal.querySelector(".gallery-modal-image");
    const caption = galleryModal.querySelector(".gallery-modal-caption");
    const title = galleryModal.querySelector(".modal-title");
    image.src = trigger.dataset.image;
    image.alt = trigger.dataset.alt;
    title.textContent = trigger.dataset.title;
    caption.textContent = trigger.dataset.caption;
  });

}

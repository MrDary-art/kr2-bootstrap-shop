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

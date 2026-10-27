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

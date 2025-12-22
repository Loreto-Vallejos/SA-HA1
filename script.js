document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     Navbar: efecto "scrolled"
  ========================= */
  const navbar = document.querySelector(".navbar-eternia");
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* =========================
     Nav: estado activo
  ========================= */
  const navLinks = document.querySelectorAll(".navbar-eternia .nav-link");

  const setActiveByHash = () => {
    const hash = (window.location.hash || "#inicio").toLowerCase();
    navLinks.forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      a.classList.toggle("active", href === hash);
      a.setAttribute("aria-current", href === hash ? "page" : "false");
    });
  };

  setActiveByHash();
  window.addEventListener("hashchange", setActiveByHash);

  /* =========================
     Contact Form
  ========================= */
  const contactForm = document.getElementById("contactForm");
  const toast = document.getElementById("toast");

  const validarNombre = (n) => (n || "").trim().length >= 3;
  const validarEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((e || "").trim());
  const validarIdea = (i) => (i || "").trim().length >= 10;

  const setFieldState = (id, isValid) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle("is-invalid", !isValid);
    el.classList.toggle("is-valid", isValid);
  };

  const showToast = () => {
    if (!toast) return;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  };

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const idea = formData.get("idea");

      const okName = validarNombre(name);
      const okEmail = validarEmail(email);
      const okIdea = validarIdea(idea);

      setFieldState("name", okName);
      setFieldState("email", okEmail);
      setFieldState("idea", okIdea);

      if (!okName || !okEmail || !okIdea) return;

      showToast();
      contactForm.reset();

      ["name", "email", "idea"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.remove("is-valid", "is-invalid");
      });
    });
  }

  /* =========================
     Animaciones
  ========================= */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".card, .section__title, .hero__content")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

  /* =========================
     Cotización
  ========================= */
  const form = document.getElementById("formCotizacion");
  const inputReferencia = document.getElementById("referencia");
  const previewBox = document.getElementById("previewBox");
  const previewImg = document.getElementById("previewImg");
  const btnQuitarImagen = document.getElementById("btnQuitarImagen");
  const msgExito = document.getElementById("msgExito");

  if (form && inputReferencia) {
    inputReferencia.addEventListener("change", () => {
      const file = inputReferencia.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
        inputReferencia.value = "";
        previewBox.classList.remove("is-visible");
        return;
      }

      previewImg.src = URL.createObjectURL(file);
      previewBox.classList.add("is-visible");
    });

    btnQuitarImagen?.addEventListener("click", () => {
      inputReferencia.value = "";
      previewBox.classList.remove("is-visible");
      previewImg.removeAttribute("src");
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      msgExito.textContent = "¡Listo! Recibimos tu solicitud.";
      form.reset();
      previewBox.classList.remove("is-visible");
    });
  }

  /* =========================
     Cuenta (login / register)
  ========================= */
  const tabs = document.querySelectorAll(".account__tab");
  const forms = document.querySelectorAll(".account__form");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("is-active"));
      forms.forEach(f => f.classList.remove("is-active"));

      tab.classList.add("is-active");
      document
        .getElementById(tab.dataset.target + "Form")
        ?.classList.add("is-active");
    });
  });

});

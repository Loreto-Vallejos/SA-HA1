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
      const isActive = href === hash;
      a.classList.toggle("active", isActive);
      a.setAttribute("aria-current", isActive ? "page" : "false");
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
     Cuenta (login / register) - TABS
     ✅ Asegura type="button"
  ========================= */
  const tabs = document.querySelectorAll(".account__tab");
  const accountForms = document.querySelectorAll(".account__form");

  const setActiveTab = (target) => {
    tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.target === target));
    accountForms.forEach((f) => f.classList.toggle("is-active", f.id === `${target}Form`));
  };

  tabs.forEach((tab) => {
    tab.setAttribute("type", "button"); // IMPORTANTÍSIMO
    tab.addEventListener("click", () => {
      setActiveTab(tab.dataset.target);
    });
  });

  /* =============================
     REGISTER: validaciones + JSON
     ✅ SIN DOMContentLoaded anidado
     ✅ NO cambia a iniciar sesión
  ============================= */
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    const registerMsg = document.getElementById("registerMsg");

    const nameInput = document.getElementById("registerName");
    const phoneInput = document.getElementById("registerPhone");
    const emailInput = document.getElementById("registerEmail");
    const passInput = document.getElementById("registerPassword");
    const pass2Input = document.getElementById("registerPassword2");

    // Helpers UI
    function setFieldError(input, message) {
      if (!input) return;
      const field = input.closest(".field");
      const errorEl = field ? field.querySelector(".error") : null;

      if (field) field.classList.add("is-invalid");
      if (errorEl) errorEl.textContent = message || "Campo inválido";
    }

    function clearFieldError(input) {
      if (!input) return;
      const field = input.closest(".field");
      const errorEl = field ? field.querySelector(".error") : null;

      if (field) field.classList.remove("is-invalid");
      if (errorEl) errorEl.textContent = "";
    }

    function showFormMessage(text, type = "error") {
      if (!registerMsg) return;
      registerMsg.textContent = text;
      registerMsg.classList.remove("success", "error");
      registerMsg.classList.add(type);
    }

    // Validaciones
    function isValidEmailLocal(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || "").trim());
    }

    function normalizeCLPhone(raw) {
      const digits = String(raw || "").replace(/\D/g, "");

      // 569XXXXXXXX (11) -> +569XXXXXXXX
      if (digits.length === 11 && digits.startsWith("569")) return `+${digits}`;

      // 56 + 9XXXXXXXX -> +569XXXXXXXX
      if (digits.length === 11 && digits.startsWith("56")) {
        const rest = digits.slice(2);
        if (rest.length === 9 && rest.startsWith("9")) return `+56${rest}`;
      }

      // 9XXXXXXXX (9) -> +569XXXXXXXX
      if (digits.length === 9 && digits.startsWith("9")) return `+56${digits}`;

      return null;
    }

    function isValidPassword(p) {
      return String(p || "").length >= 8;
    }

    // Limpia errores al escribir
    [nameInput, phoneInput, emailInput, passInput, pass2Input].forEach((el) => {
      if (!el) return;
      el.addEventListener("input", () => clearFieldError(el));
    });

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // ✅ Mantente en register SIEMPRE al enviar register
      setActiveTab("register");

      // Limpia mensaje general
      if (registerMsg) {
        registerMsg.textContent = "";
        registerMsg.classList.remove("success", "error");
      }

      let isOk = true;

      const fullName = (nameInput?.value || "").trim();
      const phoneRaw = (phoneInput?.value || "").trim();
      const email = (emailInput?.value || "").trim().toLowerCase();
      const password = passInput?.value || "";
      const password2 = pass2Input?.value || "";

      // Nombre
      if (fullName.length < 3) {
        isOk = false;
        setFieldError(nameInput, "Ingresa tu nombre completo (mínimo 3 caracteres).");
      }

      // Teléfono
      const phoneNormalized = normalizeCLPhone(phoneRaw);
      if (!phoneNormalized) {
        isOk = false;
        setFieldError(phoneInput, "Teléfono inválido. Ej: +56 9 1234 5678");
      }

      // Email
      if (!isValidEmailLocal(email)) {
        isOk = false;
        setFieldError(emailInput, "Email inválido. Ej: correo@ejemplo.com");
      }

      // Password
      if (!isValidPassword(password)) {
        isOk = false;
        setFieldError(passInput, "La contraseña debe tener al menos 8 caracteres.");
      }

      // Password coincide
      if (password2 !== password) {
        isOk = false;
        setFieldError(pass2Input, "Las contraseñas no coinciden.");
      }

      if (!isOk) {
        showFormMessage("Revisa los campos marcados en rojo.", "error");
        return;
      }

      // ✅ Crear objeto JSON con los campos requeridos
      const user = {
        nombreCompleto: fullName,
        telefono: phoneNormalized,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
      };

      // Guardar en localStorage (lista de usuarios)
      const key = "users";
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem(key) || "[]");
      } catch {
        users = [];
      }

      // Evitar duplicado por email
      const exists = users.some((u) => String(u.email || "").toLowerCase() === user.email);
      if (exists) {
        setFieldError(emailInput, "Este email ya está registrado.");
        showFormMessage("Ese email ya existe. Prueba con otro.", "error");
        return;
      }

      users.push(user);
      localStorage.setItem(key, JSON.stringify(users));

      // ✅ Mensaje visible y NO cambiar a login
      showFormMessage("Cuenta creada correctamente ✅ (ya puedes iniciar sesión)", "success");

      // Reset sin borrar el mensaje
      registerForm.reset();

      // ✅ Quédate en register (por si otro código intenta cambiar)
      setActiveTab("register");
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
        previewBox?.classList.remove("is-visible");
        return;
      }

      if (previewImg) previewImg.src = URL.createObjectURL(file);
      previewBox?.classList.add("is-visible");
    });

    btnQuitarImagen?.addEventListener("click", () => {
      inputReferencia.value = "";
      previewBox?.classList.remove("is-visible");
      previewImg?.removeAttribute("src");
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (msgExito) msgExito.textContent = "¡Listo! Recibimos tu solicitud.";
      form.reset();
      previewBox?.classList.remove("is-visible");
    });
  }

});

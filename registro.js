document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const alertContainer = document.getElementById("alertContainer");
  const jsonOutput = document.getElementById("jsonOutput");

  const fullName = document.getElementById("fullName");
  const phone = document.getElementById("phone");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  const passwordToggles = document.querySelectorAll(".password-toggle");

  // Si el profe exige guardar password, cambia a true (NO recomendado en proyectos reales)
  const SAVE_PASSWORD_IN_STORAGE = false;

  // --- Helpers ---
  const escapeHtml = (str) =>
    String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const showAlert = (type, messages) => {
    const listItems = messages.map((m) => `<li>${escapeHtml(m)}</li>`).join("");
    alertContainer.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <strong>${type === "success" ? "Listo:" : "Revisa esto:"}</strong>
        <ul class="mb-0 mt-2">${listItems}</ul>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
      </div>
    `;
  };

  // Email simple y práctico
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());

  // Teléfono (Chile friendly): +569XXXXXXXX / 569XXXXXXXX / 9XXXXXXXX
  const isValidPhone = (value) => {
    const cleaned = value.replace(/[^\d+]/g, "");
    return /^(\+?56)?9\d{8}$/.test(cleaned);
  };

  const setValidity = (input, isValid) => {
    input.classList.toggle("is-valid", isValid);
    input.classList.toggle("is-invalid", !isValid);
  };

  const resetValidationUI = () => {
    [fullName, phone, email, password, confirmPassword].forEach((i) => {
      i.classList.remove("is-valid", "is-invalid");
    });
  };

  // --- LocalStorage ---
  const USERS_KEY = "users";

  const getUsers = () => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  // --- Validación completa ---
  const validateForm = () => {
    const errors = [];

    // Nombre
    const nameVal = fullName.value.trim();
    const nameOk = nameVal.length >= 3;
    setValidity(fullName, nameOk);
    if (!nameOk) errors.push("Nombre completo inválido (mínimo 3 caracteres).");

    // Teléfono
    const phoneVal = phone.value.trim();
    const phoneOk = phoneVal.length > 0 && isValidPhone(phoneVal);
    setValidity(phone, phoneOk);
    if (!phoneOk) errors.push("Teléfono inválido. Ej: +56912345678 o 9XXXXXXXX.");

    // Email
    const emailVal = email.value.trim();
    const emailOk = emailVal.length > 0 && isValidEmail(emailVal);
    setValidity(email, emailOk);
    if (!emailOk) errors.push("Correo electrónico inválido.");

    // Password
    const passVal = password.value;
    const passOk = passVal.length >= 8;
    setValidity(password, passOk);
    if (!passOk) errors.push("La contraseña debe tener al menos 8 caracteres.");

    // Confirm password
    const confirmVal = confirmPassword.value;
    const matchOk = confirmVal.length > 0 && confirmVal === passVal;
    setValidity(confirmPassword, matchOk);
    if (!matchOk) errors.push("Las contraseñas no coinciden.");

    return { ok: errors.length === 0, errors };
  };

  // --- Mostrar / ocultar password ---
  const togglePasswordVisibility = (inputId, buttonEl) => {
    const input = document.getElementById(inputId);
    if (!input) return;

    const icon = buttonEl.querySelector("i");
    const isHidden = input.type === "password";

    input.type = isHidden ? "text" : "password";

    // Cambiar ícono
    if (icon) {
      icon.classList.toggle("bi-eye", !isHidden);
      icon.classList.toggle("bi-eye-slash", isHidden);
    }

    // Accesibilidad
    buttonEl.setAttribute(
      "aria-label",
      isHidden ? "Ocultar contraseña" : "Mostrar contraseña"
    );
  };

  passwordToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      togglePasswordVisibility(targetId, btn);
    });
  });

  // --- Submit ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alertContainer.innerHTML = "";

    const { ok, errors } = validateForm();

    if (!ok) {
      showAlert("danger", errors);
      jsonOutput.textContent = "{}";
      return;
    }

    const normalizedEmail = email.value.trim().toLowerCase();

    const users = getUsers();
    const exists = users.some((u) => String(u.email).toLowerCase() === normalizedEmail);

    if (exists) {
      setValidity(email, false);
      showAlert("danger", ["Ya existe un usuario registrado con ese email."]);
      jsonOutput.textContent = "{}";
      return;
    }

    // Crear el objeto usuario
    const user = {
      id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
      fullName: fullName.value.trim(),
      phone: phone.value.trim(),
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
    };

    if (SAVE_PASSWORD_IN_STORAGE) {
      user.password = password.value; // NO recomendado
    }

    users.push(user);
    saveUsers(users);

    // Mostrar JSON bonito (lo que guardaste)
    jsonOutput.textContent = JSON.stringify(user, null, 2);

    showAlert("success", [
      "Registro validado correctamente.",
      "Usuario guardado en localStorage (key: 'users').",
      "JSON generado en pantalla.",
    ]);

    // Opcional: limpiar form después de registrar
    form.reset();
    resetValidationUI();
  });

  // --- Reset ---
  form.addEventListener("reset", () => {
    alertContainer.innerHTML = "";
    jsonOutput.textContent = "{}";
    resetValidationUI();

    // Restaurar iconos/inputs a password por si estaban visibles
    [password, confirmPassword].forEach((inp) => (inp.type = "password"));
    passwordToggles.forEach((btn) => {
      const icon = btn.querySelector("i");
      if (icon) {
        icon.classList.add("bi-eye");
        icon.classList.remove("bi-eye-slash");
      }
      btn.setAttribute("aria-label", "Mostrar u ocultar contraseña");
    });
  });

  // Validación en vivo suave
  [fullName, phone, email, password, confirmPassword].forEach((input) => {
    input.addEventListener("blur", () => validateForm());
  });
});

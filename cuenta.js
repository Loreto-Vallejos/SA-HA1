// =============================
// REGISTER: validaciones + JSON
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return;

  const registerMsg = document.getElementById("registerMsg");

  const nameInput = document.getElementById("registerName");
  const phoneInput = document.getElementById("registerPhone");
  const emailInput = document.getElementById("registerEmail");
  const passInput = document.getElementById("registerPassword");
  const pass2Input = document.getElementById("registerPassword2");

  // Helpers UI
  function setFieldError(input, message) {
    const field = input.closest(".field");
    const errorEl = field ? field.querySelector(".error") : null;

    if (field) field.classList.add("is-invalid");
    if (errorEl) errorEl.textContent = message || "Campo inválido";
  }

  function clearFieldError(input) {
    const field = input.closest(".field");
    const errorEl = field ? field.querySelector(".error") : null;

    if (field) field.classList.remove("is-invalid");
    if (errorEl) errorEl.textContent = "";
  }

  function showFormMessage(text, type = "error") {
    if (!registerMsg) return;
    registerMsg.textContent = text;
    // Si tu CSS no tiene estilos por clase, esto no rompe nada:
    registerMsg.classList.remove("success", "error");
    registerMsg.classList.add(type);
  }

  // Validaciones
  function isValidEmail(email) {
    // suficiente para tarea (sin ser exageradamente estricto)
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function normalizeCLPhone(raw) {
    // Limpia todo menos dígitos
    const digits = String(raw || "").replace(/\D/g, "");

    // Posibles entradas:
    // 569XXXXXXXX -> +569XXXXXXXX
    // 56 9 XXXXXXXX -> +569XXXXXXXX
    // 9 XXXXXXXX -> +569XXXXXXXX
    // XXXXXXXX (8) -> asumimos móvil? NO: pedimos 9 dígitos iniciando con 9
    // Chile móvil: +56 9 XXXXXXXX (9 dígitos: 9 + 8)
    let d = digits;

    if (d.startsWith("00")) d = d.slice(2); // 00 -> prefijo internacional
    if (d.startsWith("56")) d = d.slice(2); // quita país si viene
    // ahora debería empezar con 9 y tener 9 dígitos total
    if (d.length === 9 && d.startsWith("9")) {
      return `+56${d}`;
    }
    // Si viene como 569XXXXXXXX (11)
    if (digits.length === 11 && digits.startsWith("569")) {
      return `+${digits}`;
    }
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

    // Limpia mensaje general
    if (registerMsg) registerMsg.textContent = "";

    let isOk = true;

    const fullName = nameInput.value.trim();
    const phoneRaw = phoneInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passInput.value;
    const password2 = pass2Input.value;

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
    if (!isValidEmail(email)) {
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
      email: email, // nombre de usuario
      password: password
    };

    // Guardar en localStorage (lista de usuarios)
    const key = "users";
    const users = JSON.parse(localStorage.getItem(key) || "[]");

    // Evitar duplicado por email (recomendado)
    const exists = users.some((u) => u.email === user.email);
    if (exists) {
      setFieldError(emailInput, "Este email ya está registrado.");
      showFormMessage("Ese email ya existe. Prueba con otro.", "error");
      return;
    }

    users.push(user);
    localStorage.setItem(key, JSON.stringify(users));

    // Feedback + reset
    showFormMessage("Cuenta creada correctamente ✅", "success");
    registerForm.reset();
  });
});

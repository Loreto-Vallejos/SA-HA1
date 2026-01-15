
/*inicio sesión*/

// LOGIN: validaciones + auth con LocalStorage + redirección

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Usuario de prueba (seed) ----------
  // Requisito: "Almacenar los datos del usuario de prueba en el local storage"
  // Esto crea un usuario demo solo si NO existe ya.
  const USERS_KEY = "users";
  const SESSION_KEY = "currentUser";

  function getUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      const parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function seedTestUser() {
    const users = getUsers();
    const demoEmail = "demo@eternia.cl";
    const demoPass = "Eternia123"; // cumple 8+ caracteres

    const exists = users.some((u) => (u.email || "").toLowerCase() === demoEmail.toLowerCase());
    if (!exists) {
      users.push({
        nombreCompleto: "Usuario Demo",
        telefono: "+56912345678",
        email: demoEmail,
        password: demoPass,
      });
      saveUsers(users);
    }
  }

  seedTestUser();

  // ---------- Helpers UI (login) ----------
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  const loginMsg = document.getElementById("loginMsg");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

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

  function showLoginMessage(text, type = "error") {
    if (!loginMsg) return;
    loginMsg.textContent = text;
    loginMsg.classList.remove("success", "error");
    loginMsg.classList.add(type);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  // Limpia errores al escribir
  [loginEmail, loginPassword].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => clearFieldError(el));
  });

  // ---------- Submit login ----------
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (loginMsg) loginMsg.textContent = "";

    let isOk = true;

    const email = (loginEmail.value || "").trim().toLowerCase();
    const password = loginPassword.value || "";

    // Campos vacíos
    if (!email) {
      isOk = false;
      setFieldError(loginEmail, "Ingresa tu email.");
    } else if (!isValidEmail(email)) {
      isOk = false;
      setFieldError(loginEmail, "Email inválido.");
    }

    if (!password) {
      isOk = false;
      setFieldError(loginPassword, "Ingresa tu contraseña.");
    }

    if (!isOk) {
      showLoginMessage("Completa los campos requeridos.", "error");
      return;
    }

    // Auth contra usuarios preguardados
    const users = getUsers();
    const found = users.find((u) => (u.email || "").toLowerCase() === email);

    // Usuario / contraseña inválidos
    if (!found || found.password !== password) {
      showLoginMessage("Nombre de usuario o contraseña inválidos.", "error");
      return;
    }

    // Login OK -> guardar sesión
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        email: found.email,
        nombreCompleto: found.nombreCompleto,
        loginAt: new Date().toISOString(),
      })
    );

    showLoginMessage("Inicio de sesión exitoso ✅ Redirigiendo...", "success");

    // Redirección a inicio
    window.location.href = "index.html";
  });
});

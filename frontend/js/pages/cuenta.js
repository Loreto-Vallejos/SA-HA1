/**
 * ============================================================
 * CUENTA.JS - Login y Registro conectado al Backend
 * ============================================================
 * 
 * Este archivo maneja:
 * - Registro de usuarios (POST /auth/register)
 * - Login de usuarios (POST /auth/login)
 * - Validaciones de formulario
 * - Manejo de errores de la API
 * 
 * REQUIERE: api.js cargado antes de este archivo
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ============================================================
    // TABS: Cambiar entre Login y Register
    // ============================================================
    
    const tabs = document.querySelectorAll(".account__tab");
    const accountForms = document.querySelectorAll(".account__form");
    
    const setActiveTab = (target) => {
        tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.target === target));
        accountForms.forEach((f) => f.classList.toggle("is-active", f.id === `${target}Form`));
    };
    
    tabs.forEach((tab) => {
        tab.setAttribute("type", "button");
        tab.addEventListener("click", () => setActiveTab(tab.dataset.target));
    });
    
    // ============================================================
    // UTILIDADES DE UI
    // ============================================================
    
    function setFieldError(input, message) {
        if (!input) return;
        const field = input.closest(".field");
        const errorEl = field?.querySelector(".error");
        
        if (field) field.classList.add("is-invalid");
        if (errorEl) errorEl.textContent = message || "Campo inválido";
    }
    
    function clearFieldError(input) {
        if (!input) return;
        const field = input.closest(".field");
        const errorEl = field?.querySelector(".error");
        
        if (field) field.classList.remove("is-invalid");
        if (errorEl) errorEl.textContent = "";
    }
    
    function showFormMessage(msgElement, text, type = "error") {
        if (!msgElement) return;
        msgElement.textContent = text;
        msgElement.classList.remove("success", "error");
        msgElement.classList.add(type);
    }
    
    function clearFormMessage(msgElement) {
        if (!msgElement) return;
        msgElement.textContent = "";
        msgElement.classList.remove("success", "error");
    }
    
    function setButtonLoading(button, isLoading) {
        if (!button) return;
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.textContent = "Cargando...";
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || button.textContent;
        }
    }
    
    // ============================================================
    // VALIDACIONES
    // ============================================================
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || "").trim());
    }
    
    function isValidPassword(password) {
        return String(password || "").length >= 6; // Mínimo 6 según backend
    }
    
    function normalizeCLPhone(raw) {
        const digits = String(raw || "").replace(/\D/g, "");
        
        if (digits.length === 11 && digits.startsWith("569")) return `+${digits}`;
        if (digits.length === 11 && digits.startsWith("56")) {
            const rest = digits.slice(2);
            if (rest.length === 9 && rest.startsWith("9")) return `+56${rest}`;
        }
        if (digits.length === 9 && digits.startsWith("9")) return `+56${digits}`;
        
        return null;
    }
    
    // ============================================================
    // REGISTRO - Conectado al Backend
    // ============================================================
    
    const registerForm = document.getElementById("registerForm");
    
    if (registerForm) {
        const registerMsg = document.getElementById("registerMsg");
        const nameInput = document.getElementById("registerName");
        const lastNameInput = document.getElementById("registerLastName");
        const phoneInput = document.getElementById("registerPhone");
        const addressInput = document.getElementById("registerAddress");
        const cityInput = document.getElementById("registerCity");
        const emailInput = document.getElementById("registerEmail");
        const passInput = document.getElementById("registerPassword");
        const pass2Input = document.getElementById("registerPassword2");
        const submitBtn = registerForm.querySelector("button[type='submit']");
        
        // Limpiar errores al escribir
        [nameInput, lastNameInput, phoneInput, addressInput, cityInput, emailInput, passInput, pass2Input].forEach((el) => {
            if (el) el.addEventListener("input", () => clearFieldError(el));
        });
        
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            clearFormMessage(registerMsg);
            
            // Obtener valores
            const name = (nameInput?.value || "").trim();
            const lastName = (lastNameInput?.value || "").trim();
            const phoneRaw = (phoneInput?.value || "").trim();
            const address = (addressInput?.value || "").trim();
            const city = (cityInput?.value || "").trim();
            const email = (emailInput?.value || "").trim().toLowerCase();
            const password = passInput?.value || "";
            const password2 = pass2Input?.value || "";
            
            // ============================================================
            // VALIDACIONES LOCALES
            // ============================================================
            
            let isValid = true;
            
            // Nombre
            if (!name) {
                isValid = false;
                setFieldError(nameInput, "El nombre es requerido");
            }
            
            // Apellido
            if (!lastName) {
                isValid = false;
                setFieldError(lastNameInput, "El apellido es requerido");
            }
            
            // Teléfono (opcional, pero si se ingresa, validar)
            const phoneNormalized = normalizeCLPhone(phoneRaw);
            if (phoneRaw && !phoneNormalized) {
                isValid = false;
                setFieldError(phoneInput, "Teléfono inválido. Ej: +56 9 1234 5678");
            }
            
            // Email
            if (!isValidEmail(email)) {
                isValid = false;
                setFieldError(emailInput, "Email inválido");
            }
            
            // Password
            if (!isValidPassword(password)) {
                isValid = false;
                setFieldError(passInput, "Mínimo 6 caracteres");
            }
            
            // Confirmar password
            if (password !== password2) {
                isValid = false;
                setFieldError(pass2Input, "Las contraseñas no coinciden");
            }
            
            if (!isValid) {
                showFormMessage(registerMsg, "Revisa los campos marcados en rojo", "error");
                return;
            }
            
            // ============================================================
            // ENVIAR AL BACKEND
            // ============================================================
            
            setButtonLoading(submitBtn, true);
            
            try {
                // Preparar datos para la API
                const userData = {
                    nombre: name,
                    apellido: lastName,
                    email: email,
                    contrasena: password,
                    telefono: phoneNormalized || null,
                    direccion: address || null,
                    ciudad: city || null
                };
                
                console.log("📤 Enviando registro:", { ...userData, contrasena: "***" });
                
                // Llamar a la API
                const response = await window.API.auth.register(userData);
                
                console.log("📥 Respuesta:", response);
                                      
                if (response.success) {
                    showFormMessage(registerMsg, "✅ ¡Cuenta creada! Redirigiendo...", "success");
                    registerForm.reset();
                    
                    // Limpiar errores visuales
                    registerForm.querySelectorAll(".field").forEach(field => {
                        field.classList.remove("is-invalid");
                    });
                    
                    // Redirigir después de 2 segundos
                    setTimeout(() => {
                        window.location.href = "../catalogo/";
                    }, 2000);
                }
 
                
            } catch (error) {
                console.error("❌ Error en registro:", error);
                
                // Manejar errores específicos
                const lowerMessage = error.message.toLowerCase();
                if (lowerMessage.includes("email ya está registrado")) {
                    setFieldError(emailInput, "Este email ya está registrado");
                } else if (lowerMessage.includes("contraseña")) {
                    setFieldError(passInput, error.message);
                } else {
                    showFormMessage(registerMsg, error.message || "Error de conexión", "error");
                }
                
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });
    }
    
    // ============================================================
    // LOGIN - Conectado al Backend
    // ============================================================
    
    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
        const loginMsg = document.getElementById("loginMsg");
        const emailInput = document.getElementById("loginEmail");
        const passInput = document.getElementById("loginPassword");
        const submitBtn = loginForm.querySelector("button[type='submit']");
        
        // Limpiar errores al escribir
        [emailInput, passInput].forEach((el) => {
            if (el) el.addEventListener("input", () => clearFieldError(el));
        });
        
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            clearFormMessage(loginMsg);
            
            const email = (emailInput?.value || "").trim().toLowerCase();
            const password = passInput?.value || "";
            
            // ============================================================
            // VALIDACIONES LOCALES
            // ============================================================
            
            let isValid = true;
            
            if (!isValidEmail(email)) {
                isValid = false;
                setFieldError(emailInput, "Email inválido");
            }
            
            if (!password) {
                isValid = false;
                setFieldError(passInput, "Ingresa tu contraseña");
            }
            
            if (!isValid) {
                showFormMessage(loginMsg, "Revisa los campos", "error");
                return;
            }
            
            // ============================================================
            // ENVIAR AL BACKEND
            // ============================================================
            
            setButtonLoading(submitBtn, true);
            
            try {
                console.log("📤 Enviando login:", { email, contrasena: "***" });
                
                const response = await window.API.auth.login(email, password);
                
                console.log("📥 Respuesta:", response);
                
                if (response.success) {
                    showFormMessage(loginMsg, `✅ ¡Bienvenido, ${response.data.nombre}!`, "success");
                    loginForm.reset();
                    
                    // Redirigir después de 1.5 segundos
                    setTimeout(() => {
                        window.location.href = "../catalogo/"; // O la página que prefieras
                    }, 1500);
                } else {
                    showFormMessage(loginMsg, response.message || "Credenciales inválidas", "error");
                }
                
            } catch (error) {
                console.error("❌ Error en login:", error);
                
                // Manejar errores específicos
                if (error.status === 401 || error.message.includes("Credenciales")) {
                    showFormMessage(loginMsg, "Email o contraseña incorrectos", "error");
                } else {
                    showFormMessage(loginMsg, error.message || "Error de conexión", "error");
                }
                
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });
    }
    
    // ============================================================
    // VERIFICAR SI YA HAY SESIÓN ACTIVA
    // ============================================================
    
    if (window.API?.auth?.isAuthenticated()) {
        const user = window.API.auth.getCurrentUser();
        console.log("👤 Usuario ya autenticado:", user?.nombre);
        
        // Opcional: mostrar mensaje o redirigir
        // window.location.href = "../catalogo/";
    }
    
});
 
 
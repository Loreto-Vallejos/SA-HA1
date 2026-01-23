/**
 * ============================================================
 * API SERVICE - Conexión Frontend ↔ Backend
 * ============================================================
 * 
 * Este archivo centraliza TODAS las llamadas al backend.
 * Así mantienes tu código organizado y fácil de mantener.
 * 
 * USO:
 *   import { authService, productoService } from './api.js';
 *   
 *   // Registrar usuario
 *   const response = await authService.register(userData);
 *   
 *   // Obtener productos
 *   const productos = await productoService.getAll();
 */

// ============================================================
// CONFIGURACIÓN BASE
// ============================================================

/**
 * URL base del backend
 * 
 * - LOCAL:      http://localhost:8080
 * - PRODUCCIÓN: https://tu-api.railway.app (cambiar después del deploy)
 */
const API_BASE_URL = "http://localhost:8080";

/**
 * Tiempo máximo de espera para las peticiones (en milisegundos)
 */
const TIMEOUT_MS = 10000; // 10 segundos

// ============================================================
// UTILIDADES
// ============================================================

/**
 * Obtiene el token JWT guardado en localStorage
 */
function getToken() {
    return localStorage.getItem("authToken");
}

/**
 * Guarda el token JWT en localStorage
 */
function saveToken(token) {
    localStorage.setItem("authToken", token);
}

/**
 * Elimina el token (logout)
 */
function removeToken() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
}

/**
 * Guarda los datos del usuario actual
 */
function saveCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}

/**
 * Obtiene los datos del usuario actual
 */
function getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

/**
 * Verifica si hay un usuario autenticado
 */
function isAuthenticated() {
    return !!getToken();
}

// ============================================================
// FUNCIÓN BASE PARA PETICIONES
// ============================================================

/**
 * Realiza una petición HTTP al backend
 * 
 * @param {string} endpoint - Ruta del endpoint (ej: "/auth/login")
 * @param {object} options - Opciones de la petición
 * @returns {Promise<object>} - Respuesta del servidor
 * 
 * @example
 * const data = await apiRequest("/api/productos", { method: "GET" });
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Headers por defecto
    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };
    
    // Agregar token si existe y no es una ruta pública
    const token = getToken();
    if (token && !endpoint.startsWith("/auth/")) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Configuración de la petición
    const config = {
        ...options,
        headers
    };
    
    // Si hay body, convertirlo a JSON
    if (options.body && typeof options.body === "object") {
        config.body = JSON.stringify(options.body);
    }
    
    try {
        // Crear timeout con AbortController
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
        
        const response = await fetch(url, {
            ...config,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Parsear respuesta JSON
        const data = await response.json();
        
        // Si la respuesta no es OK, lanzar error
        if (!response.ok) {
            const error = new Error(data.message || "Error en la petición");
            error.status = response.status;
            error.data = data;
            throw error;
        }
        
        return data;
        
    } catch (error) {
        // Error de timeout
        if (error.name === "AbortError") {
            throw new Error("La petición tardó demasiado. Verifica tu conexión.");
        }
        
        // Error de red (servidor no disponible)
        if (error.message === "Failed to fetch") {
            throw new Error("No se pudo conectar con el servidor. ¿Está el backend corriendo?");
        }
        
        // Re-lanzar otros errores
        throw error;
    }
}

// ============================================================
// SERVICIO DE AUTENTICACIÓN
// ============================================================

const authService = {
    /**
     * Registra un nuevo usuario
     * 
     * @param {object} userData - Datos del usuario
     * @param {string} userData.nombre - Nombre del usuario
     * @param {string} userData.apellido - Apellido del usuario
     * @param {string} userData.email - Email del usuario
     * @param {string} userData.contrasena - Contraseña
     * @param {string} [userData.telefono] - Teléfono (opcional)
     * @param {string} [userData.direccion] - Dirección (opcional)
     * @param {string} [userData.ciudad] - Ciudad (opcional)
     * 
     * @returns {Promise<object>} - Datos del usuario y token
     * 
     * @example
     * const result = await authService.register({
     *     nombre: "Juan",
     *     apellido: "Pérez",
     *     email: "juan@email.com",
     *     contrasena: "password123"
     * });
     */
    async register(userData) {
        const response = await apiRequest("/auth/register", {
            method: "POST",
            body: userData
        });
        
        // Si el registro fue exitoso, guardar token y datos
        if (response.success && response.data) {
            saveToken(response.data.token);
            saveCurrentUser({
                id: response.data.idCliente,
                nombre: response.data.nombre,
                apellido: response.data.apellido,
                email: response.data.email
            });
        }
        
        return response;
    },
    
    /**
     * Inicia sesión
     * 
     * @param {string} email - Email del usuario
     * @param {string} contrasena - Contraseña
     * 
     * @returns {Promise<object>} - Datos del usuario y token
     * 
     * @example
     * const result = await authService.login("juan@email.com", "password123");
     */
    async login(email, contrasena) {
        const response = await apiRequest("/auth/login", {
            method: "POST",
            body: { email, contrasena }
        });
        
        // Si el login fue exitoso, guardar token y datos
        if (response.success && response.data) {
            saveToken(response.data.token);
            saveCurrentUser({
                id: response.data.idCliente,
                nombre: response.data.nombre,
                apellido: response.data.apellido,
                email: response.data.email
            });
        }
        
        return response;
    },
    
    /**
     * Cierra sesión
     */
    logout() {
        removeToken();
        // Opcional: redirigir al login
        // window.location.href = "/pages/cuenta/";
    },
    
    /**
     * Verifica si el token actual es válido
     */
    async verifyToken() {
        try {
            const response = await apiRequest("/auth/verify", {
                method: "GET"
            });
            return response.success;
        } catch {
            return false;
        }
    },
    
    /**
     * Obtiene el usuario actual
     */
    getCurrentUser,
    
    /**
     * Verifica si hay sesión activa
     */
    isAuthenticated
};

// ============================================================
// SERVICIO DE PRODUCTOS
// ============================================================

const productoService = {
    /**
     * Obtiene todos los productos
     * 
     * @returns {Promise<Array>} - Lista de productos
     * 
     * @example
     * const productos = await productoService.getAll();
     */
    async getAll() {
        const response = await apiRequest("/api/productos", {
            method: "GET"
        });
        return response.data || [];
    },
    
    /**
     * Obtiene un producto por ID
     * 
     * @param {number} id - ID del producto
     * @returns {Promise<object>} - Datos del producto
     */
    async getById(id) {
        const response = await apiRequest(`/api/productos/${id}`, {
            method: "GET"
        });
        return response.data;
    },
    
    /**
     * Obtiene productos por categoría
     * 
     * @param {string} categoria - Nombre de la categoría
     * @returns {Promise<Array>} - Lista de productos
     */
    async getByCategory(categoria) {
        const response = await apiRequest(`/api/productos/categoria/${categoria}`, {
            method: "GET"
        });
        return response.data || [];
    },
    
    /**
     * Busca productos por nombre
     * 
     * @param {string} nombre - Texto a buscar
     * @returns {Promise<Array>} - Lista de productos
     */
    async search(nombre) {
        const response = await apiRequest(`/api/productos/buscar?nombre=${encodeURIComponent(nombre)}`, {
            method: "GET"
        });
        return response.data || [];
    },
    
    /**
     * Obtiene solo productos disponibles (stock > 0)
     * 
     * @returns {Promise<Array>} - Lista de productos disponibles
     */
    async getAvailable() {
        const response = await apiRequest("/api/productos/disponibles", {
            method: "GET"
        });
        return response.data || [];
    },
    
    /**
     * Crea un nuevo producto (requiere autenticación)
     * 
     * @param {object} productoData - Datos del producto
     * @returns {Promise<object>} - Producto creado
     */
    async create(productoData) {
        const response = await apiRequest("/api/productos", {
            method: "POST",
            body: productoData
        });
        return response.data;
    },
    
    /**
     * Actualiza un producto (requiere autenticación)
     * 
     * @param {number} id - ID del producto
     * @param {object} productoData - Datos a actualizar
     * @returns {Promise<object>} - Producto actualizado
     */
    async update(id, productoData) {
        const response = await apiRequest(`/api/productos/${id}`, {
            method: "PUT",
            body: productoData
        });
        return response.data;
    },
    
    /**
     * Elimina un producto (requiere autenticación)
     * 
     * @param {number} id - ID del producto
     */
    async delete(id) {
        await apiRequest(`/api/productos/${id}`, {
            method: "DELETE"
        });
    }
};

// ============================================================
// SERVICIO DE CLIENTES
// ============================================================

const clienteService = {
    /**
     * Obtiene todos los clientes (requiere autenticación)
     */
    async getAll() {
        const response = await apiRequest("/api/clientes", {
            method: "GET"
        });
        return response.data || [];
    },
    
    /**
     * Obtiene un cliente por ID
     */
    async getById(id) {
        const response = await apiRequest(`/api/clientes/${id}`, {
            method: "GET"
        });
        return response.data;
    },
    
    /**
     * Actualiza datos de un cliente
     */
    async update(id, clienteData) {
        const response = await apiRequest(`/api/clientes/${id}`, {
            method: "PUT",
            body: clienteData
        });
        return response.data;
    }
};

// ============================================================
// EXPORTAR SERVICIOS
// ============================================================

// Para uso con módulos ES6:
// export { authService, productoService, clienteService, API_BASE_URL };

// Para uso sin módulos (script tradicional):
window.API = {
    auth: authService,
    productos: productoService,
    clientes: clienteService,
    baseUrl: API_BASE_URL
};

// También exportar funciones de utilidad
window.API.utils = {
    getToken,
    saveToken,
    removeToken,
    getCurrentUser,
    isAuthenticated
};

console.log("✅ API Service cargado. Usa window.API para acceder a los servicios.");

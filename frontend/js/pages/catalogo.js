/**
 * ============================================================
 * CATALOGO.JS - Cargar productos desde el Backend
 * ============================================================
 * 
 * Este archivo maneja:
 * - Cargar lista de productos (GET /api/productos)
 * - Filtrar por categoría
 * - Buscar productos
 * - Renderizar cards de productos
 * 
 * REQUIERE: api.js cargado antes de este archivo
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ============================================================
    // ELEMENTOS DEL DOM
    // ============================================================
    
    const productosContainer = document.getElementById("productosContainer");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const errorMessage = document.getElementById("errorMessage");
    const filtroBotones = document.querySelectorAll(".categoria-item");
    const buscadorInput = document.getElementById("search-input");
    
    // ============================================================
    // ESTADO
    // ============================================================
    
    let todosLosProductos = [];
    
    // ============================================================
    // FUNCIONES DE UI
    // ============================================================
    
    function showLoading() {
        if (loadingSpinner) loadingSpinner.style.display = "block";
        if (errorMessage) errorMessage.style.display = "none";
    }
    
    function hideLoading() {
        if (loadingSpinner) loadingSpinner.style.display = "none";
    }
    
    function showError(message) {
        hideLoading();
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = "block";
        }
    }
    
    // ============================================================
    // RENDERIZAR PRODUCTOS
    // ============================================================
    
    /**
     * Crea el HTML de una card de producto
     */
    function crearCardProducto(producto) {
        // Determinar estado del stock
        let stockBadge = "";
        if (producto.stock === 0 || producto.estadoStock === "AGOTADO") {
            stockBadge = `<span class="badge bg-danger">Agotado</span>`;
        } else if (producto.stock <= 3 || producto.estadoStock === "POCAS_UNIDADES") {
            stockBadge = `<span class="badge bg-warning">¡Últimas unidades!</span>`;
        }
        
        // Badge de descuento
        let descuentoBadge = "";
        if (producto.descuento) {
            const badgeColor = producto.badgeColor || "sandia";
            descuentoBadge = `<span class="product-badge badge--${badgeColor}">${producto.descuento}</span>`;
        }
        
        // Precio anterior (si hay descuento)
        let precioAnteriorHTML = "";
        if (producto.precioAnterior) {
            precioAnteriorHTML = `<span class="price-old">$${formatearPrecio(producto.precioAnterior)}</span>`;
        }
        
        // Imagen (usar logo si no hay)
        console.log("Producto imagen:", producto.imagen); // Debug
        let imagenSrc;
        if (producto.imagen) {
            if (producto.imagen.startsWith('http')) {
                // URL absoluta, usar tal cual
                imagenSrc = producto.imagen;
            } else if (producto.imagen.includes('assets/')) {
                // Determinar la ruta correcta según la página
                const isHomePage = document.getElementById("catalogo-grid") !== null;
                if (isHomePage) {
                    // En home, usar ruta tal cual (assets/)
                    imagenSrc = producto.imagen;
                } else {
                    // En página de catálogo, convertir assets/ a ../../assets/
                    imagenSrc = producto.imagen.replace('assets/', '../../assets/');
                }
            } else {
                // Otra ruta, usar tal cual
                imagenSrc = producto.imagen;
            }
        } else {
            const isHomePage = document.getElementById("catalogo-grid") !== null;
            imagenSrc = isHomePage ? "assets/logo-eternia-blanco.png" : "../../assets/logo-eternia-blanco.png";
        }
        console.log("Imagen src final:", imagenSrc); // Debug
        
        // Determinar la ruta del logo fallback según la página
        const isHomePage = document.getElementById("catalogo-grid") !== null;
        const fallbackLogo = isHomePage ? "assets/logo-eternia-blanco.png" : "../../assets/logo-eternia-blanco.png";
        
        return `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div class="product-card" data-id="${producto.id || producto.idProducto}">
                    ${descuentoBadge}
                    
                    <div class="product-card__image">
                        <img src="${imagenSrc}" 
                             alt="${producto.nombre}" 
                             loading="lazy"
                               onerror="this.src='${fallbackLogo}'">
                        <button class="wishlist-btn-card" data-id="${producto.idProducto}" aria-label="Agregar a wishlist">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                    
                    <div class="product-card__body">
                        <span class="product-card__category">${producto.categoria || "Sin categoría"}</span>
                        <h3 class="product-card__title">${producto.nombre}</h3>
                        
                        <div class="product-card__price">
                            ${precioAnteriorHTML}
                            <span class="price-current">$${formatearPrecio(producto.precio)}</span>
                        </div>
                        
                        <div class="product-card__stock">
                            ${stockBadge}
                        </div>
                        
                        <div class="product-card__actions">
                            <button class="btn btn--primary btn-ver-detalle" 
                                    data-id="${producto.id || producto.idProducto}">
                                Ver detalle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Formatea un precio con separador de miles
     */
    function formatearPrecio(precio) {
        return Number(precio).toLocaleString("es-CL");
    }
    
    /**
     * Renderiza la lista de productos en el contenedor
     */
    function renderizarProductos(productos) {
        if (!productosContainer) return;
        
        if (productos.length === 0) {
            productosContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted">No se encontraron productos</p>
                </div>
            `;
            return;
        }
        
        productosContainer.innerHTML = productos.map(crearCardProducto).join("");
        
        // Agregar event listeners a los botones
        agregarEventListeners();
        
        // Sincronizar estado de wishlist buttons
        if (typeof syncWishlistButtons === "function") {
            syncWishlistButtons();
        }
    }
    
    /**
     * Agrega event listeners a los botones de las cards
     */
    function agregarEventListeners() {
        // Botones "Ver detalle"
        document.querySelectorAll(".btn-ver-detalle").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                // Determinar la ruta correcta: si existe catalogoGrid, estamos en home
                const isHomePage = document.getElementById("catalogo-grid") !== null;
                const rutaProducto = isHomePage ? 'pages/producto/index.html' : '../producto/index.html';
                // Redirigir a página de detalle
                window.location.href = `${rutaProducto}?id=${id}`;
            });
        });
        
        // Botones wishlist
        document.querySelectorAll(".wishlist-btn-card").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                const productId = btn.getAttribute("data-id");
                if (typeof toggleWishlist === "function") {
                    toggleWishlist(productId);
                }
            });
        });
    }
    
    // ============================================================
    // CARGAR PRODUCTOS DESDE LA API
    // ============================================================
    
    async function cargarProductos() {
        showLoading();
        
        try {
            console.log("📤 Cargando productos desde JSON local...");
            
            const res = await fetch("../../data/catalogo.json", { cache: "no-store" });
            if (!res.ok) throw new Error("Error cargando catálogo");
            
            const productos = await res.json();
            
            console.log(`📥 ${productos.length} productos cargados`);
            
            todosLosProductos = productos;
            renderizarProductos(productos);
            
        } catch (error) {
            console.error("❌ Error cargando productos desde JSON:", error);
            // Fallback: intentar API si es localhost
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                try {
                    const productos = await window.API.productos.getAll();
                    todosLosProductos = productos;
                    renderizarProductos(productos);
                } catch (apiError) {
                    console.error("❌ Error en fallback API:", apiError);
                    showError("Error al cargar productos");
                }
            } else {
                showError("Error al cargar productos");
            }
            
        } finally {
            hideLoading();
        }
    }
    
    // ============================================================
    // FILTROS Y BÚSQUEDA
    // ============================================================
    
    /**
     * Filtra productos por categoría
     */
    async function filtrarPorCategoria(categoria) {
        showLoading();
        
        try {
            const res = await fetch("../../data/catalogo.json", { cache: "no-store" });
            if (!res.ok) throw new Error("Error cargando catálogo");
            
            const todosProductos = await res.json();
            let productos;
            
            if (!categoria) {
                productos = todosProductos;
            } else {
                productos = todosProductos.filter(p => p.categoria === categoria);
            }
            
            todosLosProductos = productos;
            renderizarProductos(productos);
            
        } catch (error) {
            console.error("❌ Error filtrando:", error);
            // Fallback a API si es localhost
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                try {
                    let productos;
                    if (!categoria) {
                        productos = await window.API.productos.getAll();
                    } else {
                        productos = await window.API.productos.getByCategory(categoria);
                    }
                    todosLosProductos = productos;
                    renderizarProductos(productos);
                } catch (apiError) {
                    console.error("❌ Error en fallback API:", apiError);
                    showError("Error al filtrar productos");
                }
            } else {
                showError("Error al filtrar productos");
            }
            
        } finally {
            hideLoading();
        }
    }
    
    /**
     * Busca productos por nombre
     */
    async function buscarProductos(texto) {
        if (!texto || texto.trim().length < 2) {
            renderizarProductos(todosLosProductos);
            return;
        }
        
        showLoading();
        
        try {
            // Buscar localmente en todosLosProductos
            const textoLower = texto.trim().toLowerCase();
            const productos = todosLosProductos.filter(p => 
                p.nombre.toLowerCase().includes(textoLower) || 
                p.descripcion.toLowerCase().includes(textoLower) ||
                p.categoria.toLowerCase().includes(textoLower)
            );
            renderizarProductos(productos);
            
        } catch (error) {
            console.error("❌ Error buscando:", error);
            showError("Error al buscar productos");
            
        } finally {
            hideLoading();
        }
    }
    
    // ============================================================
    // CARRITO (básico)
    // ============================================================
    
    function agregarAlCarrito(productoId) {
        // Obtener carrito actual
        let carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
        
        // Buscar si ya existe
        const existe = carrito.find(item => item.id === productoId);
        
        if (existe) {
            existe.cantidad += 1;
        } else {
            const producto = todosLosProductos.find(p => (p.id || p.idProducto) == productoId);
            if (producto) {
                carrito.push({
                    id: productoId,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    imagen: producto.imagen,
                    cantidad: 1
                });
            }
        }
        
        localStorage.setItem("carrito", JSON.stringify(carrito));
        
        // Mostrar feedback
        mostrarToast("Producto agregado al carrito");
        
        // Actualizar contador del carrito en navbar
        actualizarContadorCarrito();
    }
    
    function actualizarContadorCarrito() {
        const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
        const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        
        const badge = document.querySelector(".cart-count");
        if (badge) {
            badge.textContent = total;
            badge.style.display = total > 0 ? "flex" : "none";
        }
    }
    
    function mostrarToast(mensaje) {
        // Crear toast si no existe
        let toast = document.getElementById("toastNotificacion");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toastNotificacion";
            toast.className = "toast-notification";
            document.body.appendChild(toast);
        }
        
        toast.textContent = mensaje;
        toast.classList.add("show");
        
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }
    
    // ============================================================
    // EVENT LISTENERS
    // ============================================================
    
    // Filtro por categoría (botones con círculos)
    if (filtroBotones.length > 0) {
        filtroBotones.forEach(btn => {
            btn.addEventListener("click", (e) => {
                // Remover active de todos
                filtroBotones.forEach(b => b.classList.remove("active"));
                // Agregar active al clickeado
                e.currentTarget.classList.add("active");
                
                const categoria = e.currentTarget.dataset.category;
                filtrarPorCategoria(categoria === "all" ? "" : categoria);
            });
        });
    }
    
    // Buscador (con debounce)
    let timeoutBusqueda;
    if (buscadorInput) {
        buscadorInput.addEventListener("input", (e) => {
            clearTimeout(timeoutBusqueda);
            timeoutBusqueda = setTimeout(() => {
                buscarProductos(e.target.value);
            }, 300);
        });
    }
    
    // ============================================================
    // CARGAR CATÁLOGO EN HOME (desde API)
    // ============================================================
    
    async function cargarCatalogoHomeDesdeAPI() {
        const catalogoGrid = document.getElementById("catalogo-grid");
        if (!catalogoGrid) return;
        
        try {
            console.log("📤 Cargando catálogo home desde JSON local...");
            
            // Determinar la ruta correcta según el entorno
            const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && !window.location.hostname.includes('vercel-preview');
            const rutaJSON = isProduction ? "data/catalogo.json" : "../../data/catalogo.json";
            
            console.log("🌐 Entorno detectado:", isProduction ? "producción" : "desarrollo");
            console.log("📂 Ruta JSON:", rutaJSON);
            
            const res = await fetch(rutaJSON, { cache: "no-store" });
            if (!res.ok) throw new Error(`Error cargando catálogo desde ${rutaJSON}`);
            
            const productos = await res.json();
            console.log(`📥 ${productos.length} productos cargados desde JSON`);
            console.log("Primer producto de ejemplo:", productos[0]);
            
            // Limitar a 4 productos
            const limit = parseInt(catalogoGrid.dataset.limit) || 4;
            const productosLimitados = productos.slice(0, limit);

            renderizarCatalogoHome(productosLimitados);
        } catch (error) {
            console.error("❌ Error cargando catálogo home desde JSON:", error);
            // Fallback: intentar cargar desde API si es local
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                try {
                    console.log("🔄 Intentando fallback con API local...");
                    const productos = await window.API.productos.getAll();
                    const limit = parseInt(catalogoGrid.dataset.limit) || 4;
                    const productosLimitados = productos.slice(0, limit);
                    renderizarCatalogoHome(productosLimitados);
                } catch (apiError) {
                    console.error("❌ Error en fallback API:", apiError);
                    // Mostrar mensaje de error en el grid
                    catalogoGrid.innerHTML = '<div class="alert alert-warning">Error cargando productos. Por favor, intenta recargar la página.</div>';
                }
            } else {
                // En producción, mostrar mensaje de error
                catalogoGrid.innerHTML = '<div class="alert alert-warning">Error cargando productos. Por favor, intenta recargar la página.</div>';
            }
        }
    }
    
    function renderizarCatalogoHome(productos) {
        const catalogoGrid = document.getElementById("catalogo-grid");
        if (!catalogoGrid) return;
        
        catalogoGrid.innerHTML = productos.map(crearCardProducto).join("");
        
        // Agregar event listeners a todos los botones
        agregarEventListeners();
        
        // Sincronizar estado de wishlist buttons
        if (typeof syncWishlistButtons === "function") {
            syncWishlistButtons();
        }
    }
    
    // ============================================================
    // INICIALIZACIÓN
    // ============================================================
    
    // Cargar productos al iniciar (página catálogo)
    if (productosContainer) {
        cargarProductos();
    }
    
    // Cargar catálogo en home si existe
    const catalogoGrid = document.getElementById("catalogo-grid");
    if (catalogoGrid) {
        cargarCatalogoHomeDesdeAPI();
    }

    // Actualizar contador del carrito
    actualizarContadorCarrito();
    
});

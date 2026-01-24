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
    const filtroCategoria = document.getElementById("filtroCategoria");
    const buscadorInput = document.getElementById("buscadorProductos");
    
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
        const imagenSrc = producto.imagen ? `/frontend/assets/${producto.imagen}` : "/frontend/assets/logo-eternia-blanco.png";
        console.log("Imagen src:", imagenSrc); // Debug
        
        return `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div class="product-card" data-id="${producto.idProducto}">
                    ${descuentoBadge}
                    
                    <div class="product-card__image">
                        <img src="${imagenSrc}" 
                             alt="${producto.nombre}" 
                             loading="lazy"
                             onerror="this.src='/frontend/assets/logo-eternia-blanco.png'">
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
                            <button class="btn btn--secondary btn-ver-detalle" 
                                    data-id="${producto.idProducto}">
                                Ver detalle
                            </button>
                            
                            <button class="btn btn--primary btn-agregar-carrito" 
                                    data-id="${producto.idProducto}"
                                    ${producto.stock === 0 ? "disabled" : ""}>
                                ${producto.stock === 0 ? "Agotado" : "Agregar"}
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
    }
    
    /**
     * Agrega event listeners a los botones de las cards
     */
    function agregarEventListeners() {
        // Botones "Ver detalle"
        document.querySelectorAll(".btn-ver-detalle").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                // Redirigir a página de detalle
                window.location.href = `./detalle.html?id=${id}`;
            });
        });
        
        // Botones "Agregar al carrito"
        document.querySelectorAll(".btn-agregar-carrito").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                agregarAlCarrito(id);
            });
        });
    }
    
    // ============================================================
    // CARGAR PRODUCTOS DESDE LA API
    // ============================================================
    
    async function cargarProductos() {
        showLoading();
        
        try {
            console.log("📤 Cargando productos...");
            
            const productos = await window.API.productos.getAll();
            
            console.log(`📥 ${productos.length} productos cargados`);
            
            todosLosProductos = productos;
            renderizarProductos(productos);
            
        } catch (error) {
            console.error("❌ Error cargando productos:", error);
            showError(error.message || "Error al cargar productos");
            
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
            let productos;
            
            if (!categoria || categoria === "todas") {
                productos = await window.API.productos.getAll();
            } else {
                productos = await window.API.productos.getByCategory(categoria);
            }
            
            todosLosProductos = productos;
            renderizarProductos(productos);
            
        } catch (error) {
            console.error("❌ Error filtrando:", error);
            showError(error.message);
            
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
            const productos = await window.API.productos.search(texto.trim());
            renderizarProductos(productos);
            
        } catch (error) {
            console.error("❌ Error buscando:", error);
            showError(error.message);
            
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
            const producto = todosLosProductos.find(p => p.idProducto == productoId);
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
    
    // Filtro por categoría
    if (filtroCategoria) {
        filtroCategoria.addEventListener("change", (e) => {
            filtrarPorCategoria(e.target.value);
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
    // INICIALIZACIÓN
    // ============================================================
    
    // Cargar productos al iniciar
    cargarProductos();
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
    
});

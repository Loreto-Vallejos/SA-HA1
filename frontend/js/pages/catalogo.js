/* =========================
   CATÁLOGO – FETCH + RENDER
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof initNavbarScrollColor === 'function') {
    initNavbarScrollColor();
  }

  const grid = document.getElementById("catalogo-grid");
  if (!grid) return;

  // ✅ Soporte para límite de productos (data-limit)
  const limit = parseInt(grid.dataset.limit) || 0;

  // Detectar si estamos en el home o en la página de catálogo
  const isHome = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/frontend/');
  const jsonPath = isHome ? "data/catalogo.json" : "../../data/catalogo.json";

  // Cargar productos dinámicamente
  fetch(jsonPath, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} al cargar catalogo.json`);
      return res.json();
    })
    .then((productos) => {
      if (!Array.isArray(productos)) throw new Error("catalogo.json debe ser un array []");

      // Aplicar el límite si existe
      let productosAMostrar = limit > 0 ? productos.slice(0, limit) : productos;

      grid.innerHTML = productosAMostrar.map(p => renderCard(p, isHome)).join("");

      // ✅ IMPORTANTE: después de renderizar
      if (typeof updateWishlistCount === 'function') updateWishlistCount();
      if (typeof syncWishlistButtons === 'function') syncWishlistButtons();
    })
    .catch((err) => {
      console.error(err);
      grid.innerHTML = `
        <div class="col-12">
          <p class="text-white" style="margin:0;">No se pudo cargar el catálogo. Revisa consola (F12).</p>
        </div>
      `;
    });
});

/* =========================
   HELPERS
   ========================= */
function formatCLP(numero) {
  return new Intl.NumberFormat("es-CL").format(Number(numero) || 0);
}

function escapeHTML(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function hasPrecioAnterior(val) {
  // Evita que "" se muestre como $0
  if (val === null || val === undefined) return false;
  if (typeof val === "string" && val.trim() === "") return false;
  const n = Number(val);
  return Number.isFinite(n) && n > 0;
}

/* =========================
   RENDER CARD
   ========================= */
function renderCard(p, isHome = false) {
  const id = escapeHTML(p.id);
  const nombre = escapeHTML(p.nombre);
  const descripcion = escapeHTML(p.descripcion);
  
  // Ajustar ruta de imagen según contexto
  let imagen = escapeHTML(p.imagen);
  if (isHome) {
    // Si estamos en home, convertir rutas relativas a assets/
    imagen = imagen.replace('../../assets/', 'assets/').replace('/frontend/assets/', 'assets/');
  }

  const descuento = escapeHTML(p.descuento ?? "");
  const badgeColor = escapeHTML(p.badgeColor ?? "sandia");

  const precio = formatCLP(p.precio);
  const precioAnterior = hasPrecioAnterior(p.precioAnterior) ? formatCLP(p.precioAnterior) : "";

  // Ajustar rutas según si estamos en home o catálogo
  const productoUrl = isHome ? `pages/producto/?id=${id}` : `../producto/?id=${id}`;
  const carritoUrl = isHome ? `pages/carrito/` : `../carrito/`;
  const shareIcon = isHome ? `assets/share.svg` : `../../assets/share.svg`;

  return `
    <div class="col-12 col-md-6 col-lg-3">
      <article>
        <div class="galeria-productos">
          <a href="${productoUrl}" class="card-link">
            <figure class="producto">
              <div class="contenedor-imagen">
                <img src="${imagen}" alt="${nombre}">
                ${descuento ? `<span class="info ${badgeColor}">${descuento}</span>` : ""}
                <button class="wishlist-btn-card" data-id="${id}" type="button" aria-label="Agregar a wishlist">
                  <i class="fa-regular fa-heart"></i>
                </button>
              </div>

              <figcaption>
                <h3>${nombre}</h3>
                <p class="descripcion">${descripcion}</p>
                <div class="precio-container">
                  ${precioAnterior ? `<p class="precio-anterior">$${precioAnterior}</p>` : ""}
                  <p class="precio">$${precio}</p>
                </div>
                <button class="add-to-cart" 
                  data-id="${id}" 
                  data-nombre="${nombre}" 
                  data-precio="${p.precio}" 
                  data-imagen="${imagen}"
                  type="button">
                  <i class="fa-solid fa-cart-shopping"></i>
                  Agregar
                </button>
              </figcaption>
            </figure>
          </a>
        </div>
      </article>
    </div>
  `;
}

/* =========================
   QUICK VIEW MODAL
   ========================= */
function attachQuickViewListeners() {
  const quickViewButtons = document.querySelectorAll('.quick-view-btn');
  
  quickViewButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const nombre = btn.dataset.nombre;
      const descripcion = btn.dataset.descripcion;
      const imagen = btn.dataset.imagen;
      const precio = btn.dataset.precio;
      const precioAnterior = btn.dataset.precioAnterior;
      
      showQuickView(id, nombre, descripcion, imagen, precio, precioAnterior);
    });
  });
}

function showQuickView(id, nombre, descripcion, imagen, precio, precioAnterior) {
  const modal = document.getElementById('quickViewModal');
  const modalBody = document.getElementById('quickViewModalBody');
  
  if (!modal || !modalBody) return;
  
  const precioAntHtml = precioAnterior && precioAnterior !== '' 
    ? `<span class="quick-view__precio-anterior">$${precioAnterior}</span>` 
    : '';
  
  modalBody.innerHTML = `
    <div class="quick-view__content">
      <div class="quick-view__image">
        <img src="${imagen}" alt="${nombre}">
      </div>
      <div class="quick-view__details">
        <h2 class="quick-view__title">${nombre}</h2>
        <p class="quick-view__description">${descripcion}</p>
        <div class="quick-view__price">
          <span class="quick-view__precio-actual">$${precio}</span>
          ${precioAntHtml}
        </div>
        <div class="quick-view__actions">
          <a href="./carrito.html" class="btn btn--accent" data-id="${id}">
            <i class="fa-solid fa-cart-shopping"></i> Agregar al carrito
          </a>
          <button class="btn btn--secondary wishlist-btn" type="button" data-id="${id}">
            <i class="fa-regular fa-heart"></i> Wishlist
          </button>
        </div>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Re-sync wishlist button
  syncWishlistButtons();
}

function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;
  
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal listeners
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('quickViewModal');
  const closeBtn = document.getElementById('closeQuickView');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeQuickView);
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeQuickView();
      }
    });
  }
  
  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickView();
    }
  });

  // Prevenir que el botón "Agregar al carro" navegue a la página de producto
  document.addEventListener('click', (e) => {
    const addToCartBtn = e.target.closest('.add-to-cart');
    if (addToCartBtn) {
      e.preventDefault();
      e.stopPropagation();
      
      // Obtener datos del producto desde los data attributes
      const productId = addToCartBtn.getAttribute('data-id');
      const nombre = addToCartBtn.getAttribute('data-nombre');
      const precio = parseInt(addToCartBtn.getAttribute('data-precio')) || 0;
      const imagen = addToCartBtn.getAttribute('data-imagen');
      
      // Obtener carrito actual de localStorage
      let carrito = [];
      try {
        carrito = JSON.parse(localStorage.getItem('carritoEternia')) || [];
      } catch (err) {
        carrito = [];
      }
      
      // Buscar si el producto ya está en el carrito
      const existeIndex = carrito.findIndex(item => String(item.id) === String(productId));
      
      if (existeIndex !== -1) {
        // Si ya existe, incrementar cantidad
        carrito[existeIndex].cantidad += 1;
      } else {
        // Si no existe, agregarlo
        carrito.push({
          id: productId,
          nombre: nombre,
          precio: precio,
          imagen: imagen,
          cantidad: 1
        });
      }
      
      // Guardar en localStorage
      localStorage.setItem('carritoEternia', JSON.stringify(carrito));
      
      // Actualizar badge del carrito en navbar
      updateCartBadge();
      
      // Mostrar feedback visual
      addToCartBtn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
      addToCartBtn.disabled = true;
      setTimeout(() => {
        addToCartBtn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Agregar';
        addToCartBtn.disabled = false;
      }, 2000);
    }

    // Manejar botón wishlist
    const wishlistBtn = e.target.closest('.wishlist-btn-card');
    if (wishlistBtn) {
      e.preventDefault();
      e.stopPropagation();
      
      const productId = wishlistBtn.getAttribute('data-id');
      
      // Usar la función toggleWishlist de wishlist.js
      if (typeof toggleWishlist === 'function') {
        toggleWishlist(productId);
        
        // Actualizar el ícono
        const icon = wishlistBtn.querySelector('i');
        if (isInWishlist(productId)) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid');
          wishlistBtn.classList.add('active');
        } else {
          icon.classList.remove('fa-solid');
          icon.classList.add('fa-regular');
          wishlistBtn.classList.remove('active');
        }
      }
    }
  });
});

/* =========================
   CART BADGE UPDATE
   ========================= */
function updateCartBadge() {
  let carrito = [];
  try {
    carrito = JSON.parse(localStorage.getItem('carritoEternia')) || [];
  } catch (err) {
    carrito = [];
  }
  
  // Calcular total de items
  const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  
  // Buscar el badge en el navbar (puede haber varios selectores)
  const badges = document.querySelectorAll('#cartCount, #cartBadge, .cart-badge, .badge-cart');
  badges.forEach(badge => {
    if (badge) {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  });
}

// Actualizar badge al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});

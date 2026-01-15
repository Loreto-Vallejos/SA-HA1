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

  // Si hay productos estáticos (home), inicializar quick view
  const staticProducts = grid.querySelectorAll('.quick-view-btn');
  if (staticProducts.length > 0) {
    attachQuickViewListeners();
    return;
  }

  // ✅ Si tu JSON está dentro de assets, usa: "./assets/catalogo.json"
  fetch("/frontend/data/catalogo.json", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} al cargar catalogo.json`);
      return res.json();
    })
    .then((productos) => {
      if (!Array.isArray(productos)) throw new Error("catalogo.json debe ser un array []");

      // Aplicar el límite si existe
      let productosAMostrar = limit > 0 ? productos.slice(0, limit) : productos;

      grid.innerHTML = productosAMostrar.map(renderCard).join("");

      // ✅ IMPORTANTE: después de renderizar
      updateWishlistCount();
      syncWishlistButtons();
      attachQuickViewListeners();
    })
    .catch((err) => {
      console.error(err);
      grid.innerHTML = `
        <div class="col-12">
          <p style="margin:0;">No se pudo cargar el catálogo. Revisa consola (F12).</p>
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
function renderCard(p) {
  const id = escapeHTML(p.id);
  const nombre = escapeHTML(p.nombre);
  const descripcion = escapeHTML(p.descripcion);
  const imagen = escapeHTML(p.imagen);

  const descuento = escapeHTML(p.descuento ?? "");
  const badgeColor = escapeHTML(p.badgeColor ?? "sandia");

  const precio = formatCLP(p.precio);
  const precioAnterior = hasPrecioAnterior(p.precioAnterior) ? formatCLP(p.precioAnterior) : "";

  return `
    <div class="col-12 col-md-6 col-lg-3">
      <article>
        <div class="galeria-productos">
          <figure class="producto">
            <div class="contenedor-imagen">
              <img src="${imagen}" alt="${nombre}">
              ${descuento ? `<span class="info ${badgeColor}">${descuento}</span>` : ""}
            </div>

            <figcaption>
              <h3>${nombre}</h3>
              <p>${descripcion}</p>
              <p class="precio">
                $${precio}
                ${precioAnterior ? ` <span>$${precioAnterior}</span>` : ""}
              </p>
            </figcaption>

            <div class="overlay">
              <a href="./carrito.html" class="add-to-cart" data-id="${id}">Add to cart</a>

              <ul class="acciones">
                <li>
                  <a href="#" aria-label="Compartir">
                    <img src="../../assets/share.svg" alt="Compartir">
                  </a>
                </li>
                <li>
                  <button class="quick-view-btn" type="button" data-id="${id}" data-nombre="${nombre}" data-descripcion="${descripcion}" data-imagen="${imagen}" data-precio="${precio}" data-precio-anterior="${precioAnterior}" aria-label="Vista rápida">
                    <i class="fa-regular fa-eye"></i>
                  </button>
                </li>
                <li>
                  <button class="wishlist-btn" type="button" data-id="${id}" aria-label="Wishlist">
                    <i class="fa-regular fa-heart"></i>
                  </button>
                </li>
              </ul>
            </div>
          </figure>
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
});


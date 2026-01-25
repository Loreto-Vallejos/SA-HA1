
console.log("✅ wishlist.js (Core) cargado");

const WISHLIST_KEY = "wishlist";

/* =========================
   CORE LOGIC
   ========================= */

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
}

function setWishlist(list) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}

function isInWishlist(id) {
  return getWishlist().includes(String(id));
}

function toggleWishlist(id) {
  id = String(id);
  const list = getWishlist();
  const index = list.indexOf(id);

  if (index === -1) {
    list.push(id);
  } else {
    list.splice(index, 1);
  }

  setWishlist(list);
  updateWishlistCount();
  syncWishlistButtons();

  // Si estamos en la página de wishlist y quitamos algo, refrescamos para ocultar la card
  if (document.getElementById("wishlist-grid") && index !== -1) {
    renderWishlist();
  }
}

/* =========================
   UI UPDATES
   ========================= */

function updateWishlistCount() {
  const countEls = document.querySelectorAll("#wishlistCount");
  const n = getWishlist().length;

  countEls.forEach(el => {
    el.textContent = n;
    el.style.display = n > 0 ? "inline-block" : "none";
  });
}

function syncWishlistButtons() {
  document.querySelectorAll(".wishlist-btn, .wishlist-btn-card").forEach(btn => {
    const id = btn.dataset.id;
    const icon = btn.querySelector("i");
    const active = isInWishlist(id);

    btn.classList.toggle("is-active", active);

    if (icon) {
      icon.classList.toggle("fa-solid", active);
      icon.classList.toggle("fa-regular", !active);
    }
  });
}

/* =========================
   RENDERING (Premium Style)
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
  if (val === null || val === undefined) return false;
  if (typeof val === "string" && val.trim() === "") return false;
  const n = Number(val);
  return Number.isFinite(n) && n > 0;
}

function renderWishlistCard(p) {
  const id = escapeHTML(p.id);
  const nombre = escapeHTML(p.nombre);
  const descripcion = escapeHTML(p.descripcion);
  const imagenRaw = p.imagen;
  const imagen = escapeHTML(imagenRaw.startsWith("../../assets/") ? imagenRaw.replace("../../assets/", "/frontend/assets/") : imagenRaw);

  const descuento = escapeHTML(p.descuento ?? "");
  const badgeColor = escapeHTML(p.badgeColor ?? "sandia");

  const precio = formatCLP(p.precio);
  const precioAnterior = hasPrecioAnterior(p.precioAnterior) ? formatCLP(p.precioAnterior) : "";

  // Badge de descuento
  let descuentoBadge = "";
  if (descuento) {
    descuentoBadge = `<span class="product-badge ${badgeColor}">${descuento}</span>`;
  }

  // Precio anterior (si hay descuento)
  let precioAnteriorHTML = "";
  if (precioAnterior) {
    precioAnteriorHTML = `<span class="price-old">$${precioAnterior}</span>`;
  }

  return `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
      <div class="product-card" data-id="${id}">
        ${descuentoBadge}

        <div class="product-card__image">
          <img src="${imagen}"
               alt="${nombre}"
               loading="lazy"
               onerror="this.src='../../assets/logo-eternia-blanco.png'">
          <button class="wishlist-btn-card" data-id="${id}" aria-label="Quitar de wishlist">
            <i class="fas fa-heart"></i>
          </button>
        </div>

        <div class="product-card__body">
          <span class="product-card__category">${escapeHTML(p.categoria || "Sin categoría")}</span>
          <h3 class="product-card__title">${nombre}</h3>

          <div class="product-card__price">
            ${precioAnteriorHTML}
            <span class="price-current">$${precio}</span>
          </div>

          <div class="product-card__stock">
            <!-- Stock info could be added here if available -->
          </div>

          <div class="product-card__actions">
            <button class="btn btn--primary btn-ver-detalle"
                    data-id="${id}">
              Ver detalle
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function renderWishlist() {
  const grid = document.getElementById("wishlist-grid");
  const empty = document.getElementById("wishlist-empty");
  if (!grid) return;

  const ids = getWishlist().map(String);

  if (ids.length === 0) {
    if (empty) empty.style.display = "block";
    grid.innerHTML = "";
    return;
  }

  if (empty) empty.style.display = "none";

  try {
    // Cargar desde JSON local para compatibilidad con GitHub Pages
    const res = await fetch("../../data/catalogo.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Error cargando catálogo");

    const productos = await res.json();
    const favs = productos.filter(p => ids.includes(String(p.id)));

    grid.innerHTML = favs.map(renderWishlistCard).join("");
    syncWishlistButtons();
  } catch (err) {
    console.error(err);
    grid.innerHTML = "<p>Error al cargar favoritos.</p>";
  }
}


/* =========================
   MODAL - LOGIC
   ========================= */

const productModal = document.getElementById("productModal");
const closeModalBtn = document.getElementById("closeModal");
const modalBody = document.getElementById("modalBody");

function openModal(productId) {
  if (!productModal || !modalBody) return;

  fetch("/frontend/data/catalogo.json")
    .then(res => res.json())
    .then(productos => {
      const p = productos.find(item => String(item.id) === String(productId));
      if (!p) return;

      const precio = formatCLP(p.precio);
      const precioAnterior = hasPrecioAnterior(p.precioAnterior) ? formatCLP(p.precioAnterior) : "";
      const d = p.detalles || {};

      // Ajustar imagen path
      const imagenSrc = p.imagen.startsWith("../../assets/") ? p.imagen.replace("../../assets/", "/frontend/assets/") : p.imagen;

      modalBody.innerHTML = `
        <div class="product-modal__grid">
          <div class="product-modal__image">
            <img src="${imagenSrc}" alt="${p.nombre}">
          </div>
          <div class="product-modal__info">
            <h2 class="product-modal__title">${p.nombre}</h2>
            <p class="product-modal__price">
              $${precio}
              ${precioAnterior ? `<span>$${precioAnterior}</span>` : ""}
            </p>
            <p class="product-modal__description">${p.descripcion}</p>
            
            <div class="product-modal__specs">
              <div class="spec-item">
                <span>Material</span>
                <span>${d.material || "Madera Premium"}</span>
              </div>
              <div class="spec-item">
                <span>Medidas</span>
                <span>${d.medidas || "Estándar"}</span>
              </div>
              <div class="spec-item">
                <span>Peso</span>
                <span>${d.peso || "S/N"}</span>
              </div>
              <div class="spec-item">
                <span>Garantía</span>
                <span>${d.garantia || "Vitalicia"}</span>
              </div>
            </div>

            <div class="product-modal__actions">
              <button class="product-modal__btn btn-buy ver-mas" data-id="${p.id}">
                Ver más
              </button>
            </div>
          </div>
        </div>
      `;

      productModal.classList.add("is-active");
      document.body.style.overflow = "hidden"; // Bloquear scroll
    })
    .catch(err => console.error("Error al cargar detalles:", err));
}

function closeModal() {
  if (!productModal) return;
  productModal.classList.remove("is-active");
  document.body.style.overflow = ""; // Liberar scroll
}

/* =========================
   INITIALIZATION
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  updateWishlistCount();
  syncWishlistButtons();
  renderWishlist();

  // Cerrar modal al clickear X o fuera
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (productModal) {
    productModal.addEventListener("click", (e) => {
      if (e.target === productModal) closeModal();
    });
  }
});

document.addEventListener("click", (e) => {
  // Manejo de Wishlist
  const wishBtn = e.target.closest(".wishlist-btn, .wishlist-btn-card");
  if (wishBtn) {
    e.preventDefault();
    toggleWishlist(wishBtn.dataset.id);
    return;
  }

  // Manejo de Ver detalle
  const detalleBtn = e.target.closest(".btn-ver-detalle");
  if (detalleBtn) {
    e.preventDefault();
    const id = detalleBtn.dataset.id;
    // Determinar la ruta correcta: si existe catalogo-grid, estamos en home
    const isHomePage = document.getElementById("catalogo-grid") !== null;
    const rutaProducto = isHomePage ? 'pages/producto/index.html' : '../producto/index.html';
    // Redirigir a página de detalle
    window.location.href = `${rutaProducto}?id=${id}`;
    return;
  }

  // Manejo de Ver más en modal
  const verMasBtn = e.target.closest(".ver-mas");
  if (verMasBtn) {
    e.preventDefault();
    const id = verMasBtn.dataset.id;
    // Determinar la ruta correcta
    const isHomePage = document.getElementById("catalogo-grid") !== null;
    const rutaProducto = isHomePage ? 'pages/producto/index.html' : '../producto/index.html';
    // Redirigir a página de detalle
    window.location.href = `${rutaProducto}?id=${id}`;
    closeModal(); // Cerrar modal antes de redirigir
    return;
  }

  // Manejo de Modal de Producto (click en imagen)
  const productImg = e.target.closest(".product-card__image img");
  if (productImg) {
    const container = productImg.closest(".product-card");
    const idBtn = container?.querySelector("[data-id]");
    if (idBtn) {
      openModal(idBtn.dataset.id);
    }
  }
});

window.addEventListener("storage", () => {
  updateWishlistCount();
  syncWishlistButtons();
  if (document.getElementById("wishlist-grid")) renderWishlist();
});

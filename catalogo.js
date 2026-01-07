/* =========================
   WISHLIST – LOCALSTORAGE
   ========================= */

console.log("wishlist.js cargado OK");


const WISHLIST_KEY = "wishlist";

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

  if (index === -1) list.push(id);
  else list.splice(index, 1);

  setWishlist(list);
  updateWishlistCount();
  syncWishlistButtons();
}

function updateWishlistCount() {
  const countEl = document.getElementById("wishlistCount");
  if (!countEl) return;

  const n = getWishlist().length;
  countEl.textContent = n;
  countEl.style.display = n > 0 ? "inline-block" : "none";
}

function syncWishlistButtons() {
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    const id = btn.dataset.id;
    const active = isInWishlist(id);

    btn.classList.toggle("is-active", active);

    const icon = btn.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-solid", active);
      icon.classList.toggle("fa-regular", !active);
    }
  });
}

/* Click en corazón (delegación, 1 solo listener) */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".wishlist-btn");
  if (!btn) return;

  e.preventDefault();
  toggleWishlist(btn.dataset.id);
});

/* Sync entre pestañas */
window.addEventListener("storage", () => {
  updateWishlistCount();
  syncWishlistButtons();
});

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

  // ✅ Si tu JSON está dentro de assets, usa: "./assets/catalogo.json"
  fetch("./catalogo.json", { cache: "no-store" })
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
                    <img src="assets/share.svg" alt="Compartir">
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="Comparar">
                    <img src="assets/compare.svg" alt="Comparar">
                  </a>
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



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
  document.querySelectorAll(".wishlist-btn").forEach(btn => {
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
                    <i class="fa-solid fa-heart"></i>
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

async function renderWishlist() {
  const grid = document.getElementById("wishlist-grid");
  const empty = document.getElementById("wishlistEmpty");
  if (!grid) return;

  const ids = getWishlist().map(String);

  if (ids.length === 0) {
    if (empty) empty.style.display = "block";
    grid.innerHTML = "";
    return;
  }

  if (empty) empty.style.display = "none";

  try {
    const res = await fetch("./catalogo.json", { cache: "no-store" });
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
   INITIALIZATION
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  updateWishlistCount();
  syncWishlistButtons();
  renderWishlist();
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".wishlist-btn");
  if (!btn) return;
  e.preventDefault();
  toggleWishlist(btn.dataset.id);
});

window.addEventListener("storage", () => {
  updateWishlistCount();
  syncWishlistButtons();
  if (document.getElementById("wishlist-grid")) renderWishlist();
});

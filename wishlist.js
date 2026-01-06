
console.log("✅ wishlist.js cargado");

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

function removeFromWishlist(id) {
  id = String(id);
  const list = getWishlist().filter(x => x !== id);
  setWishlist(list);
}

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

function renderCard(p) {
  const id = escapeHTML(p.id);
  const nombre = escapeHTML(p.nombre);
  const descripcion = escapeHTML(p.descripcion);
  const imagen = escapeHTML(p.imagen);

  const precio = formatCLP(p.precio);
  const precioAnterior = hasPrecioAnterior(p.precioAnterior) ? formatCLP(p.precioAnterior) : "";

  return `
    <div class="col-12 col-md-6 col-lg-3">
      <article class="card h-100">
        <img src="${imagen}" class="card-img-top" alt="${nombre}">
        <div class="card-body">
          <h5 class="card-title">${nombre}</h5>
          <p class="card-text">${descripcion}</p>
          <p class="precio">$${precio}${precioAnterior ? ` <span>$${precioAnterior}</span>` : ""}</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-outline-danger w-100 js-remove" data-id="${id}">Quitar</button>
        </div>
      </article>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("wishlist.js cargado OK");

  const grid = document.getElementById("wishlist-grid");
  const empty = document.getElementById("wishlistEmpty");

  if (!grid) {
    console.error("No existe #wishlist-grid en wishlist.html");
    return;
  }

  const ids = getWishlist().map(String);

  if (ids.length === 0) {
    if (empty) empty.style.display = "block";
    grid.innerHTML = "";
    return;
  }

  try {
    const res = await fetch("./catalogo.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} cargando catalogo.json`);

    const productos = await res.json();
    const productosWishlist = productos.filter(p => ids.includes(String(p.id)));

    if (productosWishlist.length === 0) {
      if (empty) empty.style.display = "block";
      grid.innerHTML = "";
      return;
    }

    grid.innerHTML = productosWishlist.map(renderCard).join("");
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<div class="col-12"><p>No se pudo cargar tu wishlist.</p></div>`;
  }
});

document.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".js-remove");
  if (!removeBtn) return;

  removeFromWishlist(removeBtn.dataset.id);
  location.reload();
});


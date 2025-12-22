document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("catalogo-grid");
  if (!grid) return;

  fetch("catalogo.json", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} al cargar catalogo.json`);
      return res.json();
    })
    .then((productos) => {
      if (!Array.isArray(productos)) throw new Error("catalogo.json debe ser un array []");
      grid.innerHTML = productos.map(renderCard).join("");
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

function renderCard(p) {
  const nombre = escapeHTML(p.nombre);
  const descripcion = escapeHTML(p.descripcion);
  const imagen = escapeHTML(p.imagen);

  const descuento = escapeHTML(p.descuento ?? "");
  const badgeColor = escapeHTML(p.badgeColor ?? "sandia");
  const precio = formatCLP(p.precio);
  const precioAnterior = p.precioAnterior != null ? formatCLP(p.precioAnterior) : "";

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
              <p class="precio">$${precio}${precioAnterior ? ` <span>$${precioAnterior}</span>` : ""}</p>
            </figcaption>

            <div class="overlay">
              <a href="./carrito.html" class="add-to-cart" data-id="${escapeHTML(p.id)}">Add to cart</a>
              <ul class="acciones">
                <li><a href="#" aria-label="Compartir"><img src="assets/share.svg" alt="Compartir"></a></li>
                <li><a href="#" aria-label="Comparar"><img src="assets/compare.svg" alt="Comparar"></a></li>
                <li><a href="#" aria-label="Me gusta"><img src="assets/like.svg" alt="Me gusta"></a></li>
              </ul>
            </div>
          </figure>
        </div>
      </article>
    </div>
  `;
}

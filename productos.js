/**
 * PRODUCTOS.JS - Lógica para la página de detalle productos.html (Versión Premium)
 */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (document.body) {
    document.body.classList.add('page-product');
  }

  if (!productId) {
    window.location.href = "catalogo.html";
    return;
  }

  // ✅ Cargar desde JSON Local (Versión estática)
  fetch("catalogo.json")
    .then(res => res.json())
    .then(productos => {
      // El JSON local ya tiene la estructura correcta, no es necesario mapear


      const p = productos.find(item => String(item.id) === String(productId));
      if (!p) {
        window.location.href = "catalogo.html";
        return;
      }
      renderProductDetail(p);
      renderRelatedProducts(productos, p);
    })
    .catch(err => {
      console.error("Error al cargar producto:", err);
      document.getElementById("productDetailContent").innerHTML = `
        <div class="alert alert-danger text-center">
          Ocurrió un error al cargar el producto. Por favor intenta más tarde.
        </div>
      `;
    });
});

function renderProductDetail(p) {
  const container = document.getElementById("productDetailContent");
  const precio = formatCLP(p.precio);

  // Galería con Layout Vertical
  const galeriaHtml = p.galeria ? p.galeria.map((img, i) => `
    <div class="thumb-item ${i === 0 ? 'active' : ''}" data-full="${img}" onclick="updateMainImage('${img}', this)">
      <img src="${img}" alt="${p.nombre} - vista ${i + 1}">
    </div>
  `).join("") : `<div class="thumb-item active" data-full="${p.imagen}"><img src="${p.imagen}" alt="${p.nombre}"></div>`;

  // Opciones
  const opcionesHtml = p.opciones ? p.opciones.map(opt => `
    <div class="product-option mb-4">
      <label class="form-label">${opt.nombre}</label>
      <select class="product-option-select">
        ${opt.valores.map(val => `<option value="${val}">${val}</option>`).join("")}
      </select>
    </div>
  `).join("") : "";

  // Bloque de Botones y Reserva (Reutilizable para Responsive)
  const servicios = p.servicios || {};
  const buttonsBlock = `
    <!-- Botones de Acción -->
    <div class="d-grid gap-3 d-md-flex align-items-center mb-4 mt-4 action-buttons-container">
      <div class="quantity-wrapper me-md-2" style="max-width: 100px;">
        <input type="number" class="form-control bg-transparent text-white border-secondary text-center quantity-input" value="1" min="1" style="padding: 0.8rem;">
      </div>
      <button class="btn btn--primary btn-lg flex-grow-1 add-to-cart-btn shadow-lg w-100" data-id="${p.id}" data-nombre="${p.nombre}" data-precio="${p.precio}" data-imagen="${p.imagen}">
        AÑADIR AL CARRITO
      </button>
      <button class="btn btn-outline-light btn-lg wishlist-btn" data-id="${p.id}" title="Añadir a favoritos" style="padding: 0.8rem 1.2rem;">
        <i class="fa-regular fa-heart"></i>
      </button>
    </div>

    ${servicios.reserva ? `
      <div class="d-flex align-items-start gap-3 p-3 rounded-3 bg-opacity-10 bg-info border border-info border-opacity-25 text-info mb-4">
         <i class="fa-solid fa-calendar-check mt-1"></i>
         <div>
            <strong>Opción de Reserva Disponible</strong> <br>
            <span class="small opacity-75">${servicios.reserva}</span>
         </div>
      </div>
    ` : ''}
  `;

  const specs = p.especificaciones_tecnicas || {};

  container.innerHTML = `
    <!-- MAIN PRODUCT SECTION -->
    <div class="row g-5 align-items-start">
      <!-- Columna Izquierda: Galería + Botones (Desktop) -->
      <div class="col-12 col-lg-7">
        <div class="product-gallery">
          <div class="thumbnails-container">
            <div class="thumbnails-grid">
              ${galeriaHtml}
            </div>
          </div>
          <div class="main-image-container ms-lg-3">
             <img src="${p.imagen}" id="mainProductImg" class="img-fluid" alt="${p.nombre}">
          </div>
        </div>

        <!-- Botones Desktop (Visible solo en LG+) -->
        <div class="d-none d-lg-block pt-3">
           ${buttonsBlock}
        </div>
      </div>

      <!-- Columna Derecha: Info + Botones (Mobile) -->
      <div class="col-12 col-lg-5">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-3">
            <li class="breadcrumb-item"><a href="index.html" class="text-white-50">Inicio</a></li>
            <li class="breadcrumb-item"><a href="catalogo.html" class="text-white-50">Catálogo</a></li>
            <li class="breadcrumb-item active text-white" aria-current="page">${p.nombre}</li>
          </ol>
        </nav>

        <h1 class="product-title">${p.nombre}</h1>
        
        <div class="d-flex align-items-center gap-3 mb-4">
          <span class="product-price">$${precio}</span>
          ${p.descuento ? `<span class="badge bg-danger rounded-pill px-3 py-2">${p.descuento}</span>` : ""}
        </div>

        <p class="product-short-desc lead text-white-50 mb-4" style="font-size: 1.1rem;">
          ${p.descripcion}
        </p>

        <hr class="border-secondary border-opacity-25 my-4">

        <div class="product-customization mb-4">
          ${opcionesHtml}
        </div>

        <!-- Botones Mobile (Visible solo en < LG) -->
        <div class="d-lg-none">
           ${buttonsBlock}
        </div>
        
      </div>
    </div>

    <!-- FULL WIDTH DETAILS SECTION -->
    <div class="row mt-5 pt-lg-5">
      <div class="col-12 col-lg-10 mx-auto">
        <h3 class="mb-4 text-center border-bottom border-secondary border-opacity-25 pb-3">Detalles y Especificaciones</h3>
        
        <div class="accordion eternia-accordion" id="productAccordion">
          
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDesc" aria-expanded="true">
                DESCRIPCIÓN DEL MODELO
              </button>
            </h2>
            <div id="collapseDesc" class="accordion-collapse collapse show" data-bs-parent="#productAccordion">
              <div class="accordion-body">
                <div class="row">
                   <div class="col-md-8">
                      <p>Diseñado para ${p.nombre === 'Villano Otaku' ? 'quienes vivieron con pasión hasta el final' : 'honrar la memoria de forma única'}. Este ataúd combina artesanía tradicional con estética moderna.</p>
                      <ul class="text-white-50">
                        <li>Construcción robusta y certificada.</li>
                        <li>Acabados a mano por artesanos expertos.</li>
                        <li>Diseño exclusivo de la colección Eternia 2025.</li>
                      </ul>
                   </div>
                   <div class="col-md-4">
                      <div class="p-3 bg-white bg-opacity-10 rounded">
                        <p class="mb-1 text-gold text-uppercase small ls-1">Material Base</p>
                        <p class="text-white mb-3">${p.detalles.material}</p>
                        <p class="mb-1 text-gold text-uppercase small ls-1">Interior</p>
                        <p class="text-white mb-0">${p.detalles.interior}</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          ${specs.acabado ? `
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSpecs">
                ESPECIFICACIONES TÉCNICAS
              </button>
            </h2>
            <div id="collapseSpecs" class="accordion-collapse collapse" data-bs-parent="#productAccordion">
              <div class="accordion-body">
                <div class="row">
                  ${Object.entries(specs).map(([k, v]) => `
                    <div class="col-6 col-md-3 mb-4">
                       <span class="d-block text-gold small text-uppercase mb-1">${k.replace('_', ' ')}</span>
                       <span class="text-white">${v}</span>
                    </div>
                  `).join('')}
                   <div class="col-6 col-md-3 mb-4">
                       <span class="d-block text-gold small text-uppercase mb-1">Carga Máxima</span>
                       <span class="text-white">${p.detalles.peso}</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
          ` : ''}

          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseShip">
                ENVÍO Y SERVICIOS
              </button>
            </h2>
            <div id="collapseShip" class="accordion-collapse collapse" data-bs-parent="#productAccordion">
              <div class="accordion-body">
                 <div class="row g-4">
                    <div class="col-md-4">
                        <div class="d-flex gap-3">
                           <i class="fa-solid fa-truck-fast text-gold fs-3"></i>
                           <div>
                              <h5 class="fs-6 text-white text-uppercase">Envío</h5>
                              <p class="text-white-50 small mb-0">${servicios.envio || "Consultar cobertura."}</p>
                           </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="d-flex gap-3">
                           <i class="fa-solid fa-shield-halved text-gold fs-3"></i>
                           <div>
                              <h5 class="fs-6 text-white text-uppercase">Garantía</h5>
                              <p class="text-white-50 small mb-0">${p.detalles.garantia}</p>
                           </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="d-flex gap-3">
                           <i class="fa-solid fa-rotate-left text-gold fs-3"></i>
                           <div>
                              <h5 class="fs-6 text-white text-uppercase">Devoluciones</h5>
                              <p class="text-white-50 small mb-0">${servicios.devolucion || "Estándar."}</p>
                           </div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  // Inicializar lógica de carrito y galería
  initCartLogic();

  if (typeof syncWishlistButtons === 'function') syncWishlistButtons();
}

function initCartLogic() {
  const btns = document.querySelectorAll('.add-to-cart-btn');

  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const id = btn.dataset.id;
      const nombre = btn.dataset.nombre;
      const precio = btn.dataset.precio;
      const imagen = btn.dataset.imagen;

      // Buscar el input de cantidad dentro del mismo contenedor
      const container = btn.closest('.action-buttons-container');
      const qtyInput = container ? container.querySelector('.quantity-input') : null;
      const cantidad = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

      addToCartGlobal(id, nombre, precio, imagen, cantidad);
    });
  });
}

function addToCartGlobal(id, nombre, precio, imagen, cantidad) {
  // Simulación de lógica de carrito global (adaptar según implementación real)
  let carrito = JSON.parse(localStorage.getItem('carritoEternia')) || [];

  const existing = carrito.find(p => String(p.id) === String(id));
  if (existing) {
    existing.cantidad += cantidad;
  } else {
    carrito.push({ id, nombre, precio, imagen, cantidad });
  }

  localStorage.setItem('carritoEternia', JSON.stringify(carrito));

  // Feedback visual
  alert(`Se añadieron ${cantidad} unidad(es) de "${nombre}" al carrito.`);

  // Si existe función global para actualizar contador UI, llamarla
  // if (typeof updateCartCount === 'function') updateCartCount();
}


function updateMainImage(src, thumbEl) {
  const mainImg = document.getElementById("mainProductImg");
  document.querySelectorAll(".thumb-item").forEach(t => t.classList.remove("active"));
  thumbEl.classList.add("active");

  mainImg.style.opacity = 0;
  setTimeout(() => {
    mainImg.src = src;
    mainImg.style.opacity = 1;
  }, 200);
}

function renderRelatedProducts(all, current) {
  const grid = document.getElementById("relatedGrid");
  const related = all.filter(item => String(item.id) !== String(current.id)).slice(0, 4);

  grid.innerHTML = related.map(p => {
    const id = escapeHTML(p.id);
    const nombre = escapeHTML(p.nombre);
    const imagen = escapeHTML(p.imagen);
    const precio = formatCLP(p.precio);

    return `
      <div class="col-12 col-md-6 col-lg-3">
        <article class="producto-card-mini">
          <div class="contenedor-imagen">
            <img src="${imagen}" alt="${nombre}" onclick="window.location.href='productos.html?id=${id}'" style="cursor:pointer">
            <div class="overlay-mini">
               <button class="wishlist-btn-small wishlist-btn" data-id="${id}"><i class="fa-regular fa-heart"></i></button>
            </div>
          </div>
          <div class="info-mini mt-3 text-center">
            <h3 class="fs-6 text-white">${nombre}</h3>
            <p class="precio-mini text-gold">$${precio}</p>
          </div>
        </article>
      </div>
    `;
  }).join("");

  if (typeof syncWishlistButtons === 'function') syncWishlistButtons();
}

// Helpers
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

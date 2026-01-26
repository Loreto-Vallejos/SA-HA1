console.log("✅ productos.js cargado");

/* =========================
   UTILS
   ========================= */
function formatCLP(numero) {
  return new Intl.NumberFormat('es-CL').format(numero);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* =========================
   CARGAR PRODUCTO
   ========================= */
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    mostrarError('No se especificó un producto');
    return;
  }

  try {
    const response = await fetch('../../data/catalogo.json');
    const productos = await response.json();
    const producto = productos.find(p => p.id == productId);

    if (!producto) {
      mostrarError('Producto no encontrado');
      return;
    }

    renderProducto(producto);
    renderRelacionados(productos, productId);
    
    // Sincronizar wishlist
    if (typeof syncWishlistButtons === 'function') {
      syncWishlistButtons();
    }
  } catch (error) {
    console.error('Error cargando producto:', error);
    mostrarError('Error al cargar el producto');
  }
});


/* =========================
   RENDER PRODUCTO
   ========================= */
function renderProducto(p) {
  const container = document.getElementById('productDetailContent');
  
  const nombre = escapeHTML(p.nombre);
  const descripcion = escapeHTML(p.descripcion);
  const precio = formatCLP(p.precio);
  const precioAnterior = p.precioAnterior ? formatCLP(p.precioAnterior) : null;
  const imagen = escapeHTML(p.imagen);
  const detalles = p.detalles || {};

  // Badge de descuento
  let descuentoBadge = '';
  if (p.descuento) {
    descuentoBadge = `<span class="product-badge ${p.badgeColor || 'sandia'}">${escapeHTML(p.descuento)}</span>`;
  }

  container.innerHTML = `
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="../../index.html">Inicio</a></li>
        <li class="breadcrumb-item"><a href="../catalogo/">Catálogo</a></li>
        <li class="breadcrumb-item active" aria-current="page">${nombre}</li>
      </ol>
    </nav>

    <div class="row g-4">
      <!-- Columna Imagen -->
      <div class="col-12 col-lg-7">
        <div class="product-image-container">
          ${descuentoBadge}
          <img src="${imagen}" alt="${nombre}" class="product-image">
        </div>
      </div>

      <!-- Columna Info -->
      <div class="col-12 col-lg-5">
        <div class="product-info">
          <!-- Título y Compartir -->
          <div class="product-header">
            <h1 class="product-title">${nombre}</h1>
            <button class="btn-share" id="shareBtn" title="Compartir producto">
              <i class="fa-solid fa-share-nodes"></i>
            </button>
          </div>
          
          <!-- Precios -->
          <div class="product-price-section">
            ${precioAnterior ? `<span class="product-price-old">$${precioAnterior}</span>` : ''}
            <span class="product-price">$${precio}</span>
          </div>

          <!-- Descripción -->
          <p class="product-description">${descripcion}</p>

          <!-- Medios de Pago -->
          <div class="product-payment-info">
            <h4 class="info-subtitle">
              <i class="fa-solid fa-credit-card"></i>
              Medios de pago
            </h4>
            <div class="payment-methods">
              <span class="payment-item"><i class="fa-brands fa-cc-visa"></i> Visa</span>
              <span class="payment-item"><i class="fa-brands fa-cc-mastercard"></i> Mastercard</span>
              <span class="payment-item"><i class="fa-solid fa-building-columns"></i> Transferencia</span>
              <span class="payment-item"><i class="fa-solid fa-money-bill"></i> Efectivo</span>
            </div>
          </div>

          <!-- Envíos -->
          <div class="product-shipping-info">
            <h4 class="info-subtitle">
              <i class="fa-solid fa-truck-fast"></i>
              Formas de envío
            </h4>
            <div class="shipping-options">
              <div class="shipping-item">
                <i class="fa-solid fa-box"></i>
                <div class="shipping-content">
                  <strong>Envío a domicilio</strong>
                  <span>Recibe en 3-5 días hábiles</span>
                </div>
              </div>
              <div class="shipping-item">
                <i class="fa-solid fa-store"></i>
                <div class="shipping-content">
                  <strong>Retiro en tienda</strong>
                  <span>Retira en 24 horas</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Cantidad -->
          <div class="product-quantity">
            <label for="quantity" class="form-label">Cantidad</label>
            <div class="quantity-selector">
              <button type="button" class="quantity-btn" id="decreaseQty">-</button>
              <input type="number" id="quantity" class="quantity-input" value="1" min="1" max="10">
              <button type="button" class="quantity-btn" id="increaseQty">+</button>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="product-actions">
            <button class="btn-add-cart" id="addToCartBtn" data-id="${p.id}">
              <i class="fa-solid fa-cart-shopping"></i>
              Agregar al carrito
            </button>
            <button class="btn-wishlist wishlist-btn" type="button" data-id="${p.id}">
              <i class="fa-regular fa-heart"></i>
            </button>
          </div>

          <!-- Detalles del Producto -->
          <div class="product-details">
            <h3 class="details-title">
              <i class="fa-solid fa-circle-info"></i>
              Detalles del producto
            </h3>
            <table class="details-table">
              ${detalles.material ? `<tr><td>Material:</td><td>${escapeHTML(detalles.material)}</td></tr>` : ''}
              ${detalles.medidas ? `<tr><td>Medidas:</td><td>${escapeHTML(detalles.medidas)}</td></tr>` : ''}
              ${detalles.peso ? `<tr><td>Peso:</td><td>${escapeHTML(detalles.peso)}</td></tr>` : ''}
              ${detalles.interior ? `<tr><td>Interior:</td><td>${escapeHTML(detalles.interior)}</td></tr>` : ''}
              ${detalles.garantia ? `<tr><td>Garantía:</td><td>${escapeHTML(detalles.garantia)}</td></tr>` : ''}
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // Event Listeners
  setupQuantityControls();
  setupAddToCart(p);
  setupShareButton(p);
  
  // Sincronizar wishlist
  if (typeof syncWishlistButtons === 'function') {
    syncWishlistButtons();
  }
}


/* =========================
   CONTROLES DE CANTIDAD
   ========================= */
function setupQuantityControls() {
  const decreaseBtn = document.getElementById('decreaseQty');
  const increaseBtn = document.getElementById('increaseQty');
  const quantityInput = document.getElementById('quantity');

  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
  }

  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value);
      const max = parseInt(quantityInput.max);
      if (currentValue < max) {
        quantityInput.value = currentValue + 1;
      }
    });
  }
}

/* =========================
   AGREGAR AL CARRITO
   ========================= */
function setupAddToCart(producto) {
  const addToCartBtn = document.getElementById('addToCartBtn');
  
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const quantity = parseInt(document.getElementById('quantity').value);
      
      // Obtener carrito actual
      let carrito = [];
      try {
        carrito = JSON.parse(localStorage.getItem('carritoEternia')) || [];
      } catch (e) {
        carrito = [];
      }

      // Agregar o actualizar producto
      const existingIndex = carrito.findIndex(item => item.id === producto.id);
      
      if (existingIndex > -1) {
        carrito[existingIndex].cantidad += quantity;
      } else {
        carrito.push({
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          cantidad: quantity
        });
      }

      localStorage.setItem('carritoEternia', JSON.stringify(carrito));

      // Actualizar badge del carrito
      updateCartBadge();

      // Feedback visual
      const originalText = addToCartBtn.innerHTML;
      addToCartBtn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado al carrito';
      addToCartBtn.disabled = true;

      setTimeout(() => {
        addToCartBtn.innerHTML = originalText;
        addToCartBtn.disabled = false;
      }, 2000);

      console.log('Producto agregado al carrito:', producto.nombre, 'x', quantity);
    });
  }
}


/* =========================
   PRODUCTOS RELACIONADOS
   ========================= */
function renderRelacionados(productos, currentId) {
  const grid = document.getElementById('relatedGrid');
  if (!grid) return;

  const relacionados = productos
    .filter(p => p.id != currentId)
    .slice(0, 4);

  grid.innerHTML = relacionados.map(crearCardProductoRelacionado).join("");

  // Agregar event listeners
  agregarEventListenersRelacionados();

  // Sincronizar wishlist buttons
  if (typeof syncWishlistButtons === 'function') {
    syncWishlistButtons();
  }
}

/**
 * Crea una tarjeta de producto relacionado usando la misma estructura del catálogo
 */
function crearCardProductoRelacionado(producto) {
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
    precioAnteriorHTML = `<div class="price-old">$${formatearPrecio(producto.precioAnterior)}</div>`;
  }

  // Imagen - en página de producto usar ../../assets/
  let imagenSrc;
  if (producto.imagen) {
    if (producto.imagen.startsWith('http')) {
      // URL absoluta, usar tal cual
      imagenSrc = producto.imagen;
    } else if (producto.imagen.includes('assets/')) {
      // Convertir assets/ a ../../assets/ para página de producto
      imagenSrc = producto.imagen.replace('assets/', '../../assets/');
    } else {
      // Otra ruta, usar tal cual
      imagenSrc = producto.imagen;
    }
  } else {
    imagenSrc = "../../assets/logo-eternia-blanco.png";
  }

  const fallbackLogo = "../../assets/logo-eternia-blanco.png";

  return `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
      <div class="product-card" data-id="${producto.id}">
        ${descuentoBadge}

        <div class="product-card__image">
          <img src="${imagenSrc}"
               alt="${producto.nombre}"
               loading="lazy"
               onerror="this.src='${fallbackLogo}'">
          <button class="wishlist-btn-card" data-id="${producto.id}" aria-label="Agregar a wishlist">
            <i class="far fa-heart"></i>
          </button>
        </div>

        <div class="product-card__body">
          <span class="product-card__category">${producto.categoria || "Sin categoría"}</span>
          <h3 class="product-card__title">${producto.nombre}</h3>

          <div class="product-card__price">
            ${precioAnteriorHTML}
            <div class="price-current">$${formatearPrecio(producto.precio)}</div>
          </div>

          <div class="product-card__stock">
            ${stockBadge}
          </div>

          <div class="product-card__actions">
            <button class="btn btn--primary btn-ver-detalle"
                    data-id="${producto.id}">
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
 * Agrega event listeners a las tarjetas relacionadas
 */
function agregarEventListenersRelacionados() {
  // Botones "Ver detalle"
  document.querySelectorAll('#relatedGrid .btn-ver-detalle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = btn.getAttribute('data-id');
      if (productId) {
        window.location.href = `?id=${productId}`;
      }
    });
  });
}

/* =========================
   ERROR
   ========================= */
function mostrarError(mensaje) {
  const container = document.getElementById('productDetailContent');
  container.innerHTML = `
    <div class="alert alert-warning text-center">
      <i class="fa-solid fa-exclamation-triangle"></i>
      <p class="mb-0 mt-2">${escapeHTML(mensaje)}</p>
      <a href="../catalogo/" class="btn btn-sm btn-outline-warning mt-3">Ver catálogo</a>
    </div>
  `;
}

/* =========================
   COMPARTIR PRODUCTO
   ========================= */
function setupShareButton(producto) {
  const shareBtn = document.getElementById('shareBtn');
  
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const url = window.location.href;
      const title = producto.nombre;
      const text = `${producto.nombre} - ${producto.descripcion}`;

      // Si el navegador soporta Web Share API
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: text,
            url: url
          });
          console.log('Compartido exitosamente');
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.log('Error al compartir:', error);
            copiarAlPortapapeles(url, shareBtn);
          }
        }
      } else {
        // Fallback: copiar al portapapeles
        copiarAlPortapapeles(url, shareBtn);
      }
    });
  }
}

function copiarAlPortapapeles(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.classList.add('copied');
    
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.classList.remove('copied');
    }, 2000);
    
    console.log('URL copiada al portapapeles');
  }).catch(err => {
    console.error('Error al copiar:', err);
  });
}

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
  
  // Buscar el badge en el navbar
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

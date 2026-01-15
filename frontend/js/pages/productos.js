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

  grid.innerHTML = relacionados.map(p => {
    const precio = formatCLP(p.precio);
    const precioAnterior = p.precioAnterior ? formatCLP(p.precioAnterior) : '';
    
    return `
      <div class="col-12 col-md-6 col-lg-3">
        <article>
          <div class="galeria-productos">
            <a href="?id=${p.id}" class="card-link">
              <figure class="producto">
                <div class="contenedor-imagen">
                  <img src="${escapeHTML(p.imagen)}" alt="${escapeHTML(p.nombre)}">
                  ${p.descuento ? `<span class="info ${p.badgeColor || 'sandia'}">${escapeHTML(p.descuento)}</span>` : ''}
                  <button class="wishlist-btn-card" data-id="${p.id}" type="button" aria-label="Agregar a wishlist">
                    <i class="fa-regular fa-heart"></i>
                  </button>
                </div>
                <figcaption>
                  <h3>${escapeHTML(p.nombre)}</h3>
                  <p class="descripcion">${escapeHTML(p.descripcion)}</p>
                  <div class="precio-container">
                    ${precioAnterior ? `<p class="precio-anterior">$${precioAnterior}</p>` : ''}
                    <p class="precio">$${precio}</p>
                  </div>
                  <button class="add-to-cart" data-id="${p.id}" type="button">
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
  }).join('');

  // Event listeners para wishlist en relacionados
  document.querySelectorAll('.wishlist-btn-card').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const productId = btn.getAttribute('data-id');
      if (typeof toggleWishlist === 'function') {
        toggleWishlist(productId);
        
        const icon = btn.querySelector('i');
        if (typeof isInWishlist === 'function' && isInWishlist(productId)) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid');
          btn.classList.add('active');
        } else {
          icon.classList.remove('fa-solid');
          icon.classList.add('fa-regular');
          btn.classList.remove('active');
        }
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

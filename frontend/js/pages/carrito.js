console.log("✅ carrito.js cargado");

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
   CARGAR CARRITO
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  renderCarrito();
  setupCheckoutButton();
});

/* =========================
   OBTENER CARRITO
   ========================= */
function getCarrito() {
  try {
    return JSON.parse(localStorage.getItem('carritoEternia')) || [];
  } catch (e) {
    return [];
  }
}

function saveCarrito(carrito) {
  localStorage.setItem('carritoEternia', JSON.stringify(carrito));
}

/* =========================
   RENDER CARRITO
   ========================= */
function renderCarrito() {
  const carrito = getCarrito();
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const cartSummary = document.getElementById('cartSummary');
  const cartCount = document.getElementById('cartCount');

  // Si el carrito está vacío
  if (carrito.length === 0) {
    cartItemsContainer.innerHTML = '';
    emptyCart.style.display = 'block';
    cartSummary.style.display = 'none';
    cartCount.textContent = '0 productos';
    return;
  }

  // Mostrar productos
  emptyCart.style.display = 'none';
  cartSummary.style.display = 'block';

  // Contar productos totales
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  cartCount.textContent = `${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}`;

  // Renderizar items
  cartItemsContainer.innerHTML = carrito.map(item => renderCartItem(item)).join('');

  // Calcular totales
  updateTotals(carrito);

  // Setup event listeners
  setupQuantityButtons();
  setupRemoveButtons();
}

/* =========================
   RENDER ITEM
   ========================= */
function renderCartItem(item) {
  const subtotal = item.precio * item.cantidad;
  
  // Normalizar la ruta de la imagen para que funcione desde /pages/carrito/
  let imagen = item.imagen || '';
  
  // Si ya es una URL completa (http/https), dejarla como está
  if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
    // URL completa, no hacer nada
  }
  // Si empieza con /frontend/, ajustar a ruta relativa desde carrito
  else if (imagen.startsWith('/frontend/')) {
    imagen = imagen.replace('/frontend/', '../../');
  }
  // Si empieza con /, quitarlo y agregar ../../
  else if (imagen.startsWith('/')) {
    imagen = '../..' + imagen;
  }
  // Si es ruta relativa tipo assets/ (desde home), agregar ../../
  else if (imagen.startsWith('assets/')) {
    imagen = '../../' + imagen;
  }
  // Si ya empieza con ../../, dejarla
  else if (imagen.startsWith('../../')) {
    // Ya está correcta
  }
  // Cualquier otra cosa, intentar agregar ../../
  else if (imagen && !imagen.startsWith('../')) {
    imagen = '../../' + imagen;
  }

  return `
    <div class="cart-item" data-id="${item.id}">
      <img src="${escapeHTML(imagen)}" 
           alt="${escapeHTML(item.nombre)}" 
           class="cart-item-image"
           onerror="this.src='../../assets/placeholder.jpg'">
      
      <div class="cart-item-info">
        <h3 class="cart-item-name">
          <a href="../producto/?id=${item.id}">${escapeHTML(item.nombre)}</a>
        </h3>
        <p class="cart-item-price">$${formatCLP(item.precio)} c/u</p>
      </div>

      <div class="cart-item-quantity">
        <button type="button" class="qty-btn qty-decrease" data-id="${item.id}">-</button>
        <input type="number" class="qty-input" value="${item.cantidad}" min="1" max="10" data-id="${item.id}">
        <button type="button" class="qty-btn qty-increase" data-id="${item.id}">+</button>
      </div>

      <div class="cart-item-total">
        <p class="cart-item-subtotal">$${formatCLP(subtotal)}</p>
        <button type="button" class="btn-remove" data-id="${item.id}">
          <i class="fa-regular fa-trash-can"></i>
          Eliminar
        </button>
      </div>
    </div>
  `;
}

/* =========================
   ACTUALIZAR TOTALES
   ========================= */
function updateTotals(carrito) {
  const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  
  document.getElementById('subtotal').textContent = `$${formatCLP(subtotal)}`;
  document.getElementById('total').textContent = `$${formatCLP(subtotal)}`;
  
  // Habilitar/deshabilitar botón checkout
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.disabled = carrito.length === 0;
  }
}

/* =========================
   BOTONES DE CANTIDAD
   ========================= */
function setupQuantityButtons() {
  // Disminuir
  document.querySelectorAll('.qty-decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      updateQuantity(id, -1);
    });
  });

  // Aumentar
  document.querySelectorAll('.qty-increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      updateQuantity(id, 1);
    });
  });

  // Input directo
  document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = input.dataset.id;
      const newQty = parseInt(e.target.value);
      if (newQty >= 1 && newQty <= 10) {
        setQuantity(id, newQty);
      } else {
        renderCarrito(); // Reset
      }
    });
  });
}

function updateQuantity(id, delta) {
  const carrito = getCarrito();
  const itemIndex = carrito.findIndex(item => String(item.id) === String(id));
  
  if (itemIndex > -1) {
    carrito[itemIndex].cantidad += delta;
    
    // Si llega a 0, eliminar
    if (carrito[itemIndex].cantidad < 1) {
      carrito.splice(itemIndex, 1);
    }
    
    // Máximo 10
    if (carrito[itemIndex] && carrito[itemIndex].cantidad > 10) {
      carrito[itemIndex].cantidad = 10;
    }
    
    saveCarrito(carrito);
    renderCarrito();
  }
}

function setQuantity(id, quantity) {
  const carrito = getCarrito();
  const itemIndex = carrito.findIndex(item => String(item.id) === String(id));
  
  if (itemIndex > -1) {
    carrito[itemIndex].cantidad = Math.min(Math.max(quantity, 1), 10);
    saveCarrito(carrito);
    renderCarrito();
  }
}

/* =========================
   BOTONES ELIMINAR
   ========================= */
function setupRemoveButtons() {
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      removeItem(id);
    });
  });
}

function removeItem(id) {
  let carrito = getCarrito();
  // Comparar con conversión a string para evitar problemas de tipo
  carrito = carrito.filter(item => String(item.id) !== String(id));
  saveCarrito(carrito);
  
  // Animación de eliminación
  const itemElement = document.querySelector(`.cart-item[data-id="${id}"]`);
  if (itemElement) {
    itemElement.style.opacity = '0';
    itemElement.style.transform = 'translateX(-20px)';
    setTimeout(() => {
      renderCarrito();
    }, 300);
  } else {
    renderCarrito();
  }
}

/* =========================
   CHECKOUT BUTTON
   ========================= */
function setupCheckoutButton() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const carrito = getCarrito();
      
      if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
      }
      
      // Guardar carrito para checkout
      sessionStorage.setItem('checkoutCarrito', JSON.stringify(carrito));
      
      // Redirigir a checkout
      window.location.href = '../checkout/';
    });
  }
}

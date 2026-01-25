console.log("✅ checkout.js cargado");

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
   CONSTANTES
   ========================= */
const SHIPPING_COST = 15000;

/* =========================
   INICIALIZACIÓN
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si hay productos en el checkout
  const carrito = getCheckoutCarrito();
  
  if (carrito.length === 0) {
    // Redirigir al carrito si no hay productos
    window.location.href = '../carrito/';
    return;
  }

  renderOrderSummary(carrito);
  setupShippingOptions();
  setupFormValidation();
});

/* =========================
   OBTENER CARRITO
   ========================= */
function getCheckoutCarrito() {
  try {
    // Primero intentar sessionStorage (viene del carrito)
    let carrito = JSON.parse(sessionStorage.getItem('checkoutCarrito'));
    
    // Si no hay, intentar localStorage
    if (!carrito || carrito.length === 0) {
      carrito = JSON.parse(localStorage.getItem('carritoEternia')) || [];
    }
    
    return carrito;
  } catch (e) {
    return [];
  }
}

/* =========================
   RENDER ORDER SUMMARY
   ========================= */
function renderOrderSummary(carrito) {
  const orderItems = document.getElementById('orderItems');
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shippingCost');
  const totalEl = document.getElementById('total');

  // Calcular subtotal
  const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  
  // Render items
  orderItems.innerHTML = carrito.map(item => {
    const itemTotal = item.precio * item.cantidad;
    
    // Fix image path logic
    let imagen = item.imagen;
    if (imagen.startsWith('http')) {
      // External URL, use as-is
    } else if (imagen.startsWith('/')) {
      // Absolute path from root, convert to relative from checkout page
      // /frontend/assets/image.png -> ../../assets/image.png
      const pathParts = imagen.split('/');
      if (pathParts[1] === 'frontend' && pathParts[2] === 'assets') {
        imagen = `../../assets/${pathParts.slice(3).join('/')}`;
      } else {
        imagen = `../..${imagen}`;
      }
    } else if (imagen.startsWith('../')) {
      // Already relative path like ../../assets/, use as-is
      imagen = imagen;
    } else {
      // Just filename or other relative path, prepend assets path
      imagen = `../../assets/${imagen}`;
    }

    return `
      <div class="order-item">
        <img src="${escapeHTML(imagen)}" alt="${escapeHTML(item.nombre)}" class="order-item-image" onerror="this.style.display='none'">
        <div class="order-item-info">
          <p class="order-item-name">${escapeHTML(item.nombre)}</p>
          <span class="order-item-qty">Cantidad: ${item.cantidad}</span>
        </div>
        <span class="order-item-price">$${formatCLP(itemTotal)}</span>
      </div>
    `;
  }).join('');

  // Update totals
  updateTotals(subtotal);
}

function updateTotals(subtotal) {
  const shippingEl = document.getElementById('shippingCost');
  const totalEl = document.getElementById('total');
  const subtotalEl = document.getElementById('subtotal');
  
  // Check shipping type
  const tipoEnvio = document.querySelector('input[name="tipoEnvio"]:checked')?.value || 'domicilio';
  const shipping = tipoEnvio === 'retiro' ? 0 : SHIPPING_COST;
  
  subtotalEl.textContent = `$${formatCLP(subtotal)}`;
  shippingEl.textContent = shipping === 0 ? 'Gratis' : `$${formatCLP(shipping)}`;
  totalEl.textContent = `$${formatCLP(subtotal + shipping)}`;
  
  // Guardar total para el pago
  sessionStorage.setItem('checkoutTotal', subtotal + shipping);
  sessionStorage.setItem('checkoutSubtotal', subtotal);
  sessionStorage.setItem('checkoutShipping', shipping);
}

/* =========================
   SHIPPING OPTIONS
   ========================= */
function setupShippingOptions() {
  const shippingOptions = document.querySelectorAll('.shipping-option');
  const direccionFields = document.getElementById('direccionFields');
  const retiroInfo = document.getElementById('retiroInfo');

  shippingOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove active class from all
      shippingOptions.forEach(opt => opt.classList.remove('active'));
      
      // Add to clicked
      option.classList.add('active');
      
      // Check radio
      const radio = option.querySelector('input[type="radio"]');
      radio.checked = true;
      
      // Toggle fields
      if (radio.value === 'retiro') {
        direccionFields.style.display = 'none';
        retiroInfo.style.display = 'block';
        
        // Remove required from address fields
        direccionFields.querySelectorAll('[required]').forEach(field => {
          field.removeAttribute('required');
          field.classList.remove('is-invalid');
        });
      } else {
        direccionFields.style.display = 'flex';
        retiroInfo.style.display = 'none';
        
        // Add required back
        document.getElementById('direccion').setAttribute('required', '');
        document.getElementById('comuna').setAttribute('required', '');
        document.getElementById('ciudad').setAttribute('required', '');
        document.getElementById('region').setAttribute('required', '');
      }
      
      // Update totals
      const carrito = getCheckoutCarrito();
      const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
      updateTotals(subtotal);
    });
  });
}

/* =========================
   FORM VALIDATION
   ========================= */
function setupFormValidation() {
  const form = document.getElementById('checkoutForm');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Reset validation
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    
    // Validate
    let isValid = true;
    
    // Required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('is-invalid');
        isValid = false;
      }
    });
    
    // Email validation
    const email = document.getElementById('email');
    if (email.value && !isValidEmail(email.value)) {
      email.classList.add('is-invalid');
      isValid = false;
    }
    
    // RUT validation (básica)
    const rut = document.getElementById('rut');
    if (rut.value && !isValidRUT(rut.value)) {
      rut.classList.add('is-invalid');
      isValid = false;
    }
    
    if (isValid) {
      // Guardar datos del cliente
      saveCustomerData();
      
      // Redirigir a pasarela de pago
      window.location.href = '../pago/';
    } else {
      // Scroll to first error
      const firstError = form.querySelector('.is-invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  });
  
  // Real-time validation on blur
  form.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('blur', () => {
      if (field.hasAttribute('required') && !field.value.trim()) {
        field.classList.add('is-invalid');
      } else {
        field.classList.remove('is-invalid');
      }
    });
    
    field.addEventListener('input', () => {
      field.classList.remove('is-invalid');
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidRUT(rut) {
  // Validación básica de formato RUT chileno
  const cleanRUT = rut.replace(/[.-]/g, '').toUpperCase();
  return /^\d{7,8}[0-9K]$/.test(cleanRUT);
}

function saveCustomerData() {
  const formData = {
    nombre: document.getElementById('nombre').value,
    apellido: document.getElementById('apellido').value,
    email: document.getElementById('email').value,
    telefono: document.getElementById('telefono').value,
    rut: document.getElementById('rut').value,
    tipoEnvio: document.querySelector('input[name="tipoEnvio"]:checked').value,
    direccion: document.getElementById('direccion').value,
    depto: document.getElementById('depto').value,
    comuna: document.getElementById('comuna').value,
    ciudad: document.getElementById('ciudad').value,
    region: document.getElementById('region').value,
    instrucciones: document.getElementById('instrucciones').value,
    notas: document.getElementById('notas').value
  };
  
  sessionStorage.setItem('checkoutCustomer', JSON.stringify(formData));
}

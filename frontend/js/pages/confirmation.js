console.log("✅ confirmation.js cargado");

/* =========================
   UTILS
   ========================= */
function formatCLP(numero) {
  return new Intl.NumberFormat('es-CL').format(numero);
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('es-CL', options);
}

/* =========================
   INICIALIZACIÓN
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  // Obtener la orden del sessionStorage
  const orderData = sessionStorage.getItem('lastOrder');
  
  if (!orderData) {
    // No hay orden, redirigir al inicio
    showNoOrderMessage();
    return;
  }

  const order = JSON.parse(orderData);
  
  renderOrderDetails(order);
  
  // Limpiar datos de sesión después de mostrar
  cleanupSession();
});

/* =========================
   RENDER ORDER
   ========================= */
function renderOrderDetails(order) {
  // Número de orden y fecha
  document.getElementById('orderNumber').textContent = order.orderNumber;
  document.getElementById('orderDate').textContent = formatDate(order.date);

  // Items del pedido
  renderOrderItems(order.items);

  // Totales
  document.getElementById('orderSubtotal').textContent = `$${formatCLP(order.subtotal)}`;
  document.getElementById('orderShipping').textContent = order.shipping > 0 ? `$${formatCLP(order.shipping)}` : 'Gratis';
  document.getElementById('orderTotal').textContent = `$${formatCLP(order.total)}`;

  // Información de envío
  renderShippingInfo(order.customer);

  // Información de pago
  renderPaymentInfo(order);
}

function renderOrderItems(items) {
  const container = document.getElementById('orderItems');
  
  if (!items || items.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay items en el pedido</p>';
    return;
  }

  container.innerHTML = items.map(item => {
    // Normalizar la ruta de la imagen para que funcione desde /pages/confirmacion/
    let imagen = item.imagen || '';
    
    // Si ya es una URL completa (http/https), dejarla como está
    if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
      // URL completa, no hacer nada
    }
    // Si empieza con /frontend/, ajustar a ruta relativa desde confirmacion
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
    
    if (!imagen) imagen = '../../assets/placeholder.jpg';
    
    return `
    <div class="order-item">
      <img src="${imagen}" 
           alt="${item.nombre}" 
           class="order-item-image"
           onerror="this.src='../../assets/placeholder.jpg'">
      <div class="order-item-details">
        <div class="order-item-name">${item.nombre}</div>
        <div class="order-item-meta">Cantidad: ${item.cantidad}</div>
      </div>
      <div class="order-item-price">$${formatCLP(item.precio * item.cantidad)}</div>
    </div>
  `;
  }).join('');
}

function renderShippingInfo(customer) {
  const container = document.getElementById('shippingDetails');
  
  if (!customer) {
    container.innerHTML = '<p class="text-muted">Información no disponible</p>';
    return;
  }

  let shippingHTML = `
    <div class="info-item">
      <span class="info-label">Nombre</span>
      <span class="info-value">${customer.nombre} ${customer.apellido}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Email</span>
      <span class="info-value">${customer.email}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Teléfono</span>
      <span class="info-value">${customer.telefono}</span>
    </div>
  `;

  if (customer.tipoEnvio === 'domicilio') {
    shippingHTML += `
      <div class="info-item">
        <span class="info-label">Dirección</span>
        <span class="info-value">${customer.direccion}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Ciudad</span>
        <span class="info-value">${customer.ciudad}, ${customer.region}</span>
      </div>
    `;
  } else {
    shippingHTML += `
      <div class="info-item">
        <span class="info-label">Método de Entrega</span>
        <span class="info-value">Retiro en Tienda</span>
      </div>
      <div class="info-item">
        <span class="info-label">Dirección de Retiro</span>
        <span class="info-value">Av. Providencia 1234, Local 56, Santiago</span>
      </div>
    `;
  }

  container.innerHTML = shippingHTML;
}

function renderPaymentInfo(order) {
  const container = document.getElementById('paymentDetails');
  
  const methodName = order.paymentMethod === 'credito' ? 'Tarjeta de Crédito' : 'Tarjeta de Débito';
  const cuotasInfo = order.paymentMethod === 'credito' && order.cuotas !== 'sin_cuotas' 
    ? `${order.cuotas} cuotas` 
    : 'Sin cuotas';

  container.innerHTML = `
    <div class="info-item">
      <span class="info-label">Método</span>
      <span class="info-value">${methodName}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Cuotas</span>
      <span class="info-value">${cuotasInfo}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Estado</span>
      <span class="info-value" style="color: #28a745;">
        <i class="fas fa-check-circle me-1"></i>
        Pago Exitoso
      </span>
    </div>
    <div class="info-item">
      <span class="info-label">Procesado por</span>
      <span class="info-value">WebPay Plus (Simulación)</span>
    </div>
  `;
}

/* =========================
   NO ORDER STATE
   ========================= */
function showNoOrderMessage() {
  const main = document.querySelector('.confirmation-page');
  
  main.innerHTML = `
    <div class="container">
      <div class="no-order-message" style="text-align: center; padding: 4rem 2rem;">
        <i class="fas fa-receipt" style="font-size: 4rem; color: #ccc; margin-bottom: 1.5rem;"></i>
        <h2 style="font-family: 'Playfair Display', serif; color: var(--color-primary, #054060); margin-bottom: 1rem;">
          No hay orden para mostrar
        </h2>
        <p style="color: var(--color-text-light, #6c757d); margin-bottom: 2rem;">
          Parece que no tienes un pedido reciente o ya se ha mostrado la confirmación.
        </p>
        <a href="../catalogo/" class="btn btn-primary" 
           style="background: linear-gradient(135deg, var(--color-accent, #d4af37), #c49b30); 
                  border: none; padding: 0.875rem 2rem; border-radius: 50px;">
          <i class="fas fa-shopping-bag me-2"></i>
          Ir al Catálogo
        </a>
      </div>
    </div>
  `;
}

/* =========================
   CLEANUP
   ========================= */
function cleanupSession() {
  // Limpiar datos del checkout de sessionStorage
  // pero mantener la orden para permitir refrescar la página
  sessionStorage.removeItem('checkoutCarrito');
  sessionStorage.removeItem('checkoutCustomer');
  sessionStorage.removeItem('checkoutTotal');
  sessionStorage.removeItem('checkoutSubtotal');
  sessionStorage.removeItem('checkoutShipping');
}

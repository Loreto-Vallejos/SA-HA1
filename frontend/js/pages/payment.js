console.log("✅ payment.js cargado");

/* =========================
   UTILS
   ========================= */
function formatCLP(numero) {
  return new Intl.NumberFormat('es-CL').format(numero);
}

/* =========================
   INICIALIZACIÓN
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  // Verificar datos del checkout
  const total = sessionStorage.getItem('checkoutTotal');
  const customer = sessionStorage.getItem('checkoutCustomer');
  
  if (!total || !customer) {
    // Redirigir al checkout si no hay datos
    window.location.href = '../checkout/';
    return;
  }

  // Mostrar total
  const totalFormatted = `$${formatCLP(parseInt(total))}`;
  document.getElementById('paymentTotal').textContent = totalFormatted;
  document.getElementById('btnPayAmount').textContent = totalFormatted;

  setupPaymentMethods();
  setupCardInputs();
  setupPaymentForm();
  setupCancelButton();
});

/* =========================
   MÉTODOS DE PAGO
   ========================= */
function setupPaymentMethods() {
  const methodOptions = document.querySelectorAll('.method-option');
  const cuotasGroup = document.getElementById('cuotasGroup');

  methodOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove active from all
      methodOptions.forEach(opt => opt.classList.remove('active'));
      
      // Add to clicked
      option.classList.add('active');
      
      // Check radio
      const radio = option.querySelector('input[type="radio"]');
      radio.checked = true;
      
      // Show/hide cuotas
      if (radio.value === 'debito') {
        cuotasGroup.style.display = 'none';
      } else {
        cuotasGroup.style.display = 'block';
      }
    });
  });
}

/* =========================
   CARD INPUTS FORMATTING
   ========================= */
function setupCardInputs() {
  // Card Number - formato con espacios
  const cardNumber = document.getElementById('cardNumber');
  cardNumber.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formatted;
  });

  // Expiry - formato MM/YY
  const cardExpiry = document.getElementById('cardExpiry');
  cardExpiry.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
  });

  // CVV - solo números
  const cardCVV = document.getElementById('cardCVV');
  cardCVV.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  });

  // Card Name - solo letras
  const cardName = document.getElementById('cardName');
  cardName.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
  });
}

/* =========================
   PAYMENT FORM
   ========================= */
function setupPaymentForm() {
  const form = document.getElementById('paymentForm');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validar campos
    if (!validatePaymentForm()) {
      return;
    }
    
    // Simular procesamiento
    processPayment();
  });
}

function validatePaymentForm() {
  const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
  const cardName = document.getElementById('cardName').value;
  const cardExpiry = document.getElementById('cardExpiry').value;
  const cardCVV = document.getElementById('cardCVV').value;

  // Validar número de tarjeta (16 dígitos)
  if (cardNumber.length < 15 || cardNumber.length > 16) {
    alert('Por favor ingresa un número de tarjeta válido');
    document.getElementById('cardNumber').focus();
    return false;
  }

  // Validar nombre
  if (cardName.trim().length < 3) {
    alert('Por favor ingresa el nombre como aparece en la tarjeta');
    document.getElementById('cardName').focus();
    return false;
  }

  // Validar fecha de vencimiento
  if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
    alert('Por favor ingresa una fecha de vencimiento válida (MM/AA)');
    document.getElementById('cardExpiry').focus();
    return false;
  }

  // Validar CVV
  if (cardCVV.length < 3 || cardCVV.length > 4) {
    alert('Por favor ingresa un CVV válido');
    document.getElementById('cardCVV').focus();
    return false;
  }

  return true;
}

function processPayment() {
  // Mostrar overlay de procesamiento
  const processing = document.getElementById('processingPayment');
  processing.style.display = 'flex';

  // Simular tiempo de procesamiento (3-5 segundos)
  const processingTime = 3000 + Math.random() * 2000;

  setTimeout(() => {
    // Generar número de orden
    const orderNumber = generateOrderNumber();
    
    // Guardar orden
    saveOrder(orderNumber);
    
    // Limpiar carrito
    clearCart();
    
    // Redirigir a confirmación
    window.location.href = `../confirmacion/?orden=${orderNumber}`;
  }, processingTime);
}

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ETR-${timestamp}-${random}`;
}

function saveOrder(orderNumber) {
  const carrito = JSON.parse(sessionStorage.getItem('checkoutCarrito') || localStorage.getItem('carritoEternia') || '[]');
  const customer = JSON.parse(sessionStorage.getItem('checkoutCustomer'));
  const total = sessionStorage.getItem('checkoutTotal');
  const subtotal = sessionStorage.getItem('checkoutSubtotal');
  const shipping = sessionStorage.getItem('checkoutShipping');

  const order = {
    orderNumber,
    date: new Date().toISOString(),
    customer,
    items: carrito,
    subtotal: parseInt(subtotal),
    shipping: parseInt(shipping),
    total: parseInt(total),
    paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
    cuotas: document.getElementById('cuotas').value,
    status: 'confirmed'
  };

  // Guardar orden
  sessionStorage.setItem('lastOrder', JSON.stringify(order));
  
  // También guardar en historial de órdenes (localStorage)
  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem('eterniaOrders')) || [];
  } catch (e) {
    orders = [];
  }
  orders.push(order);
  localStorage.setItem('eterniaOrders', JSON.stringify(orders));
}

function clearCart() {
  localStorage.removeItem('carritoEternia');
  sessionStorage.removeItem('checkoutCarrito');
  sessionStorage.removeItem('checkoutTotal');
  sessionStorage.removeItem('checkoutSubtotal');
  sessionStorage.removeItem('checkoutShipping');
}

/* =========================
   CANCEL BUTTON
   ========================= */
function setupCancelButton() {
  const cancelBtn = document.getElementById('cancelBtn');
  
  cancelBtn.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que deseas cancelar el pago?')) {
      window.location.href = '../checkout/';
    }
  });
}

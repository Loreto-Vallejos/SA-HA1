/**
 * CARRITO.JS - Lógica del Carrito de Compras
 * Maneja visualización, cálculos y simulación de Checkout (JSON/WhatsApp)
 */

document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    setupEventListeners();
});

const CART_KEY = 'carritoEternia';

function loadCart() {
    const raw = localStorage.getItem(CART_KEY);
    let cart = [];
    try {
        cart = JSON.parse(raw) || [];
    } catch(e) {
        cart = [];
    }

    const container = document.getElementById('cartContainer');
    const emptyMsg = document.getElementById('emptyCartMsg');
    const tableBody = document.getElementById('cartTableBody');
    const badge = document.getElementById('cartCount');

    // Actualizar Badge
    const totalCount = cart.reduce((acc, item) => acc + item.cantidad, 0);
    if (badge) {
        badge.textContent = totalCount;
        badge.classList.remove('d-none');
        if (totalCount === 0) badge.classList.add('d-none');
    }

    // Toggle Empty State
    if (cart.length === 0) {
        container.classList.add('d-none');
        emptyMsg.classList.remove('d-none');
        return;
    }

    container.classList.remove('d-none');
    emptyMsg.classList.add('d-none');
    
    // Render Items
    renderItems(cart, tableBody);
    
    // Calcular Total
    calculateTotals(cart);
}

function renderItems(cart, tbody) {
    if(!tbody) return;
    
    tbody.innerHTML = cart.map((item, index) => {
        const precio = Number(item.precio);
        const subtotal = precio * item.cantidad;
        
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <img src="${item.imagen}" alt="${item.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
                        <div>
                            <h6 class="mb-0 text-white font-playfair"><a href="productos.html?id=${item.id}" class="text-white text-decoration-none">${item.nombre}</a></h6>
                            <small class="text-white-50">SKU: ET-${item.id}</small>
                        </div>
                    </div>
                </td>
                <td class="text-white">$${formatCLP(precio)}</td>
                <td>
                    <div class="quantity-wrapper" style="max-width: 80px;">
                         <input type="number" class="form-control bg-dark border-secondary text-white text-center p-1 cart-qty-input" 
                                value="${item.cantidad}" min="1" data-index="${index}">
                    </div>
                </td>
                <td class="text-end text-gold fw-bold">$${formatCLP(subtotal)}</td>
                <td class="text-end">
                    <button class="btn btn-link text-danger p-0 cart-remove-btn" data-index="${index}" title="Eliminar">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

function calculateTotals(cart) {
    const total = cart.reduce((sum, item) => sum + (Number(item.precio) * item.cantidad), 0);
    
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    
    if(subtotalEl) subtotalEl.textContent = `$${formatCLP(total)}`;
    if(totalEl) totalEl.textContent = `$${formatCLP(total)}`;
}

function setupEventListeners() {
    const tbody = document.getElementById('cartTableBody');
    
    // Delegación de eventos para inputs y botones dinámicos
    if(tbody) {
        tbody.addEventListener('change', (e) => {
            if(e.target.classList.contains('cart-qty-input')) {
                updateQuantity(e.target.dataset.index, e.target.value);
            }
        });

        tbody.addEventListener('click', (e) => {
            const btn = e.target.closest('.cart-remove-btn');
            if(btn) {
                removeFromCart(btn.dataset.index);
            }
        });
    }

    // Checkout
    const btnCheckout = document.getElementById('btnCheckout');
    if(btnCheckout) {
        btnCheckout.addEventListener('click', handleCheckout);
    }
}

function updateQuantity(index, newMovie) {
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    const qty = parseInt(newMovie);
    
    if(qty < 1) {
        return loadCart(); // Revertir si es inválido
    }
    
    if(cart[index]) {
        cart[index].cantidad = qty;
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        loadCart(); // Re-render completo para actualizar subtotales
    }
}

function removeFromCart(index) {
    if(!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    cart.splice(index, 1);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    loadCart();
}

/**
 * SIMULACIÓN DE BACKEND
 * Genera el JSON y permite enviarlo por WhatsApp
 */
function handleCheckout() {
    const feedback = document.getElementById('checkoutFeedback');
    feedback.classList.remove('d-none');
    
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    if(cart.length === 0) return;

    // 1. GENERAR EL JSON (Payload para el Backend)
    const orderPayload = {
        customer_id: "GUEST_USER", // En el futuro vendrá del login
        created_at: new Date().toISOString(),
        currency: "CLP",
        items: cart.map(item => ({
            product_id: Number(item.id),
            details: {
                name: item.nombre,
                price: Number(item.precio)
            },
            quantity: item.cantidad,
            subtotal: Number(item.precio) * item.cantidad
        })),
        total_amount: cart.reduce((sum, i) => sum + (Number(i.precio) * i.cantidad), 0),
        status: "PENDING"
    };

    console.log("------------------------------------------------");
    console.log("📡 SIMULANDO ENVÍO AL BACKEND (POST /api/orders)");
    console.log("📦 payload:", JSON.stringify(orderPayload, null, 2));
    console.log("------------------------------------------------");

    // 2. OPCIÓN WHATSAPP (Fallback)
    setTimeout(() => {
        feedback.classList.add('d-none');
        
        const message = buildWhatsAppMessage(cart, orderPayload.total_amount);
        const whastappUrl = `https://wa.me/569XXXXXXXX?text=${encodeURIComponent(message)}`;
        
        const proceeded = confirm(`
[MODO DESARROLLO]
Se ha generado el JSON del pedido en la Consola (F12).

¿Te gustaría enviar este pedido a Ventas por WhatsApp ahora?
        `);

        if(proceeded) {
            window.open(whastappUrl, '_blank');
            // Opcional: Limpiar carrito
            // localStorage.removeItem(CART_KEY);
            // loadCart();
        }
    }, 800);
}

function buildWhatsAppMessage(cart, total) {
    let msg = `Hola Eternia, quiero confirmar el siguiente pedido:\n\n`;
    cart.forEach(item => {
        msg += `⚰️ *${item.nombre}* x${item.cantidad} - $${formatCLP(item.precio * item.cantidad)}\n`;
    });
    msg += `\n💰 *TOTAL: $${formatCLP(total)}*\n`;
    msg += `\nQuedo atento a los detalles de pago y envío.`;
    return msg;
}

function formatCLP(num) {
    return new Intl.NumberFormat('es-CL').format(num);
}

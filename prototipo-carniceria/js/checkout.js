// Funcionalidad específica del checkout
document.addEventListener('DOMContentLoaded', function() {
    inicializarCheckout();
    cargarResumenPedido();
    configurarEventos();
});

let pasoActual = 1;
let datosPedido = {
    entrega: {},
    pago: {},
    productos: []
};

function inicializarCheckout() {
    // Verificar que hay productos en el carrito
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega algunos productos antes de proceder al checkout.');
        window.location.href = 'carrito.html';
        return;
    }

    // Guardar productos del carrito
    datosPedido.productos = [...carrito];
    
    // Mostrar paso inicial
    mostrarPaso(1);
}

function configurarEventos() {
    // Formulario de entrega
    const deliveryForm = document.getElementById('delivery-form');
    if (deliveryForm) {
        deliveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            procesarPasoEntrega();
        });
    }

    // Formulario de pago
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            procesarPasoPago();
        });
    }

    // Cambios en método de pago
    const metodosPago = document.querySelectorAll('input[name="metodo-pago"]');
    metodosPago.forEach(metodo => {
        metodo.addEventListener('change', function() {
            mostrarDetallesPago(this.value);
        });
    });

    // Modal de confirmación
    const confirmacionModal = document.getElementById('confirmacion-modal');
    const closeModal = document.getElementById('close-confirmacion-modal');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            confirmacionModal.classList.remove('show');
        });
    }

    // Cerrar modal al hacer clic fuera
    if (confirmacionModal) {
        confirmacionModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    }
}

function mostrarPaso(paso) {
    // Ocultar todos los pasos
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.remove('active');
    });

    // Mostrar paso actual
    const pasoElement = document.getElementById(`step-${paso}`);
    if (pasoElement) {
        pasoElement.classList.add('active');
    }

    // Actualizar progreso
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < paso) {
            step.classList.add('completed');
        } else if (index + 1 === paso) {
            step.classList.add('active');
        }
    });

    pasoActual = paso;
}

function procesarPasoEntrega() {
    const form = document.getElementById('delivery-form');
    const formData = new FormData(form);
    
    // Validar campos requeridos
    const camposRequeridos = ['nombre', 'telefono', 'direccion', 'ciudad'];
    let valido = true;

    camposRequeridos.forEach(campo => {
        const input = document.getElementById(campo);
        if (!input.value.trim()) {
            input.classList.add('error');
            valido = false;
        } else {
            input.classList.remove('error');
        }
    });

    if (!valido) {
        alert('Por favor completa todos los campos requeridos.');
        return;
    }

    // Guardar datos de entrega
    datosPedido.entrega = {
        nombre: formData.get('nombre'),
        telefono: formData.get('telefono'),
        direccion: formData.get('direccion'),
        ciudad: formData.get('ciudad'),
        codigoPostal: formData.get('codigo-postal'),
        fechaEntrega: formData.get('fecha-entrega'),
        horarioEntrega: formData.get('horario-entrega'),
        guardarDireccion: formData.get('guardar-direccion') === 'on'
    };

    mostrarPaso(2);
}

function procesarPasoPago() {
    const form = document.getElementById('payment-form');
    const formData = new FormData(form);
    const metodoPago = formData.get('metodo-pago');

    // Guardar datos de pago
    datosPedido.pago = {
        metodo: metodoPago,
        comprobante: formData.get('comprobante'),
        numeroNequi: formData.get('numero-nequi'),
        comprobanteNequi: formData.get('comprobante-nequi')
    };

    // Validaciones específicas según método de pago
    if (metodoPago === 'transferencia' && !formData.get('comprobante')) {
        alert('Por favor sube el comprobante de transferencia.');
        return;
    }

    if (metodoPago === 'nequi' && !formData.get('numero-nequi')) {
        alert('Por favor ingresa tu número de Nequi.');
        return;
    }

    mostrarPaso(3);
    actualizarConfirmacion();
}

function mostrarDetallesPago(metodo) {
    // Ocultar todos los detalles
    document.querySelectorAll('.payment-details').forEach(detail => {
        detail.style.display = 'none';
    });

    // Mostrar detalles según método
    if (metodo === 'transferencia') {
        document.getElementById('transferencia-details').style.display = 'block';
    } else if (metodo === 'nequi') {
        document.getElementById('nequi-details').style.display = 'block';
    }
}

function anteriorPaso() {
    if (pasoActual > 1) {
        mostrarPaso(pasoActual - 1);
    }
}

function actualizarConfirmacion() {
    // Información de entrega
    const deliveryInfo = document.getElementById('delivery-info');
    if (deliveryInfo) {
        deliveryInfo.innerHTML = `
            <div class="info-item">
                <strong>Nombre:</strong> ${datosPedido.entrega.nombre}
            </div>
            <div class="info-item">
                <strong>Teléfono:</strong> ${datosPedido.entrega.telefono}
            </div>
            <div class="info-item">
                <strong>Dirección:</strong> ${datosPedido.entrega.direccion}
            </div>
            <div class="info-item">
                <strong>Ciudad:</strong> ${datosPedido.entrega.ciudad}
            </div>
            ${datosPedido.entrega.fechaEntrega ? `
                <div class="info-item">
                    <strong>Fecha:</strong> ${obtenerTextoFecha(datosPedido.entrega.fechaEntrega)}
                </div>
            ` : ''}
            ${datosPedido.entrega.horarioEntrega ? `
                <div class="info-item">
                    <strong>Horario:</strong> ${obtenerTextoHorario(datosPedido.entrega.horarioEntrega)}
                </div>
            ` : ''}
        `;
    }

    // Información de pago
    const paymentInfo = document.getElementById('payment-info');
    if (paymentInfo) {
        const metodoTexto = obtenerTextoMetodoPago(datosPedido.pago.metodo);
        paymentInfo.innerHTML = `
            <div class="info-item">
                <strong>Método:</strong> ${metodoTexto}
            </div>
            ${datosPedido.pago.numeroNequi ? `
                <div class="info-item">
                    <strong>Número Nequi:</strong> ${datosPedido.pago.numeroNequi}
                </div>
            ` : ''}
        `;
    }

    // Items del pedido
    const confirmationItems = document.getElementById('confirmation-items');
    if (confirmationItems) {
        confirmationItems.innerHTML = datosPedido.productos.map(item => `
            <div class="confirmation-item">
                <div class="item-info">
                    <span class="item-nombre">${item.nombre}</span>
                    <span class="item-cantidad">${item.cantidad} ${item.unidad_medida}</span>
                </div>
                <span class="item-precio">$${(item.precio_unitario * item.cantidad).toLocaleString()}</span>
            </div>
        `).join('');
    }

    // Totales
    const total = obtenerTotalCarrito();
    const descuento = datosPedido.pago.metodo === 'transferencia' ? total * 0.05 : 0;
    const totalFinal = total - descuento;

    document.getElementById('subtotal-confirmation').textContent = `$${total.toLocaleString()}`;
    document.getElementById('total-confirmation').textContent = `$${totalFinal.toLocaleString()}`;

    if (descuento > 0) {
        document.getElementById('discount-line').style.display = 'flex';
        document.getElementById('discount-amount').textContent = `-$${descuento.toLocaleString()}`;
    }
}

function obtenerTextoFecha(fecha) {
    const fechas = {
        'hoy': 'Hoy',
        'mañana': 'Mañana',
        'pasado-manana': 'Pasado mañana'
    };
    return fechas[fecha] || fecha;
}

function obtenerTextoHorario(horario) {
    const horarios = {
        'manana': 'Mañana (8:00 - 12:00)',
        'tarde': 'Tarde (12:00 - 18:00)',
        'noche': 'Noche (18:00 - 20:00)'
    };
    return horarios[horario] || horario;
}

function obtenerTextoMetodoPago(metodo) {
    const metodos = {
        'efectivo': 'Pago Contra Entrega',
        'transferencia': 'Transferencia Bancaria',
        'nequi': 'Nequi'
    };
    return metodos[metodo] || metodo;
}

function finalizarPedido() {
    const aceptoTerminos = document.getElementById('acepto-terminos');
    if (!aceptoTerminos.checked) {
        alert('Por favor acepta los términos y condiciones para continuar.');
        return;
    }

    // Simular procesamiento
    const botonConfirmar = document.querySelector('.btn-primary');
    const textoOriginal = botonConfirmar.innerHTML;
    botonConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    botonConfirmar.disabled = true;

    setTimeout(() => {
        // Limpiar carrito
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarBadgeCarrito();

        // Mostrar modal de confirmación
        mostrarModalConfirmacion();
        
        // Restaurar botón
        botonConfirmar.innerHTML = textoOriginal;
        botonConfirmar.disabled = false;
    }, 2000);
}

function mostrarModalConfirmacion() {
    const modal = document.getElementById('confirmacion-modal');
    const total = obtenerTotalCarrito();
    const descuento = datosPedido.pago.metodo === 'transferencia' ? total * 0.05 : 0;
    const totalFinal = total - descuento;

    // Generar número de pedido
    const numeroPedido = `#PED-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    document.getElementById('numero-pedido').textContent = numeroPedido;
    document.getElementById('fecha-entrega-estimada').textContent = obtenerTextoFecha(datosPedido.entrega.fechaEntrega) || 'Mañana';
    document.getElementById('total-pedido').textContent = `$${totalFinal.toLocaleString()}`;

    modal.classList.add('show');
}

function cargarResumenPedido() {
    const resumenItems = document.getElementById('resumen-items');
    const resumenTotal = document.getElementById('resumen-total');

    if (!resumenItems || !resumenTotal) return;

    if (carrito.length === 0) {
        resumenItems.innerHTML = '<p>No hay productos en el carrito</p>';
        resumenTotal.innerHTML = '';
        return;
    }

    const total = obtenerTotalCarrito();
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

    resumenItems.innerHTML = `
        <div class="resumen-item">
            <span>Productos (${totalItems}):</span>
            <span>$${total.toLocaleString()}</span>
        </div>
        <div class="resumen-item">
            <span>Envío:</span>
            <span>Gratis</span>
        </div>
    `;

    resumenTotal.innerHTML = `
        <div class="resumen-total-item">
            <span>Total:</span>
            <span>$${total.toLocaleString()}</span>
        </div>
    `;
}

// Estilos adicionales para el checkout
const checkoutStyles = `
    .checkout-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--spacing-6) 0;
    }

    .checkout-page-header {
        text-align: center;
        margin-bottom: var(--spacing-8);
    }

    .page-title {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-2);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-3);
    }

    .page-subtitle {
        color: var(--color-gray-600);
        font-size: var(--font-size-lg);
    }

    .checkout-progress {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--spacing-8);
        padding: var(--spacing-4) 0;
    }

    .progress-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-2);
        opacity: 0.5;
        transition: var(--transition);
    }

    .progress-step.active {
        opacity: 1;
    }

    .progress-step.completed {
        opacity: 1;
    }

    .step-number {
        width: 40px;
        height: 40px;
        border-radius: var(--border-radius-full);
        background-color: var(--color-gray-300);
        color: var(--color-white);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        transition: var(--transition);
    }

    .progress-step.active .step-number {
        background-color: var(--color-primary);
    }

    .progress-step.completed .step-number {
        background-color: var(--color-success);
    }

    .step-label {
        font-size: var(--font-size-sm);
        font-weight: 500;
        color: var(--color-gray-600);
    }

    .progress-step.active .step-label {
        color: var(--color-primary);
    }

    .progress-line {
        width: 100px;
        height: 2px;
        background-color: var(--color-gray-300);
        margin: 0 var(--spacing-4);
    }

    .checkout-content {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: var(--spacing-8);
        align-items: start;
    }

    .checkout-form-container {
        background-color: var(--color-white);
        border-radius: var(--border-radius-xl);
        padding: var(--spacing-8);
        box-shadow: var(--shadow-sm);
    }

    .checkout-step {
        display: none;
    }

    .checkout-step.active {
        display: block;
    }

    .step-header {
        margin-bottom: var(--spacing-6);
        text-align: center;
    }

    .step-header h2 {
        font-size: var(--font-size-2xl);
        font-weight: 600;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-2);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-3);
    }

    .step-header p {
        color: var(--color-gray-600);
        font-size: var(--font-size-base);
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-4);
    }

    .form-group {
        margin-bottom: var(--spacing-5);
    }

    .form-label {
        display: block;
        font-weight: 500;
        color: var(--color-gray-700);
        margin-bottom: var(--spacing-2);
        font-size: var(--font-size-sm);
    }

    .form-input,
    .form-select,
    .form-textarea {
        width: 100%;
        padding: var(--spacing-3);
        border: 2px solid var(--color-gray-200);
        border-radius: var(--border-radius);
        font-size: var(--font-size-base);
        transition: var(--transition);
        background-color: var(--color-white);
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    .form-input.error {
        border-color: var(--color-error);
    }

    .form-textarea {
        resize: vertical;
        min-height: 100px;
    }

    .form-help {
        font-size: var(--font-size-xs);
        color: var(--color-gray-500);
        margin-top: var(--spacing-1);
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        cursor: pointer;
        font-size: var(--font-size-sm);
    }

    .checkbox-label input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--color-primary);
    }

    .payment-methods {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
        margin-bottom: var(--spacing-6);
    }

    .payment-method {
        position: relative;
    }

    .payment-method-label {
        cursor: pointer;
        display: block;
    }

    .payment-method-label input[type="radio"] {
        position: absolute;
        opacity: 0;
    }

    .payment-method-card {
        padding: var(--spacing-4);
        border: 2px solid var(--color-gray-200);
        border-radius: var(--border-radius-lg);
        transition: var(--transition);
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
    }

    .payment-method-card i {
        font-size: var(--font-size-xl);
        color: var(--color-gray-500);
        width: 24px;
    }

    .payment-method-card span {
        font-weight: 600;
        color: var(--color-gray-900);
    }

    .payment-method-card small {
        color: var(--color-gray-600);
        font-size: var(--font-size-xs);
    }

    .payment-method-label input[type="radio"]:checked + .payment-method-card {
        border-color: var(--color-primary);
        background-color: rgba(220, 38, 38, 0.05);
    }

    .payment-method-label input[type="radio"]:checked + .payment-method-card i {
        color: var(--color-primary);
    }

    .payment-details {
        background-color: var(--color-gray-50);
        padding: var(--spacing-4);
        border-radius: var(--border-radius-lg);
        margin-bottom: var(--spacing-6);
    }

    .payment-details h3 {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-4);
    }

    .bank-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-3);
        margin-bottom: var(--spacing-4);
    }

    .bank-item {
        padding: var(--spacing-2);
        background-color: var(--color-white);
        border-radius: var(--border-radius);
        font-size: var(--font-size-sm);
    }

    .confirmation-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-6);
    }

    .confirmation-section {
        background-color: var(--color-gray-50);
        padding: var(--spacing-4);
        border-radius: var(--border-radius-lg);
    }

    .confirmation-section h3 {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-3);
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
    }

    .confirmation-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
    }

    .confirmation-info .info-item {
        display: flex;
        justify-content: space-between;
        font-size: var(--font-size-sm);
    }

    .confirmation-info .info-item strong {
        color: var(--color-gray-700);
    }

    .confirmation-items {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
    }

    .confirmation-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-2);
        background-color: var(--color-white);
        border-radius: var(--border-radius);
    }

    .item-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-1);
    }

    .item-nombre {
        font-weight: 600;
        color: var(--color-gray-900);
        font-size: var(--font-size-sm);
    }

    .item-cantidad {
        color: var(--color-gray-600);
        font-size: var(--font-size-xs);
    }

    .item-precio {
        font-weight: 600;
        color: var(--color-primary);
        font-size: var(--font-size-sm);
    }

    .confirmation-total {
        background-color: var(--color-white);
        padding: var(--spacing-4);
        border-radius: var(--border-radius-lg);
        border: 2px solid var(--color-gray-200);
    }

    .total-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-2) 0;
        font-size: var(--font-size-sm);
    }

    .total-line.discount {
        color: var(--color-success);
    }

    .total-line.final {
        font-size: var(--font-size-lg);
        font-weight: 700;
        color: var(--color-gray-900);
        border-top: 2px solid var(--color-gray-200);
        margin-top: var(--spacing-2);
        padding-top: var(--spacing-3);
    }

    .step-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: var(--spacing-8);
        padding-top: var(--spacing-6);
        border-top: 1px solid var(--color-gray-200);
    }

    .checkout-sidebar {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-6);
    }

    .resumen-pedido {
        background-color: var(--color-white);
        border-radius: var(--border-radius-xl);
        padding: var(--spacing-6);
        box-shadow: var(--shadow-sm);
    }

    .resumen-pedido h3 {
        font-size: var(--font-size-xl);
        font-weight: 600;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-4);
    }

    .resumen-items {
        margin-bottom: var(--spacing-4);
    }

    .resumen-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-2) 0;
        border-bottom: 1px solid var(--color-gray-200);
        font-size: var(--font-size-sm);
    }

    .resumen-item:last-child {
        border-bottom: none;
    }

    .resumen-total {
        margin-bottom: var(--spacing-6);
    }

    .resumen-total-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-3) 0;
        font-size: var(--font-size-lg);
        font-weight: 700;
        color: var(--color-gray-900);
        border-top: 2px solid var(--color-gray-200);
    }

    .info-seguridad,
    .contacto-emergencia {
        background-color: var(--color-white);
        border-radius: var(--border-radius-xl);
        padding: var(--spacing-6);
        box-shadow: var(--shadow-sm);
    }

    .info-seguridad h4,
    .contacto-emergencia h4 {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-4);
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
    }

    .info-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        padding: var(--spacing-2) 0;
        font-size: var(--font-size-sm);
        color: var(--color-gray-600);
    }

    .info-item i {
        color: var(--color-primary);
        width: 16px;
    }

    .contacto-emergencia p {
        color: var(--color-gray-600);
        font-size: var(--font-size-sm);
        margin-bottom: var(--spacing-3);
    }

    .contacto-info p {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        margin-bottom: var(--spacing-2);
        color: var(--color-gray-600);
        font-size: var(--font-size-sm);
    }

    .contacto-info i {
        color: var(--color-primary);
        width: 16px;
    }

    .link {
        color: var(--color-primary);
        text-decoration: none;
    }

    .link:hover {
        text-decoration: underline;
    }

    .text-success {
        color: var(--color-success);
    }

    .success-icon {
        text-align: center;
        margin-bottom: var(--spacing-4);
    }

    .success-icon i {
        font-size: var(--font-size-5xl);
        color: var(--color-success);
    }

    .confirmacion-content {
        text-align: center;
    }

    .confirmacion-content h3 {
        font-size: var(--font-size-2xl);
        font-weight: 600;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-4);
    }

    .confirmacion-content p {
        color: var(--color-gray-600);
        margin-bottom: var(--spacing-6);
    }

    .pedido-info {
        background-color: var(--color-gray-50);
        padding: var(--spacing-4);
        border-radius: var(--border-radius-lg);
        margin-bottom: var(--spacing-6);
        text-align: left;
    }

    .pedido-info .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-2) 0;
        border-bottom: 1px solid var(--color-gray-200);
    }

    .pedido-info .info-item:last-child {
        border-bottom: none;
    }

    .acciones-confirmacion {
        display: flex;
        gap: var(--spacing-4);
        justify-content: center;
        flex-wrap: wrap;
    }

    @media (max-width: 768px) {
        .checkout-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-6);
        }

        .form-row {
            grid-template-columns: 1fr;
        }

        .checkout-progress {
            flex-direction: column;
            gap: var(--spacing-4);
        }

        .progress-line {
            width: 2px;
            height: 40px;
            margin: var(--spacing-2) 0;
        }

        .step-actions {
            flex-direction: column;
            gap: var(--spacing-3);
        }

        .step-actions .btn {
            width: 100%;
        }

        .bank-info {
            grid-template-columns: 1fr;
        }

        .acciones-confirmacion {
            flex-direction: column;
        }
    }

    @media (max-width: 480px) {
        .checkout-form-container {
            padding: var(--spacing-4);
        }

        .page-title {
            font-size: var(--font-size-2xl);
            flex-direction: column;
            gap: var(--spacing-2);
        }

        .payment-method-card {
            flex-direction: column;
            text-align: center;
            gap: var(--spacing-2);
        }
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = checkoutStyles;
document.head.appendChild(styleSheet);

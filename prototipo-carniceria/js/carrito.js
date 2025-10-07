// Funcionalidad específica del carrito
document.addEventListener('DOMContentLoaded', function() {
    inicializarCarrito();
    cargarProductosRecomendados();
});

function inicializarCarrito() {
    renderizarPaginaCarrito();
}

function renderizarPaginaCarrito() {
    const container = document.getElementById('carrito-container');
    const resumenItems = document.getElementById('resumen-items');
    const resumenTotal = document.getElementById('resumen-total');

    if (!container) return;

    if (carrito.length === 0) {
        container.innerHTML = `
            <div class="carrito-vacio-page">
                <div class="carrito-vacio-content">
                    <i class="fas fa-shopping-cart"></i>
                    <h2>Tu carrito está vacío</h2>
                    <p>Agrega algunos productos deliciosos para comenzar tu pedido</p>
                    <div class="carrito-vacio-acciones">
                        <a href="catalogo.html" class="btn btn-primary btn-large">
                            <i class="fas fa-store"></i> Ver Catálogo
                        </a>
                        <a href="index.html" class="btn btn-secondary btn-large">
                            <i class="fas fa-home"></i> Ir al Inicio
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        if (resumenItems) resumenItems.innerHTML = '';
        if (resumenTotal) resumenTotal.innerHTML = '';
        return;
    }

    // Renderizar items del carrito
    container.innerHTML = `
        <div class="carrito-items-page">
            ${carrito.map(item => `
                <div class="carrito-item-page" data-producto-id="${item.id_producto}">
                    <div class="carrito-item-imagen">
                        ${item.imagen_url ? 
                            `<img src="${item.imagen_url}" alt="${item.nombre}" loading="lazy">` :
                            obtenerIconoCategoria(item.nombre)
                        }
                    </div>
                    <div class="carrito-item-info">
                        <h3 class="carrito-item-nombre">${item.nombre}</h3>
                        <p class="carrito-item-precio">$${item.precio_unitario.toLocaleString()}/${item.unidad_medida}</p>
                        <div class="carrito-item-cantidad">
                            <button class="cantidad-btn" onclick="actualizarCantidad(${item.id_producto}, ${item.cantidad - 1})" 
                                    ${item.cantidad <= 1 ? 'disabled' : ''}>-</button>
                            <input type="number" class="cantidad-input" value="${item.cantidad}" min="1" 
                                   onchange="actualizarCantidad(${item.id_producto}, parseInt(this.value))"
                                   onblur="validarCantidad(${item.id_producto}, this.value)">
                            <button class="cantidad-btn" onclick="actualizarCantidad(${item.id_producto}, ${item.cantidad + 1})">+</button>
                        </div>
                    </div>
                    <div class="carrito-item-acciones">
                        <div class="carrito-item-subtotal">$${(item.precio_unitario * item.cantidad).toLocaleString()}</div>
                        <button class="btn btn-secondary btn-sm" onclick="eliminarDelCarrito(${item.id_producto})" 
                                title="Eliminar del carrito">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Renderizar resumen
    if (resumenItems && resumenTotal) {
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
}

function obtenerIconoCategoria(nombre) {
    const categoria = nombre.toLowerCase();
    if (categoria.includes('pollo')) {
        return '<i class="fas fa-drumstick-bite"></i>';
    } else if (categoria.includes('res') || categoria.includes('ternera')) {
        return '<i class="fas fa-hamburger"></i>';
    } else if (categoria.includes('cerdo') || categoria.includes('panceta')) {
        return '<i class="fas fa-bacon"></i>';
    } else if (categoria.includes('chorizo') || categoria.includes('salchicha') || categoria.includes('embutido')) {
        return '<i class="fas fa-sausage"></i>';
    }
    return '<i class="fas fa-meat"></i>';
}

function validarCantidad(productoId, valor) {
    const cantidad = parseInt(valor);
    if (isNaN(cantidad) || cantidad < 1) {
        actualizarCantidad(productoId, 1);
    } else {
        actualizarCantidad(productoId, cantidad);
    }
}

async function cargarProductosRecomendados() {
    try {
        // Simular carga de productos recomendados
        const productosRecomendados = productos.filter(p => p.destacado).slice(0, 3);
        const recomendadosGrid = document.getElementById('recomendados-grid');
        
        if (recomendadosGrid && productosRecomendados.length > 0) {
            recomendadosGrid.innerHTML = productosRecomendados.map(producto => `
                <div class="recomendado-item">
                    <div class="recomendado-imagen">
                        ${producto.imagen_url ? 
                            `<img src="${producto.imagen_url}" alt="${producto.nombre}">` :
                            obtenerIconoCategoria(producto.nombre)
                        }
                    </div>
                    <div class="recomendado-info">
                        <h5>${producto.nombre}</h5>
                        <p class="recomendado-precio">$${producto.precio.toLocaleString()}</p>
                        <button class="btn btn-primary btn-sm" onclick="agregarAlCarrito(${producto.id})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error al cargar productos recomendados:', error);
    }
}

// Escuchar cambios en el carrito para actualizar la página
document.addEventListener('carritoActualizado', () => {
    renderizarPaginaCarrito();
});

// Estilos adicionales para la página del carrito
const carritoStyles = `
    .breadcrumb {
        background-color: var(--color-gray-50);
        padding: var(--spacing-4) 0;
        border-bottom: 1px solid var(--color-gray-200);
    }

    .breadcrumb-nav {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        font-size: var(--font-size-sm);
    }

    .breadcrumb-link {
        color: var(--color-gray-600);
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: var(--spacing-1);
        transition: var(--transition);
    }

    .breadcrumb-link:hover {
        color: var(--color-primary);
    }

    .breadcrumb-separator {
        color: var(--color-gray-400);
    }

    .breadcrumb-current {
        color: var(--color-gray-900);
        font-weight: 500;
    }

    .main-content {
        padding: var(--spacing-8) 0;
        background-color: var(--color-gray-50);
        min-height: 60vh;
    }

    .carrito-page {
        max-width: 1200px;
        margin: 0 auto;
    }

    .carrito-page-header {
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

    .carrito-page-content {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: var(--spacing-8);
        align-items: start;
    }

    .carrito-container {
        background-color: var(--color-white);
        border-radius: var(--border-radius-xl);
        padding: var(--spacing-6);
        box-shadow: var(--shadow-sm);
    }

    .carrito-vacio-page {
        text-align: center;
        padding: var(--spacing-16);
    }

    .carrito-vacio-content {
        max-width: 400px;
        margin: 0 auto;
    }

    .carrito-vacio-content i {
        font-size: var(--font-size-5xl);
        color: var(--color-gray-300);
        margin-bottom: var(--spacing-6);
    }

    .carrito-vacio-content h2 {
        font-size: var(--font-size-2xl);
        font-weight: 600;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-4);
    }

    .carrito-vacio-content p {
        color: var(--color-gray-600);
        margin-bottom: var(--spacing-8);
    }

    .carrito-vacio-acciones {
        display: flex;
        gap: var(--spacing-4);
        justify-content: center;
        flex-wrap: wrap;
    }

    .carrito-items-page {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
    }

    .carrito-item-page {
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
        padding: var(--spacing-4);
        border: 1px solid var(--color-gray-200);
        border-radius: var(--border-radius-lg);
        background-color: var(--color-white);
        transition: var(--transition);
    }

    .carrito-item-page:hover {
        box-shadow: var(--shadow-md);
        border-color: var(--color-primary);
    }

    .carrito-item-imagen {
        width: 80px;
        height: 80px;
        border-radius: var(--border-radius);
        overflow: hidden;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-gray-100);
    }

    .carrito-item-imagen img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .carrito-item-imagen i {
        font-size: var(--font-size-2xl);
        color: var(--color-gray-500);
    }

    .carrito-item-info {
        flex: 1;
    }

    .carrito-item-nombre {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-1);
    }

    .carrito-item-precio {
        color: var(--color-gray-600);
        font-size: var(--font-size-sm);
        margin-bottom: var(--spacing-3);
    }

    .carrito-item-cantidad {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
    }

    .cantidad-btn {
        width: 32px;
        height: 32px;
        border: 1px solid var(--color-gray-300);
        background-color: var(--color-white);
        border-radius: var(--border-radius);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition);
        font-size: var(--font-size-sm);
    }

    .cantidad-btn:hover {
        background-color: var(--color-gray-50);
        border-color: var(--color-primary);
    }

    .cantidad-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .cantidad-input {
        width: 60px;
        text-align: center;
        border: 1px solid var(--color-gray-300);
        border-radius: var(--border-radius);
        padding: var(--spacing-2);
        font-size: var(--font-size-sm);
    }

    .cantidad-input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1);
    }

    .carrito-item-acciones {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: var(--spacing-2);
    }

    .carrito-item-subtotal {
        font-weight: 600;
        color: var(--color-primary);
        font-size: var(--font-size-lg);
    }

    .carrito-sidebar {
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

    .resumen-acciones {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
    }

    .info-entrega {
        background-color: var(--color-white);
        border-radius: var(--border-radius-xl);
        padding: var(--spacing-6);
        box-shadow: var(--shadow-sm);
    }

    .info-entrega h4 {
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

    .productos-recomendados {
        background-color: var(--color-white);
        border-radius: var(--border-radius-xl);
        padding: var(--spacing-6);
        box-shadow: var(--shadow-sm);
    }

    .productos-recomendados h4 {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-4);
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
    }

    .recomendados-grid {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
    }

    .recomendado-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        padding: var(--spacing-3);
        border: 1px solid var(--color-gray-200);
        border-radius: var(--border-radius);
        transition: var(--transition);
    }

    .recomendado-item:hover {
        border-color: var(--color-primary);
        box-shadow: var(--shadow-sm);
    }

    .recomendado-imagen {
        width: 50px;
        height: 50px;
        border-radius: var(--border-radius);
        overflow: hidden;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-gray-100);
    }

    .recomendado-imagen img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .recomendado-imagen i {
        font-size: var(--font-size-lg);
        color: var(--color-gray-500);
    }

    .recomendado-info {
        flex: 1;
    }

    .recomendado-info h5 {
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-1);
    }

    .recomendado-precio {
        font-size: var(--font-size-xs);
        color: var(--color-primary);
        font-weight: 600;
        margin-bottom: var(--spacing-2);
    }

    @media (max-width: 768px) {
        .carrito-page-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-6);
        }

        .carrito-item-page {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-3);
        }

        .carrito-item-acciones {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }

        .carrito-vacio-acciones {
            flex-direction: column;
        }
    }

    @media (max-width: 480px) {
        .page-title {
            font-size: var(--font-size-2xl);
            flex-direction: column;
            gap: var(--spacing-2);
        }

        .carrito-item-page {
            padding: var(--spacing-3);
        }

        .carrito-item-imagen {
            width: 60px;
            height: 60px;
        }
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = carritoStyles;
document.head.appendChild(styleSheet);

// Función para proceder al pago
function procederAlPago() {
    // Verificar que hay productos en el carrito
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega algunos productos antes de proceder al pago.');
        return;
    }

    // Redirigir al checkout
    window.location.href = 'checkout.html';
}

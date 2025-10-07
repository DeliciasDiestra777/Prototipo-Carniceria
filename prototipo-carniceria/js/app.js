// Datos de productos de ejemplo
const productos = [
    {
        id: 1,
        nombre: "Pechuga de Pollo",
        descripcion: "Pechuga de pollo fresca, ideal para asar o cocinar",
        precio: 8500,
        unidad_medida: "kg",
        categoria: "Pollo",
        stock: 25,
        imagen_url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        destacado: true
    },
    {
        id: 2,
        nombre: "Lomo de Res",
        descripcion: "Corte premium de lomo de res, perfecto para parrilla",
        precio: 25000,
        unidad_medida: "kg",
        categoria: "Res",
        stock: 15,
        imagen_url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        destacado: true
    },
    {
        id: 3,
        nombre: "Costilla de Cerdo",
        descripcion: "Costillas de cerdo frescas para barbacoa",
        precio: 12000,
        unidad_medida: "kg",
        categoria: "Cerdo",
        stock: 20,
        imagen_url: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        destacado: true
    },
    {
        id: 4,
        nombre: "Chorizo Artesanal",
        descripcion: "Chorizo artesanal con especias tradicionales",
        precio: 18000,
        unidad_medida: "kg",
        categoria: "Embutidos",
        stock: 12,
        imagen_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        destacado: true
    },
    {
        id: 5,
        nombre: "Muslo de Pollo",
        descripcion: "Muslos de pollo con hueso, ideales para guisos",
        precio: 7500,
        unidad_medida: "kg",
        categoria: "Pollo",
        stock: 30,
        imagen_url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 6,
        nombre: "Ternera Premium",
        descripcion: "Ternera de primera calidad, tierna y jugosa",
        precio: 32000,
        unidad_medida: "kg",
        categoria: "Res",
        stock: 8,
        imagen_url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 7,
        nombre: "Panceta Ahumada",
        descripcion: "Panceta de cerdo ahumada, perfecta para desayunos",
        precio: 15000,
        unidad_medida: "kg",
        categoria: "Cerdo",
        stock: 18,
        imagen_url: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 8,
        nombre: "Salchicha Alemana",
        descripcion: "Salchichas alemanas tradicionales",
        precio: 16000,
        unidad_medida: "kg",
        categoria: "Embutidos",
        stock: 14,
        imagen_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
];

// Carrito de compras
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Usuario actual (simulado)
let usuarioActual = JSON.parse(localStorage.getItem('usuario')) || null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

function inicializarApp() {
    cargarProductosDestacados();
    actualizarCarrito();
    configurarEventos();
    verificarSesion();
}

function cargarProductosDestacados() {
    const productosDestacados = productos.filter(p => p.destacado);
    const grid = document.getElementById('productos-grid');
    
    if (grid) {
        grid.innerHTML = productosDestacados.map(producto => crearTarjetaProducto(producto)).join('');
    }
}

function crearTarjetaProducto(producto) {
    return `
        <div class="producto-card" data-producto-id="${producto.id}">
            <div class="producto-imagen">
                <img src="${producto.imagen_url}" alt="${producto.nombre}" loading="lazy">
                <div class="producto-badge">Destacado</div>
            </div>
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <div class="producto-precio">
                    $${producto.precio.toLocaleString()}
                    <span class="producto-unidad">/${producto.unidad_medida}</span>
                </div>
                <div class="producto-stock">
                    <i class="fas fa-check-circle"></i> Stock: ${producto.stock} ${producto.unidad_medida}
                </div>
                <div class="producto-acciones">
                    <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${producto.id})">
                        <i class="fas fa-shopping-cart"></i> Agregar
                    </button>
                    <button class="btn-favorito" onclick="toggleFavorito(${producto.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;
    
    const itemExistente = carrito.find(item => item.id_producto === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            id_producto: productoId,
            nombre: producto.nombre,
            precio_unitario: producto.precio,
            cantidad: 1,
            unidad_medida: producto.unidad_medida,
            imagen_url: producto.imagen_url
        });
    }
    
    guardarCarrito();
    actualizarCarrito();
    mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
}

function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id_producto !== productoId);
    guardarCarrito();
    actualizarCarrito();
    
    // Disparar evento personalizado para actualizar la página del carrito
    document.dispatchEvent(new CustomEvent('carritoActualizado'));
    
    mostrarNotificacion('Producto eliminado del carrito', 'info');
}

function actualizarCantidad(productoId, nuevaCantidad) {
    const item = carrito.find(item => item.id_producto === productoId);
    if (item) {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(productoId);
        } else {
            item.cantidad = nuevaCantidad;
            guardarCarrito();
            actualizarCarrito();
            
            // Disparar evento personalizado para actualizar la página del carrito
            document.dispatchEvent(new CustomEvent('carritoActualizado'));
        }
    }
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarCarrito() {
    const badge = document.getElementById('carrito-badge');
    if (badge) {
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline' : 'none';
    }
    
    // Actualizar contenido del carrito si está abierto
    const carritoContent = document.getElementById('carrito-content');
    if (carritoContent) {
        renderizarCarrito();
    }
}

function renderizarCarrito() {
    const carritoContent = document.getElementById('carrito-content');
    if (!carritoContent) return;
    
    if (carrito.length === 0) {
        carritoContent.innerHTML = `
            <div class="carrito-vacio">
                <i class="fas fa-shopping-cart"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega algunos productos deliciosos</p>
            </div>
        `;
        return;
    }
    
    carritoContent.innerHTML = carrito.map(item => `
        <div class="carrito-item">
            <div class="carrito-item-imagen">
                <img src="${item.imagen_url}" alt="${item.nombre}">
            </div>
            <div class="carrito-item-info">
                <h4 class="carrito-item-nombre">${item.nombre}</h4>
                <p class="carrito-item-precio">$${item.precio_unitario.toLocaleString()}/${item.unidad_medida}</p>
                <div class="carrito-item-cantidad">
                    <button class="cantidad-btn" onclick="actualizarCantidad(${item.id_producto}, ${item.cantidad - 1})">-</button>
                    <input type="number" class="cantidad-input" value="${item.cantidad}" min="1" 
                           onchange="actualizarCantidad(${item.id_producto}, parseInt(this.value))">
                    <button class="cantidad-btn" onclick="actualizarCantidad(${item.id_producto}, ${item.cantidad + 1})">+</button>
                </div>
            </div>
            <div class="carrito-item-acciones">
                <div class="carrito-item-subtotal">$${(item.precio_unitario * item.cantidad).toLocaleString()}</div>
                <button class="btn btn-secondary btn-sm" onclick="eliminarDelCarrito(${item.id_producto})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('') + `
        <div class="carrito-total">
            <span>Total:</span>
            <span>$${obtenerTotalCarrito().toLocaleString()}</span>
        </div>
    `;
}

function obtenerTotalCarrito() {
    return carrito.reduce((total, item) => total + (item.precio_unitario * item.cantidad), 0);
}

function limpiarCarrito() {
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    renderizarCarrito();
    mostrarNotificacion('Carrito limpiado', 'info');
}

function procederAlPago() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío', 'warning');
        return;
    }
    
    if (!usuarioActual) {
        mostrarNotificacion('Debes iniciar sesión para continuar', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    mostrarNotificacion('Redirigiendo al proceso de pago...', 'info');
    // Aquí se implementaría la lógica de pago
}

function configurarEventos() {
    // Modal del carrito
    const carritoLink = document.getElementById('carrito-link');
    const carritoModal = document.getElementById('carrito-modal');
    const closeCarritoModal = document.getElementById('close-carrito-modal');
    
    if (carritoLink && carritoModal) {
        carritoLink.addEventListener('click', (e) => {
            e.preventDefault();
            carritoModal.classList.add('show');
            renderizarCarrito();
        });
    }
    
    if (closeCarritoModal && carritoModal) {
        closeCarritoModal.addEventListener('click', () => {
            carritoModal.classList.remove('show');
        });
    }
    
    // Cerrar modal al hacer clic fuera
    if (carritoModal) {
        carritoModal.addEventListener('click', (e) => {
            if (e.target === carritoModal) {
                carritoModal.classList.remove('show');
            }
        });
    }
    
    // Dropdown de usuario
    const userButton = document.getElementById('user-button');
    const userMenu = document.getElementById('user-menu');
    
    if (userButton && userMenu) {
        userButton.addEventListener('click', () => {
            userMenu.classList.toggle('show');
        });
        
        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!userButton.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.remove('show');
            }
        });
    }
    
    // Botón de cerrar sesión
    const logoutButton = document.getElementById('user-logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', cerrarSesion);
    }
    
    // Botón de explorar catálogo
    const abrirCatalogoBtn = document.getElementById('abrir-catalogo');
    if (abrirCatalogoBtn) {
        abrirCatalogoBtn.addEventListener('click', () => {
            window.location.href = 'catalogo.html';
        });
    }
}

function verificarSesion() {
    const navUserArea = document.getElementById('nav-user-area');
    const navUserLogged = document.getElementById('nav-user-logged');
    const userName = document.getElementById('user-name');
    
    if (usuarioActual) {
        if (navUserArea) navUserArea.style.display = 'none';
        if (navUserLogged) navUserLogged.style.display = 'flex';
        if (userName) userName.textContent = usuarioActual.nombre;
    } else {
        if (navUserArea) navUserArea.style.display = 'flex';
        if (navUserLogged) navUserLogged.style.display = 'none';
    }
}

function cerrarSesion() {
    usuarioActual = null;
    localStorage.removeItem('usuario');
    verificarSesion();
    mostrarNotificacion('Sesión cerrada', 'info');
}

function toggleFavorito(productoId) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const index = favoritos.indexOf(productoId);
    
    if (index > -1) {
        favoritos.splice(index, 1);
        mostrarNotificacion('Eliminado de favoritos', 'info');
    } else {
        favoritos.push(productoId);
        mostrarNotificacion('Agregado a favoritos', 'success');
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    
    // Actualizar botón de favorito
    const botonFavorito = document.querySelector(`[data-producto-id="${productoId}"] .btn-favorito`);
    if (botonFavorito) {
        botonFavorito.classList.toggle('active');
    }
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : tipo === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    // Agregar estilos si no existen
    if (!document.getElementById('notificacion-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notificacion-styles';
        styles.textContent = `
            .notificacion {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                padding: 16px;
                z-index: 3000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            .notificacion.show {
                transform: translateX(0);
            }
            .notificacion-contenido {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .notificacion-success { border-left: 4px solid #10b981; }
            .notificacion-error { border-left: 4px solid #ef4444; }
            .notificacion-warning { border-left: 4px solid #f59e0b; }
            .notificacion-info { border-left: 4px solid #3b82f6; }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notificacion);
    
    // Mostrar notificación
    setTimeout(() => notificacion.classList.add('show'), 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notificacion.classList.remove('show');
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

// Funciones para filtrado por categoría
function filtrarPorCategoria(categoria) {
    const productosFiltrados = productos.filter(p => p.categoria === categoria);
    const grid = document.getElementById('productos-grid');
    
    if (grid) {
        grid.innerHTML = productosFiltrados.map(producto => crearTarjetaProducto(producto)).join('');
    }
    
    // Scroll hacia la sección de productos
    const seccionProductos = document.getElementById('productos-destacados');
    if (seccionProductos) {
        seccionProductos.scrollIntoView({ behavior: 'smooth' });
    }
}

// Funciones globales para uso en HTML
window.agregarAlCarrito = agregarAlCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;
window.actualizarCantidad = actualizarCantidad;
window.limpiarCarrito = limpiarCarrito;
window.procederAlPago = procederAlPago;
window.toggleFavorito = toggleFavorito;
window.filtrarPorCategoria = filtrarPorCategoria;

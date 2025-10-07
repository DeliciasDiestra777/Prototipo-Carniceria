// Funcionalidad específica del catálogo
let productosFiltrados = [...productos];
let productosPorPagina = 9;
let paginaActual = 1;

document.addEventListener('DOMContentLoaded', function() {
    inicializarCatalogo();
    configurarFiltros();
    configurarEventosCatalogo();
});

function inicializarCatalogo() {
    renderizarProductos();
    actualizarContador();
}

function configurarFiltros() {
    // Filtros de categoría
    const filtrosCategoria = document.querySelectorAll('input[name="categoria"]');
    filtrosCategoria.forEach(filtro => {
        filtro.addEventListener('change', aplicarFiltros);
    });

    // Filtro de precio
    const precioMax = document.getElementById('precio-max');
    const precioMaxInput = document.getElementById('precio-max-input');
    
    if (precioMax && precioMaxInput) {
        precioMax.addEventListener('input', function() {
            precioMaxInput.value = this.value;
            aplicarFiltros();
        });

        precioMaxInput.addEventListener('input', function() {
            precioMax.value = this.value;
            aplicarFiltros();
        });
    }

    // Ordenamiento
    const ordenarSelect = document.getElementById('filtros-ordenar');
    if (ordenarSelect) {
        ordenarSelect.addEventListener('change', aplicarFiltros);
    }

    // Limpiar filtros
    const btnLimpiarFiltros = document.getElementById('btn-limpiar-filtros');
    if (btnLimpiarFiltros) {
        btnLimpiarFiltros.addEventListener('click', limpiarFiltros);
    }
}

function aplicarFiltros() {
    let productosFiltradosTemp = [...productos];

    // Filtrar por categoría
    const categoriasSeleccionadas = Array.from(document.querySelectorAll('input[name="categoria"]:checked'))
        .map(input => input.value);
    
    if (categoriasSeleccionadas.length > 0) {
        productosFiltradosTemp = productosFiltradosTemp.filter(producto => 
            categoriasSeleccionadas.includes(producto.categoria.toLowerCase())
        );
    }

    // Filtrar por precio
    const precioMaximo = parseInt(document.getElementById('precio-max-input').value) || 50000;
    productosFiltradosTemp = productosFiltradosTemp.filter(producto => 
        producto.precio <= precioMaximo
    );

    // Ordenar
    const ordenarPor = document.getElementById('filtros-ordenar').value;
    productosFiltradosTemp = ordenarProductos(productosFiltradosTemp, ordenarPor);

    productosFiltrados = productosFiltradosTemp;
    paginaActual = 1;
    renderizarProductos();
    actualizarContador();
}

function ordenarProductos(productos, criterio) {
    switch (criterio) {
        case 'nombre':
            return productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        case 'precio-asc':
            return productos.sort((a, b) => a.precio - b.precio);
        case 'precio-desc':
            return productos.sort((a, b) => b.precio - a.precio);
        case 'stock':
            return productos.sort((a, b) => b.stock - a.stock);
        default:
            return productos;
    }
}

function limpiarFiltros() {
    // Limpiar checkboxes de categoría
    document.querySelectorAll('input[name="categoria"]').forEach(input => {
        input.checked = false;
    });

    // Resetear precio
    const precioMax = document.getElementById('precio-max');
    const precioMaxInput = document.getElementById('precio-max-input');
    if (precioMax && precioMaxInput) {
        precioMax.value = 50000;
        precioMaxInput.value = 50000;
    }

    // Resetear ordenamiento
    const ordenarSelect = document.getElementById('filtros-ordenar');
    if (ordenarSelect) {
        ordenarSelect.value = 'nombre';
    }

    // Aplicar filtros (que ahora están limpios)
    aplicarFiltros();
}

function renderizarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = productosFiltrados.slice(inicio, fin);

    if (productosPagina.length === 0) {
        contenedor.innerHTML = `
            <div class="productos-vacio">
                <i class="fas fa-search"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar los filtros para encontrar lo que buscas</p>
                <button class="btn btn-primary" onclick="limpiarFiltros()">
                    <i class="fas fa-eraser"></i> Limpiar Filtros
                </button>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = productosPagina.map(producto => crearTarjetaProducto(producto)).join('');
    renderizarPaginacion();
}

function crearTarjetaProducto(producto) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const esFavorito = favoritos.includes(producto.id);

    return `
        <div class="producto-card" data-producto-id="${producto.id}">
            <div class="producto-imagen">
                <img src="${producto.imagen_url}" alt="${producto.nombre}" loading="lazy">
                ${producto.destacado ? '<div class="producto-badge">Destacado</div>' : ''}
            </div>
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <div class="producto-precio">
                    $${producto.precio.toLocaleString()}
                    <span class="producto-unidad">/${producto.unidad_medida}</span>
                </div>
                <div class="producto-stock ${producto.stock < 10 ? 'stock-bajo' : ''}">
                    <i class="fas fa-${producto.stock < 10 ? 'exclamation-triangle' : 'check-circle'}"></i> 
                    Stock: ${producto.stock} ${producto.unidad_medida}
                </div>
                <div class="producto-acciones">
                    <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${producto.id})">
                        <i class="fas fa-shopping-cart"></i> Agregar
                    </button>
                    <button class="btn-favorito ${esFavorito ? 'active' : ''}" onclick="toggleFavorito(${producto.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderizarPaginacion() {
    const paginacion = document.getElementById('paginacion');
    if (!paginacion) return;

    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    
    if (totalPaginas <= 1) {
        paginacion.innerHTML = '';
        return;
    }

    let paginacionHTML = '<div class="paginacion-controls">';
    
    // Botón anterior
    if (paginaActual > 1) {
        paginacionHTML += `<button class="btn-pagina" onclick="cambiarPagina(${paginaActual - 1})">
            <i class="fas fa-chevron-left"></i> Anterior
        </button>`;
    }

    // Números de página
    const inicioPagina = Math.max(1, paginaActual - 2);
    const finPagina = Math.min(totalPaginas, paginaActual + 2);

    for (let i = inicioPagina; i <= finPagina; i++) {
        paginacionHTML += `<button class="btn-pagina ${i === paginaActual ? 'active' : ''}" 
            onclick="cambiarPagina(${i})">${i}</button>`;
    }

    // Botón siguiente
    if (paginaActual < totalPaginas) {
        paginacionHTML += `<button class="btn-pagina" onclick="cambiarPagina(${paginaActual + 1})">
            Siguiente <i class="fas fa-chevron-right"></i>
        </button>`;
    }

    paginacionHTML += '</div>';
    paginacion.innerHTML = paginacionHTML;
}

function cambiarPagina(nuevaPagina) {
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
        paginaActual = nuevaPagina;
        renderizarProductos();
        
        // Scroll hacia arriba
        document.querySelector('.catalogo-content').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function actualizarContador() {
    const contador = document.getElementById('productos-contador');
    if (contador) {
        const total = productosFiltrados.length;
        contador.textContent = `${total} producto${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`;
    }
}

function configurarEventosCatalogo() {
    // Toggle de filtros en móvil
    const toggleFiltrosMobile = document.getElementById('toggle-filtros-mobile');
    const sidebar = document.querySelector('.catalogo-sidebar');
    
    if (toggleFiltrosMobile && sidebar) {
        toggleFiltrosMobile.addEventListener('click', () => {
            sidebar.classList.toggle('show-mobile');
        });
    }

    // Cerrar sidebar móvil al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (sidebar && !sidebar.contains(e.target) && !toggleFiltrosMobile.contains(e.target)) {
            sidebar.classList.remove('show-mobile');
        }
    });
}

// Funciones globales para uso en HTML
window.cambiarPagina = cambiarPagina;
window.limpiarFiltros = limpiarFiltros;

// Estilos adicionales para el catálogo
const catalogoStyles = `
    .hero-catalogo {
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
        color: var(--color-white);
        padding: var(--spacing-16) 0;
        text-align: center;
    }

    .hero-catalogo .hero-title {
        font-size: var(--font-size-4xl);
        font-weight: 700;
        margin-bottom: var(--spacing-4);
    }

    .hero-catalogo .hero-subtitle {
        font-size: var(--font-size-lg);
        opacity: 0.9;
    }

    .catalogo-main {
        padding: var(--spacing-16) 0;
        background-color: var(--color-gray-50);
        min-height: 60vh;
    }

    .catalogo-layout {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: var(--spacing-8);
        align-items: start;
    }

    .catalogo-sidebar {
        background-color: var(--color-white);
        border-radius: var(--border-radius-xl);
        padding: var(--spacing-6);
        box-shadow: var(--shadow-sm);
        position: sticky;
        top: 100px;
    }

    .filtros-container {
        position: relative;
    }

    .filtros-title {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-6);
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
    }

    .filtros-section {
        margin-bottom: var(--spacing-6);
    }

    .filtros-section h4 {
        font-size: var(--font-size-base);
        font-weight: 600;
        color: var(--color-gray-700);
        margin-bottom: var(--spacing-3);
    }

    .filtros-categorias {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
    }

    .filtro-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        cursor: pointer;
        padding: var(--spacing-2);
        border-radius: var(--border-radius);
        transition: var(--transition);
    }

    .filtro-item:hover {
        background-color: var(--color-gray-50);
    }

    .filtro-item input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--color-primary);
    }

    .filtros-precio {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
    }

    .precio-slider {
        position: relative;
    }

    .precio-range {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: var(--color-gray-200);
        outline: none;
        -webkit-appearance: none;
    }

    .precio-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--color-primary);
        cursor: pointer;
    }

    .precio-labels {
        display: flex;
        justify-content: space-between;
        font-size: var(--font-size-sm);
        color: var(--color-gray-600);
        margin-top: var(--spacing-2);
    }

    .precio-input label {
        font-size: var(--font-size-sm);
        color: var(--color-gray-700);
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
    }

    .precio-input input {
        width: 80px;
        padding: var(--spacing-2);
        border: 1px solid var(--color-gray-300);
        border-radius: var(--border-radius);
        font-size: var(--font-size-sm);
    }

    .filtros-ordenar {
        width: 100%;
        padding: var(--spacing-3);
        border: 1px solid var(--color-gray-300);
        border-radius: var(--border-radius);
        background-color: var(--color-white);
        font-size: var(--font-size-sm);
    }

    .catalogo-content {
        background-color: var(--color-white);
        border-radius: var(--border-radius-xl);
        padding: var(--spacing-6);
        box-shadow: var(--shadow-sm);
    }

    .productos-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-6);
        flex-wrap: wrap;
        gap: var(--spacing-4);
    }

    .productos-info h2 {
        font-size: var(--font-size-2xl);
        font-weight: 700;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-2);
    }

    .productos-contador {
        color: var(--color-gray-600);
        font-size: var(--font-size-sm);
    }

    .productos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--spacing-6);
        margin-bottom: var(--spacing-8);
    }

    .productos-vacio {
        text-align: center;
        padding: var(--spacing-16);
        color: var(--color-gray-500);
        grid-column: 1 / -1;
    }

    .productos-vacio i {
        font-size: var(--font-size-4xl);
        margin-bottom: var(--spacing-4);
        color: var(--color-gray-300);
    }

    .productos-vacio h3 {
        font-size: var(--font-size-xl);
        margin-bottom: var(--spacing-2);
    }

    .stock-bajo {
        color: var(--color-warning) !important;
    }

    .paginacion {
        display: flex;
        justify-content: center;
        margin-top: var(--spacing-8);
    }

    .paginacion-controls {
        display: flex;
        gap: var(--spacing-2);
        align-items: center;
    }

    .btn-pagina {
        padding: var(--spacing-2) var(--spacing-4);
        border: 1px solid var(--color-gray-300);
        background-color: var(--color-white);
        color: var(--color-gray-700);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: var(--transition);
        font-size: var(--font-size-sm);
    }

    .btn-pagina:hover {
        background-color: var(--color-gray-50);
        border-color: var(--color-primary);
    }

    .btn-pagina.active {
        background-color: var(--color-primary);
        color: var(--color-white);
        border-color: var(--color-primary);
    }

    .toggle-filtros-mobile {
        display: none;
    }

    @media (max-width: 768px) {
        .catalogo-layout {
            grid-template-columns: 1fr;
            gap: var(--spacing-4);
        }

        .catalogo-sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            width: 300px;
            height: 100vh;
            z-index: 1000;
            transition: left 0.3s ease;
            overflow-y: auto;
        }

        .catalogo-sidebar.show-mobile {
            left: 0;
        }

        .toggle-filtros-mobile {
            display: block;
        }

        .productos-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: var(--spacing-4);
        }
    }

    @media (max-width: 480px) {
        .productos-grid {
            grid-template-columns: 1fr;
        }

        .productos-header {
            flex-direction: column;
            align-items: flex-start;
        }
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = catalogoStyles;
document.head.appendChild(styleSheet);

// Funcionalidad de transformación de productos
let transformaciones = JSON.parse(localStorage.getItem('transformaciones')) || [];
let productosSeleccionados = [];

document.addEventListener('DOMContentLoaded', function() {
    inicializarTransformacion();
    configurarEventos();
    cargarHistorial();
});

function inicializarTransformacion() {
    // Establecer fecha actual
    const fechaInput = document.getElementById('fecha-proceso');
    if (fechaInput) {
        const hoy = new Date().toISOString().split('T')[0];
        fechaInput.value = hoy;
    }

    // Establecer usuario responsable
    const responsableInput = document.getElementById('usuario-responsable');
    if (responsableInput) {
        responsableInput.value = 'Administrador';
    }

    cargarOpcionesProductos();
}

function cargarOpcionesProductos() {
    const multiSelectOptions = document.getElementById('multi-select-options');
    const productoSalidaSelect = document.getElementById('producto-salida');
    
    if (multiSelectOptions) {
        multiSelectOptions.innerHTML = productos.map(producto => `
            <div class="multi-select-option" data-producto-id="${producto.id}">
                <input type="checkbox" id="producto-${producto.id}" value="${producto.id}">
                <label for="producto-${producto.id}">
                    <span class="producto-nombre">${producto.nombre}</span>
                    <span class="producto-categoria">${producto.categoria}</span>
                    <span class="producto-stock">Stock: ${producto.stock}</span>
                </label>
            </div>
        `).join('');
    }

    if (productoSalidaSelect) {
        productoSalidaSelect.innerHTML = '<option value="">Selecciona el producto resultante...</option>' +
            productos.map(producto => `
                <option value="${producto.id}">${producto.nombre} (${producto.categoria})</option>
            `).join('');
    }
}

function configurarEventos() {
    // Multi-select dropdown
    const multiSelectDropdown = document.getElementById('multi-select-dropdown');
    const multiSelectSelected = document.getElementById('multi-select-selected');
    
    if (multiSelectDropdown && multiSelectSelected) {
        multiSelectSelected.addEventListener('click', () => {
            multiSelectDropdown.classList.toggle('open');
        });

        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!multiSelectDropdown.contains(e.target)) {
                multiSelectDropdown.classList.remove('open');
            }
        });
    }

    // Checkboxes de productos
    const multiSelectOptions = document.getElementById('multi-select-options');
    if (multiSelectOptions) {
        multiSelectOptions.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                manejarSeleccionProducto(e.target);
            }
        });
    }

    // Formulario de transformación
    const formularioTransformacion = document.getElementById('formulario-transformacion');
    if (formularioTransformacion) {
        formularioTransformacion.addEventListener('submit', manejarTransformacion);
    }

    // Botón limpiar formulario
    const limpiarFormulario = document.getElementById('limpiar-formulario');
    if (limpiarFormulario) {
        limpiarFormulario.addEventListener('click', limpiarFormularioTransformacion);
    }

    // Botón nueva transformación
    const nuevaTransformacion = document.getElementById('nueva-transformacion');
    if (nuevaTransformacion) {
        nuevaTransformacion.addEventListener('click', mostrarFormularioTransformacion);
    }

    // Botón cerrar transformación
    const cerrarTransformacion = document.getElementById('cerrar-transformacion');
    if (cerrarTransformacion) {
        cerrarTransformacion.addEventListener('click', ocultarFormularioTransformacion);
    }

    // Filtros del historial
    const filtroFecha = document.getElementById('filtro-fecha');
    const filtroResponsable = document.getElementById('filtro-responsable');
    const limpiarFiltrosHistorial = document.getElementById('limpiar-filtros-historial');

    if (filtroFecha) {
        filtroFecha.addEventListener('change', filtrarHistorial);
    }

    if (filtroResponsable) {
        filtroResponsable.addEventListener('change', filtrarHistorial);
    }

    if (limpiarFiltrosHistorial) {
        limpiarFiltrosHistorial.addEventListener('click', limpiarFiltrosHistorialTransformacion);
    }
}

function manejarSeleccionProducto(checkbox) {
    const productoId = parseInt(checkbox.value);
    const producto = productos.find(p => p.id === productoId);

    if (checkbox.checked) {
        productosSeleccionados.push(producto);
    } else {
        productosSeleccionados = productosSeleccionados.filter(p => p.id !== productoId);
    }

    actualizarProductosSeleccionados();
}

function actualizarProductosSeleccionados() {
    const selectedItems = document.getElementById('selected-items');
    if (!selectedItems) return;

    if (productosSeleccionados.length === 0) {
        selectedItems.innerHTML = '';
        return;
    }

    selectedItems.innerHTML = productosSeleccionados.map(producto => `
        <div class="selected-item" data-producto-id="${producto.id}">
            <span class="selected-item-nombre">${producto.nombre}</span>
            <span class="selected-item-categoria">${producto.categoria}</span>
            <button type="button" class="remove-item" onclick="removerProducto(${producto.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function removerProducto(productoId) {
    productosSeleccionados = productosSeleccionados.filter(p => p.id !== productoId);
    
    // Desmarcar checkbox
    const checkbox = document.getElementById(`producto-${productoId}`);
    if (checkbox) {
        checkbox.checked = false;
    }
    
    actualizarProductosSeleccionados();
}

function manejarTransformacion(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const datos = Object.fromEntries(formData.entries());

    // Validaciones
    if (!validarFormularioTransformacion(datos)) {
        return;
    }

    // Crear objeto de transformación
    const transformacion = {
        id: Date.now(),
        productosEntrada: productosSeleccionados.map(p => ({
            id: p.id,
            nombre: p.nombre,
            categoria: p.categoria
        })),
        cantidadEntrada: parseFloat(datos['cantidad-entrada']),
        unidadEntrada: datos['unidad-entrada'],
        productoSalida: {
            id: parseInt(datos['producto-salida']),
            nombre: productos.find(p => p.id === parseInt(datos['producto-salida'])).nombre
        },
        cantidadSalida: parseFloat(datos['cantidad-salida']),
        unidadSalida: datos['unidad-salida'],
        fechaProceso: datos['fecha-proceso'],
        usuarioResponsable: datos['usuario-responsable'],
        observaciones: datos['observaciones'] || '',
        fechaCreacion: new Date().toISOString()
    };

    // Guardar transformación
    transformaciones.unshift(transformacion);
    localStorage.setItem('transformaciones', JSON.stringify(transformaciones));

    // Mostrar éxito
    mostrarNotificacion('Transformación registrada exitosamente', 'success');

    // Limpiar formulario y ocultar modal
    limpiarFormularioTransformacion();
    ocultarFormularioTransformacion();
    
    // Actualizar historial
    cargarHistorial();
}

function validarFormularioTransformacion(datos) {
    // Validar productos de entrada
    if (productosSeleccionados.length === 0) {
        mostrarNotificacion('Debes seleccionar al menos un producto de entrada', 'error');
        return false;
    }

    // Validar cantidad de entrada
    if (!datos['cantidad-entrada'] || parseFloat(datos['cantidad-entrada']) <= 0) {
        mostrarNotificacion('La cantidad de entrada debe ser mayor a 0', 'error');
        return false;
    }

    // Validar producto de salida
    if (!datos['producto-salida']) {
        mostrarNotificacion('Debes seleccionar un producto de salida', 'error');
        return false;
    }

    // Validar cantidad de salida
    if (!datos['cantidad-salida'] || parseFloat(datos['cantidad-salida']) <= 0) {
        mostrarNotificacion('La cantidad de salida debe ser mayor a 0', 'error');
        return false;
    }

    // Validar fecha
    if (!datos['fecha-proceso']) {
        mostrarNotificacion('Debes seleccionar una fecha de proceso', 'error');
        return false;
    }

    // Validar responsable
    if (!datos['usuario-responsable']) {
        mostrarNotificacion('Debes especificar el usuario responsable', 'error');
        return false;
    }

    return true;
}

function limpiarFormularioTransformacion() {
    // Limpiar productos seleccionados
    productosSeleccionados = [];
    document.querySelectorAll('#multi-select-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    actualizarProductosSeleccionados();

    // Limpiar formulario
    document.getElementById('formulario-transformacion').reset();
    
    // Restablecer valores por defecto
    const fechaInput = document.getElementById('fecha-proceso');
    const responsableInput = document.getElementById('usuario-responsable');
    
    if (fechaInput) {
        fechaInput.value = new Date().toISOString().split('T')[0];
    }
    
    if (responsableInput) {
        responsableInput.value = 'Administrador';
    }
}

function mostrarFormularioTransformacion() {
    const modal = document.getElementById('modal-transformacion');
    if (modal) {
        modal.classList.add('mostrar');
    }
}

function ocultarFormularioTransformacion() {
    const modal = document.getElementById('modal-transformacion');
    if (modal) {
        modal.classList.remove('mostrar');
    }
}

function cargarHistorial() {
    const historialTabla = document.getElementById('historial-tabla');
    if (!historialTabla) return;

    if (transformaciones.length === 0) {
        historialTabla.innerHTML = `
            <div class="historial-vacio">
                <i class="fas fa-history"></i>
                <h3>No hay transformaciones registradas</h3>
                <p>Comienza registrando tu primera transformación de productos</p>
                <button class="btn btn-primary" onclick="mostrarFormularioTransformacion()">
                    <i class="fas fa-plus"></i> Nueva Transformación
                </button>
            </div>
        `;
        return;
    }

    historialTabla.innerHTML = `
        <div class="tabla-container">
            <table class="tabla-transformaciones">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Productos Entrada</th>
                        <th>Cantidad Entrada</th>
                        <th>Producto Salida</th>
                        <th>Cantidad Salida</th>
                        <th>Responsable</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${transformaciones.map(transformacion => `
                        <tr>
                            <td>${formatearFecha(transformacion.fechaProceso)}</td>
                            <td>
                                <div class="productos-entrada">
                                    ${transformacion.productosEntrada.map(p => `
                                        <span class="producto-tag">${p.nombre}</span>
                                    `).join('')}
                                </div>
                            </td>
                            <td>${transformacion.cantidadEntrada} ${transformacion.unidadEntrada}</td>
                            <td>${transformacion.productoSalida.nombre}</td>
                            <td>${transformacion.cantidadSalida} ${transformacion.unidadSalida}</td>
                            <td>${transformacion.usuarioResponsable}</td>
                            <td>
                                <button class="btn btn-sm btn-secondary" onclick="verDetallesTransformacion(${transformacion.id})" title="Ver detalles">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-primary" onclick="editarTransformacion(${transformacion.id})" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-error" onclick="eliminarTransformacion(${transformacion.id})" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function filtrarHistorial() {
    const filtroFecha = document.getElementById('filtro-fecha').value;
    const filtroResponsable = document.getElementById('filtro-responsable').value;

    let transformacionesFiltradas = [...transformaciones];

    if (filtroFecha) {
        transformacionesFiltradas = transformacionesFiltradas.filter(t => t.fechaProceso === filtroFecha);
    }

    if (filtroResponsable) {
        transformacionesFiltradas = transformacionesFiltradas.filter(t => 
            t.usuarioResponsable.toLowerCase().includes(filtroResponsable.toLowerCase())
        );
    }

    // Actualizar tabla con datos filtrados
    const historialTabla = document.getElementById('historial-tabla');
    if (!historialTabla) return;

    if (transformacionesFiltradas.length === 0) {
        historialTabla.innerHTML = `
            <div class="historial-vacio">
                <i class="fas fa-search"></i>
                <h3>No se encontraron transformaciones</h3>
                <p>Intenta ajustar los filtros</p>
            </div>
        `;
        return;
    }

    historialTabla.innerHTML = `
        <div class="tabla-container">
            <table class="tabla-transformaciones">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Productos Entrada</th>
                        <th>Cantidad Entrada</th>
                        <th>Producto Salida</th>
                        <th>Cantidad Salida</th>
                        <th>Responsable</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${transformacionesFiltradas.map(transformacion => `
                        <tr>
                            <td>${formatearFecha(transformacion.fechaProceso)}</td>
                            <td>
                                <div class="productos-entrada">
                                    ${transformacion.productosEntrada.map(p => `
                                        <span class="producto-tag">${p.nombre}</span>
                                    `).join('')}
                                </div>
                            </td>
                            <td>${transformacion.cantidadEntrada} ${transformacion.unidadEntrada}</td>
                            <td>${transformacion.productoSalida.nombre}</td>
                            <td>${transformacion.cantidadSalida} ${transformacion.unidadSalida}</td>
                            <td>${transformacion.usuarioResponsable}</td>
                            <td>
                                <button class="btn btn-sm btn-secondary" onclick="verDetallesTransformacion(${transformacion.id})" title="Ver detalles">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-primary" onclick="editarTransformacion(${transformacion.id})" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-error" onclick="eliminarTransformacion(${transformacion.id})" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function limpiarFiltrosHistorialTransformacion() {
    document.getElementById('filtro-fecha').value = '';
    document.getElementById('filtro-responsable').value = '';
    cargarHistorial();
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function verDetallesTransformacion(id) {
    const transformacion = transformaciones.find(t => t.id === id);
    if (!transformacion) return;

    const detalles = `
        <div class="detalles-transformacion">
            <h3>Detalles de la Transformación</h3>
            <div class="detalle-item">
                <strong>Fecha:</strong> ${formatearFecha(transformacion.fechaProceso)}
            </div>
            <div class="detalle-item">
                <strong>Productos de Entrada:</strong>
                <ul>
                    ${transformacion.productosEntrada.map(p => `<li>${p.nombre} (${p.categoria})</li>`).join('')}
                </ul>
            </div>
            <div class="detalle-item">
                <strong>Cantidad de Entrada:</strong> ${transformacion.cantidadEntrada} ${transformacion.unidadEntrada}
            </div>
            <div class="detalle-item">
                <strong>Producto de Salida:</strong> ${transformacion.productoSalida.nombre}
            </div>
            <div class="detalle-item">
                <strong>Cantidad de Salida:</strong> ${transformacion.cantidadSalida} ${transformacion.unidadSalida}
            </div>
            <div class="detalle-item">
                <strong>Responsable:</strong> ${transformacion.usuarioResponsable}
            </div>
            ${transformacion.observaciones ? `
                <div class="detalle-item">
                    <strong>Observaciones:</strong> ${transformacion.observaciones}
                </div>
            ` : ''}
        </div>
    `;

    mostrarModal('Detalles de Transformación', detalles);
}

function editarTransformacion(id) {
    const transformacion = transformaciones.find(t => t.id === id);
    if (!transformacion) return;

    mostrarNotificacion('Función de edición en desarrollo', 'info');
}

function eliminarTransformacion(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta transformación?')) {
        transformaciones = transformaciones.filter(t => t.id !== id);
        localStorage.setItem('transformaciones', JSON.stringify(transformaciones));
        cargarHistorial();
        mostrarNotificacion('Transformación eliminada', 'success');
    }
}

function mostrarModal(titulo, contenido) {
    const modal = document.createElement('div');
    modal.className = 'modal modal-detalles';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${titulo}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${contenido}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.classList.add('show');
}

// Funciones globales
window.removerProducto = removerProducto;
window.verDetallesTransformacion = verDetallesTransformacion;
window.editarTransformacion = editarTransformacion;
window.eliminarTransformacion = eliminarTransformacion;
window.mostrarFormularioTransformacion = mostrarFormularioTransformacion;

// Estilos adicionales para la página de transformación
const transformacionStyles = `
    .modal-transformacion {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        visibility: hidden;
        transition: var(--transition);
    }

    .modal-transformacion.mostrar {
        opacity: 1;
        visibility: visible;
    }

    .modal-transformacion-content {
        background-color: var(--color-white);
        border-radius: var(--border-radius-xl);
        max-width: 900px;
        width: 95%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        transform: scale(0.9);
        transition: var(--transition);
    }

    .modal-transformacion.mostrar .modal-transformacion-content {
        transform: scale(1);
    }

    .modal-transformacion-header {
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
        color: var(--color-white);
        padding: var(--spacing-6);
    }

    .modal-header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .modal-logo {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
    }

    .modal-logo-image {
        width: 40px;
        height: 40px;
        object-fit: contain;
    }

    .modal-logo-text h2 {
        font-size: var(--font-size-xl);
        font-weight: 600;
        margin: 0;
    }

    .modal-transformacion-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: var(--color-white);
        width: 32px;
        height: 32px;
        border-radius: var(--border-radius-full);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition);
    }

    .modal-transformacion-close:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    .modal-transformacion-body {
        padding: var(--spacing-8);
    }

    .formulario-transformacion {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-6);
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-8);
    }

    .form-section {
        background-color: var(--color-gray-50);
        padding: var(--spacing-6);
        border-radius: var(--border-radius-lg);
        border: 1px solid var(--color-gray-200);
    }

    .form-section-title {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-4);
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
    }

    .form-section-title i {
        color: var(--color-primary);
    }

    .process-info {
        grid-column: 1 / -1;
    }

    .form-label {
        display: block;
        font-weight: 500;
        color: var(--color-gray-700);
        margin-bottom: var(--spacing-2);
        font-size: var(--font-size-sm);
    }

    .required {
        color: var(--color-error);
    }

    .multi-select-container {
        position: relative;
    }

    .multi-select-dropdown {
        position: relative;
        border: 2px solid var(--color-gray-200);
        border-radius: var(--border-radius);
        background-color: var(--color-white);
        cursor: pointer;
        transition: var(--transition);
    }

    .multi-select-dropdown:hover {
        border-color: var(--color-primary);
    }

    .multi-select-dropdown.open {
        border-color: var(--color-primary);
    }

    .multi-select-selected {
        padding: var(--spacing-3);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .multi-select-options {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: var(--color-white);
        border: 2px solid var(--color-primary);
        border-top: none;
        border-radius: 0 0 var(--border-radius) var(--border-radius);
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
    }

    .multi-select-dropdown.open .multi-select-options {
        display: block;
    }

    .multi-select-option {
        padding: var(--spacing-2) var(--spacing-3);
        border-bottom: 1px solid var(--color-gray-200);
        transition: var(--transition);
    }

    .multi-select-option:hover {
        background-color: var(--color-gray-50);
    }

    .multi-select-option:last-child {
        border-bottom: none;
    }

    .multi-select-option label {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-1);
        cursor: pointer;
        font-size: var(--font-size-sm);
    }

    .producto-nombre {
        font-weight: 500;
        color: var(--color-gray-900);
    }

    .producto-categoria {
        color: var(--color-gray-600);
        font-size: var(--font-size-xs);
    }

    .producto-stock {
        color: var(--color-success);
        font-size: var(--font-size-xs);
    }

    .selected-items {
        margin-top: var(--spacing-3);
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-2);
    }

    .selected-item {
        background-color: var(--color-primary);
        color: var(--color-white);
        padding: var(--spacing-2) var(--spacing-3);
        border-radius: var(--border-radius-full);
        font-size: var(--font-size-xs);
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
    }

    .selected-item-nombre {
        font-weight: 500;
    }

    .selected-item-categoria {
        opacity: 0.8;
    }

    .remove-item {
        background: none;
        border: none;
        color: var(--color-white);
        cursor: pointer;
        padding: 2px;
        border-radius: var(--border-radius-full);
        transition: var(--transition);
    }

    .remove-item:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .input-with-unit {
        display: flex;
        gap: var(--spacing-2);
    }

    .input-with-unit .form-input {
        flex: 1;
    }

    .unit-select {
        width: 80px;
        padding: var(--spacing-3);
    }

    .form-textarea {
        width: 100%;
        padding: var(--spacing-3);
        border: 2px solid var(--color-gray-200);
        border-radius: var(--border-radius);
        font-size: var(--font-size-base);
        font-family: var(--font-family);
        resize: vertical;
        min-height: 80px;
        transition: var(--transition);
    }

    .form-textarea:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    .form-actions {
        display: flex;
        gap: var(--spacing-4);
        justify-content: flex-end;
        padding-top: var(--spacing-6);
        border-top: 1px solid var(--color-gray-200);
    }

    .historial-transformaciones {
        padding: var(--spacing-8) 0;
        background-color: var(--color-gray-50);
        min-height: 60vh;
    }

    .historial-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-8);
    }

    .historial-header h2 {
        font-size: var(--font-size-2xl);
        font-weight: 700;
        color: var(--color-gray-900);
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
    }

    .historial-content {
        background-color: var(--color-white);
        border-radius: var(--border-radius-xl);
        padding: var(--spacing-6);
        box-shadow: var(--shadow-sm);
    }

    .historial-filtros {
        display: flex;
        gap: var(--spacing-4);
        margin-bottom: var(--spacing-6);
        flex-wrap: wrap;
        align-items: end;
    }

    .filtro-group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
    }

    .filtro-group label {
        font-size: var(--font-size-sm);
        font-weight: 500;
        color: var(--color-gray-700);
    }

    .historial-vacio {
        text-align: center;
        padding: var(--spacing-16);
        color: var(--color-gray-500);
    }

    .historial-vacio i {
        font-size: var(--font-size-4xl);
        margin-bottom: var(--spacing-4);
        color: var(--color-gray-300);
    }

    .historial-vacio h3 {
        font-size: var(--font-size-xl);
        margin-bottom: var(--spacing-2);
    }

    .tabla-container {
        overflow-x: auto;
    }

    .tabla-transformaciones {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--font-size-sm);
    }

    .tabla-transformaciones th,
    .tabla-transformaciones td {
        padding: var(--spacing-3);
        text-align: left;
        border-bottom: 1px solid var(--color-gray-200);
    }

    .tabla-transformaciones th {
        background-color: var(--color-gray-50);
        font-weight: 600;
        color: var(--color-gray-900);
    }

    .tabla-transformaciones tr:hover {
        background-color: var(--color-gray-50);
    }

    .productos-entrada {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-1);
    }

    .producto-tag {
        background-color: var(--color-primary);
        color: var(--color-white);
        padding: 2px var(--spacing-2);
        border-radius: var(--border-radius-full);
        font-size: var(--font-size-xs);
    }

    .btn-error {
        background-color: var(--color-error);
        color: var(--color-white);
    }

    .btn-error:hover {
        background-color: #dc2626;
    }

    .detalles-transformacion {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
    }

    .detalle-item {
        padding: var(--spacing-3);
        background-color: var(--color-gray-50);
        border-radius: var(--border-radius);
        border-left: 4px solid var(--color-primary);
    }

    .detalle-item strong {
        color: var(--color-gray-900);
    }

    .detalle-item ul {
        margin: var(--spacing-2) 0 0 var(--spacing-4);
    }

    .detalle-item li {
        margin-bottom: var(--spacing-1);
    }

    @media (max-width: 768px) {
        .form-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-4);
        }

        .historial-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-4);
        }

        .historial-filtros {
            flex-direction: column;
            align-items: stretch;
        }

        .form-actions {
            flex-direction: column;
        }

        .modal-transformacion-content {
            width: 98%;
            margin: var(--spacing-2);
        }

        .modal-transformacion-body {
            padding: var(--spacing-4);
        }
    }

    @media (max-width: 480px) {
        .tabla-transformaciones {
            font-size: var(--font-size-xs);
        }

        .tabla-transformaciones th,
        .tabla-transformaciones td {
            padding: var(--spacing-2);
        }
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = transformacionStyles;
document.head.appendChild(styleSheet);

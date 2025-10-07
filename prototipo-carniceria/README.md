# Prototipo Carnicería Delicias a tu Diestra

## 📋 Descripción

Este es un prototipo funcional en HTML, CSS y JavaScript del sistema de tienda online para Carnicería Delicias a tu Diestra. El prototipo incluye todas las funcionalidades principales del proyecto original, diseñado para demostración al cliente.

## 🚀 Características del Prototipo

### ✅ Funcionalidades Implementadas

- **🏠 Página Principal**: Diseño atractivo con hero section, categorías y productos destacados
- **🛍️ Catálogo de Productos**: Sistema completo de filtros, búsqueda y paginación
- **🛒 Carrito de Compras**: Gestión completa del carrito con persistencia local
- **👤 Autenticación**: Sistema de login y registro con validaciones
- **🔄 Transformación de Productos**: Módulo para registrar procesos de transformación
- **📱 Diseño Responsive**: Adaptable a todos los dispositivos
- **🎨 UI/UX Moderna**: Interfaz intuitiva y atractiva

### 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con variables CSS y Grid/Flexbox
- **JavaScript ES6+**: Funcionalidad interactiva y modular
- **Font Awesome**: Iconografía profesional
- **Google Fonts**: Tipografía Inter para mejor legibilidad

## 📁 Estructura del Proyecto

```
prototipo-carniceria/
├── index.html              # Página principal
├── catalogo.html           # Catálogo de productos
├── carrito.html            # Carrito de compras
├── login.html              # Página de inicio de sesión
├── registro.html           # Página de registro
├── transformacion.html     # Módulo de transformación
├── css/
│   └── styles.css          # Estilos principales
├── js/
│   ├── app.js              # Funcionalidad principal
│   ├── catalogo.js         # Lógica del catálogo
│   ├── carrito.js          # Gestión del carrito
│   ├── auth.js             # Autenticación
│   └── transformacion.js   # Transformación de productos
├── img/
│   ├── logoCarniceria.png  # Logo de la empresa
│   └── fondo_carnes.jpg    # Imagen de fondo
└── README.md               # Este archivo
```

## 🎯 Funcionalidades Detalladas

### 🏠 Página Principal (index.html)
- Hero section con call-to-action
- Categorías de productos interactivas
- Productos destacados con funcionalidad de carrito
- Sección "¿Por qué elegirnos?"
- Footer completo con información de contacto

### 🛍️ Catálogo (catalogo.html)
- **Filtros Avanzados**:
  - Por categoría (Pollo, Res, Cerdo, Embutidos)
  - Por rango de precio
  - Ordenamiento múltiple
- **Paginación**: Navegación por páginas
- **Búsqueda**: Sistema de filtrado en tiempo real
- **Productos**: Tarjetas con información completa

### 🛒 Carrito de Compras (carrito.html)
- **Gestión Completa**:
  - Agregar/eliminar productos
  - Modificar cantidades
  - Cálculo automático de totales
- **Persistencia**: Los datos se guardan en localStorage
- **Productos Recomendados**: Sugerencias adicionales
- **Información de Entrega**: Detalles del servicio

### 👤 Autenticación (login.html / registro.html)
- **Login**: Formulario con validaciones
- **Registro**: Formulario completo con campos obligatorios
- **Validaciones**: Email, contraseñas, términos y condiciones
- **Usuarios de Prueba**:
  - Email: `juan@email.com` / Contraseña: `12345678`
  - Email: `maria@email.com` / Contraseña: `12345678` (Admin)

### 🔄 Transformación de Productos (transformacion.html)
- **Registro de Procesos**:
  - Selección múltiple de productos de entrada
  - Definición de producto resultante
  - Cantidades y unidades de medida
- **Historial**: Visualización de todas las transformaciones
- **Filtros**: Por fecha y responsable
- **Gestión**: Ver, editar y eliminar registros

## 🚀 Cómo Usar el Prototipo

### 1. **Abrir el Prototipo**
```bash
# Navegar a la carpeta del prototipo
cd prototipo-carniceria

# Abrir index.html en tu navegador web
# O usar un servidor local:
python -m http.server 8000
# Luego visitar: http://localhost:8000
```

### 2. **Explorar las Funcionalidades**

#### 🛍️ **Navegación y Catálogo**
1. Abre `index.html` en tu navegador
2. Explora las categorías haciendo clic en las tarjetas
3. Ve al catálogo completo desde el botón "Ver Catálogo"
4. Usa los filtros para encontrar productos específicos

#### 🛒 **Carrito de Compras**
1. Agrega productos al carrito desde cualquier página
2. Haz clic en el icono del carrito para ver el contenido
3. Modifica cantidades o elimina productos
4. Ve a `carrito.html` para una vista completa

#### 👤 **Autenticación**
1. Haz clic en "Iniciar Sesión" o "Registrarse"
2. **Para probar el login**:
   - Email: `juan@email.com`
   - Contraseña: `12345678`
3. **Para probar como admin**:
   - Email: `maria@email.com`
   - Contraseña: `12345678`

#### 🔄 **Transformación de Productos**
1. Inicia sesión como administrador
2. Ve a `transformacion.html`
3. Haz clic en "Nueva Transformación"
4. Completa el formulario y guarda
5. Explora el historial de transformaciones

### 3. **Datos de Prueba**

El prototipo incluye productos de ejemplo:
- **Pollo**: Pechuga, Muslo
- **Res**: Lomo, Ternera Premium
- **Cerdo**: Costilla, Panceta Ahumada
- **Embutidos**: Chorizo Artesanal, Salchicha Alemana

## 🎨 Características de Diseño

### 🎯 **Paleta de Colores**
- **Primario**: Rojo (#dc2626) - Representa la carne fresca
- **Secundario**: Blanco (#ffffff) - Limpieza y frescura
- **Acentos**: Amarillo (#f59e0b) - Destacar elementos importantes
- **Grises**: Escala completa para textos y fondos

### 📱 **Responsive Design**
- **Desktop**: Diseño completo con sidebar y grid
- **Tablet**: Adaptación de layouts y navegación
- **Mobile**: Diseño optimizado para pantallas pequeñas

### 🎭 **Interactividad**
- **Animaciones**: Transiciones suaves en hover y focus
- **Notificaciones**: Sistema de alertas para feedback
- **Modales**: Ventanas emergentes para formularios
- **Dropdowns**: Menús desplegables intuitivos

## 🔧 Personalización

### 📝 **Modificar Productos**
Edita el array `productos` en `js/app.js`:
```javascript
const productos = [
    {
        id: 1,
        nombre: "Tu Producto",
        descripcion: "Descripción del producto",
        precio: 10000,
        unidad_medida: "kg",
        categoria: "Pollo",
        stock: 25,
        imagen_url: "url_de_imagen",
        destacado: true
    }
    // ... más productos
];
```

### 🎨 **Cambiar Colores**
Modifica las variables CSS en `css/styles.css`:
```css
:root {
    --color-primary: #tu-color;
    --color-secondary: #tu-color;
    /* ... más variables */
}
```

### 📧 **Configurar Usuarios**
Edita la función `simularLogin` en `js/auth.js`:
```javascript
const usuariosPrueba = [
    {
        email: 'tu@email.com',
        password: 'tu-password',
        nombre: 'Tu Nombre',
        // ... más datos
    }
];
```

## 📊 Funcionalidades Técnicas

### 💾 **Persistencia de Datos**
- **Carrito**: localStorage para mantener productos
- **Usuario**: sessionStorage/localStorage para sesión
- **Transformaciones**: localStorage para historial
- **Favoritos**: localStorage para productos favoritos

### 🔍 **Filtros y Búsqueda**
- **Filtrado en Tiempo Real**: Sin necesidad de recargar
- **Múltiples Criterios**: Categoría, precio, ordenamiento
- **Paginación**: Navegación eficiente por páginas

### ✅ **Validaciones**
- **Frontend**: Validación inmediata de formularios
- **Email**: Formato correcto de correo electrónico
- **Contraseñas**: Coincidencia y longitud mínima
- **Campos Obligatorios**: Verificación de datos requeridos

## 🎯 Casos de Uso para Demostración

### 👥 **Para el Cliente**
1. **Exploración General**: Navegar por todas las páginas
2. **Proceso de Compra**: Agregar productos al carrito y proceder
3. **Registro**: Crear una cuenta nueva
4. **Funcionalidades Admin**: Probar el módulo de transformación

### 💼 **Para Desarrolladores**
1. **Código Limpio**: Estructura modular y comentada
2. **Responsive**: Probar en diferentes dispositivos
3. **Performance**: Carga rápida y animaciones fluidas
4. **Accesibilidad**: Navegación por teclado y lectores de pantalla

## 🚀 Próximos Pasos

### 🔄 **Integración con Backend**
- Conectar con APIs reales
- Implementar autenticación JWT
- Sincronizar con base de datos

### 📱 **Mejoras Adicionales**
- PWA (Progressive Web App)
- Notificaciones push
- Modo offline

### 🎨 **Personalización**
- Temas personalizables
- Configuración de colores
- Múltiples idiomas

## 📞 Soporte

Para consultas sobre el prototipo:
- **Email**: info@carniceria.com
- **Teléfono**: +57 321 123 4567

---

**Carnicería Delicias a tu Diestra** - "Delicias a tu diestra" - Salmos 16:11

*Prototipo desarrollado para demostración al cliente - Versión 1.0*

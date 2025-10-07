// Funcionalidad de autenticación
document.addEventListener('DOMContentLoaded', function() {
    inicializarAuth();
});

function inicializarAuth() {
    configurarFormularios();
    configurarPasswordToggle();
    configurarValidaciones();
}

function configurarFormularios() {
    // Formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', manejarLogin);
    }

    // Formulario de registro
    const registroForm = document.getElementById('registro-form');
    if (registroForm) {
        registroForm.addEventListener('submit', manejarRegistro);
    }

    // Botones de cerrar
    const cerrarLogin = document.getElementById('cerrar-login');
    const cerrarRegistro = document.getElementById('cerrar-registro');
    
    if (cerrarLogin) {
        cerrarLogin.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    if (cerrarRegistro) {
        cerrarRegistro.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

function configurarPasswordToggle() {
    // Toggle para contraseña en login
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = togglePassword.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Toggle para contraseña en registro
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', () => {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            
            const icon = toggleConfirmPassword.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
}

function configurarValidaciones() {
    // Validación de contraseñas en registro
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    if (passwordInput && confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validarConfirmacionPassword);
    }

    // Validación de email
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', validarEmail);
    });

    // Validación de teléfono
    const telefonoInput = document.getElementById('telefono');
    if (telefonoInput) {
        telefonoInput.addEventListener('input', formatearTelefono);
    }
}

function manejarLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');

    // Validaciones básicas
    if (!email || !password) {
        mostrarNotificacion('Por favor completa todos los campos', 'error');
        return;
    }

    if (!validarEmailFormato(email)) {
        mostrarNotificacion('Por favor ingresa un email válido', 'error');
        return;
    }

    // Simular login (en un proyecto real esto sería una llamada a la API)
    const usuario = simularLogin(email, password);
    
    if (usuario) {
        // Guardar usuario en localStorage
        if (remember) {
            localStorage.setItem('usuario', JSON.stringify(usuario));
        } else {
            sessionStorage.setItem('usuario', JSON.stringify(usuario));
        }
        
        mostrarNotificacion('¡Bienvenido de vuelta!', 'success');
        
        // Redirigir después de un breve delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        mostrarNotificacion('Credenciales incorrectas. Intenta de nuevo.', 'error');
    }
}

function manejarRegistro(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const datos = Object.fromEntries(formData.entries());

    // Validaciones
    if (!validarFormularioRegistro(datos)) {
        return;
    }

    // Simular registro (en un proyecto real esto sería una llamada a la API)
    const usuario = simularRegistro(datos);
    
    if (usuario) {
        mostrarNotificacion('¡Cuenta creada exitosamente!', 'success');
        
        // Redirigir al login después de un breve delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    } else {
        mostrarNotificacion('Error al crear la cuenta. Intenta de nuevo.', 'error');
    }
}

function validarFormularioRegistro(datos) {
    // Validar campos requeridos
    const camposRequeridos = ['nombre', 'apellido', 'tipo_documento', 'numero_documento', 'direccion', 'email', 'telefono', 'password', 'confirm_password'];
    
    for (const campo of camposRequeridos) {
        if (!datos[campo]) {
            mostrarNotificacion(`El campo ${campo} es requerido`, 'error');
            return false;
        }
    }

    // Validar email
    if (!validarEmailFormato(datos.email)) {
        mostrarNotificacion('Por favor ingresa un email válido', 'error');
        return false;
    }

    // Validar contraseñas
    if (datos.password.length < 8) {
        mostrarNotificacion('La contraseña debe tener al menos 8 caracteres', 'error');
        return false;
    }

    if (datos.password !== datos.confirm_password) {
        mostrarNotificacion('Las contraseñas no coinciden', 'error');
        return false;
    }

    // Validar términos y condiciones
    if (!datos.terms) {
        mostrarNotificacion('Debes aceptar los términos y condiciones', 'error');
        return false;
    }

    return true;
}

function validarEmailFormato(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validarEmail(e) {
    const email = e.target.value;
    const input = e.target;
    
    if (email && !validarEmailFormato(email)) {
        input.classList.add('error');
        mostrarError(input, 'Email inválido');
    } else {
        input.classList.remove('error');
        limpiarError(input);
    }
}

function validarConfirmacionPassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const confirmInput = document.getElementById('confirm-password');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmInput.classList.add('error');
        mostrarError(confirmInput, 'Las contraseñas no coinciden');
    } else {
        confirmInput.classList.remove('error');
        limpiarError(confirmInput);
    }
}

function formatearTelefono(e) {
    let telefono = e.target.value.replace(/\D/g, '');
    
    if (telefono.length > 0) {
        if (telefono.length <= 3) {
            telefono = `+57 ${telefono}`;
        } else if (telefono.length <= 6) {
            telefono = `+57 ${telefono.slice(0, 3)} ${telefono.slice(3)}`;
        } else if (telefono.length <= 10) {
            telefono = `+57 ${telefono.slice(0, 3)} ${telefono.slice(3, 6)} ${telefono.slice(6)}`;
        }
    }
    
    e.target.value = telefono;
}

function mostrarError(input, mensaje) {
    limpiarError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorDiv.textContent = mensaje;
    
    input.parentNode.appendChild(errorDiv);
}

function limpiarError(input) {
    const errorDiv = input.parentNode.querySelector('.form-error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function simularLogin(email, password) {
    // Simular usuarios de prueba
    const usuariosPrueba = [
        {
            id: 1,
            nombre: 'Juan',
            apellido: 'Pérez',
            email: 'juan@email.com',
            password: '12345678',
            tipo_documento: 'CC',
            numero_documento: '12345678',
            direccion: 'Calle 123 #45-67',
            telefono: '+57 300 123 4567',
            rol: 'cliente'
        },
        {
            id: 2,
            nombre: 'María',
            apellido: 'González',
            email: 'maria@email.com',
            password: '12345678',
            tipo_documento: 'CC',
            numero_documento: '87654321',
            direccion: 'Carrera 45 #67-89',
            telefono: '+57 300 987 6543',
            rol: 'admin'
        }
    ];

    const usuario = usuariosPrueba.find(u => u.email === email && u.password === password);
    
    if (usuario) {
        // Remover la contraseña del objeto antes de devolverlo
        const { password, ...usuarioSinPassword } = usuario;
        return usuarioSinPassword;
    }
    
    return null;
}

function simularRegistro(datos) {
    // Simular que el registro fue exitoso
    const nuevoUsuario = {
        id: Date.now(),
        nombre: datos.nombre,
        apellido: datos.apellido,
        email: datos.email,
        tipo_documento: datos.tipo_documento,
        numero_documento: datos.numero_documento,
        direccion: datos.direccion,
        telefono: datos.telefono,
        rol: 'cliente',
        fecha_registro: new Date().toISOString()
    };

    // En un proyecto real, aquí se haría la llamada a la API
    console.log('Usuario registrado:', nuevoUsuario);
    
    return nuevoUsuario;
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

// Estilos adicionales para las páginas de autenticación
const authStyles = `
    .login-body,
    .registro-body {
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
        min-height: 100vh;
    }

    .main-content {
        position: relative;
        min-height: calc(100vh - 80px);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .fondo-autenticacion {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
    }

    .fondo-autenticacion-imagen {
        width: 100%;
        height: 100%;
        background-image: url('../img/fondo_carnes.jpg');
        background-size: cover;
        background-position: center;
        opacity: 0.1;
    }

    .fondo-autenticacion-overlay {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(185, 28, 28, 0.8) 100%);
    }

    .contenedor-formulario-autenticacion {
        position: relative;
        z-index: 2;
        width: 100%;
        max-width: 500px;
        padding: var(--spacing-4);
    }

    .auth-card {
        background-color: var(--color-white);
        border-radius: var(--border-radius-xl);
        box-shadow: var(--shadow-xl);
        overflow: hidden;
        position: relative;
    }

    .auth-header {
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
        color: var(--color-white);
        padding: var(--spacing-6);
        text-align: center;
        position: relative;
    }

    .cerrar-formulario {
        position: absolute;
        top: var(--spacing-4);
        right: var(--spacing-4);
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

    .cerrar-formulario:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    .auth-title {
        font-size: var(--font-size-2xl);
        font-weight: 700;
        margin-bottom: var(--spacing-2);
    }

    .auth-subtitle {
        opacity: 0.9;
        font-size: var(--font-size-base);
    }

    .auth-form {
        padding: var(--spacing-8);
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

    .input-group {
        position: relative;
        display: flex;
        align-items: center;
    }

    .input-icon {
        position: absolute;
        left: var(--spacing-3);
        color: var(--color-gray-400);
        z-index: 2;
    }

    .form-input,
    .form-select {
        width: 100%;
        padding: var(--spacing-3) var(--spacing-3) var(--spacing-3) var(--spacing-10);
        border: 2px solid var(--color-gray-200);
        border-radius: var(--border-radius);
        font-size: var(--font-size-base);
        transition: var(--transition);
        background-color: var(--color-white);
    }

    .form-input:focus,
    .form-select:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    .form-input.error,
    .form-select.error {
        border-color: var(--color-error);
    }

    .password-toggle {
        position: absolute;
        right: var(--spacing-3);
        background: none;
        border: none;
        color: var(--color-gray-400);
        cursor: pointer;
        z-index: 2;
        padding: var(--spacing-1);
        border-radius: var(--border-radius);
        transition: var(--transition);
    }

    .password-toggle:hover {
        color: var(--color-gray-600);
        background-color: var(--color-gray-100);
    }

    .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-6);
        flex-wrap: wrap;
        gap: var(--spacing-2);
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        cursor: pointer;
        font-size: var(--font-size-sm);
        color: var(--color-gray-600);
    }

    .checkbox-label input[type="checkbox"] {
        width: 16px;
        height: 16px;
        accent-color: var(--color-primary);
    }

    .forgot-password {
        color: var(--color-primary);
        text-decoration: none;
        font-size: var(--font-size-sm);
        transition: var(--transition);
    }

    .forgot-password:hover {
        text-decoration: underline;
    }

    .auth-footer {
        text-align: center;
        margin-top: var(--spacing-6);
        padding-top: var(--spacing-6);
        border-top: 1px solid var(--color-gray-200);
    }

    .auth-footer p {
        color: var(--color-gray-600);
        font-size: var(--font-size-sm);
    }

    .auth-link {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 500;
        transition: var(--transition);
    }

    .auth-link:hover {
        text-decoration: underline;
    }

    .divider {
        text-align: center;
        margin: var(--spacing-6) 0;
        position: relative;
    }

    .divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background-color: var(--color-gray-200);
    }

    .divider span {
        background-color: var(--color-white);
        padding: 0 var(--spacing-4);
        color: var(--color-gray-500);
        font-size: var(--font-size-sm);
    }

    .social-login {
        display: flex;
        gap: var(--spacing-3);
    }

    .btn-social {
        flex: 1;
        padding: var(--spacing-3);
        border: 2px solid var(--color-gray-200);
        background-color: var(--color-white);
        color: var(--color-gray-700);
        border-radius: var(--border-radius);
        font-weight: 500;
        transition: var(--transition);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-2);
    }

    .btn-social:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
        transform: translateY(-1px);
    }

    .btn-google:hover {
        border-color: #db4437;
        color: #db4437;
    }

    .btn-facebook:hover {
        border-color: #4267B2;
        color: #4267B2;
    }

    .form-error-message {
        color: var(--color-error);
        font-size: var(--font-size-xs);
        margin-top: var(--spacing-1);
    }

    .terms-checkbox {
        font-size: var(--font-size-sm);
        line-height: 1.4;
    }

    .terms-link {
        color: var(--color-primary);
        text-decoration: none;
    }

    .terms-link:hover {
        text-decoration: underline;
    }

    @media (max-width: 768px) {
        .contenedor-formulario-autenticacion {
            padding: var(--spacing-2);
        }

        .auth-form {
            padding: var(--spacing-6);
        }

        .form-row {
            grid-template-columns: 1fr;
        }

        .form-options {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-3);
        }

        .social-login {
            flex-direction: column;
        }
    }

    @media (max-width: 480px) {
        .auth-title {
            font-size: var(--font-size-xl);
        }

        .auth-form {
            padding: var(--spacing-4);
        }
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = authStyles;
document.head.appendChild(styleSheet);

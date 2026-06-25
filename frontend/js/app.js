// ============================================================================
// app.js - Controlador principal (TODOS LOS MÓDULOS EN UN SOLO ARCHIVO)
// Versión SIN SERVIDOR - usa localStorage
// ============================================================================

// ============================================================================
// PARTE 1: UTILIDADES Y CONFIGURACIÓN
// ============================================================================

const state = {
    moduloActual: 'autos',
    autos: [],
    clientes: [],
    ventas: [],
    reservas: [],
    vendedores: []
};

const content = document.getElementById('content');
const navBtns = document.querySelectorAll('.nav-btn');
const fechaSpan = document.getElementById('fecha-actual');

// ---- Funciones de utilidad ----
function mostrarFecha() {
    const ahora = new Date();
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    if (fechaSpan) {
        fechaSpan.textContent = ahora.toLocaleDateString('es-AR', opciones);
    }
}

function mostrarToast(mensaje, tipo = 'info') {
    let contenedor = document.querySelector('.toast-container');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.className = 'toast-container';
        document.body.appendChild(contenedor);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    const icono = tipo === 'success' ? 'fa-check-circle' : 
                  tipo === 'error' ? 'fa-exclamation-circle' : 
                  'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icono}"></i> ${mensaje}`;
    
    contenedor.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getBadgeClass(estado) {
    const clases = {
        'en venta': 'badge-success',
        'reservado': 'badge-warning',
        'vendido': 'badge-danger',
        'en taller': 'badge-info',
        'activo': 'badge-success',
        'inactivo': 'badge-secondary',
        'Reservado': 'badge-warning',
        'Cancelado': 'badge-danger',
        'Concretado': 'badge-success',
        'Cobrado': 'badge-success',
        'Pendiente': 'badge-warning',
        'En_cuotas': 'badge-info',
        'pendiente': 'badge-warning'
    };
    return clases[estado] || 'badge-secondary';
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.remove();
}

// ============================================================================
// PARTE 2: GESTIÓN DE DATOS (localStorage)
// ============================================================================

function getData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Error al leer ${key}:`, error);
        return [];
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error al guardar ${key}:`, error);
    }
}

function generarId(key) {
    const data = getData(key);
    if (data.length === 0) return 1;
    // Buscar el ID correcto según la estructura de cada entidad
    let maxId = 0;
    data.forEach(item => {
        const id = item.id || item.ID || item.id_reserva || 0;
        if (id > maxId) maxId = id;
    });
    return maxId + 1;
}

function eliminarPorId(key, id) {
    let data = getData(key);
    const filtered = data.filter(item => {
        const itemId = item.id || item.ID || item.id_reserva;
        return itemId !== id;
    });
    if (filtered.length === data.length) return false;
    saveData(key, filtered);
    return true;
}

// ============================================================================
// PARTE 3: FUNCIONES DE CARGA DE DATOS
// ============================================================================

function cargarAutos() {
    state.autos = getData('autos');
    renderAutos();
}

function cargarClientes() {
    state.clientes = getData('clientes');
    renderClientes();
}

function cargarVentas() {
    state.ventas = getData('ventas');
    renderVentas();
}

function cargarReservas() {
    state.reservas = getData('reservas');
    renderReservas();
}

function cargarVendedores() {
    state.vendedores = getData('vendedores');
    renderVendedores();
}

function cargarStats() {
    const autos = getData('autos');
    const clientes = getData('clientes');
    const ventas = getData('ventas');
    
    const totalAutos = document.getElementById('total-autos');
    const totalClientes = document.getElementById('total-clientes');
    const totalVentas = document.getElementById('total-ventas');
    
    if (totalAutos) totalAutos.textContent = autos.length;
    if (totalClientes) totalClientes.textContent = clientes.length;
    if (totalVentas) totalVentas.textContent = ventas.length;
}

// ============================================================================
// PARTE 4: RENDER - PÁGINA DE INICIO
// ============================================================================

function renderWelcome() {
    content.innerHTML = `
        <div class="welcome-section">
            <h2>🏠 Bienvenido al Sistema de Gestión</h2>
            <p>Selecciona un módulo para comenzar</p>
            <div class="quick-stats" id="stats-container">
                <div class="stat-card">
                    <i class="fas fa-car"></i>
                    <span id="total-autos">...</span>
                    <label>Autos en stock</label>
                </div>
                <div class="stat-card">
                    <i class="fas fa-users"></i>
                    <span id="total-clientes">...</span>
                    <label>Clientes registrados</label>
                </div>
                <div class="stat-card">
                    <i class="fas fa-hand-holding-usd"></i>
                    <span id="total-ventas">...</span>
                    <label>Ventas realizadas</label>
                </div>
            </div>
        </div>
    `;
    cargarStats();
}

// ============================================================================
// PARTE 5: RENDER - AUTOS
// ============================================================================

function renderAutos() {
    if (!state.autos || state.autos.length === 0) {
        content.innerHTML = `
            <div class="modulo-section active">
                <div class="modulo-header">
                    <h2>🚗 Gestión de Autos</h2>
                    <div class="modulo-actions">
                        <button class="btn btn-primary" onclick="mostrarFormularioAuto()">
                            <i class="fas fa-plus"></i> Nuevo Auto
                        </button>
                        <button class="btn btn-secondary" onclick="cargarAutos()">
                            <i class="fas fa-sync"></i> Actualizar
                        </button>
                    </div>
                </div>
                <p style="text-align:center;padding:40px;color:var(--gray-500);">
                    No hay autos cargados. ¡Agrega el primero!
                </p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="modulo-section active">
            <div class="modulo-header">
                <h2>🚗 Gestión de Autos</h2>
                <div class="modulo-actions">
                    <button class="btn btn-primary" onclick="mostrarFormularioAuto()">
                        <i class="fas fa-plus"></i> Nuevo Auto
                    </button>
                    <button class="btn btn-secondary" onclick="cargarAutos()">
                        <i class="fas fa-sync"></i> Actualizar
                    </button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patente</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Año</th>
                            <th>Precio</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    state.autos.forEach(auto => {
        html += `
            <tr>
                <td>${auto.id}</td>
                <td><strong>${auto.patente}</strong></td>
                <td>${auto.marca}</td>
                <td>${auto.modelo}</td>
                <td>${auto.anio}</td>
                <td>$${auto.precio} ${auto.moneda}</td>
                <td><span class="badge ${getBadgeClass(auto.estado)}">${auto.estado}</span></td>
                <td>
                    <div class="actions">
                        <button class="btn btn-sm btn-primary" onclick="editarAuto(${auto.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarAuto(${auto.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    content.innerHTML = html;
}

// ============================================================================
// PARTE 6: RENDER - CLIENTES
// ============================================================================

function renderClientes() {
    if (!state.clientes || state.clientes.length === 0) {
        content.innerHTML = `
            <div class="modulo-section active">
                <div class="modulo-header">
                    <h2>👤 Gestión de Clientes</h2>
                    <div class="modulo-actions">
                        <button class="btn btn-primary" onclick="mostrarFormularioCliente()">
                            <i class="fas fa-plus"></i> Nuevo Cliente
                        </button>
                        <button class="btn btn-secondary" onclick="cargarClientes()">
                            <i class="fas fa-sync"></i> Actualizar
                        </button>
                    </div>
                </div>
                <p style="text-align:center;padding:40px;color:var(--gray-500);">
                    No hay clientes registrados. ¡Agrega el primero!
                </p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="modulo-section active">
            <div class="modulo-header">
                <h2>👤 Gestión de Clientes</h2>
                <div class="modulo-actions">
                    <button class="btn btn-primary" onclick="mostrarFormularioCliente()">
                        <i class="fas fa-plus"></i> Nuevo Cliente
                    </button>
                    <button class="btn btn-secondary" onclick="cargarClientes()">
                        <i class="fas fa-sync"></i> Actualizar
                    </button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>DNI</th>
                            <th>Email</th>
                            <th>Localidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    state.clientes.forEach(cliente => {
        html += `
            <tr>
                <td>${cliente.ID}</td>
                <td><strong>${cliente.Nombre_completo}</strong></td>
                <td>${cliente.Dni}</td>
                <td>${cliente.Email}</td>
                <td>${cliente.Localidad}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-sm btn-primary" onclick="editarCliente(${cliente.ID})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarCliente(${cliente.ID})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    content.innerHTML = html;
}

// ============================================================================
// PARTE 7: RENDER - VENTAS
// ============================================================================

function renderVentas() {
    if (!state.ventas || state.ventas.length === 0) {
        content.innerHTML = `
            <div class="modulo-section active">
                <div class="modulo-header">
                    <h2>💰 Gestión de Ventas</h2>
                    <div class="modulo-actions">
                        <button class="btn btn-primary" onclick="mostrarFormularioVenta()">
                            <i class="fas fa-plus"></i> Nueva Venta
                        </button>
                        <button class="btn btn-secondary" onclick="cargarVentas()">
                            <i class="fas fa-sync"></i> Actualizar
                        </button>
                    </div>
                </div>
                <p style="text-align:center;padding:40px;color:var(--gray-500);">
                    No hay ventas registradas. ¡Registra la primera!
                </p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="modulo-section active">
            <div class="modulo-header">
                <h2>💰 Gestión de Ventas</h2>
                <div class="modulo-actions">
                    <button class="btn btn-primary" onclick="mostrarFormularioVenta()">
                        <i class="fas fa-plus"></i> Nueva Venta
                    </button>
                    <button class="btn btn-secondary" onclick="cargarVentas()">
                        <i class="fas fa-sync"></i> Actualizar
                    </button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Auto</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Precio</th>
                            <th>Forma Pago</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    state.ventas.forEach(venta => {
        html += `
            <tr>
                <td>${venta.id}</td>
                <td>${venta.id_auto}</td>
                <td>${venta.id_cliente}</td>
                <td>${venta.fecha}</td>
                <td>$${venta.precio_final}</td>
                <td>${venta.forma_pago}</td>
                <td><span class="badge ${getBadgeClass(venta.estado_de_pago)}">${venta.estado_de_pago}</span></td>
                <td>
                    <div class="actions">
                        <button class="btn btn-sm btn-danger" onclick="eliminarVenta(${venta.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    content.innerHTML = html;
}

// ============================================================================
// PARTE 8: RENDER - RESERVAS
// ============================================================================

function renderReservas() {
    if (!state.reservas || state.reservas.length === 0) {
        content.innerHTML = `
            <div class="modulo-section active">
                <div class="modulo-header">
                    <h2>📅 Gestión de Reservas</h2>
                    <div class="modulo-actions">
                        <button class="btn btn-primary" onclick="mostrarFormularioReserva()">
                            <i class="fas fa-plus"></i> Nueva Reserva
                        </button>
                        <button class="btn btn-secondary" onclick="cargarReservas()">
                            <i class="fas fa-sync"></i> Actualizar
                        </button>
                    </div>
                </div>
                <p style="text-align:center;padding:40px;color:var(--gray-500);">
                    No hay reservas registradas.
                </p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="modulo-section active">
            <div class="modulo-header">
                <h2>📅 Gestión de Reservas</h2>
                <div class="modulo-actions">
                    <button class="btn btn-primary" onclick="mostrarFormularioReserva()">
                        <i class="fas fa-plus"></i> Nueva Reserva
                    </button>
                    <button class="btn btn-secondary" onclick="cargarReservas()">
                        <i class="fas fa-sync"></i> Actualizar
                    </button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Auto</th>
                            <th>Fecha</th>
                            <th>Seña</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    state.reservas.forEach(reserva => {
        html += `
            <tr>
                <td>${reserva.id_reserva}</td>
                <td>${reserva.id_cliente}</td>
                <td>${reserva.id_auto}</td>
                <td>${reserva.fecha_reserva}</td>
                <td>$${reserva.monto_sena}</td>
                <td><span class="badge ${getBadgeClass(reserva.estado)}">${reserva.estado}</span></td>
                <td>
                    <div class="actions">
                        <button class="btn btn-sm btn-danger" onclick="eliminarReserva(${reserva.id_reserva})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    content.innerHTML = html;
}

// ============================================================================
// PARTE 9: RENDER - VENDEDORES
// ============================================================================

function renderVendedores() {
    if (!state.vendedores || state.vendedores.length === 0) {
        content.innerHTML = `
            <div class="modulo-section active">
                <div class="modulo-header">
                    <h2>👔 Gestión de Vendedores</h2>
                    <div class="modulo-actions">
                        <button class="btn btn-primary" onclick="mostrarFormularioVendedor()">
                            <i class="fas fa-plus"></i> Nuevo Vendedor
                        </button>
                        <button class="btn btn-secondary" onclick="cargarVendedores()">
                            <i class="fas fa-sync"></i> Actualizar
                        </button>
                    </div>
                </div>
                <p style="text-align:center;padding:40px;color:var(--gray-500);">
                    No hay vendedores registrados.
                </p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="modulo-section active">
            <div class="modulo-header">
                <h2>👔 Gestión de Vendedores</h2>
                <div class="modulo-actions">
                    <button class="btn btn-primary" onclick="mostrarFormularioVendedor()">
                        <i class="fas fa-plus"></i> Nuevo Vendedor
                    </button>
                    <button class="btn btn-secondary" onclick="cargarVendedores()">
                        <i class="fas fa-sync"></i> Actualizar
                    </button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>DNI</th>
                            <th>Email</th>
                            <th>Comisión</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    state.vendedores.forEach(vendedor => {
        html += `
            <tr>
                <td>${vendedor.id}</td>
                <td><strong>${vendedor.nombre_completo}</strong></td>
                <td>${vendedor.dni}</td>
                <td>${vendedor.email}</td>
                <td>${vendedor.comision_porcentaje}%</td>
                <td><span class="badge ${getBadgeClass(vendedor.estado)}">${vendedor.estado}</span></td>
                <td>
                    <div class="actions">
                        <button class="btn btn-sm btn-danger" onclick="eliminarVendedor(${vendedor.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    content.innerHTML = html;
}

// ============================================================================
// PARTE 10: FORMULARIOS - AUTOS
// ============================================================================

function mostrarFormularioAuto() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'modal-auto';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>🚗 Registrar Nuevo Auto</h3>
            <form id="formAuto">
                <div class="form-group">
                    <label>Patente</label>
                    <input type="text" id="patente" required placeholder="Ej: ABC123">
                </div>
                <div class="form-group">
                    <label>Marca</label>
                    <input type="text" id="marca" required placeholder="Ej: Toyota">
                </div>
                <div class="form-group">
                    <label>Modelo</label>
                    <input type="text" id="modelo" required placeholder="Ej: Corolla">
                </div>
                <div class="form-group">
                    <label>Año</label>
                    <input type="number" id="anio" required placeholder="Ej: 2020">
                </div>
                <div class="form-group">
                    <label>Kilómetros</label>
                    <input type="number" id="kilometros" required placeholder="Ej: 50000">
                </div>
                <div class="form-group">
                    <label>Precio</label>
                    <input type="number" step="0.01" id="precio" required placeholder="Ej: 15000000">
                </div>
                <div class="form-group">
                    <label>Moneda</label>
                    <select id="moneda">
                        <option value="pesos">Pesos</option>
                        <option value="dolares">Dólares</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="cerrarModal('modal-auto')">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Guardar
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('formAuto').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nuevoAuto = {
            id: generarId('autos'),
            patente: document.getElementById('patente').value.trim(),
            marca: document.getElementById('marca').value.trim(),
            modelo: document.getElementById('modelo').value.trim(),
            anio: parseInt(document.getElementById('anio').value),
            kilometros: parseInt(document.getElementById('kilometros').value),
            precio: parseFloat(document.getElementById('precio').value),
            moneda: document.getElementById('moneda').value,
            fecha_alta: new Date().toISOString().split('T')[0],
            estado: 'en venta'
        };
        
        const autos = getData('autos');
        autos.push(nuevoAuto);
        saveData('autos', autos);
        
        mostrarToast('Auto registrado correctamente', 'success');
        cerrarModal('modal-auto');
        cargarAutos();
    });
}

function editarAuto(id) {
    const autos = getData('autos');
    const auto = autos.find(a => a.id === id);
    if (!auto) {
        mostrarToast('Auto no encontrado', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'modal-editar-auto';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>✏️ Editar Auto</h3>
            <form id="formEditarAuto">
                <div class="form-group">
                    <label>Patente</label>
                    <input type="text" id="edit-patente" value="${auto.patente}" required>
                </div>
                <div class="form-group">
                    <label>Marca</label>
                    <input type="text" id="edit-marca" value="${auto.marca}" required>
                </div>
                <div class="form-group">
                    <label>Modelo</label>
                    <input type="text" id="edit-modelo" value="${auto.modelo}" required>
                </div>
                <div class="form-group">
                    <label>Año</label>
                    <input type="number" id="edit-anio" value="${auto.anio}" required>
                </div>
                <div class="form-group">
                    <label>Kilómetros</label>
                    <input type="number" id="edit-kilometros" value="${auto.kilometros}" required>
                </div>
                <div class="form-group">
                    <label>Precio</label>
                    <input type="number" step="0.01" id="edit-precio" value="${auto.precio}" required>
                </div>
                <div class="form-group">
                    <label>Moneda</label>
                    <select id="edit-moneda">
                        <option value="pesos" ${auto.moneda === 'pesos' ? 'selected' : ''}>Pesos</option>
                        <option value="dolares" ${auto.moneda === 'dolares' ? 'selected' : ''}>Dólares</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Estado</label>
                    <select id="edit-estado">
                        <option value="en venta" ${auto.estado === 'en venta' ? 'selected' : ''}>En venta</option>
                        <option value="reservado" ${auto.estado === 'reservado' ? 'selected' : ''}>Reservado</option>
                        <option value="vendido" ${auto.estado === 'vendido' ? 'selected' : ''}>Vendido</option>
                        <option value="en taller" ${auto.estado === 'en taller' ? 'selected' : ''}>En taller</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="cerrarModal('modal-editar-auto')">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Actualizar
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('formEditarAuto').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const autosActualizados = getData('autos');
        const index = autosActualizados.findIndex(a => a.id === id);
        
        if (index !== -1) {
            autosActualizados[index] = {
                ...autosActualizados[index],
                patente: document.getElementById('edit-patente').value.trim(),
                marca: document.getElementById('edit-marca').value.trim(),
                modelo: document.getElementById('edit-modelo').value.trim(),
                anio: parseInt(document.getElementById('edit-anio').value),
                kilometros: parseInt(document.getElementById('edit-kilometros').value),
                precio: parseFloat(document.getElementById('edit-precio').value),
                moneda: document.getElementById('edit-moneda').value,
                estado: document.getElementById('edit-estado').value
            };
            
            saveData('autos', autosActualizados);
            mostrarToast('Auto actualizado correctamente', 'success');
            cerrarModal('modal-editar-auto');
            cargarAutos();
        }
    });
}

function eliminarAuto(id) {
    if (!confirm('¿Estás seguro de eliminar este auto?')) return;
    if (eliminarPorId('autos', id)) {
        mostrarToast('Auto eliminado correctamente', 'success');
        cargarAutos();
    } else {
        mostrarToast('Error al eliminar auto', 'error');
    }
}

// ============================================================================
// PARTE 11: FORMULARIOS - CLIENTES
// ============================================================================

function mostrarFormularioCliente() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'modal-cliente';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>👤 Registrar Nuevo Cliente</h3>
            <form id="formCliente">
                <div class="form-group">
                    <label>DNI</label>
                    <input type="text" id="dni" required>
                </div>
                <div class="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" id="nombre_completo" required>
                </div>
                <div class="form-group">
                    <label>Teléfono</label>
                    <input type="text" id="telefono" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label>Localidad</label>
                    <input type="text" id="localidad" required>
                </div>
                <div class="form-group">
                    <label>¿Qué busca?</label>
                    <input type="text" id="que_busca" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="cerrarModal('modal-cliente')">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Guardar
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('formCliente').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nuevoCliente = {
            ID: generarId('clientes'),
            Dni: document.getElementById('dni').value.trim(),
            Nombre_completo: document.getElementById('nombre_completo').value.trim(),
            Telefono: document.getElementById('telefono').value.trim(),
            Email: document.getElementById('email').value.trim(),
            Localidad: document.getElementById('localidad').value.trim(),
            Que_busca: document.getElementById('que_busca').value.trim()
        };
        
        const clientes = getData('clientes');
        clientes.push(nuevoCliente);
        saveData('clientes', clientes);
        
        mostrarToast('Cliente registrado correctamente', 'success');
        cerrarModal('modal-cliente');
        cargarClientes();
    });
}

function editarCliente(id) {
    const clientes = getData('clientes');
    const cliente = clientes.find(c => c.ID === id);
    if (!cliente) {
        mostrarToast('Cliente no encontrado', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'modal-editar-cliente';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>✏️ Editar Cliente</h3>
            <form id="formEditarCliente">
                <div class="form-group">
                    <label>DNI</label>
                    <input type="text" id="edit-dni" value="${cliente.Dni}" required>
                </div>
                <div class="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" id="edit-nombre" value="${cliente.Nombre_completo}" required>
                </div>
                <div class="form-group">
                    <label>Teléfono</label>
                    <input type="text" id="edit-telefono" value="${cliente.Telefono}" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="edit-email" value="${cliente.Email}" required>
                </div>
                <div class="form-group">
                    <label>Localidad</label>
                    <input type="text" id="edit-localidad" value="${cliente.Localidad}" required>
                </div>
                <div class="form-group">
                    <label>¿Qué busca?</label>
                    <input type="text" id="edit-que_busca" value="${cliente.Que_busca}" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="cerrarModal('modal-editar-cliente')">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Actualizar
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('formEditarCliente').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const clientesActualizados = getData('clientes');
        const index = clientesActualizados.findIndex(c => c.ID === id);
        
        if (index !== -1) {
            clientesActualizados[index] = {
                ...clientesActualizados[index],
                Dni: document.getElementById('edit-dni').value.trim(),
                Nombre_completo: document.getElementById('edit-nombre').value.trim(),
                Telefono: document.getElementById('edit-telefono').value.trim(),
                Email: document.getElementById('edit-email').value.trim(),
                Localidad: document.getElementById('edit-localidad').value.trim(),
                Que_busca: document.getElementById('edit-que_busca').value.trim()
            };
            
            saveData('clientes', clientesActualizados);
            mostrarToast('Cliente actualizado correctamente', 'success');
            cerrarModal('modal-editar-cliente');
            cargarClientes();
        }
    });
}

function eliminarCliente(id) {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;
    if (eliminarPorId('clientes', id)) {
        mostrarToast('Cliente eliminado correctamente', 'success');
        cargarClientes();
    } else {
        mostrarToast('Error al eliminar cliente', 'error');
    }
}

// ============================================================================
// PARTE 12: FORMULARIOS - VENTAS
// ============================================================================

function mostrarFormularioVenta() {
    const autos = getData('autos');
    const clientes = getData('clientes');
    const vendedores = getData('vendedores');
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'modal-venta';
    
    let optionsAutos = autos.map(a => `<option value="${a.id}">${a.patente} - ${a.marca} ${a.modelo}</option>`).join('');
    let optionsClientes = clientes.map(c => `<option value="${c.ID}">${c.Nombre_completo}</option>`).join('');
    let optionsVendedores = vendedores.map(v => `<option value="${v.id}">${v.nombre_completo}</option>`).join('');
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3>💰 Registrar Nueva Venta</h3>
            <form id="formVenta">
                <div class="form-group">
                    <label>Auto</label>
                    <select id="id_auto" required>
                        <option value="">Seleccione un auto</option>
                        ${optionsAutos}
                    </select>
                </div>
                <div class="form-group">
                    <label>Cliente</label>
                    <select id="id_cliente" required>
                        <option value="">Seleccione un cliente</option>
                        ${optionsClientes}
                    </select>
                </div>
                <div class="form-group">
                    <label>Vendedor</label>
                    <select id="id_vendedor" required>
                        <option value="">Seleccione un vendedor</option>
                        ${optionsVendedores}
                    </select>
                </div>
                <div class="form-group">
                    <label>Precio Final</label>
                    <input type="number" step="0.01" id="precio_final" required>
                </div>
                <div class="form-group">
                    <label>Forma de Pago</label>
                    <select id="forma_pago">
                        <option value="Contado">Contado</option>
                        <option value="Financiado">Financiado</option>
                        <option value="Parte_de_pago">Parte de pago</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Estado de Pago</label>
                    <select id="estado_pago">
                        <option value="Cobrado">Cobrado</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="En_cuotas">En cuotas</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="cerrarModal('modal-venta')">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Guardar
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('formVenta').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const idAuto = parseInt(document.getElementById('id_auto').value);
        const idCliente = parseInt(document.getElementById('id_cliente').value);
        const idVendedor = parseInt(document.getElementById('id_vendedor').value);
        
        if (!idAuto || !idCliente || !idVendedor) {
            mostrarToast('Por favor complete todos los campos', 'error');
            return;
        }
        
        const nuevaVenta = {
            id: generarId('ventas'),
            id_auto: idAuto,
            id_cliente: idCliente,
            id_vendedor: idVendedor,
            fecha: new Date().toISOString().split('T')[0],
            precio_final: parseFloat(document.getElementById('precio_final').value),
            forma_pago: document.getElementById('forma_pago').value,
            estado_de_pago: document.getElementById('estado_pago').value
        };
        
        const ventas = getData('ventas');
        ventas.push(nuevaVenta);
        saveData('ventas', ventas);
        
        // Cambiar estado del auto a vendido
        const autos = getData('autos');
        const autoIndex = autos.findIndex(a => a.id === idAuto);
        if (autoIndex !== -1) {
            autos[autoIndex].estado = 'vendido';
            autos[autoIndex].fecha_venta = new Date().toISOString().split('T')[0];
            saveData('autos', autos);
        }
        
        mostrarToast('Venta registrada correctamente', 'success');
        cerrarModal('modal-venta');
        cargarVentas();
    });
}

function eliminarVenta(id) {
    if (!confirm('¿Estás seguro de eliminar esta venta?')) return;
    if (eliminarPorId('ventas', id)) {
        mostrarToast('Venta eliminada correctamente', 'success');
        cargarVentas();
    } else {
        mostrarToast('Error al eliminar venta', 'error');
    }
}

// ============================================================================
// PARTE 13: FORMULARIOS - RESERVAS
// ============================================================================

function mostrarFormularioReserva() {
    const autos = getData('autos').filter(a => a.estado === 'en venta');
    const clientes = getData('clientes');
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'modal-reserva';
    
    let optionsAutos = autos.map(a => `<option value="${a.id}">${a.patente} - ${a.marca} ${a.modelo}</option>`).join('');
    let optionsClientes = clientes.map(c => `<option value="${c.ID}">${c.Nombre_completo}</option>`).join('');
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3>📅 Crear Nueva Reserva</h3>
            <form id="formReserva">
                <div class="form-group">
                    <label>Cliente</label>
                    <select id="id_cliente" required>
                        <option value="">Seleccione un cliente</option>
                        ${optionsClientes}
                    </select>
                </div>
                <div class="form-group">
                    <label>Auto (solo disponibles)</label>
                    <select id="id_auto" required>
                        <option value="">Seleccione un auto</option>
                        ${optionsAutos}
                    </select>
                </div>
                <div class="form-group">
                    <label>Fecha de Reserva</label>
                    <input type="date" id="fecha_reserva" required>
                </div>
                <div class="form-group">
                    <label>Monto de Seña</label>
                    <input type="number" id="monto_sena" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="cerrarModal('modal-reserva')">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Guardar
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('formReserva').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const idAuto = parseInt(document.getElementById('id_auto').value);
        const idCliente = parseInt(document.getElementById('id_cliente').value);
        const fecha = document.getElementById('fecha_reserva').value;
        const fechaFormateada = fecha.split('-').reverse().join('/');
        
        if (!idAuto || !idCliente) {
            mostrarToast('Por favor complete todos los campos', 'error');
            return;
        }
        
        // Calcular fecha límite (30 días después)
        const fechaReserva = new Date(fecha);
        const fechaLimite = new Date(fechaReserva);
        fechaLimite.setDate(fechaLimite.getDate() + 30);
        const fechaLimiteFormateada = fechaLimite.toISOString().split('T')[0].split('-').reverse().join('/');
        
        const nuevaReserva = {
            id_reserva: generarId('reservas'),
            id_cliente: idCliente,
            id_auto: idAuto,
            id_vendedor: 1,
            fecha_reserva: fechaFormateada,
            monto_sena: parseInt(document.getElementById('monto_sena').value),
            fecha_limite: fechaLimiteFormateada,
            estado: 'Reservado'
        };
        
        const reservas = getData('reservas');
        reservas.push(nuevaReserva);
        saveData('reservas', reservas);
        
        // Cambiar estado del auto a reservado
        const autos = getData('autos');
        const autoIndex = autos.findIndex(a => a.id === idAuto);
        if (autoIndex !== -1) {
            autos[autoIndex].estado = 'reservado';
            saveData('autos', autos);
        }
        
        mostrarToast('Reserva creada correctamente', 'success');
        cerrarModal('modal-reserva');
        cargarReservas();
    });
}

function eliminarReserva(id) {
    if (!confirm('¿Estás seguro de eliminar esta reserva?')) return;
    if (eliminarPorId('reservas', id)) {
        mostrarToast('Reserva eliminada correctamente', 'success');
        cargarReservas();
    } else {
        mostrarToast('Error al eliminar reserva', 'error');
    }
}

// ============================================================================
// PARTE 14: FORMULARIOS - VENDEDORES
// ============================================================================

function mostrarFormularioVendedor() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'modal-vendedor';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>👔 Registrar Nuevo Vendedor</h3>
            <form id="formVendedor">
                <div class="form-group">
                    <label>DNI</label>
                    <input type="text" id="dni" required>
                </div>
                <div class="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" id="nombre_completo" required>
                </div>
                <div class="form-group">
                    <label>Teléfono</label>
                    <input type="text" id="telefono" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label>Porcentaje de Comisión</label>
                    <input type="number" step="0.01" id="comision" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="cerrarModal('modal-vendedor')">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Guardar
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('formVendedor').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nuevoVendedor = {
            id: generarId('vendedores'),
            dni: document.getElementById('dni').value.trim(),
            nombre_completo: document.getElementById('nombre_completo').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            email: document.getElementById('email').value.trim(),
            comision_porcentaje: parseFloat(document.getElementById('comision').value),
            fecha_ingreso: new Date().toISOString().split('T')[0],
            estado: 'activo'
        };
        
        const vendedores = getData('vendedores');
        vendedores.push(nuevoVendedor);
        saveData('vendedores', vendedores);
        
        mostrarToast('Vendedor registrado correctamente', 'success');
        cerrarModal('modal-vendedor');
        cargarVendedores();
    });
}

function eliminarVendedor(id) {
    if (!confirm('¿Estás seguro de eliminar este vendedor?')) return;
    if (eliminarPorId('vendedores', id)) {
        mostrarToast('Vendedor eliminado correctamente', 'success');
        cargarVendedores();
    } else {
        mostrarToast('Error al eliminar vendedor', 'error');
    }
}

// ============================================================================
// PARTE 15: NAVEGACIÓN ENTRE MÓDULOS
// ============================================================================

function cambiarModulo(modulo) {
    // Actualizar estado
    state.moduloActual = modulo;
    
    // Actualizar botones de navegación
    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.modulo === modulo) {
            btn.classList.add('active');
        }
    });
    
    // Cargar el módulo correspondiente
    switch(modulo) {
        case 'autos':
            cargarAutos();
            break;
        case 'clientes':
            cargarClientes();
            break;
        case 'ventas':
            cargarVentas();
            break;
        case 'reservas':
            cargarReservas();
            break;
        case 'vendedores':
            cargarVendedores();
            break;
        default:
            renderWelcome();
    }
}

// ============================================================================
// PARTE 16: INICIALIZACIÓN
// ============================================================================

function init() {
    // Mostrar fecha
    mostrarFecha();
    
    // Configurar navegación
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modulo = this.dataset.modulo;
            cambiarModulo(modulo);
        });
    });
    
    // Cargar módulo inicial (Autos)
    cambiarModulo('autos');
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
const API_CITAS = "http://localhost:8080/ApiCitas";
const API_USUARIOS = "http://localhost:8080/api/Usuario";
const API_HORARIOS = "http://localhost:8080/ApiHorario";
const API_SERVICIOS = "http://localhost:8080/ApiServicios";

// Variables globales
let citasData = [];
let usuariosData = [];
let horariosData = [];
let serviciosData = [];
let usuarioActual = {
    idUsuario: 1,
    idCliente: 1,
    nombreCompleto: 'Juan Pérez'
};

// ===== FUNCIONES PARA OBTENER DATOS DE LAS APIS =====

async function obtenerTodasLasCitas() {
    try {
        const response = await fetch(`${API_CITAS}/GetCitas`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const citas = await response.json();
        citasData = citas;
        console.log('Citas cargadas:', citas);
        return citas;
    } catch (error) {
        console.error('Error al obtener citas:', error);
        mostrarError('Error al cargar las citas: ' + error.message);
        return [];
    }
}

async function obtenerUsuarios() {
    try {
        const response = await fetch(`${API_USUARIOS}/GetUsuarios?page=0&size=50`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const datos = await response.json();
        // Si la respuesta viene paginada, extraer el contenido
        usuariosData = datos.content || datos;
        console.log('Usuarios cargados:', usuariosData);
        return usuariosData;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        mostrarError('Error al cargar usuarios: ' + error.message);
        return [];
    }
}

async function obtenerHorarios() {
    try {
        const response = await fetch(`${API_HORARIOS}/GetHorario`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const horarios = await response.json();
        horariosData = horarios;
        console.log('Horarios cargados:', horarios);
        return horarios;
    } catch (error) {
        console.error('Error al obtener horarios:', error);
        mostrarError('Error al cargar horarios: ' + error.message);
        return [];
    }
}

async function obtenerServicios() {
    try {
        const response = await fetch(`${API_SERVICIOS}/ConsultarServicios`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const servicios = await response.json();
        serviciosData = servicios;
        console.log('Servicios cargados:', servicios);
        return servicios;
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        mostrarError('Error al cargar servicios: ' + error.message);
        return [];
    }
}

// ===== FUNCIONES PARA POBLAR LOS DROPDOWNS =====

function poblarDropdownUsuarios() {
    const selectUsuario = document.getElementById('usuario');
    if (!selectUsuario) return;

    // Limpiar opciones existentes excepto la primera
    selectUsuario.innerHTML = '<option value="">Seleccionar doctor</option>';

    usuariosData.forEach(usuario => {
        const option = document.createElement('option');
        option.value = usuario.idUsuario;
        option.textContent = `${usuario.nombre} ${usuario.apellido}`;
        selectUsuario.appendChild(option);
    });
}

function poblarDropdownHorarios() {
    const selectHorario = document.getElementById('horario');
    if (!selectHorario) return;

    // Limpiar opciones existentes excepto la primera
    selectHorario.innerHTML = '<option value="">Seleccionar horario</option>';

    horariosData.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario.idHorario;
        option.textContent = horario.descripcion;
        selectHorario.appendChild(option);
    });
}

function poblarDropdownServicios() {
    const selectServicio = document.getElementById('servicio');
    if (!selectServicio) return;

    // Limpiar opciones existentes excepto la primera
    selectServicio.innerHTML = '<option value="">Seleccionar servicio</option>';

    serviciosData.forEach(servicio => {
        const option = document.createElement('option');
        option.value = servicio.idServicio;
        option.textContent = servicio.nombre;
        selectServicio.appendChild(option);
    });
}

// ===== FUNCIONES PARA LAS OPERACIONES DE CITAS =====

async function crearCita(datosNuevaCita) {
    try {
        const response = await fetch(`${API_CITAS}/PostCitas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosNuevaCita)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        const nuevaCita = await response.json();
        console.log('Cita creada:', nuevaCita);
        return nuevaCita;
    } catch (error) {
        console.error('Error al crear cita:', error);
        throw error;
    }
}

async function actualizarCita(id, datosActualizados) {
    try {
        const response = await fetch(`${API_CITAS}/PutCitas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        const citaActualizada = await response.json();
        console.log('Cita actualizada:', citaActualizada);
        return citaActualizada;
    } catch (error) {
        console.error('Error al actualizar cita:', error);
        throw error;
    }
}

async function eliminarCita(id) {
    try {
        const response = await fetch(`${API_CITAS}/DeleteCitas/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        const resultado = await response.json();
        console.log('Cita eliminada:', resultado);
        return resultado;
    } catch (error) {
        console.error('Error al eliminar cita:', error);
        throw error;
    }
}

// ===== FUNCIONES UTILITARIAS =====

function obtenerNombreUsuario(idUsuario) {
    const usuario = usuariosData.find(u => u.idUsuario === idUsuario);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario desconocido';
}

function obtenerDescripcionHorario(idHorario) {
    const horario = horariosData.find(h => h.idHorario === idHorario);
    return horario ? horario.descripcion : 'Horario no disponible';
}

function obtenerNombreServicio(idServicio) {
    const servicio = serviciosData.find(s => s.idServicio === idServicio);
    return servicio ? servicio.nombre : 'Servicio desconocido';
}

function formatearFecha(fecha) {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatearFechaInput(fecha) {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toISOString().split('T')[0];
}

/**
 * Verifica si hay conflicto de horario para un doctor en una fecha específica
 * @param {Array} citas - Array de todas las citas
 * @param {Date} fechaCita - Fecha de la nueva cita
 * @param {number} idUsuario - ID del doctor
 * @param {number} idHorario - ID del horario
 * @param {number} idCitaExcluir - ID de cita a excluir (para edición)
 * @returns {boolean} - true si hay conflicto
 */
function verificarConflictoHorario(citas, fechaCita, idUsuario, idHorario, idCitaExcluir = null) {
    const fechaStr = new Date(fechaCita).toDateString();
    
    return citas.some(cita => {
        // Excluir la cita que se está editando
        if (idCitaExcluir && cita.idCita === idCitaExcluir) {
            return false;
        }
        
        // Verificar solo citas no canceladas
        if (cita.estado === 'CANCELADA') {
            return false;
        }
        
        const citaFechaStr = new Date(cita.fecha_cita).toDateString();
        
        // Verificar si es el mismo doctor, misma fecha y mismo horario
        return citaFechaStr === fechaStr && 
               cita.idUsuario === idUsuario && 
               cita.idHorario === idHorario;
    });
}

// ===== FUNCIONES PARA RENDERIZAR CITAS =====

function renderizarListaCitas(citas) {
    const appointmentList = document.getElementById('appointmentList');
    if (!appointmentList) return;

    // Filtrar solo las próximas citas (no canceladas ni completadas)
    const proximasCitas = citas.filter(cita => {
        const fechaCita = new Date(cita.fecha_cita);
        const hoy = new Date();
        return fechaCita >= hoy && !['CANCELADA', 'COMPLETADA'].includes(cita.estado);
    });

    if (proximasCitas.length === 0) {
        appointmentList.innerHTML = `
            <li class="appointment-item no-appointments">
                <div class="appointment-info text-center">
                    <p><i class="far fa-calendar"></i> No tienes citas programadas</p>
                </div>
            </li>
        `;
        return;
    }

    appointmentList.innerHTML = proximasCitas.map(cita => `
        <li class="appointment-item">
            <div class="appointment-info">
                <h4>${obtenerNombreServicio(cita.idServicio)}</h4>
                <p><i class="far fa-clock"></i> ${formatearFecha(cita.fecha_cita)}, ${obtenerDescripcionHorario(cita.idHorario)}</p>
                <p><i class="fas fa-user-md"></i> Dr. ${obtenerNombreUsuario(cita.idUsuario)}</p>
                <span class="badge badge-${cita.estado.toLowerCase()}">${cita.estado}</span>
            </div>
            <div class="appointment-actions">
                ${cita.estado === 'PENDIENTE' ? `<button class="btn-confirm" onclick="confirmarCita(${cita.idCita})">Confirmar</button>` : ''}
                <button class="btn-edit" onclick="editarCita(${cita.idCita})">Editar</button>
                <button class="btn-cancel" onclick="cancelarCita(${cita.idCita})">Cancelar</button>
            </div>
        </li>
    `).join('');
}

// ===== FUNCIONES PARA ACTUALIZAR INFORMACIÓN DE USUARIO =====

function actualizarInfoUsuario() {
    const userNameElement = document.getElementById('userName');
    const userAvatarElement = document.getElementById('userAvatar');
    
    if (userNameElement) {
        userNameElement.textContent = usuarioActual.nombreCompleto;
    }
    
    if (userAvatarElement) {
        const initials = usuarioActual.nombreCompleto
            .split(' ')
            .map(name => name.charAt(0))
            .join('')
            .toUpperCase();
        userAvatarElement.textContent = initials;
    }
}

// ===== FUNCIÓN PRINCIPAL PARA CARGAR DATOS =====

async function cargarDatosIniciales() {
    try {
        showLoader(true);
        
        // Cargar datos en paralelo
        const [citas, usuarios, horarios, servicios] = await Promise.all([
            obtenerTodasLasCitas(),
            obtenerUsuarios(),
            obtenerHorarios(),
            obtenerServicios()
        ]);

        // Poblar dropdowns
        poblarDropdownUsuarios();
        poblarDropdownHorarios();
        poblarDropdownServicios();

        // Actualizar datos globales para el calendario
        window.usuariosData = usuarios;
        window.horariosData = horarios;
        window.serviciosData = servicios;

        // Actualizar UI
        actualizarInfoUsuario();
        actualizarEstadisticasDashboard(citas);
        renderizarListaCitas(citas);
        
        // Si existe el calendario, actualizar sus citas y datos
        if (window.calendar) {
            window.calendar.appointments = citas;
            window.calendar.render();
        }
        
        // También llamar a la función de actualización del calendario si existe
        if (window.actualizarDatosGlobalesCalendario) {
            window.actualizarDatosGlobalesCalendario(usuarios, horarios, servicios);
        }
        
        console.log('Datos iniciales cargados correctamente');
        
    } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        mostrarError('Error al cargar los datos iniciales');
    } finally {
        showLoader(false);
    }
}

// Función para actualizar las estadísticas en el dashboard usando citasServices.js
function actualizarEstadisticasDashboard(citas) {
    // Usar la función global de citasServices.js
    if (typeof window.actualizarEstadisticasCitas === 'function') {
        window.actualizarEstadisticasCitas(citas);
    } else {
        // Fallback manual si no está disponible
        const stats = calcularEstadisticasManual(citas);
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length >= 3) {
            statCards[0].querySelector('h3').textContent = stats.pendientes;
            statCards[1].querySelector('h3').textContent = stats.completadas;
            statCards[2].querySelector('h3').textContent = stats.canceladas;
        }
    }
}

// Función de respaldo para calcular estadísticas
function calcularEstadisticasManual(citas) {
    const stats = {
        pendientes: 0,
        completadas: 0,
        canceladas: 0,
        confirmadas: 0
    };

    citas.forEach(cita => {
        const estado = String(cita.estado || '').toUpperCase().trim();
        switch(estado) {
            case 'PENDIENTE':
                stats.pendientes++;
                break;
            case 'COMPLETADA':
                stats.completadas++;
                break;
            case 'CANCELADA':
                stats.canceladas++;
                break;
            case 'CONFIRMADA':
                stats.confirmadas++;
                break;
        }
    });

    return stats;
}

// ===== FUNCIONES PARA ACCIONES DE CITAS =====

window.confirmarCita = async function(idCita) {
    if (!confirm('¿Confirmar esta cita?')) return;
    
    try {
        showLoader(true);
        const cita = citasData.find(c => c.idCita === idCita);
        if (!cita) {
            throw new Error('Cita no encontrada');
        }

        const citaActualizada = { ...cita, estado: 'CONFIRMADA' };
        await actualizarCita(idCita, citaActualizada);
        
        mostrarExito('Cita confirmada exitosamente');
        await cargarDatosIniciales();
    } catch (error) {
        mostrarError('Error al confirmar la cita: ' + error.message);
    } finally {
        showLoader(false);
    }
};

window.cancelarCita = async function(idCita) {
    if (!confirm('¿Está seguro que desea cancelar esta cita?')) return;
    
    try {
        showLoader(true);
        const cita = citasData.find(c => c.idCita === idCita);
        if (!cita) {
            throw new Error('Cita no encontrada');
        }

        const citaActualizada = { ...cita, estado: 'CANCELADA' };
        await actualizarCita(idCita, citaActualizada);
        
        mostrarExito('Cita cancelada exitosamente');
        await cargarDatosIniciales();
    } catch (error) {
        mostrarError('Error al cancelar la cita: ' + error.message);
    } finally {
        showLoader(false);
    }
};

window.editarCita = function(idCita) {
    const cita = citasData.find(c => c.idCita === idCita);
    if (cita && window.modal) {
        window.modal.open(cita);
    }
};

window.eliminarCitaCompleta = async function(idCita) {
    if (!confirm('¿Está seguro que desea eliminar esta cita permanentemente?')) return;
    
    try {
        showLoader(true);
        await eliminarCita(idCita);
        
        mostrarExito('Cita eliminada exitosamente');
        await cargarDatosIniciales();
    } catch (error) {
        mostrarError('Error al eliminar la cita: ' + error.message);
    } finally {
        showLoader(false);
    }
};

// ===== CLASE PARA MANEJAR EL MODAL =====

class CitasModal {
    constructor() {
        this.modal = document.getElementById('appointment-modal');
        this.currentEditingId = null;
        if (this.modal) {
            this.init();
        } else {
            console.error('Modal no encontrado con ID: appointment-modal');
        }
    }

    init() {
        // Abrir modal para nueva cita
        const newAppointmentBtn = document.getElementById('new-appointment-btn');
        if (newAppointmentBtn) {
            newAppointmentBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Abriendo modal...');
                this.open();
            });
        } else {
            console.error('Botón de nueva cita no encontrado');
        }

        // Cerrar modal
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.close();
            });
        });

        // Cerrar al hacer clic fuera del modal
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Manejar envío del formulario
        const form = document.getElementById('appointment-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.close();
            }
        });
    }

    open(editData = null) {
        console.log('Abriendo modal, editData:', editData);
        
        // Forzar la apertura del modal
        this.modal.style.display = 'flex';
        this.modal.style.alignItems = 'center';
        this.modal.style.justifyContent = 'center';
        this.modal.style.position = 'fixed';
        this.modal.style.top = '0';
        this.modal.style.left = '0';
        this.modal.style.width = '100%';
        this.modal.style.height = '100%';
        this.modal.style.backgroundColor = 'rgba(0,0,0,0.6)';
        this.modal.style.zIndex = '9999';
        document.body.style.overflow = 'hidden';
        
        // Establecer fecha mínima como hoy
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('date');
        if (dateInput) {
            dateInput.setAttribute('min', today);
        }

        if (editData) {
            this.currentEditingId = editData.idCita;
            this.populateForm(editData);
            const modalTitle = document.querySelector('.modal-header h3');
            if (modalTitle) {
                modalTitle.textContent = 'Editar Cita';
            }
        } else {
            this.currentEditingId = null;
            const modalTitle = document.querySelector('.modal-header h3');
            if (modalTitle) {
                modalTitle.textContent = 'Agendar Nueva Cita';
            }
        }
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetForm();
        this.currentEditingId = null;
    }

    resetForm() {
        const form = document.getElementById('appointment-form');
        if (form) {
            form.reset();
        }
    }

    populateForm(cita) {
        document.getElementById('usuario').value = cita.idUsuario;
        document.getElementById('servicio').value = cita.idServicio;
        document.getElementById('date').value = formatearFechaInput(cita.fecha_cita);
        document.getElementById('horario').value = cita.idHorario;
    }

    async handleSubmit() {
        const formData = {
            usuario: document.getElementById('usuario').value,
            servicio: document.getElementById('servicio').value,
            date: document.getElementById('date').value,
            horario: document.getElementById('horario').value
        };

        // Validar campos
        if (!formData.usuario || !formData.servicio || !formData.date || !formData.horario) {
            mostrarError('Por favor complete todos los campos');
            return;
        }

        // Validar conflicto de horarios
        const fechaCita = new Date(formData.date);
        const idUsuario = parseInt(formData.usuario);
        const idHorario = parseInt(formData.horario);
        
        const hayConflicto = verificarConflictoHorario(
            citasData, 
            fechaCita, 
            idUsuario, 
            idHorario, 
            this.currentEditingId
        );

        if (hayConflicto) {
            const nombreDoctor = obtenerNombreUsuario(idUsuario);
            const descripcionHorario = obtenerDescripcionHorario(idHorario);
            const fechaFormateada = formatearFecha(fechaCita);
            
            mostrarError(`El Dr. ${nombreDoctor} ya tiene una cita programada el ${fechaFormateada} en el horario ${descripcionHorario}`);
            return;
        }

        try {
            showLoader(true);

            const citaData = {
                idUsuario: parseInt(formData.usuario),
                idCliente: usuarioActual.idCliente,
                idHorario: parseInt(formData.horario),
                idServicio: parseInt(formData.servicio),
                fecha_cita: new Date(formData.date),
                estado: 'PENDIENTE'
            };

            if (this.currentEditingId) {
                // Editar cita existente
                citaData.idCita = this.currentEditingId;
                await actualizarCita(this.currentEditingId, citaData);
                mostrarExito('Cita actualizada exitosamente');
            } else {
                // Crear nueva cita
                await crearCita(citaData);
                mostrarExito('Cita agendada exitosamente');
            }
            
            this.close();
            await cargarDatosIniciales();

        } catch (error) {
            mostrarError('Error al procesar la cita: ' + error.message);
        } finally {
            showLoader(false);
        }
    }
}

// ===== FUNCIONES DE NOTIFICACIONES Y LOADER =====

function mostrarExito(mensaje) {
    mostrarNotificacion(mensaje, 'success');
}

function mostrarError(mensaje) {
    mostrarNotificacion(mensaje, 'error');
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo === 'error' ? 'danger' : tipo === 'success' ? 'success' : 'info'}`;
    alertDiv.textContent = mensaje;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function showLoader(show) {
    let loader = document.getElementById('citas-loader');
    
    if (show && !loader) {
        loader = document.createElement('div');
        loader.id = 'citas-loader';
        loader.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: rgba(0,0,0,0.5); display: flex; align-items: center; 
                        justify-content: center; z-index: 9999;">
                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <div style="border: 4px solid #f3f3f3; border-top: 4px solid #007bff; 
                                border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 0 auto 10px;"></div>
                    <p>Procesando...</p>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loader);
    } else if (!show && loader) {
        loader.remove();
    }
}

// ===== INICIALIZACIÓN =====

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Inicializando controlador de citas...');
        
        // Crear instancia del modal
        window.modal = new CitasModal();
        
        // Cargar datos iniciales
        await cargarDatosIniciales();
        
        console.log('Controlador de citas inicializado correctamente');
        
    } catch (error) {
        console.error('Error al inicializar el controlador de citas:', error);
        mostrarError('Error al inicializar la aplicación');
    }
});
// Funciones de compatibilidad con el controlador original
if (typeof window !== 'undefined') {
    // Simular las funciones del controlador original
    window.apiGet = window.apiGet || function(endpoint) {
        return Promise.resolve({ data: [] });
    };
    
    window.requireSession = window.requireSession || function() {
        return {
            NOMBRECOMPLETO: 'Juan Pérez',
            IDCLIENTE: 1,
            nombreCompleto: 'Juan Pérez',
            idCliente: 1
        };
    };
    
    window.formatDate = window.formatDate || function(date) {
        return new Date(date).toLocaleDateString('es-ES');
    };
}

// Calendar functionality
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.today = new Date();
        this.currentDate.setDate(16); // Establecer día actual como 16 para mostrar
        this.months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        this.appointments = [
            {
                date: new Date(2025, 8, 25), // 25 Sep 2025
                title: "Limpieza Dental",
                time: "10:00 AM - 11:00 AM",
                doctor: "Dr. María Rodríguez",
                status: "pendiente"
            },
            {
                date: new Date(2025, 8, 28), // 28 Sep 2025
                title: "Blanqueamiento Dental", 
                time: "2:00 PM - 3:30 PM",
                doctor: "Dr. Carlos López",
                status: "pendiente"
            }
        ];
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        });

        document.getElementById('todayBtn').addEventListener('click', () => {
            this.currentDate = new Date();
            this.render();
        });
    }

    render() {
        this.renderHeader();
        this.renderDays();
    }

    renderHeader() {
        const monthYear = `${this.months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        document.getElementById('currentMonth').textContent = monthYear;
    }

    renderDays() {
        const daysGrid = document.getElementById('daysGrid');
        daysGrid.innerHTML = '';

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dayElement = document.createElement('div');
            dayElement.textContent = date.getDate();

            // Add classes based on conditions
            if (date.getMonth() !== this.currentDate.getMonth()) {
                dayElement.classList.add('other-month');
            }

            if (this.isSameDay(date, this.today)) {
                dayElement.classList.add('current-day');
            }

            if (this.hasAppointment(date)) {
                dayElement.classList.add('has-appointment');
            }

            dayElement.addEventListener('click', () => {
                // Remove previous selection
                document.querySelectorAll('.days-grid div').forEach(d => d.classList.remove('selected'));
                dayElement.classList.add('selected');
                
                // Check if this day has an appointment
                if (this.hasAppointment(date)) {
                    this.showAppointmentDetails(date);
                } else {
                    this.selectDate(date);
                }
            });

            daysGrid.appendChild(dayElement);
        }
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    hasAppointment(date) {
        return this.appointments.some(appointment => this.isSameDay(date, appointment.date));
    }

    getAppointment(date) {
        return this.appointments.find(appointment => this.isSameDay(date, appointment.date));
    }

    selectDate(date) {
        console.log('Fecha seleccionada:', date);
        // Aquí puedes agregar lógica para mostrar citas de esa fecha
    }

    showAppointmentDetails(date) {
        const appointment = this.getAppointment(date);
        if (appointment) {
            const modal = document.createElement('div');
            modal.className = 'appointment-detail-modal';
            modal.innerHTML = `
                <div class="appointment-detail-content">
                    <div class="appointment-detail-header">
                        <h3><i class="fas fa-calendar-check"></i> Detalles de la Cita</h3>
                        <button class="close-detail-modal">&times;</button>
                    </div>
                    <div class="appointment-detail-body">
                        <div class="detail-item">
                            <i class="fas fa-tooth"></i>
                            <div>
                                <strong>Servicio:</strong>
                                <span>${appointment.title}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <strong>Hora:</strong>
                                <span>${appointment.time}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <div>
                                <strong>Fecha:</strong>
                                <span>${date.toLocaleDateString('es-ES', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}</span>
                            </div>
                        </div>
                        <div class="detail-item status-${appointment.status}">
                            <i class="fas fa-info-circle"></i>
                            <div>
                                <strong>Estado:</strong>
                                <span class="status-badge">${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="appointment-detail-actions">
                        <button class="btn btn-primary" onclick="document.getElementById('appointment-modal').style.display='flex'; this.closest('.appointment-detail-modal').remove();">
                            <i class="fas fa-edit"></i> Modificar
                        </button>
                        <button class="btn btn-cancel" onclick="this.closest('.appointment-detail-modal').remove();">
                            <i class="fas fa-times"></i> Cerrar
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Close modal functionality
            const closeBtn = modal.querySelector('.close-detail-modal');
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });

            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });

            // Close on Escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        }
    }
}

// Modal functionality
class Modal {
    constructor() {
        this.modal = document.getElementById('appointment-modal');
        this.init();
    }

    init() {
        // Open modal buttons
        document.getElementById('new-appointment-btn').addEventListener('click', () => {
            this.open();
        });

        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.close();
            });
        });

        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Form submission
        document.getElementById('appointment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.close();
            }
        });
    }

    open() {
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').setAttribute('min', today);
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetForm();
    }

    resetForm() {
        document.getElementById('appointment-form').reset();
    }

    handleSubmit() {
        const formData = {
            service: document.getElementById('service').value,
            specialist: document.getElementById('specialist').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            notes: document.getElementById('notes').value
        };

        console.log('Nueva cita:', formData);
        
        // Aquí iría la lógica para enviar los datos al servidor
        // Por ahora solo mostramos un mensaje de éxito
        alert('¡Cita agendada exitosamente!');
        this.close();
    }
}

// Appointment actions
class AppointmentManager {
    constructor() {
        this.init();
    }

    init() {
        // Confirm appointment buttons
        document.querySelectorAll('.btn-confirm').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.confirmAppointment(e.target);
            });
        });

        // Cancel appointment buttons
        document.querySelectorAll('.btn-cancel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.cancelAppointment(e.target);
            });
        });
    }

    confirmAppointment(button) {
        const appointmentItem = button.closest('.appointment-item');
        const appointmentTitle = appointmentItem.querySelector('h4').textContent;
        
        if (confirm(`¿Confirmar la cita de ${appointmentTitle}?`)) {
            button.textContent = 'Confirmada';
            button.style.background = 'var(--success)';
            button.disabled = true;
            
            // Agregar animación de éxito
            appointmentItem.style.borderLeftColor = 'var(--success)';
            
            console.log('Cita confirmada:', appointmentTitle);
        }
    }

    cancelAppointment(button) {
        const appointmentItem = button.closest('.appointment-item');
        const appointmentTitle = appointmentItem.querySelector('h4').textContent;
        
        if (confirm(`¿Está seguro que desea cancelar la cita de ${appointmentTitle}?`)) {
            appointmentItem.style.opacity = '0.5';
            appointmentItem.style.borderLeftColor = 'var(--warning)';
            
            // Cambiar texto del botón
            button.textContent = 'Cancelada';
            button.disabled = true;
            
            // Deshabilitar botón de confirmar
            const confirmBtn = appointmentItem.querySelector('.btn-confirm');
            if (confirmBtn) {
                confirmBtn.disabled = true;
                confirmBtn.style.opacity = '0.5';
            }
            
            console.log('Cita cancelada:', appointmentTitle);
        }
    }
}

// Responsive utilities
class ResponsiveUtils {
    constructor() {
        this.init();
    }

    init() {
        this.handleResize();
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        // Adjust calendar for mobile
        if (isMobile) {
            this.adjustCalendarForMobile();
        } else {
            this.adjustCalendarForDesktop();
        }
    }

    adjustCalendarForMobile() {
        const daysGrid = document.getElementById('daysGrid');
        if (daysGrid) {
            daysGrid.style.gap = '3px';
        }
        
        // Make appointment actions stack vertically on mobile
        document.querySelectorAll('.appointment-actions').forEach(actions => {
            if (window.innerWidth <= 480) {
                actions.style.flexDirection = 'column';
                actions.style.width = '100%';
            }
        });
    }

    adjustCalendarForDesktop() {
        const daysGrid = document.getElementById('daysGrid');
        if (daysGrid) {
            daysGrid.style.gap = '8px';
        }
        
        // Reset appointment actions for desktop
        document.querySelectorAll('.appointment-actions').forEach(actions => {
            actions.style.flexDirection = 'row';
            actions.style.width = 'auto';
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
    new Modal();
    new AppointmentManager();
    new ResponsiveUtils();
    
    // El menu.js se encargará del menú flotante
    
    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });

    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.card, .calendar-container, .appointments').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
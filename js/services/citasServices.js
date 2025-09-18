// citasServices.js - Servicios para estadísticas y utilidades

/**
 * Función para obtener totales de citas según los estados de la BD
 * @param {Array} citas - Array de citas obtenido de la API
 * @returns {Object} - Objeto con los totales por estado
 */
function obtenerTotalesCitas(citas) {
  // Validar que citas es un array
  if (!Array.isArray(citas)) {
    console.error('Se esperaba un array de citas');
    return { completadas: 0, pendientes: 0, canceladas: 0, confirmadas: 0 };
  }

  let completadas = 0;
  let pendientes = 0;
  let canceladas = 0;
  let confirmadas = 0;

  citas.forEach(cita => {
    try {
      // Usar el nombre exacto de campo de tu BD: estado
      const estado = String(cita.estado || "").toUpperCase().trim();
      
      switch(estado) {
        case "COMPLETADA":
          completadas++;
          break;
        case "PENDIENTE":
          pendientes++;
          break;
        case "CANCELADA":
          canceladas++;
          break;
        case "CONFIRMADA":
          confirmadas++;
          break;
        default:
          console.warn('Estado de cita no reconocido:', estado);
      }
    } catch (error) {
      console.warn('Error procesando cita:', cita, error);
    }
  });

  return { completadas, pendientes, canceladas, confirmadas };
}

/**
 * Función para actualizar la UI con los totales de citas
 * @param {Array} citas - Array de citas obtenido de la API
 */
function actualizarEstadisticasCitas(citas) {
  try {
    const totals = obtenerTotalesCitas(citas);
    
    // Actualizar las tarjetas de estadísticas en el dashboard
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 3) {
      // Tarjeta 1: Citas Pendientes
      const pendientesCard = statCards[0].querySelector('h3');
      if (pendientesCard) pendientesCard.textContent = totals.pendientes;
      
      // Tarjeta 2: Citas Completadas
      const completadasCard = statCards[1].querySelector('h3');
      if (completadasCard) completadasCard.textContent = totals.completadas;
      
      // Tarjeta 3: Citas Canceladas
      const canceladasCard = statCards[2].querySelector('h3');
      if (canceladasCard) canceladasCard.textContent = totals.canceladas;
    }
    
    // También actualizar elementos específicos si existen
    const pendienteElem = document.getElementById('pendiente');
    const completadosElem = document.getElementById('Completados');
    const canceladasElem = document.getElementById('Canceladas');
    const confirmadasElem = document.getElementById('Confirmadas');
    
    if (pendienteElem) pendienteElem.textContent = totals.pendientes;
    if (completadosElem) completadosElem.textContent = totals.completadas;
    if (canceladasElem) canceladasElem.textContent = totals.canceladas;
    if (confirmadasElem) confirmadasElem.textContent = totals.confirmadas;
    
    console.log('Estadísticas actualizadas:', totals);
    
  } catch (error) {
    console.error('Error actualizando estadísticas:', error);
  }
}

/**
 * Función para obtener estadísticas de citas por fecha
 * @param {Array} citas - Array de citas
 * @param {number} dias - Número de días a analizar (por defecto 7)
 * @returns {Object} - Objeto con labels y datos por estado
 */
function estadisticasCitasPorFecha(citas, dias = 7) {
  // Crear array de los últimos 'dias' días
  const days = Array.from({ length: dias }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    // Resetear horas para comparación exacta por día
    date.setHours(0, 0, 0, 0);
    return date;
  }).reverse();

  // Crear labels para los días (formato DD/MM/YYYY)
  const labels = days.map(d => {
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  });

  // Objeto para almacenar resultados por estado
  const resultados = {
    completadas: Array(days.length).fill(0),
    pendientes: Array(days.length).fill(0),
    canceladas: Array(days.length).fill(0),
    confirmadas: Array(days.length).fill(0)
  };

  // Procesar cada cita
  citas.forEach(cita => {
    try {
      // Usar el campo fecha_cita de tu BD
      const fechaCita = new Date(cita.fecha_cita);
      fechaCita.setHours(0, 0, 0, 0); // Normalizar hora
      
      // Encontrar el índice del día correspondiente
      const diaIndex = days.findIndex(d => d.getTime() === fechaCita.getTime());
      
      if (diaIndex !== -1) {
        const estado = String(cita.estado || "").toUpperCase().trim();
        
        switch(estado) {
          case "COMPLETADA":
            resultados.completadas[diaIndex]++;
            break;
          case "PENDIENTE":
            resultados.pendientes[diaIndex]++;
            break;
          case "CANCELADA":
            resultados.canceladas[diaIndex]++;
            break;
          case "CONFIRMADA":
            resultados.confirmadas[diaIndex]++;
            break;
        }
      }
    } catch (error) {
      console.warn('Error procesando cita para estadísticas por fecha:', cita, error);
    }
  });

  return { labels, ...resultados };
}

/**
 * Función para obtener citas del mes actual
 * @param {Array} citas - Array de todas las citas
 * @returns {Array} - Citas del mes actual
 */
function obtenerCitasDelMes(citas) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return citas.filter(cita => {
    const citaDate = new Date(cita.fecha_cita);
    return citaDate.getMonth() === currentMonth && citaDate.getFullYear() === currentYear;
  });
}

/**
 * Función para obtener próximas citas (siguientes 7 días)
 * @param {Array} citas - Array de todas las citas
 * @returns {Array} - Próximas citas ordenadas por fecha
 */
function obtenerProximasCitas(citas) {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);
  
  return citas
    .filter(cita => {
      const citaDate = new Date(cita.fecha_cita);
      return citaDate >= now && citaDate <= nextWeek && cita.estado !== 'CANCELADA';
    })
    .sort((a, b) => new Date(a.fecha_cita) - new Date(b.fecha_cita));
}

/**
 * Función para obtener citas por estado
 * @param {Array} citas - Array de todas las citas
 * @param {string} estado - Estado a filtrar (PENDIENTE, CONFIRMADA, etc.)
 * @returns {Array} - Citas filtradas por estado
 */
function obtenerCitasPorEstado(citas, estado) {
  return citas.filter(cita => 
    cita.estado.toUpperCase() === estado.toUpperCase()
  );
}

/**
 * Función para verificar si hay conflictos de horario
 * @param {Array} citas - Array de todas las citas
 * @param {Date} fechaCita - Fecha de la nueva cita
 * @param {number} idHorario - ID del horario
 * @param {number} idCitaExcluir - ID de cita a excluir (para edición)
 * @returns {boolean} - true si hay conflicto
 */
function verificarConflictoHorario(citas, fechaCita, idHorario, idCitaExcluir = null) {
  const fechaStr = new Date(fechaCita).toDateString();
  
  return citas.some(cita => {
    if (idCitaExcluir && cita.idCita === idCitaExcluir) {
      return false; // Excluir la cita que se está editando
    }
    
    const citaFechaStr = new Date(cita.fecha_cita).toDateString();
    return citaFechaStr === fechaStr && 
           cita.idHorario === idHorario && 
           cita.estado !== 'CANCELADA';
  });
}

/**
 * Función para generar reporte de estadísticas completo
 * @param {Array} citas - Array de todas las citas
 * @returns {Object} - Reporte completo de estadísticas
 */
function generarReporteEstadisticas(citas) {
  const totalCitas = citas.length;
  const totalesPorEstado = obtenerTotalesCitas(citas);
  const citasDelMes = obtenerCitasDelMes(citas);
  const proximasCitas = obtenerProximasCitas(citas);
  const estadisticasSemana = estadisticasCitasPorFecha(citas, 7);
  
  return {
    total: totalCitas,
    porEstado: totalesPorEstado,
    delMesActual: citasDelMes.length,
    proximasSemana: proximasCitas.length,
    estadisticasSemanal: estadisticasSemana,
    tasaConfirmacion: totalCitas > 0 ? ((totalesPorEstado.confirmadas + totalesPorEstado.completadas) / totalCitas * 100).toFixed(1) : 0,
    tasaCancelacion: totalCitas > 0 ? (totalesPorEstado.canceladas / totalCitas * 100).toFixed(1) : 0
  };
}

// Hacer las funciones disponibles globalmente
if (typeof window !== 'undefined') {
  window.obtenerTotalesCitas = obtenerTotalesCitas;
  window.actualizarEstadisticasCitas = actualizarEstadisticasCitas;
  window.estadisticasCitasPorFecha = estadisticasCitasPorFecha;
  window.obtenerCitasDelMes = obtenerCitasDelMes;
  window.obtenerProximasCitas = obtenerProximasCitas;
  window.obtenerCitasPorEstado = obtenerCitasPorEstado;
  window.verificarConflictoHorario = verificarConflictoHorario;
  window.generarReporteEstadisticas = generarReporteEstadisticas;
}
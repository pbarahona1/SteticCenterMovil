const API_CITAS = "http://localhost:8080/ApiCitas";
 
// Función para obtener totales de citas según tu estructura de BD
export function obtenerTotalesCitas(citas) {
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
      const estado = String(cita.estado || cita.ESTADO || "").toUpperCase().trim();
      
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

// Función para actualizar la UI con los totales
export function actualizarEstadisticasCitas(citas) {
  try {
    const totals = obtenerTotalesCitas(citas);
    
    // Actualizar los elementos si existen
    const pendienteElem = document.getElementById('pendiente');
    const completadosElem = document.getElementById('Completados');
    const canceladasElem = document.getElementById('Canceladas');
    
    if (pendienteElem) pendienteElem.textContent = totals.pendientes;
    if (completadosElem) completadosElem.textContent = totals.completadas;
    if (canceladasElem) canceladasElem.textContent = totals.canceladas;
    
    // También puedes mostrar las confirmadas si tienes un elemento para ello
    const confirmadasElem = document.getElementById('Confirmadas');
    if (confirmadasElem) confirmadasElem.textContent = totals.confirmadas;
    
  } catch (error) {
    console.error('Error actualizando estadísticas:', error);
  }
}

export function estadisticasCitasPorFecha(citas, dias = 7) {
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
      const fechaCita = new Date(cita.fecha_cita || cita.FECHA_CITA);
      fechaCita.setHours(0, 0, 0, 0); // Normalizar hora
      
      // Encontrar el índice del día correspondiente
      const diaIndex = days.findIndex(d => d.getTime() === fechaCita.getTime());
      
      if (diaIndex !== -1) {
        const estado = String(cita.estado || cita.ESTADO || "").toUpperCase().trim();
        
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
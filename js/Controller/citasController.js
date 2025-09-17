import { actualizarEstadisticasCitas } from '../services/citasServices.js';

// Cuando cargas las citas (ejemplo con fetch)
async function cargarCitas() {
  try {
    const response = await fetch('/ApiCitas');
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const citas = await response.json();
    
    // Actualizar las estadísticas en el dashboard
    actualizarEstadisticasCitas(citas);
    
    // También puedes obtener estadísticas por fecha si las necesitas
    const statsPorFecha = estadisticasCitasPorFecha(citas, 7);
    console.log('Estadísticas por fecha:', statsPorFecha);
    
    return citas;
  } catch (error) {
    console.error('Error al cargar citas:', error);
    // Mostrar valores por defecto en caso de error
    actualizarEstadisticasCitas([]);
  }
}

// Llamar al cargar la página
document.addEventListener('DOMContentLoaded', cargarCitas);


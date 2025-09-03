import { apiGet } from './api.js';

function el(sel) { return document.querySelector(sel); }
function html(node, s) { node.innerHTML = s; }

async function loadDetalleCita(idCita) {
  try {
    const resp = await apiGet(`/ApiDetalleCita/GetDetalle/${idCita}`);
    const arr = resp.data || resp || [];

    const list = arr.map(x => `
      <div class="detalle-item">
        <div><strong>Observaciones:</strong> ${x.OBSERVACIONES || x.observaciones || 'Sin observaciones'}</div>
      </div>
    `).join('') || '<p class="empty">No hay detalles para esta cita.</p>';

    const cont = el('#detalleCita');
    if (cont) html(cont, list);
  } catch (e) {
    console.error("Error al cargar detalle de cita:", e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const idCita = params.get("idCita");
  if (idCita) loadDetalleCita(idCita);
});
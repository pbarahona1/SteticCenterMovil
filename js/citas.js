import { apiGet, requireSession, formatDate } from './api.js';

function el(sel) { return document.querySelector(sel); }
function html(node, s) { node.innerHTML = s; }

async function loadCitas() {
  const cliente = requireSession(); 
  if (!cliente) return;

  const nombre = cliente.NOMBRECOMPLETO || cliente.nombreCompleto || 'Cliente';
  const greetEl = el('#greet');
  if (greetEl) greetEl.textContent = `Hola, ${nombre.split(' ')[0]}!`;

  try {
    const resp = await apiGet('/ApiCitas/GetCitas'); 
    const arr = resp.data || resp || [];
    const id = cliente.IDCLIENTE || cliente.idCliente;

    const citas = arr.filter(x => (x.IDCLIENTE || x.idCliente) == id)
                     .sort((a, b) => new Date(a.FECHA_CITA || a.fecha_cita) - new Date(b.FECHA_CITA || b.fecha_cita));

    const list = citas.map(x => {
      const f = formatDate(x.FECHA_CITA || x.fecha_cita);
      const estado = (x.ESTADO || x.estado || '').toUpperCase();
      return `
      <li class="cita-item">
        <div>
          <div class="cita-fecha">${f}</div>
          <div class="cita-estado">${estado}</div>
        </div>
        <a class="btn-small" href="MisCitas.html">Ver</a>
      </li>`;
    }).join('') || '<li class="empty">No tienes citas.</li>';

    const ul = el('#listaCitas');
    if (ul) html(ul, list);
  } catch (e) {
    console.error("Error al cargar citas:", e);
  }
}

document.addEventListener('DOMContentLoaded', loadCitas);
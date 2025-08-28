import { apiGet, requireSession, formatDate } from './api.js';

function el(sel){ return document.querySelector(sel); }
function html(node, s){ node.innerHTML = s; }

async function load() {
  const cliente = requireSession(); 
  if (!cliente) return;


  const nombre = cliente.NOMBRECOMPLETO || cliente.nombreCompleto || 'Cliente';
  const greetEl = el('#greet');
  if (greetEl) greetEl.textContent = `Hola, ${nombre.split(' ')[0]}!`;

  try {
    const resp = await apiGet('/ApiCitas/GetCitas'); 
    const arr = resp.data || resp || [];
    const id = cliente.IDCLIENTE || cliente.idCliente;

    const pendientes = arr.filter(x => {
      const xId = x.IDCLIENTE || x.idCliente;
      const estado = (x.ESTADO || x.estado || '').toString().toUpperCase();
      return xId == id && ['PENDIENTE','PROGRAMADA','AGENDADA','EN_PROCESO'].includes(estado);
    }).sort((a,b)=> new Date(a.FECHA_CITA || a.fechaCita) - new Date(b.FECHA_CITA || b.fechaCita));

    const list = pendientes.slice(0,5).map(x => {
      const f = formatDate(x.FECHA_CITA || x.fechaCita);
      const estado = x.ESTADO || x.estado || '';
      return `<li class="cita-item">
        <div>
          <div class="cita-fecha">${f}</div>
          <div class="cita-estado">${estado}</div>
        </div>
        <a class="btn-small" href="MisCitas.html">Ver</a>
      </li>`;
    }).join('') || '<li class="empty">No tienes citas pendientes.</li>';

    const ul = el('#citasPendientes');
    if (ul) html(ul, list);
  } catch (e) {
    console.error("Error al cargar citas:", e);
  }

  try {
    const p = await apiGet('/api/paquetes/GetPaquetes');  
    const paquetes = (p.data || p || []).slice(0,6);

    const s = await apiGet('/ApiServicios/ConsultarServicios'); 
    const servicios = (s.data || s || []).slice(0,6);

const cards = paquetes.slice(0,6).map(x => `
  <div class="card">
    <div class="chip">Paquete</div>
    <div class="card-title">${x.nombre}</div>
    <div class="card-price">$${x.precio ?? '-'}</div>
    <a class="btn-small" href="Servicios.html">Ver más</a>
  </div>
`).join('');

const cont = el('#destacados');
if (cont) html(cont, cards || '<p class="empty">No hay recomendaciones.</p>');

  } catch(e){ 
    console.error("Error al cargar paquetes/servicios:", e); 
  }
}

document.addEventListener('DOMContentLoaded', load);

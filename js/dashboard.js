
import { apiGet, requireSession, formatDate } from './api.js';

function el(sel){ return document.querySelector(sel); }
function html(node, s){ node.innerHTML = s; }

async function load() {
  const cliente = requireSession(); if (!cliente) return;
  // Header greeting
  const nombre = cliente.nombreCompleto || cliente.NOMBRECOMPLETO || 'Cliente';
  const greetEl = el('#greet');
  if (greetEl) greetEl.textContent = `Hola, ${nombre.split(' ')[0]}!`;

  try {
    const resp = await apiGet('/ApiCitas/GetCitas');
    const arr = resp.data || resp || [];
    const id = cliente.idCliente || cliente.IDCLIENTE || cliente.id || cliente.IdCliente;
    const pendientes = arr.filter(x => {
      const xId = x.idCliente || x.IDCLIENTE || x.IdCliente;
      const estado = (x.estado || x.ESTADO || '').toString().toUpperCase();
      return xId == id && ['PENDIENTE','PROGRAMADA','AGENDADA','EN_PROCESO'].includes(estado);
    }).sort((a,b)=> new Date(a.fechaCita||a.FECHA_CITA) - new Date(b.fechaCita||b.FECHA_CITA));

    const list = pendientes.slice(0,5).map(x => {
      const f = formatDate(x.fechaCita || x.FECHA_CITA);
      const estado = x.estado || x.ESTADO || '';
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
    console.error(e);
  }

  // Paquetes y Servicios destacados
  try {
    const p = await apiGet('/api/paquetes/GetPaquetes');
    const paquetes = (p.data || p || []).slice(0,6);
    const s = await apiGet('/ApiServicios/ConsultarServicios');
    const servicios = (s.data || s || []).slice(0,6);

    const cards = [...paquetes.map(x => ({
      tipo:'Paquete', nombre: x.nombrePaquete || x.NOMBREPAQUETE || 'Paquete', precio: x.precio || x.PRECIO
    })), ...servicios.map(x => ({
      tipo:'Servicio', nombre: x.nombreServicio || x.NOMBRESERVICIO || 'Servicio', precio: x.precio || x.PRECIO
    }))].slice(0,6).map(c => `
      <div class="card">
        <div class="chip">${c.tipo}</div>
        <div class="card-title">${c.nombre}</div>
        <div class="card-price">$${c.precio ?? '-'}</div>
        <a class="btn-small" href="Servicios.html">Ver más</a>
      </div>
    `).join('');

    const cont = el('#destacados');
    if (cont) html(cont, cards || '<p class="empty">No hay recomendaciones.</p>');
  } catch(e){ console.error(e); }
}

document.addEventListener('DOMContentLoaded', load);
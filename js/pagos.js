// pagos.js
import { apiGet, requireSession, formatDate } from './api.js';

function el(s){ return document.querySelector(s); }
function html(n,h){ n.innerHTML = h; }

async function loadPagos(){
  const cliente = requireSession(); if (!cliente) return;
  const id = cliente.idCliente || cliente.IDCLIENTE || cliente.IdCliente;

  try{
    const resp = await apiGet('/api/GetFacturas');
    const arr = resp.data || resp || [];
    const mias = arr.filter(f => (f.idCliente||f.IDCLIENTE||f.IdCliente) == id)
      .sort((a,b)=> new Date(b.fecha||b.FECHA) - new Date(a.fecha||a.FECHA));

    const body = mias.map(f => {
      const fecha = formatDate(f.fecha||f.FECHA);
      const total = f.total || f.TOTAL;
      const estado = f.estado || f.ESTADO;
      return `
        <div class="factura-card">
          <p><strong>Fecha:</strong> ${fecha}</p>
          <p><strong>Monto:</strong> $${total}</p>
          <p><strong>Estado:</strong> ${estado}</p>
          <a class="btn-detalle" href="#" data-id="${f.idFactura||f.IDFACTURA||f.IdFactura}">Ver Detalle</a>
          <a class="btn-descargar" href="#" data-id="${f.idFactura||f.IDFACTURA||f.IdFactura}">Descargar</a>
        </div>`;
    }).join('') || '<p class="empty">No tienes pagos registrados.</p>';

    const cont = el('#facturasList');
    if (cont) html(cont, body);

    // attach events
    cont?.querySelectorAll('.btn-detalle').forEach(a => a.addEventListener('click', e => {
      e.preventDefault(); alert('Detalle de factura próximamente (requiere endpoint de detalle).');
    }));
    cont?.querySelectorAll('.btn-descargar').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      const idf = a.getAttribute('data-id');
      window.print();
    }));

  }catch(e){ console.error(e); alert('No se pudo cargar tu historial'); }
}

document.addEventListener('DOMContentLoaded', loadPagos);
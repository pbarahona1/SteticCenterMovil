// perfil.js
import { apiGet, apiSend, requireSession } from './api.js';

function el(s){ return document.querySelector(s); }
function html(n,h){ n.innerHTML = h; }

function fillPerfil(c){
  el('#nombre').textContent = c.nombreCompleto || c.NOMBRECOMPLETO || '';
  el('#correo').textContent = c.correo || c.CORREO || '';
  el('#direccion').textContent = c.direccion || c.DIRECCION || '';
  // telefono no existe en entidad
}

function setForm(c){
  el('#fnombre').value = c.nombreCompleto || c.NOMBRECOMPLETO || '';
  el('#fcorreo').value = c.correo || c.CORREO || '';
  el('#fdireccion').value = c.direccion || c.DIRECCION || '';
}

function validateEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function load(){
  const c = requireSession(); if (!c) return;
  fillPerfil(c);

  el('#btnEditar')?.addEventListener('click', ()=> {
    setForm(c);
    el('#editModal').showModal();
  });

  el('#btnChangePass')?.addEventListener('click', ()=> {
    el('#pcorreo').value = '';
    el('#pnueva').value = '';
    el('#passModal').showModal();
  });

  el('#saveEdit')?.addEventListener('click', async ()=>{
    const nombre = el('#fnombre').value.trim();
    const correo = el('#fcorreo').value.trim();
    const dir = el('#fdireccion').value.trim();
    if (!nombre || !correo || !dir) return alert('Completa todos los campos');
    if (!validateEmail(correo)) return alert('Correo inválido');

    const id = c.idCliente || c.IDCLIENTE;
    const payload = {
      idCliente: id,
      nombreCompleto: nombre,
      correo: correo,
      direccion: dir,
      contrasenaCliente: c.contrasenaCliente || c.CONTRASENACLIENTE || null
    };

    try{
      await apiSend('PUT', `/api/clientes/PutClientes/${id}`, payload);
      const updated = { ...c, ...payload };
      localStorage.setItem('cliente', JSON.stringify(updated));
      fillPerfil(updated);
      el('#editModal').close();
      alert('Perfil actualizado');
    }catch(e){ console.error(e); alert('No se pudo actualizar'); }
  });

  el('#savePass')?.addEventListener('click', async ()=>{
    const email = el('#pcorreo').value.trim();
    const nueva = el('#pnueva').value.trim();
    if (!validateEmail(email)) return alert('Correo inválido');
    const currentEmail = c.correo || c.CORREO || '';
    if (email.toLowerCase() !== currentEmail.toLowerCase()) return alert('El correo debe coincidir con el de tu cuenta');

    if (nueva.length < 6) return alert('La contraseña debe tener al menos 6 caracteres');

    const id = c.idCliente || c.IDCLIENTE;
    const payload = {
      idCliente: id,
      nombreCompleto: c.nombreCompleto || c.NOMBRECOMPLETO,
      correo: currentEmail,
      direccion: c.direccion || c.DIRECCION,
      contrasenaCliente: nueva
    };

    try{
      await apiSend('PUT', `/api/clientes/PutClientes/${id}`, payload);
      const updated = { ...c, contrasenaCliente: nueva };
      localStorage.setItem('cliente', JSON.stringify(updated));
      el('#passModal').close();
      alert('Contraseña actualizada');
    }catch(e){ console.error(e); alert('No se pudo cambiar la contraseña'); }
  });
}

document.addEventListener('DOMContentLoaded', load);
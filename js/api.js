const API_BASE = localStorage.getItem('API_BASE') || 'http://localhost:8080';

async function apiGet(path) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}

async function apiSend(method, path, data) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method,
      headers: {
    "Authorization": "Bearer " + localStorage.getItem("token"), 
    "Content-Type": "application/json"
  },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}`);
  try { return await res.json(); } catch { return { ok: true }; }
}

function getSession() {
  const raw = localStorage.getItem('cliente');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function requireSession() {
  const c = getSession();
  if (!c) {
    alert('Inicia sesión para continuar');
    window.location.href = 'IniciarSesion.html';
    return null;
  }
  return c;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString();
}

export { API_BASE, apiGet, apiSend, getSession, requireSession, formatDate };
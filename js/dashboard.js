// service.js
const API_URL = "http://localhost:8080"; 

export async function login(email, password) {
  const response = await fetch(`${API_URL}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Error en login");
  return await response.json();
}


export async function getClienteById(id) {
  const response = await fetch(`${API_URL}/clientes/${id}`);
  if (!response.ok) throw new Error("Error al obtener cliente");
  return await response.json();
}

export async function updateCliente(id, data) {
  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al actualizar cliente");
  return await response.json();
}

export async function getCitasByCliente(idCliente) {
  const response = await fetch(`${API_URL}/citas/cliente/${idCliente}`);
  if (!response.ok) throw new Error("Error al obtener citas");
  return await response.json();
}

export async function crearCita(data) {
  const response = await fetch(`${API_URL}/citas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear cita");
  return await response.json();
}

export async function cancelarCita(idCita) {
  const response = await fetch(`${API_URL}/citas/${idCita}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al cancelar cita");
  return true;
}

export async function getFacturasByCliente(idCliente) {
  const response = await fetch(`${API_URL}/facturas/cliente/${idCliente}`);
  if (!response.ok) throw new Error("Error al obtener facturas");
  return await response.json();
}

export async function getServicios() {
  const response = await fetch(`${API_URL}/servicios`);
  if (!response.ok) throw new Error("Error al obtener servicios");
  return await response.json();
}

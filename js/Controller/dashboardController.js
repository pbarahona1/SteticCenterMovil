import {
  login,
  getClienteById,
  getCitasByCliente,
  getFacturasByCliente,
  getServicios,
} from "./service.js";

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const user = await login(email, password);
    localStorage.setItem("idCliente", user.id);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Error al iniciar sesión");
    console.error(error);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const idCliente = localStorage.getItem("idCliente");
  if (!idCliente) return;

  try {
    const cliente = await getClienteById(idCliente);
    document.getElementById("clienteNombre").innerText = cliente.nombre;
    document.getElementById("clienteEmail").innerText = cliente.email;

    const servicios = await getServicios();
    const serviciosDiv = document.getElementById("serviciosList");
    serviciosDiv.innerHTML = "";
    servicios.forEach((s) => {
      serviciosDiv.innerHTML += `
        <div class="card">
          <img src="${s.imagen}" alt="${s.nombre}" class="card-img"/>
          <h3>${s.nombre}</h3>
          <p>${s.descripcion}</p>
          <p><strong>$${s.precio}</strong></p>
        </div>
      `;
    });

    const citas = await getCitasByCliente(idCliente);
    const citasDiv = document.getElementById("citasList");
    citasDiv.innerHTML = "";
    citas.forEach((c) => {
      citasDiv.innerHTML += `
        <li>
          ${c.fecha} - ${c.hora} (${c.estado})
        </li>
      `;
    });

    const facturas = await getFacturasByCliente(idCliente);
    const facturasDiv = document.getElementById("facturasList");
    facturasDiv.innerHTML = "";
    facturas.forEach((f) => {
      facturasDiv.innerHTML += `
        <li>
          Factura #${f.id} - Total: $${f.total} - Fecha: ${f.fecha}
        </li>
      `;
    });
  } catch (error) {
    console.error("Error cargando dashboard:", error);
  }
});

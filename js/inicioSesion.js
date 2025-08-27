import { apiGet, requireSession, formatDate } from './api.js';

    document.getElementById("formLogin").addEventListener("submit", async (e) => {
      e.preventDefault();

      const usuario = document.getElementById("usuario").value.trim();
      const password = document.getElementById("password").value.trim();
      const errorMsg = document.getElementById("errorMsg");

      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("No se pudo conectar con la API");

        const clientes = await res.json();

        const cliente = clientes.find(c => 
          c.CORREO === usuario && c.CONTRASENACLIENTE === password
        );

        if (cliente) {
          localStorage.setItem("clienteLogueado", JSON.stringify(cliente));

          window.location.href = "Dashboard.html";
        } else {
          errorMsg.style.display = "block";
        }

      } catch (err) {
        console.error("Error al conectar con API:", err);
        errorMsg.textContent = "Error de conexión con el servidor";
        errorMsg.style.display = "block";
      }
    });
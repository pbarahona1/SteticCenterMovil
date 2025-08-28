import { login } from './auth.js';

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    try {
      const cliente = await login(usuario, password);
      console.log("Login exitoso:", cliente);
      window.location.href = "Dashboard.html";
    } catch (err) {
      console.error("Error durante login:", err);
      errorMsg.textContent = err.message || "Correo o contraseña incorrectos";
      errorMsg.style.display = "block";
    }
  });
});

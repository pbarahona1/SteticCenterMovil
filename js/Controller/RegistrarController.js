import { 
  createCliente 
} from "../services/RegistrarService.js";

document.addEventListener("DOMContentLoaded", () => {
    const Form = document.getElementById("formRegistro");
    const Registrar = document.getElementById("btnRegistrar");

    Form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = Form.idCliente.value;

    const data = {
      nombreCompleto: Form.Nombre.value.trim(),
      direccion: Form.Dirección.value.trim(),
      correo: Form.Email.value.trim(),
      contrasenaCliente: Form.Contraseña.value.trim(),
    };

    try {
            await createCliente(data);
            alert("Registro exitoso");
            window.location.href = 'Dashboard.html';
        } catch (error) {
            console.error("Error en registro:", error);
            alert("Error en el registro: " + error.message);
        }
  });
  });



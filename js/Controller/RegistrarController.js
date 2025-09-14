// controllers/clienteController.js
import { createCliente } from "../services/RegistrarService.js";

document.addEventListener("DOMContentLoaded", () => {
    // Obtener datos del formulario
    const Form = document.querySelector("Formulario-registro");
    const Registrar = document.getElementById("btnRegistrar");

    try {
      const response = await createCliente(cliente);
      console.log("Cliente registrado con éxito");
      
      console.log("Cliente creado:", response);
      window.location.href = "Dashboard.html";
      // Redirigir si quieres:
      // window.location.href = "Dashboard.html";
    } catch (error) {
      console.error("Error al registrar", err);
      errorMsg.textContent = err.message || "Correo, Telefono incorrectos";
      errorMsg.style.display = "block";
    }
  });

  Registrar.addEventListener("click", () => {
    form.reset();
    form.idCliente.value = "";
    lbModal.textContent = "Agregar Cliente";
    modal.show();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = form.idCliente.value;

    const data = {
      nombreCategoria: form.categoryName.value.trim(),
      descripcion: form.categoryDescription.value.trim(),
    };

    try {
      if (id) {
        await updateCategory(id, data);
      } else {
        await createCategory(data);
      }
      modal.hide();
      await loadCategories();
    } catch (err) {
      console.error("Error al guardar la categoría: ", err);
    }
  });
});

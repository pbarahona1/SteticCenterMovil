import {
  createClientes,
} from "../services/RegistrarService.js";

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#categoriesTable tbody");
  const form = document.getElementById("categoryForm");
  const modal = new bootstrap.Modal(document.getElementById("categoryModal"));
  const lbModal = document.getElementById("categoryModalLabel");
  const btnAdd = document.getElementById("btnAddCategory");

  loadCategories();

  btnAdd.addEventListener("click", () => {
    form.reset();
    form.categoryId.value = "";
    lbModal.textContent = "Agregar Cliente";
    modal.show();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = form.categoryId.value;

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

  async function loadCategories() {
    try {
      const categories = await getCategories();
      tableBody.innerHTML = "";

      if (!categories || categories.length == 0) {
        tableBody.innerHTML =
          '<td colspan="5">Actualmente no hay registros</td>';
        return;
      }

    } catch (err) {
      console.error("Error cargando categorías: ", err);
    }
  }
});

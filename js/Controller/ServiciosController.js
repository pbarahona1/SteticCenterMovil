import {
  getServicios
} from "../services/Servicios.js";


document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".element-card");
  const cardsContainer = document.getElementById("cardsContainer");
  cards.forEach(card => {
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      cards.forEach(c => { if (c !== card) c.classList.remove('open'); });
      card.classList.toggle("open");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".element-card")) {
      cards.forEach(c => c.classList.remove("open"));
    }
  }, true);


  async function loadData(type) {
    currentType = type;
    updateActiveButton(type);
    cardsContainer.innerHTML = "<p class='col-span-full text-center'>Cargando...</p>";

    try {
      let data;
      if (type === "servicios") {
        data = await getServicios();
      } else if (type === "paquetes") {
        data = await getPaquetes();
      } else if (type === "productos") {
        data = await getProductos();
      }
      

      
      allData = Array.isArray(data) ? data : [];
      renderCards(allData);
    } catch (error) {
      console.error(error);
      cardsContainer.innerHTML = "<p class='col-span-full text-center text-red-500'>Error al cargar datos</p>";
    }
  }

  // Renderizar tarjetas
  function renderCards(data) {
    if (!data.length) {
      cardsContainer.innerHTML = "<p class='col-span-full text-center'>No hay registros</p>";
      return;
    }
    
    cardsContainer.innerHTML = data.map(item => {
      const itemId = getIdFromItem(item, currentType);

      return `
      <div class="bg-white shadow rounded-lg overflow-hidden card">
        <div class="card-image-container">
          <img src="${item.imgUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTZhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNpbiBpbWFnZW48L3RleHQ+PC9zdmc+'}" 
               alt="${item.nombre}" 
               class="card-image">
        </div>
        <div class="p-4 flex-grow">
          <h3 class="font-bold text-lg mb-1">${item.nombre}</h3>
          ${currentType === "paquetes" && item.descripcion ? `<p class="text-sm text-gray-500 mb-2">${item.descripcion}</p>` : ""}
          ${currentType === "servicios" && item.duracion_min ? `<p class="text-sm text-gray-600 mb-1">Duración: ${item.duracion_min} min</p>` : ""}
          ${currentType === "productos" && item.stock !== undefined ? `<p class="text-sm text-gray-600 mb-1">Stock: ${item.stock}</p>` : ""}
          <p class="text-green-600 font-bold text-lg mt-2">$${item.precio}</p>
        </div>
        <div class="p-4 border-t border-gray-100">
          <div class="flex gap-2">
            <button onclick="editRegistro('${currentType}', ${itemId})" class="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Editar
            </button>
            <button onclick="deleteRegistro('${currentType}', ${itemId})" class="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
              Eliminar
            </button>
          </div>
        </div>
      </div>
      `;
    }).join("");
  }

});

const API_URLS = {
  servicios: "http://localhost:8080/ApiServicios",
  cloudinary: "http://localhost:8080/Api/image"
};

export async function getServicios() {
  const res = await fetch(`${API_URLS.servicios}/ConsultarServicios`);
  return await res.json();
}
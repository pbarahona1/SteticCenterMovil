const API_URL = "http://localhost:8080/ApiServicios";

export async function getCategories(){
    const res = await fetch(`${API_URL}/ConsultarServicios`);
    return res.json();
}

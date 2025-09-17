const API_URL = "http://localhost:8080/api/clientes";

export async function createCliente(data){
    await fetch(`${API_URL}/PostClientes`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}


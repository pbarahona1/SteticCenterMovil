const API_URL = "http://8080/ApiCitas";

export async function getCitas(){
    const res = await fetch(`${API_URL}/GetCitas`);
    return res.json();
}

export async function createCitas(data){
    await fetch(`${API_URL}/PostCitas`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}

export async function updateCitas(id, data){
    await fetch(`${API_URL}/PutCitas/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}

export async function deleteCitas(id){
    await fetch(`${API_URL}/DeleteCitas/${id}`, {
        method: "DELETE"
    });
}
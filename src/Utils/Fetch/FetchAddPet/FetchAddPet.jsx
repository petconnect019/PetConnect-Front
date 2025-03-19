export const FetchAddPet = async (petData, token)=> {
    try {
        let response = await fetch('http://localhost:5000/api/pets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization : `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify(petData)
        });
        const result = await response.json();
        

        if (!response.ok) {
            return {
                ok: false,
                message: result.message
            }
        }
        return result;
        

    } catch (error) {
        console.log(error);
        return { ok: false, message: "Error en la conexión con el servidor" };
    }
}

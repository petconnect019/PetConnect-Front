export const FetchAddPet = async (formDataPet, token)=> {
    try {
        let response = await fetch('http://localhost:5000/api/pets', {
            method: 'POST',
            headers: {
                Authorization : `Bearer ${token}`
            },
            credentials: 'include',
            body: formDataPet
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

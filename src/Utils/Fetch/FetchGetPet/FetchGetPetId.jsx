export const FetchPetById = async (id)=> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        // If the response is not ok, check if it has a redirect property
        if (!response.ok) {
            if (data.redirect) {
                return {
                    ok: false,
                    message: data.message,
                    redirect: data.redirect
                };
            }
            throw new Error(data.message || 'Error al obtener la mascota');
        }

        return data;

    } catch (error) {
        console.error('Error en FetchPetById:', error);
        throw error;
    }
}
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

        // Always check for redirect first, regardless of response status
        if (data.redirect) {
            return {
                ok: false,
                message: data.message,
                redirect: data.redirect
            };
        }

        // If no redirect, check if response is ok
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener la mascota');
        }

        // If we get here, we have a valid pet response
        return {
            ok: true,
            pet: data.pet
        };

    } catch (error) {
        console.error('Error en FetchPetById:', error);
        throw error;
    }
}
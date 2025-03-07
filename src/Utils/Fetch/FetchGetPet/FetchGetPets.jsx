export const FetchPets  = async (token)=> {
    try {
        const response = await fetch('http://localhost:5000/api/pets/user/pets', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las mascotas');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error en FetchPets:', error);
        throw error;
    }
}
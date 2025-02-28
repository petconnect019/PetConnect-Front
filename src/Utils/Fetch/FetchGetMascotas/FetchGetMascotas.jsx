export const FetchMascotas  = async ()=> {
    try {
        const response = await fetch('http://localhost:5000/api/pets', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las mascotas');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error en FetchMascotas:', error);
        throw error;
    }
}
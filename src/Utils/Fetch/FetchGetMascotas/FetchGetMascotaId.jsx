export const FetchGetMascotaId = async (id)=> {
    try {
        const response = await fetch(`http://localhost:5000/api/pets/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener la mascota');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error en FetchGetMascotaId:', error);
        throw error;
    }
}
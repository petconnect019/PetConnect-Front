const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchDeletePet = async (petId) => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`${API_BASE_URL}/api/pets/${petId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al eliminar la mascota');
        }

        return {
            success: true,
            message: data.message || 'Mascota eliminada exitosamente',
            data
        };
    } catch (error) {
        console.error('Error en fetchDeletePet:', error);
        return {
            success: false,
            message: error.message || 'Error al eliminar la mascota',
            error
        };
    }
}; 
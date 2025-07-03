import { isTokenExpired } from '../../Helpers/IsTokenExpired/IsTokenExpired';
import { FetchRefreshToken } from '../FetchRefreshToken/FetchRefreshToken';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchDeletePet = async (petId) => {
    try {
        let token = localStorage.getItem('accessToken');
        
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        // Verificar si el token ha expirado y refrescarlo si es necesario
        if (isTokenExpired(token)) {
            try {
                await FetchRefreshToken();
                token = localStorage.getItem('accessToken');
            } catch (refreshError) {
                throw new Error('Error de autenticación: ' + refreshError.message);
            }
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
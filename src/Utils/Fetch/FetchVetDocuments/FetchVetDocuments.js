import { useState } from 'react';
import { isTokenExpired } from '../../Helpers/IsTokenExpired/IsTokenExpired';
import { FetchRefreshToken } from '../FetchRefreshToken/FetchRefreshToken';

const API_URL = import.meta.env.VITE_API_URL;

// Función base para hacer peticiones con manejo de errores
const fetchWithAuth = async (url, options = {}) => {
    try {
        let token = localStorage.getItem('accessToken');
        
        if (!token) {
            throw new Error('Token no proporcionado');
        }

        if (isTokenExpired(token)) {
            try {
                await FetchRefreshToken();
                token = localStorage.getItem('accessToken');
            } catch (error) {
                throw new Error('Error al refrescar el token');
            }
        }

        const response = await fetch(`${API_URL}/api/vet${url}`, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers
            },
            ...options
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en la solicitud');
        }

        return data;
    } catch (error) {
        console.error('Error en petición:', error);
        throw error;
    }
};

// === FUNCIONES PARA DOCUMENTOS ===

export const createVetDocument = async (documentData, file) => {
    const formData = new FormData();
    
    // Agregar campos del documento
    Object.keys(documentData).forEach(key => {
        if (documentData[key] !== null && documentData[key] !== undefined) {
            formData.append(key, documentData[key]);
        }
    });

    // Agregar archivo si existe
    if (file) {
        formData.append('file', file);
    }

    return await fetchWithAuth('/documents', {
        method: 'POST',
        body: formData
    });
};

export const getDocumentsByPet = async (petId) => {
    return await fetchWithAuth(`/documents/pet/${petId}`);
};

export const getAllDocuments = async () => {
    return await fetchWithAuth('/documents');
};

export const updateVetDocument = async (documentId, updateData) => {
    return await fetchWithAuth(`/documents/${documentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
};

export const deleteVetDocument = async (documentId) => {
    return await fetchWithAuth(`/documents/${documentId}`, {
        method: 'DELETE'
    });
};

// === FUNCIONES PARA RECORDATORIOS ===

export const getRemindersByPet = async (petId) => {
    return await fetchWithAuth(`/reminders/pet/${petId}`);
};

export const toggleReminder = async (reminderId) => {
    return await fetchWithAuth(`/reminders/${reminderId}/toggle`, {
        method: 'PATCH'
    });
};

// === FUNCIONES PARA ESTADÍSTICAS ===

export const getVetStats = async () => {
    return await fetchWithAuth('/stats');
};

// Hook personalizado para documentos veterinarios
export const useVetDocuments = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createDocument = async (documentData, file) => {
        setLoading(true);
        setError(null);
        try {
            const result = await createVetDocument(documentData, file);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getDocuments = async (petId) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getDocumentsByPet(petId);
            return result.documents;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getReminders = async (petId) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getRemindersByPet(petId);
            return result.reminders;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createDocument,
        getDocuments,
        getReminders,
        toggleReminder,
        loading,
        error
    };
}; 
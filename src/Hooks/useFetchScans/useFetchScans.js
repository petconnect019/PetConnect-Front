import { useState, useEffect } from 'react';
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";

export const useFetchScans = (pet_id) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [scans, setScans] = useState([]);

    useEffect(() => {
        if (!pet_id) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    throw new Error('No hay token de acceso');
                }
                
                if (isTokenExpired(token)) {
                    throw new Error('Token expirado');
                }
                
                // Obtener los QRs de la mascota
                const qrResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/qr/pet/${pet_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!qrResponse.ok) {
                    throw new Error('Error al obtener QRs de la mascota');
                }
                
                const qrData = await qrResponse.json();
                const qrCodes = qrData.data || [];
                
                // Obtener historial de escaneos para cada QR
                const allScanHistory = [];
                for (const qr of qrCodes) {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/qr/${qr._id}/history`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.history) {
                            allScanHistory.push(...data.history);
                        }
                    }
                }
                
                // Ordenar por fecha y hora (más reciente primero)
                const sortedHistory = allScanHistory.sort((a, b) => {
                    const dateA = new Date(`${a.fecha} ${a.hora}`);
                    const dateB = new Date(`${b.fecha} ${b.hora}`);
                    return dateB - dateA; // Más reciente primero
                });
                
                setScans(sortedHistory);
            } catch (error) {
                console.error('Error al obtener historial de escaneos:', error);
                setError(error.message || 'Error desconocido');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [pet_id]);

    return { scans, isLoading, error };
};

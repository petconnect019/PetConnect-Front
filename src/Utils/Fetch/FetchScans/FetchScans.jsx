/**
 * Obtiene el historial de escaneos para los QRs de una mascota
 * @param {string} pet_id - ID de la mascota
 * @returns {Promise<Array>} - Array con el historial de escaneos
 */
export const FetchScans = async (pet_id) => {
    if (!pet_id) {
        throw new Error('Se requiere el ID de la mascota');
    }
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('No hay token de acceso');
    }

    try {
        // 1. Obtener todos los QRs asociados a la mascota
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
        
        // 2. Obtener historial de escaneos para cada QR
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
        
        // 3. Ordenar por fecha y hora (más reciente primero)
        return allScanHistory.sort((a, b) => {
            const dateA = new Date(`${a.fecha} ${a.hora}`);
            const dateB = new Date(`${b.fecha} ${b.hora}`);
            return dateB - dateA; // Más reciente primero
        });
    } catch (error) {
        console.error('Error al obtener historial de escaneos:', error);
        throw error;
    }
}
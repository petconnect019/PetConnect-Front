export const FetchLinkPetQr = async (objectQrPet, token) => {
    console.log('=== DEBUG FetchLinkPetQr ===');
    console.log('Objeto recibido:', objectQrPet);
    console.log('Token recibido:', token ? 'SÍ' : 'NO');
    
    // Validación de parámetros
    if (!objectQrPet?._id) {
        console.error("El ID del QR no está definido");
        return { ok: false, message: "ID de QR inválido" };
    }
    if (!token) {
        console.error("Token no proporcionado");
        return { ok: false, message: "Token no válido" };
    }

    try {
        const url = `${import.meta.env.VITE_API_URL}/api/qr/link?_id=${objectQrPet._id}`;
        console.log('URL de la petición:', url);
        console.log('Headers:', {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        });
        console.log('Body:', JSON.stringify(objectQrPet));
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(objectQrPet),
        });

        console.log('Status de respuesta:', response.status);
        console.log('Response OK:', response.ok);
        
        const result = await response.json();
        console.log('Respuesta del servidor:', result);

        // Manejo de errores basado en la respuesta del servidor
        if (!response.ok) {
            return {
                ok: false,
                message: result?.message || "Error al vincular el QR con la mascota",
            };
        }

        return { ok: true, data: result };

    } catch (error) {
        return { ok: false, message: `Error de conexión: ${error.message || "Error desconocido"}` };
    }
};

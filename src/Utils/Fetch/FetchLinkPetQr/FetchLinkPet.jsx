export const FetchLinkPetQr = async (objectQrPet, token) => {
    // Validación de parámetros
    if (!objectQrPet?.qrId) {
        console.error("El ID del QR no está definido");
        return { ok: false, message: "ID de QR inválido" };
    }
    if (!token) {
        console.error("Token no proporcionado");
        return { ok: false, message: "Token no válido" };
    }

    try {
        const response = await fetch(`http://localhost:5000/api/qr/link?qrId=${objectQrPet.qrId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(objectQrPet),
        });

        const result = await response.json();

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

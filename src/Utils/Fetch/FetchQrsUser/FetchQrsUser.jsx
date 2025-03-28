export const FetchQrsUser = async (token)=> {
    try {
        const response = await fetch(`http://localhost:5000/api/qr/user`, {
            method: 'GET',
            credentials: 'include',
            
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await response.json();

        if (!response.ok) {
            return {
                ok: false,
                message: data?.message || "Error al vincular el QR con la mascota",
            };
        }

        return { ok: true, data: data };


    } catch (error) {
        console.error('Error en FetchPetById:', error);
        throw error;
    }
}
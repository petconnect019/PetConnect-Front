

export const FetchLinkPetQr = async (objectQrPet, token)=> {
    try {
       const response = await fetch(`http://localhost:5000/api/qr/link?qrId=${objectQrPet.qrId}`, {
        method: 'POST',
        headers: {
            Authorization : `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(objectQrPet),
       });

       const result = await response.json();

       if (!response.ok) {
        
        return {
            ok: false,
            message: result.message
        }
    }
    return result;
        
    } catch (error) {
        console.log(error);
        return { ok: false, message: "Error en la conexión con el servidor" };
    }
}
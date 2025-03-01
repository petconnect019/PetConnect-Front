export const FetchResetPassword = async (tokenEmail)=> { 
    try {
        const response = await fetch('http://localhost:5000/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tokenEmail),
            credentials: 'include'
        })
        const result = await response.json();
        console.log(result);
        
        if (response.ok) {
            return { ok: true, message: result.message };
        } else {
            return { ok: false, message: result.message };
        }
    } catch (error) {
        console.log(error);
        return { ok: false, message: "Error en la conexión con el servidor" };
    }
}
export const RefreshToken = async ()=> {
    try {
        const response = await fetch('http://localhost:5000/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error al refrescar el token');
        }

        const data = await response.json();
        sessionStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;

    } catch (error) {
        console.error('Error en refreshToken:', error);
        sessionStorage.removeItem('accessToken');
        throw error;
    }
}
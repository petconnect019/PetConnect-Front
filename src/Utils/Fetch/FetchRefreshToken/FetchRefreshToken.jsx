export const FetchRefreshToken = async ()=> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {
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
        localStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;

    } catch (error) {
        console.error('Error en refreshToken:', error);
        localStorage.removeItem('accessToken');
        throw error;
    }
}
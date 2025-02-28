export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;

        return Date.now() >= expirationTime;
    } catch (error) {
        console.error('Error al verificar token:', error);
        return true;
    }
}
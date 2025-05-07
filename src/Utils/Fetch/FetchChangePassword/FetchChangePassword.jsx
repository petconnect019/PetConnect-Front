import { FetchRefreshToken } from '../FetchRefreshToken/FetchRefreshToken';

export const changePassword = async (currentPassword, newPassword) => {
  try {
    // Primero intentamos refrescar el token antes de hacer la petición
    const refreshedToken = await FetchRefreshToken();
    
    if (!refreshedToken) {
      throw new Error('No hay sesión activa');
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshedToken}`
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al cambiar la contraseña');
    }

    // Si el cambio de contraseña fue exitoso, actualizamos los tokens
    if (data.token && data.refreshToken) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Error al cambiar la contraseña. Por favor, intente nuevamente.');
  }
}; 
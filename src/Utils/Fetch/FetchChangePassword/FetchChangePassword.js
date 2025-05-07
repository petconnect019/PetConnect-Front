

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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

    return data;
  } catch (error) {
    throw new Error(error.message || 'Error al cambiar la contraseña. Por favor, intente nuevamente.');
  }
}; 
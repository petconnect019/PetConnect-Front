import config from '../Utils/config';

export const sendSupportEmail = async (formData) => {
  try {
    const response = await fetch(`${config.api}/api/support/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include', // Importante para las cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al enviar el mensaje');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en el servicio de soporte:', error);
    throw error;
  }
}; 
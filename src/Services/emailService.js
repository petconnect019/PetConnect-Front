import config from '../Utils/config';
import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const SCAN_TEMPLATE_ID = import.meta.env.VITE_SCAN_TEMPLATE_ID;

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

/**
 * Envía una notificación por correo electrónico cuando se escanea un QR.
 * @param {object} templateParams - Parámetros para la plantilla de EmailJS.
 * @param {string} templateParams.owner_name - Nombre del dueño de la mascota.
 * @param {string} templateParams.to_email - Correo del dueño de la mascota.
 * @param {string} templateParams.pet_name - Nombre de la mascota.
 * @param {string} templateParams.location_data - La ubicación (dirección o coordenadas).
 */
export const sendScanNotificationEmail = async (templateParams) => {
  if (!SERVICE_ID || !PUBLIC_KEY || !SCAN_TEMPLATE_ID) {
    console.error('EmailJS environment variables are not configured.');
    // No lanzar un error fatal, solo registrarlo y continuar.
    // La notificación principal es la del backend y la de la app.
    return;
  }

  try {
    // La plantilla de EmailJS se encarga de enviar al 'to_email' si está configurado así.
    // Si no, EmailJS lo envía al correo por defecto de la cuenta.
    // Aquí preparamos los parámetros que la plantilla espera.
    const paramsForTemplate = {
      owner_name: templateParams.owner_name,
      pet_name: templateParams.pet_name,
      location_data: templateParams.location_data,
      to_email: templateParams.to_email, // Asegurarnos que la plantilla use este campo.
    };
    
    await emailjs.send(SERVICE_ID, SCAN_TEMPLATE_ID, paramsForTemplate, PUBLIC_KEY);
    console.log('Correo de notificación enviado exitosamente a través de EmailJS.');
  } catch (error) {
    console.error('Error al enviar el correo con EmailJS:', error);
  }
}; 
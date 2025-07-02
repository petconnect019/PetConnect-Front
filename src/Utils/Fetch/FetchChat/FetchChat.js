const BASE_URL = import.meta.env.VITE_API_URL;

// Obtener todas las conversaciones del usuario
export const fetchGetConversations = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No hay token disponible');
    }

    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener conversaciones');
    }

    return data.chats || [];
  } catch (error) {
    console.error('Error en fetchGetConversations:', error);
    throw error;
  }
};

// Obtener los mensajes de una conversación
export const fetchGetMessages = async (chatId) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No hay token disponible');
    }

    const response = await fetch(`${BASE_URL}/api/chat/${chatId}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener mensajes');
    }

    return data.messages || [];
  } catch (error) {
    console.error('Error en fetchGetMessages:', error);
    throw error;
  }
};

// Enviar un mensaje
export const fetchSendMessage = async (chatId, content) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No hay token disponible');
    }

    const response = await fetch(`${BASE_URL}/api/chat/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al enviar mensaje');
    }

    return data.data || data.message;
  } catch (error) {
    console.error('Error en fetchSendMessage:', error);
    throw error;
  }
};

// Crear una nueva conversación
export const fetchCreateConversation = async (recipientId) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No hay token disponible');
    }

    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ recipientId })
    });

    if (!response.ok) {
      throw new Error('Error al crear conversación');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en fetchCreateConversation:', error);
    throw error;
  }
}; 
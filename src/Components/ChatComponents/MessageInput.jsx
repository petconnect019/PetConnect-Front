import { useState } from 'react';
import { fetchSendMessage } from '../../Utils/Fetch/FetchChat/FetchChat';
import { IoSend, IoAttach, IoImage } from 'react-icons/io5';

export const MessageInput = ({ chatId, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !chatId) return;
    
    try {
      setSending(true);
      const sentMessage = await fetchSendMessage(chatId, message.trim());
      setMessage('');
      
      if (onMessageSent) {
        onMessageSent(sentMessage);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      // Aquí se podría mostrar un toast o alerta al usuario
    } finally {
      setSending(false);
    }
  };

  if (!chatId) {
    return null;
  }

  return (
    <form onSubmit={handleSendMessage} className="border-t p-3 bg-white">
      <div className="flex items-center">
        <button 
          type="button" 
          className="p-2 text-gray-500 hover:text-blue-500 focus:outline-none"
          title="Adjuntar archivo"
        >
          <IoAttach className="text-xl" />
        </button>
        
        <button 
          type="button" 
          className="p-2 text-gray-500 hover:text-blue-500 focus:outline-none mr-2"
          title="Enviar imagen"
        >
          <IoImage className="text-xl" />
        </button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 py-2 px-3 border rounded-full focus:outline-none focus:border-blue-500"
          placeholder="Escribe un mensaje..."
          disabled={sending}
        />
        
        <button
          type="submit"
          className={`ml-2 p-2 rounded-full text-white ${
            message.trim() && !sending
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={!message.trim() || sending}
          title="Enviar mensaje"
        >
          <IoSend className="text-xl" />
        </button>
      </div>
    </form>
  );
}; 
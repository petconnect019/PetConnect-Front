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
    <form onSubmit={handleSendMessage} className="border-t p-2 xs:p-2.5 sm:p-3 md:p-3.5 lg:p-4 xl:p-4.5 2xl:p-5 bg-white">
      <div className="flex items-center">
        <button 
          type="button" 
          className="p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-3.5 xl:p-4 text-gray-500 hover:text-blue-500 focus:outline-none"
          title="Adjuntar archivo"
        >
          <IoAttach className="text-lg xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl" />
        </button>
        
        <button 
          type="button" 
          className="p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-3.5 xl:p-4 text-gray-500 hover:text-blue-500 focus:outline-none mr-1 xs:mr-1.5 sm:mr-2 md:mr-2.5 lg:mr-3 xl:mr-3.5"
          title="Enviar imagen"
        >
          <IoImage className="text-lg xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl" />
        </button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-3.5 xl:py-4 px-2 xs:px-2.5 sm:px-3 md:px-3.5 lg:px-4 xl:px-4.5 border rounded-full focus:outline-none focus:border-blue-500 text-sm xs:text-base sm:text-lg md:text-lg lg:text-xl xl:text-xl"
          placeholder="Escribe un mensaje..."
          disabled={sending}
        />
        
        <button
          type="submit"
          className={`ml-1 xs:ml-1.5 sm:ml-2 md:ml-2.5 lg:ml-3 xl:ml-3.5 p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-3.5 xl:p-4 rounded-full text-white ${
            message.trim() && !sending
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={!message.trim() || sending}
          title="Enviar mensaje"
        >
          <IoSend className="text-lg xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl" />
        </button>
      </div>
    </form>
  );
}; 
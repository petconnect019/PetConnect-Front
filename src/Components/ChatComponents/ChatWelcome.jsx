import React from 'react';

const ChatWelcome = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50">
      <div className="w-24 h-24 mb-6 bg-gray-200 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Bienvenido a tus Mensajes
      </h3>
      <p className="text-gray-500 max-w-sm">
        Selecciona una conversación de la lista de la izquierda para ver los mensajes, o inicia una nueva conversación desde el perfil de una mascota.
      </p>
    </div>
  );
};

export default ChatWelcome; 
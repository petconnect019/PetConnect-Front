import React from 'react';
import { useChat } from '../../Contexts/ChatContext/ChatContextV2Simple';

const ChatDebugger = () => {
  const chatContext = useChat();
  
  const {
    connected,
    activeChat,
    messages,
    messagesLoading,
    messagesError,
    conversations
  } = chatContext;

  if (process.env.NODE_ENV !== 'development') {
    return null; // Solo mostrar en desarrollo
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-sm max-h-60 overflow-auto z-50">
      <h4 className="font-bold mb-2">🐛 Chat Debug</h4>
      
      <div className="space-y-1">
        <div>
          <strong>Conexión:</strong> {connected ? '✅ Conectado' : '❌ Desconectado'}
        </div>
        
        <div>
          <strong>Chat Activo:</strong> {activeChat ? `✅ ${activeChat._id}` : '❌ Ninguno'}
        </div>
        
        <div>
          <strong>Conversaciones:</strong> {conversations?.length || 0}
        </div>
        
        <div>
          <strong>Mensajes:</strong> {messages?.length || 0}
          {messagesLoading && ' (Cargando...)'}
          {messagesError && ' (Error)'}
        </div>
        
        {messages && messages.length > 0 && (
          <div>
            <strong>Últimos 3 mensajes:</strong>
            <div className="mt-1 space-y-1">
              {messages.slice(-3).map((msg, idx) => (
                <div key={idx} className="text-xs bg-gray-800 p-1 rounded">
                  <div>ID: {msg._id}</div>
                  <div>Contenido: {msg.content?.substring(0, 20)}...</div>
                  <div>Optimista: {msg.isOptimistic ? '✅' : '❌'}</div>
                  <div>Enviando: {msg.sending ? '✅' : '❌'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-2 pt-2 border-t border-gray-600">
          <strong>Funciones disponibles:</strong>
          <div>sendMessage: {typeof chatContext.sendMessage === 'function' ? '✅' : '❌'}</div>
          <div>loadMessages: {typeof chatContext.loadMessages === 'function' ? '✅' : '❌'}</div>
          <div>selectChat: {typeof chatContext.selectChat === 'function' ? '✅' : '❌'}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatDebugger; 
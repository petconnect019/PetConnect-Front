import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { useChat } from '../../Contexts/ChatContext/ChatContext';

import ConversationList from '../../Components/ChatComponents/ConversationList';
import MessageList from '../../Components/ChatComponents/MessageList';
import MessageInput from '../../Components/ChatComponents/MessageInput';
import { FooterNav } from '../../Components/FooterNav/FooterNav';
import LoadingSpinner from '../../Components/Common/LoadingSpinner';
import ErrorMessage from '../../Components/Common/ErrorMessage';
import ConnectionStatus from '../../Components/Common/ConnectionStatus';
import ChatWelcome from '../../Components/ChatComponents/ChatWelcome';

export const Chat = () => {
  const navigate = useNavigate();
  const { chat_id } = useParams();
  const { isAuthenticated } = useAuth();
  
  // Conectamos al nuevo y simplificado ChatContext
  const {
    connectionState,
    isLoading,
    error,
    conversations,
    activeChat,
    loadMessages,
    sendMessage,
  } = useChat();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Efecto para cargar los mensajes cuando el chat_id de la URL cambia
  useEffect(() => {
    if (chat_id) {
      loadMessages(chat_id);
    }
  }, [chat_id, loadMessages]);
  
  // Derivar el chat activo de la lista de conversaciones
  const selectedConversation = conversations.find(c => c._id === activeChat.chatId);

  // Determinar si la vista de chat está visible (en móvil)
  const isChatViewVisible = !!activeChat.chatId;

  const handleSelectConversation = (conversation) => {
    navigate(`/chat/${conversation._id}`);
  };

  const handleSendMessage = async (content) => {
    if (!activeChat.chatId) return;
    await sendMessage(activeChat.chatId, content);
  };

  const handleBack = () => {
    navigate('/chat');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <main className="flex-1 flex overflow-hidden">
        {/* Panel de Conversaciones (Sidebar) */}
        <aside
          className={`
            w-full md:w-1/3 lg:w-1/4
            flex flex-col bg-white border-r border-gray-200
            transition-transform duration-300 ease-in-out
            ${isChatViewVisible ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
            absolute md:static h-full
          `}
        >
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Mensajes</h1>
            <ConnectionStatus connectionState={connectionState} />
          </div>
          
          {isLoading && conversations.length === 0 ? (
            <LoadingSpinner message="Cargando conversaciones..." />
          ) : (
            <ConversationList
              conversations={conversations}
              selectedConversationId={activeChat.chatId}
              onSelectConversation={handleSelectConversation}
            />
          )}
        </aside>

        {/* Panel de Mensajes (Principal) */}
        <section
          className={`
            flex-1 flex flex-col bg-white
            transition-transform duration-300 ease-in-out
            ${isChatViewVisible ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            absolute md:static w-full h-full
          `}
        >
          {error && <ErrorMessage message={error} />}
          
          {activeChat.chatId && selectedConversation ? (
            <>
              {/* Header del Chat Activo */}
              <div className="flex items-center p-4 border-b border-gray-200">
                <button 
                  className="md:hidden mr-4 p-2 rounded-full hover:bg-gray-100"
                  onClick={handleBack}
                >
                  &larr;
                </button>
                <h2 className="text-lg font-semibold truncate">
                  {selectedConversation.title}
                </h2>
              </div>
              
              {/* Lista de Mensajes */}
              <MessageList
                isLoading={isLoading && activeChat.messages.length === 0}
                messages={activeChat.messages}
              />
              
              {/* Input de Mensaje */}
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={connectionState !== 'connected'}
              />
            </>
          ) : (
            // Pantalla de bienvenida cuando no hay chat seleccionado
            <ChatWelcome />
          )}
        </section>
      </main>
      <FooterNav />
    </div>
  );
};

export default Chat;
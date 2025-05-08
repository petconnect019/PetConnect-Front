import { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { ConversationList } from '../../Components/ChatComponents/ConversationList';
import { MessageInput } from '../../Components/ChatComponents/MessageInput';
import { IoArrowBack, IoEllipsisVertical, IoSearch } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchGetMessages } from '../../Utils/Fetch/FetchChat/FetchChat';
import { socket } from '../../Utils/socket';
import { FooterNav } from '../../Components/FooterNav/FooterNav';
import { NavButton } from '../../Components/NavButton/NavButton';

// Memoizar el componente MessageList
const MemoizedMessageList = memo(({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);
  
  // Evitar logs innecesarios en producción
  if (process.env.NODE_ENV === 'development') {
    console.log("MessageList renderizado con:", { 
      messages: messages?.length || 0, 
      currentUser: currentUser?.id || 'no user'
    });
  }

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Agrupar mensajes por fecha
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.timestamp);
      const dateStr = date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(message);
    });
    return groups;
  };

  const groupedMessages = useMemo(() => {
    return groupMessagesByDate(messages || []);
  }, [messages]);

  // Función para obtener el nombre del remitente
  const getSenderName = (message) => {
    if (message.senderId === currentUser?.id) {
      return currentUser?.name || "Tú";
    }
    return message.senderName || 
           (message.senderId && message.senderId.name) || 
           "Usuario";
  };

  // Componente para mensajes enviados (usuario actual)
  const SentMessage = ({ message, senderName }) => (
    <div className="flex w-full justify-end mb-1">
      <div className="relative max-w-[65%] min-w-[80px] bg-brand text-white px-2 py-[6px] rounded-lg ml-auto mr-2">
        <div className="text-[11px] font-medium mb-0.5 text-white">
          {senderName}
        </div>
        <p className="text-[14px] text-white whitespace-pre-wrap break-words pr-[52px] leading-[19px]">
          {message.content}
        </p>
        <div className="absolute bottom-[4px] right-2 flex items-center">
          <span className="text-[11px] text-gray-100 min-w-[55px] text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false
            })}
          </span>
          <svg className="w-[18px] h-[18px] text-white ml-0.5" viewBox="0 0 16 11" fill="currentColor">
            <path d="M11.1548 0.721314C10.9249 0.721314 10.7038 0.809804 10.5359 0.977803L4.06216 7.45155L1.46411 4.85351C1.12945 4.51884 0.585785 4.51884 0.251121 4.85351C-0.0837068 5.18817 -0.0837068 5.73184 0.251121 6.0665L3.45567 9.27105C3.62357 9.43895 3.84474 9.52744 4.06216 9.52744C4.27958 9.52744 4.50075 9.43895 4.66865 9.27105L11.7736 2.16608C12.1083 1.83142 12.1083 1.28775 11.7736 0.953083C11.6057 0.809804 11.3846 0.721314 11.1548 0.721314Z"/>
          </svg>
        </div>
        <div className="absolute top-0 right-[-8px] w-0 h-0 border-solid border-t-[8px] border-t-brand border-l-[8px] border-l-transparent">
        </div>
      </div>
    </div>
  );

  // Componente para mensajes recibidos
  const ReceivedMessage = ({ message, senderName }) => (
    <div className="flex w-full justify-start mb-1">
      <div className="relative max-w-[65%] min-w-[80px] bg-white px-2 py-[6px] rounded-lg ml-2 mr-auto">
        <div className="text-[11px] font-medium mb-0.5 text-[#1877F2]">
          {senderName}
        </div>
        <p className="text-[14px] text-[#111b21] whitespace-pre-wrap break-words pr-[52px] leading-[19px]">
          {message.content}
        </p>
        <div className="absolute bottom-[4px] right-2 flex items-center">
          <span className="text-[11px] text-[#667781] min-w-[55px] text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false
            })}
          </span>
        </div>
        <div className="absolute top-0 left-[-8px] w-0 h-0 border-solid border-t-[8px] border-t-white border-r-[8px] border-r-transparent">
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#E4DDD6] p-3">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="bg-[#E2F3FB] px-3 py-1 rounded-lg text-[11px] text-gray-600 shadow-sm">
              {date}
            </div>
          </div>
          {dateMessages.map((message, index) => {
            const isCurrentUser = message.senderId === currentUser?.id;
            const senderName = getSenderName(message);
            
            return isCurrentUser ? 
              <SentMessage key={message._id || index} message={message} senderName={senderName} /> : 
              <ReceivedMessage key={message._id || index} message={message} senderName={senderName} />;
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
});

export const Messages = () => {
    const { isAuthenticated, user } = useAuth();
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showSidebar, setShowSidebar] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { chat_id } = useParams();

    const currentUser = useMemo(() => user, [user]);
    const memoizedMessages = useMemo(() => messages, [messages]);

    useEffect(() => {
        if (chat_id && isAuthenticated) {
            const loadMessages = async () => {
                try {
                    const data = await fetchGetMessages(chat_id);
                    setMessages(data);
                } catch (error) {
                    console.error('Error al cargar mensajes:', error);
                }
            };
            loadMessages();
        } else {
            setMessages([]);
        }
    }, [chat_id, isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated || !chat_id) return;

        const handleNewMessage = (data) => {
            if (data.chatId === chat_id) {
                setMessages(prev => {
                    const messageExists = prev.some(m => m._id === data.message._id);
                    if (messageExists) return prev;
                    return [...prev, data.message];
                });
            }
        };

        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('new_message', handleNewMessage);
        };
    }, [isAuthenticated, chat_id]);

    useEffect(() => {
        if (chat_id && isAuthenticated) {
            const conversationData = sessionStorage.getItem(`conversation_${chat_id}`);
            let otherUserName = 'tu contacto';
            
            if (conversationData) {
                try {
                    const parsedData = JSON.parse(conversationData);
                    otherUserName = parsedData.otherUser?.name || otherUserName;
                } catch (e) {
                    console.error('Error al parsear datos de conversación:', e);
                }
            }
            
            setSelectedChat({
                _id: chat_id,
                otherUser: { name: otherUserName }
            });
            
            if (window.innerWidth < 768) {
                setShowSidebar(false);
            }

            const loadMessages = async () => {
                try {
                    const data = await fetchGetMessages(chat_id);
                    setMessages(data);
                } catch (error) {
                    console.error('Error al cargar mensajes:', error);
                }
            };

            loadMessages();
            const interval = setInterval(loadMessages, 5000);

            return () => clearInterval(interval);
        }
    }, [chat_id, isAuthenticated]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setShowSidebar(true);
            } else if (selectedChat) {
                setShowSidebar(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        
        return () => window.removeEventListener('resize', handleResize);
    }, [selectedChat]);

    const handleSelectConversation = (conversation) => {
        if (conversation && conversation.otherUser) {
            sessionStorage.setItem(
                `conversation_${conversation._id}`, 
                JSON.stringify({
                    otherUser: {
                        name: conversation.otherUser.name || 'Usuario'
                    }
                })
            );
        }
        
        setSelectedChat(conversation);
        navigate(`/messages/${conversation._id}`);
        if (window.innerWidth < 768) {
            setShowSidebar(false);
        }
    };

    const handleBackToList = () => {
        setShowSidebar(true);
        setSelectedChat(null);
        navigate('/messages');
    };

    const handleNewMessage = (message) => {
        setMessages(prev => [...prev, message]);
    };

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pb-16">
            <header className="flex items-center px-4 py-3 bg-white border-b border-gray-200 h-14 md:h-16 shrink-0">
                {(!showSidebar && selectedChat) ? (
                    <>
                        <button 
                            className="md:hidden -ml-2 p-2 rounded-full hover:bg-gray-100"
                            onClick={handleBackToList}
                        >
                            <IoArrowBack className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="ml-2 text-lg font-semibold text-gray-800 truncate">
                            {selectedChat.otherUser?.name || 'Chat'}
                        </h1>
                        <button className="ml-auto p-2 rounded-full hover:bg-gray-100">
                            <IoEllipsisVertical className="w-5 h-5 text-gray-600" />
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex items-center">
                            <NavButton onClick={() => navigate('/home')} />
                            <h1 className="ml-2 text-lg font-semibold text-gray-800">Mensajes</h1>
                        </div>
                        <div className="ml-auto relative max-w-xs w-full">
                            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar chat..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                        </div>
                    </>
                )}
            </header>

            <div className="flex flex-1 overflow-hidden">
                <div 
                    className={`
                        ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                        w-full md:w-[380px] bg-white border-r border-gray-200
                        transition-transform duration-300 ease-in-out
                        absolute md:relative inset-y-0 left-0 z-20
                    `}
                >
                    <ConversationList 
                        onSelectConversation={handleSelectConversation}
                        selectedChat={selectedChat}
                        searchQuery={searchQuery}
                    />
                </div>

                <div 
                    className={`
                        flex-1 flex flex-col bg-gray-50
                        ${(!showSidebar || window.innerWidth >= 768) ? 'opacity-100' : 'opacity-0 md:opacity-100'}
                        transition-opacity duration-300
                    `}
                >
                    {selectedChat ? (
                        <>
                            <div className="flex-1 overflow-hidden">
                                <MemoizedMessageList 
                                    messages={memoizedMessages}
                                    currentUser={currentUser}
                                />
                            </div>
                            <div className="p-4 bg-white border-t border-gray-200 mb-12">
                                <MessageInput 
                                    chatId={selectedChat._id}
                                    onMessageSent={handleNewMessage}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-4">
                            <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <IoSearch className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                Selecciona un chat
                            </h3>
                            <p className="text-gray-500 text-center text-sm">
                                Elige una conversación para comenzar a chatear
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-50">
                <FooterNav navigate={navigate} />
            </div>
        </div>
    );
};
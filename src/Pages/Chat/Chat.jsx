import { useState, useEffect } from 'react';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { ConversationList } from '../../Components/ChatComponents/ConversationList';
import { MessageInput } from '../../Components/ChatComponents/MessageInput';
import { IoArrowBack, IoEllipsisVertical, IoSearch } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchGetMessages } from '../../Utils/Fetch/FetchChat/FetchChat';
import { socket } from '../../Utils/socket';
import { FooterNav } from '../../Components/FooterNav/FooterNav';
import { MessageList } from '../../Components/ChatComponents/MessageList';

export const Chat = () => {
    const { isAuthenticated, user } = useAuth();
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { chat_id } = useParams();

    // Efecto para suscribirse a eventos de socket
    useEffect(() => {
        if (!isAuthenticated) {
            // Limpiar listeners si el usuario se desautentica
            socket.off('new_message');
            socket.off('chat_request');
            socket.off('pet_message');
            return;
        }

        const handleNewMessage = (data) => {
            // Solo actualizar si el mensaje pertenece al chat actualmente abierto
            if (data.chatId === chat_id) {
                setMessages(prev => [...prev, data.message]);
            }
        };

        const handleChatRequest = (data) => {
            console.log('Nueva solicitud de chat recibida:', data);
            // Opcional: Mostrar una notificación en lugar de forzar la navegación
            // Forzar actualización de la lista de conversaciones
            if (typeof window.updateConversationList === 'function') {
                window.updateConversationList();
            }
        };

        const handlePetMessage = (data) => {
            console.log('Nuevo mensaje de mascota recibido:', data);
            // Este evento parece obsoleto con la nueva lógica del backend, 
            // pero se mantiene por si alguna parte del sistema aún lo usa.
            if (typeof window.updateConversationList === 'function') {
                window.updateConversationList();
            }
        };

        // Limpiar suscripciones anteriores para evitar duplicados
        socket.off('new_message');
        socket.off('chat_request');
        socket.off('pet_message');

        // Suscribirse a eventos
        socket.on('new_message', handleNewMessage);
        socket.on('chat_request', handleChatRequest);
        socket.on('pet_message', handlePetMessage);

        // La función de limpieza se ejecuta cuando el componente se desmonta 
        // o cuando las dependencias del useEffect cambian.
        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('chat_request', handleChatRequest);
            socket.off('pet_message', handlePetMessage);
        };
    }, [isAuthenticated, chat_id]);

    // Efecto para manejar el chat_id y cargar mensajes
    useEffect(() => {
        if (chat_id && isAuthenticated) {
            // Intentar obtener información de la conversación del almacenamiento local
            const conversationData = sessionStorage.getItem(`conversation_${chat_id}`);
            let otherUserName = 'tu contacto';
            
            // Si hay datos de conversación almacenados, usar el nombre del otro usuario
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
                otherUser: { name: `${otherUserName}` }
            });
            
            if (window.innerWidth < 768) {
                setShowSidebar(false);
            }

            // Cargar mensajes del chat una sola vez
            const loadMessages = async () => {
                setIsLoading(true);
                try {
                    const data = await fetchGetMessages(chat_id);
                    setMessages(data);
                } catch (error) {
                    console.error('Error al cargar mensajes:', error);
                    // Opcional: mostrar un error en la UI
                } finally {
                    setIsLoading(false);
                }
            };

            loadMessages();
        }
    }, [chat_id, isAuthenticated]);

    // Efecto para manejar el responsive
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
        // Guardar datos de la conversación en sessionStorage para uso futuro
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
        navigate(`/chat/${conversation._id}`);
        if (window.innerWidth < 768) {
            setShowSidebar(false);
        }
    };

    const handleBackToList = () => {
        setShowSidebar(true);
        setSelectedChat(null);
        navigate('/chat');
    };

    const handleNewMessage = (message) => {
        setMessages(prev => [...prev, message]);
    };

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    return (
        <div className="fixed inset-0 flex flex-col bg-gray-50">
            {/* Header */}
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
                        <h1 className="text-lg font-semibold text-gray-800">Mensajes</h1>
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

            {/* Main Container */}
            <div className="flex flex-1 overflow-hidden pb-16">
                {/* Sidebar */}
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

                {/* Chat Area */}
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
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <MessageList 
                                        messages={messages}
                                        currentUser={user}
                                    />
                                )}
                            </div>
                            <div className="p-4 bg-white border-t border-gray-200">
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
            <FooterNav navigate={navigate} />
        </div>
    );
};
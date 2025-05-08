import { useState, useEffect } from 'react';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { fetchGetConversations } from '../../Utils/Fetch/FetchChat/FetchChat';
import { useSocket } from '../../Hooks/useSocket';
import { isTokenExpired } from '../../Utils/Helpers/IsTokenExpired/IsTokenExpired';
import { FetchRefreshToken } from '../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken';
import { IoChatbubble, IoTime } from 'react-icons/io5';
import { IoSearch } from 'react-icons/io5';
import defaultProfilePic from '../../assets/images/DefaultProfile.png';

export const ConversationList = ({ onSelectConversation, selectedChat, searchQuery }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user } = useAuth();
    const socket = useSocket();

    const loadConversations = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            setError(null);

            let token = sessionStorage.getItem('accessToken');
            if (isTokenExpired(token)) {
                try {
                    await FetchRefreshToken();
                    token = sessionStorage.getItem('accessToken');
                } catch (error) {
                    console.error('Error al refrescar el token:', error);
                    setError('Error de autenticación. Por favor, vuelve a iniciar sesión.');
                    return;
                }
            }

            const data = await fetchGetConversations();
            
            if (!Array.isArray(data)) {
                throw new Error('Formato de datos inválido');
            }

            const formattedConversations = data.map(chat => {
                const otherUser = chat.participants.find(p => p._id !== user._id);
                return {
                    _id: chat._id,
                    otherUser: {
                        _id: otherUser?._id,
                        name: otherUser?.name || 'Usuario',
                        profilePicture: otherUser?.profile_picture
                    },
                    lastMessage: chat.lastMessage,
                    unreadCount: chat.unreadCount || 0,
                    petName: chat.petName
                };
            });

            setConversations(formattedConversations);
        } catch (error) {
            console.error('Error al cargar conversaciones:', error);
            setError('Error al cargar las conversaciones. Por favor, intenta de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadConversations();
            const interval = setInterval(loadConversations, 5000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (!isAuthenticated || !socket) return;

        const handleNewMessage = () => {
            loadConversations();
        };

        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('new_message', handleNewMessage);
        };
    }, [isAuthenticated, socket]);

    const filteredConversations = conversations.filter(conversation => 
        conversation.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (conversation.petName && conversation.petName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center text-red-500 p-4 text-center">
                {error}
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Sin conversaciones
                </h3>
                <p className="text-gray-500 text-sm">
                    Comienza una nueva conversación para chatear con otros usuarios
                </p>
            </div>
        );
    }

    if (filteredConversations.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No se encontraron conversaciones
                </h3>
                <p className="text-gray-500 text-sm">
                    No hay conversaciones que coincidan con tu búsqueda
                </p>
            </div>
        );
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return 'Ayer';
        } else if (days < 7) {
            return date.toLocaleDateString([], { weekday: 'long' });
        } else {
            return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
        }
    };

    return (
        <div className="h-full overflow-y-auto">
            {filteredConversations.map(conversation => (
                <button
                    key={conversation._id}
                    onClick={() => onSelectConversation(conversation)}
                    className={`
                        w-full p-4 flex items-center space-x-3 hover:bg-gray-50
                        ${selectedChat?._id === conversation._id ? 'bg-gray-100' : ''}
                        transition-colors duration-200
                    `}
                >
                    <div className="relative">
                        <img
                            src={conversation.otherUser.profilePicture || 'https://via.placeholder.com/40'}
                            alt={conversation.otherUser.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        {conversation.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {conversation.unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {conversation.otherUser.name}
                            </h3>
                            {conversation.lastMessage && (
                                <span className="text-xs text-gray-500">
                                    {formatTime(conversation.lastMessage.timestamp)}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 truncate">
                                {conversation.lastMessage ? conversation.lastMessage.content : 'No hay mensajes'}
                            </p>
                            {conversation.petName && (
                                <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                                    {conversation.petName}
                                </span>
                            )}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};
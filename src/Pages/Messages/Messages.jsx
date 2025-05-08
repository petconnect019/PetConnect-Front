import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { ConversationList } from '../../Components/ChatComponents/ConversationList';
import { MessageInput } from '../../Components/ChatComponents/MessageInput';
import { MessageList } from '../../Components/ChatComponents/MessageList';
import { IoArrowBack, IoEllipsisVertical, IoSearch } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { FooterNav } from '../../Components/FooterNav/FooterNav';
import { NavButton } from '../../Components/NavButton/NavButton';
import { useMessages } from '../../Hooks/useMessages';
import { useSocket } from '../../Hooks/useSocket';

export const Messages = () => {
    const { isAuthenticated, user } = useAuth();
    const [selectedChat, setSelectedChat] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { chat_id } = useParams();
    const socket = useSocket();

    const currentUser = useMemo(() => user, [user]);
    const { messages, loading, error, addMessage } = useMessages(chat_id, isAuthenticated);

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
                                {loading ? (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                                    </div>
                                ) : error ? (
                                    <div className="h-full flex items-center justify-center text-red-500">
                                        {error}
                                    </div>
                                ) : (
                                    <MessageList 
                                        messages={messages}
                                        currentUser={currentUser}
                                    />
                                )}
                            </div>
                            <div className="p-4 bg-white border-t border-gray-200 mb-12">
                                <MessageInput 
                                    chatId={selectedChat._id}
                                    onMessageSent={addMessage}
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
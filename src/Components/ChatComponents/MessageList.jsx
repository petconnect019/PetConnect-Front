import { useMemo, useRef, useEffect } from 'react';
import { SentMessage } from './SentMessage';
import { ReceivedMessage } from './ReceivedMessage';
import { MessageDate } from './MessageDate';

export const MessageList = ({ messages, currentUser, selectedChat }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const groupMessagesByDate = useMemo(() => {
        return messages.reduce((groups, message) => {
            const date = new Date(message.timestamp).toLocaleDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
            return groups;
        }, {});
    }, [messages]);

    const getSenderName = (message) => {
        if (message.senderId === currentUser?._id) {
            return currentUser?.name || 'Tú';
        }
        // Si el mensaje tiene senderName, usarlo
        if (message.senderName) {
            return message.senderName;
        }
        // Si no, usar el nombre del otro usuario de la conversación
        return selectedChat?.otherUser?.name || 'Usuario';
    };

    if (!messages || messages.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Sin mensajes
                </h3>
                <p className="text-gray-500 text-sm">
                    Comienza la conversación enviando un mensaje
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Object.entries(groupMessagesByDate).map(([date, messages]) => (
                <div key={date} className="space-y-4">
                    <MessageDate date={date} />
                    {messages.map((message) => (
                        <div key={message._id}>
                            {message.senderId === currentUser?._id ? (
                                <SentMessage 
                                    message={message}
                                    senderName={getSenderName(message)}
                                />
                            ) : (
                                <ReceivedMessage 
                                    message={message}
                                    senderName={getSenderName(message)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}; 
import { useState, useRef, useEffect } from 'react';
import { fetchSendMessage } from '../../Utils/Fetch/FetchChat/FetchChat';
import { isTokenExpired } from '../../Utils/Helpers/IsTokenExpired/IsTokenExpired';
import { FetchRefreshToken } from '../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken';
import { IoPaperPlane } from 'react-icons/io5';

export const MessageInput = ({ chatId, onMessageSent }) => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [chatId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!message.trim() || isSending) return;

        try {
            setIsSending(true);
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

            const response = await fetchSendMessage(chatId, message.trim());
            
            if (response) {
                onMessageSent(response);
                setMessage('');
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            setError('Error al enviar el mensaje. Por favor, intenta de nuevo.');
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            {error && (
                <div className="absolute -top-8 left-0 right-0 bg-red-50 text-red-500 text-sm p-2 rounded-t-lg">
                    {error}
                </div>
            )}
            <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                    <textarea
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe un mensaje..."
                        className="w-full px-4 py-2 pr-12 bg-gray-50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        rows="1"
                        style={{
                            minHeight: '40px',
                            maxHeight: '120px',
                            overflowY: 'auto'
                        }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={!message.trim() || isSending}
                    className={`
                        p-2 rounded-full
                        ${message.trim() && !isSending
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                        transition-colors duration-200
                    `}
                >
                    <IoPaperPlane className="w-5 h-5" />
                </button>
            </div>
        </form>
    );
}; 
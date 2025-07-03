import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { IoSend } from 'react-icons/io5';
import useDebounce from '../../Hooks/useDebounce';

export const MessageInput = memo(({ 
  chatId, 
  onMessageSent, 
  disabled = false,
  placeholder = "Escribe un mensaje...",
  maxLength = 1000
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);

  // Focus automático cuando se selecciona un chat
  useEffect(() => {
    if (chatId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatId]);

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !chatId || sending || disabled) {
      return;
    }
    
    const messageContent = message.trim();
    
    try {
      setSending(true);
      setMessage('');
      
      if (onMessageSent) {
        await onMessageSent(messageContent, {
          type: 'text',
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setMessage(messageContent);
    } finally {
      setSending(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [message, chatId, sending, disabled, onMessageSent]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  }, [handleSendMessage]);

  // Debounce para validaciones en tiempo real
  const debouncedMessage = useDebounce(message, 300);

  if (!chatId) {
    return (
      <div className="border-t p-4 bg-gray-50">
        <div className="flex items-center justify-center text-gray-500">
          <span className="text-sm">Selecciona un chat para comenzar a escribir</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t bg-white">
      <form onSubmit={handleSendMessage} className="p-4">
        <div className="flex items-center space-x-2">
          {/* Input de mensaje */}
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`
                w-full py-3 px-4 border rounded-full 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200
                ${disabled || sending ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
              `}
              placeholder={disabled ? 'Chat no disponible' : placeholder}
              disabled={disabled || sending}
              maxLength={maxLength}
            />
          </div>
          
          {/* Botón de enviar */}
          <button
            type="submit"
            className={`
              p-3 rounded-full text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
              ${message.trim() && !sending && !disabled
                ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105' 
                : 'bg-gray-300 cursor-not-allowed'
              }
            `}
            disabled={!message.trim() || sending || disabled}
            title={
              sending ? 'Enviando...' :
              !message.trim() ? 'Escribe un mensaje' :
              disabled ? 'Chat no disponible' :
              'Enviar mensaje'
            }
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <IoSend className="text-lg" />
            )}
          </button>
        </div>
        
        {/* Contador de caracteres */}
        {message.length > (maxLength * 0.8) && (
          <div className="mt-2 text-right">
            <span className={`text-xs ${
              message.length > (maxLength * 0.95) ? 'text-red-500' : 'text-gray-500'
            }`}>
              {message.length}/{maxLength}
            </span>
          </div>
        )}
        
        {/* Estado de conexión */}
        {disabled && (
          <div className="mt-2 text-center">
            <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
              Sin conexión - Verificando...
            </span>
          </div>
        )}
      </form>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput; 
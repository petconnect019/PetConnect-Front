import React, { useState, useRef } from 'react';
import { IoSend } from 'react-icons/io5';

const MessageInput = ({ onSendMessage, disabled }) => {
  const [content, setContent] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() && !disabled) {
      onSendMessage(content.trim());
      setContent('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          ref={inputRef}
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={disabled ? "Conectando..." : "Escribe un mensaje..."}
          disabled={disabled}
          className="flex-1 w-full px-4 py-2 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          disabled={disabled || !content.trim()}
          className="p-3 bg-orange-500 text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <IoSend />
        </button>
      </form>
      </div>
  );
}; 

export default MessageInput; 
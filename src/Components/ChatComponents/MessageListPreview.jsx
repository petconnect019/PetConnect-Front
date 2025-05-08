import React from 'react';
import { MessageList } from './MessageList';
import { mockMessages, mockCurrentUser } from '../../Utils/mockData/mockMessages';

export const MessageListPreview = () => {
  return (
    <div className="w-full max-w-2xl mx-auto h-[600px] border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-white p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Vista Previa de Mensajes</h2>
        <p className="text-sm text-gray-600">Conversación de ejemplo entre María y Juan</p>
      </div>
      <div className="h-[calc(600px-80px)]">
        <MessageList 
          messages={mockMessages}
          currentUser={mockCurrentUser}
        />
      </div>
    </div>
  );
}; 
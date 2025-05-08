import React from 'react';

export const ReceivedMessage = ({ message, senderName }) => {
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    return (
        <div className="flex justify-start mb-2">
            <div className="relative max-w-[70%]">
                <div className="bg-gray-100 rounded-lg py-2 px-4 shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">
                        {senderName}
                    </div>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                </div>
                <div className="absolute -bottom-5 left-0 w-0 h-0 border-8 border-transparent border-t-gray-100 border-l-gray-100 transform -rotate-45 -translate-x-1/2" />
                <span className="text-xs text-gray-500 mt-1 block">
                    {formatTime(message.timestamp)}
                </span>
            </div>
        </div>
    );
}; 
import React from 'react';

export const SentMessage = ({ message }) => {
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    return (
        <div className="flex justify-end mb-2">
            <div className="relative max-w-[70%]">
                <div className="bg-blue-500 text-white rounded-lg py-2 px-4 shadow-sm">
                    <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                </div>
                <div className="absolute -bottom-5 right-0 w-0 h-0 border-8 border-transparent border-t-blue-500 border-r-blue-500 transform rotate-45 translate-x-1/2" />
                <span className="text-xs text-gray-500 mt-1 block text-right">
                    {formatTime(message.timestamp)}
                </span>
            </div>
        </div>
    );
}; 
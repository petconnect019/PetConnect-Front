import React, { memo } from 'react';
import { IoArrowBack, IoEllipsisVertical, IoSearch, IoClose } from 'react-icons/io5';
import ConnectionStatus from '../Common/ConnectionStatus';
import defaultProfilePic from '../../assets/images/DefaultProfile.png';

/**
 * Header optimizado del chat con memoización
 * Solo se re-renderiza cuando sus props cambian
 */
const OptimizedChatHeader = memo(({
  // Estado
  activeChat,
  showSidebar,
  connected,
  error,
  showSearchBar,
  localSearchQuery,
  unreadCount,
  
  // Callbacks
  onBackToList,
  onSearchToggle,
  onSearchChange,
  onSearchClear,
  onRetryConnection
}) => {
  
  if (!showSidebar && activeChat) {
    const otherParticipant = activeChat.otherParticipants?.[0];
    const displayName = otherParticipant?.name || 'Usuario';
    const displayAvatar = otherParticipant?.profilePicture || defaultProfilePic;

    // Header del chat activo
    return (
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 h-16 shrink-0 relative">
        <ConnectionStatus 
          connected={connected} 
          error={error}
          onRetry={onRetryConnection}
          compact={true}
        />
        
        <div className="flex items-center flex-1">
          <button 
            className="md:hidden -ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onBackToList}
            aria-label="Volver a la lista"
          >
            <IoArrowBack className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center ml-2 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 mr-3">
              <img 
                src={displayAvatar}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = defaultProfilePic}
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800 truncate">
                {displayName}
              </h1>
              {activeChat.petName && (
                <p className="text-sm text-gray-500 truncate">
                  Sobre {activeChat.petName}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Header de la lista de conversaciones
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 h-16 shrink-0 relative">
      <ConnectionStatus 
        connected={connected} 
        error={error}
        onRetry={onRetryConnection}
        compact={true}
      />
      
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-gray-800">
            Mensajes
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-red-500 rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {showSearchBar ? (
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 flex-1 max-w-xs">
              <IoSearch className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Buscar chats..."
                value={localSearchQuery}
                onChange={onSearchChange}
                className="bg-transparent flex-1 text-sm focus:outline-none"
                autoFocus
              />
              <button
                onClick={onSearchClear}
                className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <IoClose className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSearchToggle}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Buscar chats"
              aria-label="Buscar chats"
            >
              <IoSearch className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

OptimizedChatHeader.displayName = 'OptimizedChatHeader';

export default OptimizedChatHeader; 
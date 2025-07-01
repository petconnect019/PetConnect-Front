// Archivo de índice para hooks del chat
// Facilita las importaciones y mantiene una API limpia

export { default as useChatConnection } from './useChatConnection';
export { default as useChatConversations } from './useChatConversations';
export { default as useChatMessages } from './useChatMessages';
export { default as useChatSocket } from './useChatSocket';

// Re-exportar hooks individuales si se prefiere importación nombrada
export { useChatConnection } from './useChatConnection';
export { useChatConversations } from './useChatConversations';
export { useChatMessages } from './useChatMessages';
export { useChatSocket } from './useChatSocket'; 
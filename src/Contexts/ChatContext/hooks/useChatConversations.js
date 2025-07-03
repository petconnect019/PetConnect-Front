import { useState, useCallback, useMemo } from 'react';
import config from '../../../Utils/config';

/**
 * Hook para manejar las conversaciones del chat
 * Incluye carga, búsqueda y gestión de estado
 */
export const useChatConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    hasNext: false
  });

  // Cargar conversaciones desde el servidor
  const loadConversations = useCallback(async (options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const {
        page = 1,
        limit = 20,
        search = '',
        resetList = false,
        ...filters
      } = options;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...filters
      });

      const response = await fetch(`${config.api}/api/chat?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        const newConversations = data.data || [];
        
        setConversations(prev => 
          resetList || page === 1 ? newConversations : [...prev, ...newConversations]
        );
        setPagination(data.pagination || {});
      } else {
        throw new Error(data.message || 'Error al cargar conversaciones');
      }
    } catch (error) {
      console.error('Error al cargar conversaciones:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar una conversación específica
  const updateConversation = useCallback((conversationUpdate) => {
    setConversations(prev => 
      prev.map(conv => 
        conv._id === conversationUpdate._id 
          ? { ...conv, ...conversationUpdate }
          : conv
      )
    );
  }, []);

  // Agregar nueva conversación
  const addConversation = useCallback((newConversation) => {
    setConversations(prev => {
      // Evitar duplicados
      const exists = prev.some(conv => conv._id === newConversation._id);
      return exists ? prev : [newConversation, ...prev];
    });
  }, []);

  // Remover conversación
  const removeConversation = useCallback((conversationId) => {
    setConversations(prev => 
      prev.filter(conv => conv._id !== conversationId)
    );
  }, []);

  // Buscar conversaciones
  const searchConversations = useCallback((query) => {
    setSearchQuery(query);
    // Recargar con el nuevo término de búsqueda
    loadConversations({ search: query, resetList: true });
  }, [loadConversations]);

  // Limpiar búsqueda
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    loadConversations({ resetList: true });
  }, [loadConversations]);

  // Conversaciones filtradas localmente (para búsqueda instantánea)
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) {
      return conversations;
    }

    const query = searchQuery.toLowerCase();
    return conversations.filter(conv => {
      const title = conv.title?.toLowerCase() || '';
      const petName = conv.petName?.toLowerCase() || '';
      const lastMessageContent = conv.lastMessage?.content?.toLowerCase() || '';
      const participantNames = conv.otherParticipants?.map(p => p.name?.toLowerCase()).join(' ') || '';

      return title.includes(query) || 
             petName.includes(query) || 
             lastMessageContent.includes(query) ||
             participantNames.includes(query);
    });
  }, [conversations, searchQuery]);

  // Contador de mensajes no leídos
  const unreadCount = useMemo(() => 
    conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0)
  , [conversations]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Recargar conversaciones
  const refresh = useCallback(() => {
    loadConversations({ resetList: true });
  }, [loadConversations]);

  return {
    // Estado
    conversations: filteredConversations,
    allConversations: conversations,
    loading,
    error,
    searchQuery,
    pagination,
    unreadCount,
    
    // Acciones
    loadConversations,
    updateConversation,
    addConversation,
    removeConversation,
    searchConversations,
    clearSearch,
    clearError,
    refresh
  };
};

export default useChatConversations; 
import { useState } from 'react';
import { fetchCreateConversation } from '../../Utils/Fetch/FetchChat/FetchChat';
import { IoChatboxEllipses, IoClose, IoSearch } from 'react-icons/io5';

export const NewChatButton = ({ onConversationCreated }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleOpenModal = () => {
    setShowModal(true);
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Esta función simula la búsqueda de usuarios
    // En un caso real, se haría una petición al backend
    try {
      setSearching(true);
      setError(null);
      
      // Simulación de búsqueda - reemplazar con una llamada API real
      setTimeout(() => {
        // Resultados simulados
        const mockResults = [
          { _id: '1', name: 'Usuario 1', email: 'usuario1@example.com' },
          { _id: '2', name: 'Usuario 2', email: 'usuario2@example.com' },
        ];
        setSearchResults(mockResults);
        setSearching(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error en la búsqueda:', err);
      setError('No pudimos realizar la búsqueda');
      setSearching(false);
    }
  };

  const handleStartConversation = async (userId) => {
    try {
      const newConversation = await fetchCreateConversation(userId);
      
      if (onConversationCreated) {
        onConversationCreated(newConversation);
      }
      
      handleCloseModal();
    } catch (err) {
      console.error('Error al crear conversación:', err);
      setError('No pudimos crear la conversación');
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 focus:outline-none"
        title="Nueva conversación"
      >
        <IoChatboxEllipses className="text-xl" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">Nueva conversación</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
            
            <div className="p-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar usuario por nombre o email"
                    className="flex-1 py-2 px-3 border rounded-l focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600 focus:outline-none"
                    disabled={searching || !searchQuery.trim()}
                  >
                    {searching ? 'Buscando...' : <IoSearch />}
                  </button>
                </div>
              </form>
              
              {error && (
                <div className="text-red-500 mb-4">{error}</div>
              )}
              
              <div className="max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <ul className="divide-y">
                    {searchResults.map((user) => (
                      <li key={user._id} className="py-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <button
                            onClick={() => handleStartConversation(user._id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 focus:outline-none"
                          >
                            Chatear
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  searchQuery.trim() && !searching && (
                    <p className="text-center text-gray-500 py-4">
                      No se encontraron usuarios
                    </p>
                  )
                )}
                
                {searching && (
                  <p className="text-center text-gray-500 py-4">
                    Buscando...
                  </p>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 rounded-b-lg border-t">
              <button
                onClick={handleCloseModal}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 focus:outline-none"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 
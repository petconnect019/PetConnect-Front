import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiMail, FiPhone, FiMessageCircle, FiCheck, FiHeart, FiShare2, FiSend, FiX } from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';
import { MdPets, MdMessage } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import DefaultProfile from '../../assets/images/DefaultProfile.png';
import defaultDog from '../../assets/images/DogProfilePfp.png';
import defaultCat from '../../assets/images/CatProfilePfp.png';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { useChat } from '../../Contexts/ChatContext/ChatContextV2';
import config from '../../Utils/config';

export const PublicUserProfile = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { loadConversations, sendMessage: sendChatMessage } = useChat();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPets, setUserPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [chatCreatedSuccessfully, setChatCreatedSuccessfully] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const modalRef = useRef(null);

  // Predefined messages
  const predefinedMessages = [
    "¡Hola! acabo de escanear el código QR de tu mascota, ¿me puedes ayudar?",
    "De casualidad, ¿tienes información sobre la mascota que encontré?",
    "Hola, soy un usuario de PetConnect y he encontrado a tu mascota. ¿Podrías ayudarme?",
  ];

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`${config.api}/api/users/public/${user_id}`);
        console.log('Response status:', response.status);
        
        // Si la respuesta no es ok, intentamos leer el texto del error
        if (!response.ok) {
          const textResponse = await response.text();
          console.error('Error response:', textResponse);
          
          try {
            // Intentamos parsear como JSON por si acaso
            const errorData = JSON.parse(textResponse);
            throw new Error(errorData.message || 'Error del servidor');
          } catch (parseError) {
            // Si no es JSON, usamos el texto como está
            throw new Error(`Error del servidor: ${textResponse}`);
          }
        }

        const data = await response.json();
        console.log('Response data:', data);
        
        if (data && data.ok && data.profile) {
          setUserProfile(data.profile);
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (err) {
        console.error('Error completo:', err);
        setError(err.message || 'Error al cargar el perfil del usuario');
      } finally {
        setLoading(false);
      }
    };

    if (user_id) {
      fetchUserProfile();
    }
  }, [user_id]);

  // Fetch user's pets
  useEffect(() => {
    const fetchUserPets = async () => {
      if (!user_id) return;
      
      try {
        setLoadingPets(true);
        console.log('Fetching pets from:', `${config.api}/api/users/public/${user_id}/pets`);
        
        const response = await fetch(`${config.api}/api/users/public/${user_id}/pets`);
        console.log('Pets response status:', response.status);

        if (!response.ok) {
          const textResponse = await response.text();
          console.error('Pets error response:', textResponse);
          throw new Error('Error al obtener las mascotas');
        }

        const data = await response.json();
        console.log('Pets response data:', data);
        
        if (data && data.ok && data.pets) {
          setUserPets(data.pets);
        } else {
          setUserPets([]);
        }
      } catch (err) {
        console.error('Error completo al obtener mascotas:', err);
        setUserPets([]);
      } finally {
        setLoadingPets(false);
      }
    };

    fetchUserPets();
  }, [user_id]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowMessageModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleContactUser = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      return;
    }
    
    setShowMessageModal(true);
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  const handleCustomMessageChange = (e) => {
    setCustomMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      setShowMessageModal(false);
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      return;
    }

    const messageToSend = selectedMessage || customMessage;
    if (!messageToSend.trim()) return;

    setIsSending(true);
    const url = `${config.api}/api/chat/user/${user_id}/start`;
    console.log('Intentando enviar mensaje a:', url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ initialMessage: messageToSend })
      });

      console.log('Estado de la respuesta:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Respuesta del servidor (no OK):', errorText);
        throw new Error(`El servidor respondió con un error ${response.status}.`);
      }
      
      const data = await response.json();

      if (data && data.success && data.chat && data.chat._id) {
        console.log('✅ Chat creado exitosamente:', data.chat);
        
        // Mostrar mensaje de éxito
        setMessageSent(true);
        setChatCreatedSuccessfully(true);
        
        // Actualizar las conversaciones en el ChatContext (NO BLOQUEAR POR ERRORES)
        loadConversations().catch(loadError => {
          console.warn('⚠️ Error al actualizar conversaciones (no crítico):', loadError);
          // Fallback: intentar agregar conversación manualmente al contexto si existe el método
          try {
            if (typeof sendChatMessage === 'function') {
              console.log('🔄 Intentando fallback para agregar conversación');
            }
          } catch (fallbackError) {
            console.warn('⚠️ Fallback también falló:', fallbackError);
          }
        });
        
        // Redirigir al chat después de un breve delay
        setTimeout(() => {
          setShowMessageModal(false);
          setMessageSent(false);
          setChatCreatedSuccessfully(false);
          
          // Navegar con validación
          const chatId = data.chat._id;
          if (chatId) {
            console.log('🚀 Navegando al chat:', chatId);
            navigate(`/chat/${chatId}`);
          } else {
            console.error('❌ ID de chat no válido:', data.chat);
            navigate('/messages'); // Fallback a lista de mensajes
          }
        }, 1500);
      } else {
        console.error('❌ Respuesta inválida del servidor:', data);
        throw new Error(`Respuesta del servidor inválida: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      
      // Si el error incluye información de respuesta del servidor, parsearla
      let serverMessage = '';
      if (err.message.includes('500') && err.message.includes('permisos')) {
        serverMessage = 'Problema de permisos en el servidor.';
      } else if (err.message.includes('Respuesta del servidor inválida')) {
        serverMessage = 'El mensaje se envió pero hubo un problema con la respuesta.';
      }
      
      let errorMessage;
      if (err.message.includes('404')) {
        errorMessage = 'No se pudo encontrar el recurso solicitado (Error 404).';
      } else if (err.message.includes('contigo mismo')) {
        errorMessage = 'No puedes enviarte mensajes a ti mismo.';
      } else if (err.message.includes('vacío')) {
        errorMessage = 'El mensaje no puede estar vacío.';
      } else if (serverMessage) {
        errorMessage = serverMessage + ' El mensaje podría haberse enviado, verifica tus conversaciones.';
      } else {
        errorMessage = 'No se pudo enviar el mensaje, por favor intente nuevamente.';
      }
      
      alert(errorMessage);
    } finally {
      setIsSending(false);
      // Limpiar estados en caso de error
      if (!chatCreatedSuccessfully) {
        setMessageSent(false);
        setChatCreatedSuccessfully(false);
      }
    }
  };

  const handleShare = () => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        throw new Error('No se pudo copiar el enlace');
      }
    } catch (err) {
      console.error('Error al copiar el enlace:', err);
      alert(`No se pudo copiar automáticamente. Copia este enlace: ${window.location.href}`);
    }
    
    setIsShareMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-md">
              <ImSpinner2 className="animate-spin text-orange-500 text-4xl" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Cargando información de usuario...</p>
          <p className="text-gray-500 text-sm mt-2">Esto podría tomar un momento</p>
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-6">
        <button 
          onClick={handleGoBack} 
          className="flex items-center text-gray-700 hover:text-orange-500 mb-4"
        >
          <FiArrowLeft className="mr-2" /> Volver
        </button>
        
        <div className="bg-red-50 p-6 rounded-lg text-center max-w-md mx-auto">
          <p className="text-red-500 font-medium mb-2">
            {error === 'Este perfil no es público' 
              ? 'Este perfil es privado'
              : error || 'No se encontró el perfil del usuario'}
          </p>
          <p className="text-gray-600 text-sm">
            {error === 'Este perfil no es público'
              ? 'El usuario ha configurado su perfil como privado.'
              : 'Es posible que el usuario no exista o que no esté disponible en este momento.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-20">
      <AnimatePresence>
        {copySuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg shadow-lg flex items-center">
              <FiCheck className="mr-2" /> ¡Enlace copiado!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with navigation buttons */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <button 
              onClick={handleGoBack} 
              className="flex items-center text-gray-700 hover:text-orange-500 transition-colors p-2 rounded-full hover:bg-orange-50"
            >
              <FiArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="ml-2 font-medium hidden sm:inline">Volver</span>
            </button>
            
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
              Perfil de {userProfile.name}
            </h1>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button 
                  onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                  className="p-2 rounded-full text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                  aria-label="Compartir"
                >
                  <FiShare2 className="w-6 h-6" />
                </button>
                
                {isShareMenuOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-50 border border-gray-100">
                    <button 
                      onClick={handleShare}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 transition-colors"
                    >
                      <FiShare2 className="mr-2 w-5 h-5 text-gray-500" />
                      Copiar enlace
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Main profile card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          {/* Hero section with background and profile */}
          <div className="relative">
            {/* Background gradient banner */}
            <div className="h-32 sm:h-40 bg-gradient-to-r from-orange-400 to-amber-300"></div>
            
            {/* Profile image - overlapping the banner */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 sm:-bottom-20">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <img 
                  src={userProfile.profile_picture || DefaultProfile} 
                  alt={userProfile.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Profile information with space for the overlapping image */}
          <div className="pt-20 sm:pt-24 p-6 sm:p-8 flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              {userProfile.name}
            </h2>
            
            {/* User gender */}
            {userProfile.gender && userProfile.gender !== 'Otro' && (
              <p className="text-gray-600 text-sm mb-2">
                {userProfile.gender}
              </p>
            )}
            
            {/* User location */}
            {userProfile.city && userProfile.state && (
              <div className="flex items-center text-gray-600 mb-4">
                <FiMapPin className="text-orange-500 mr-1" />
                <p className="text-sm">
                  {userProfile.city}, {userProfile.state}
                  {userProfile.country && userProfile.country !== 'Colombia' && `, ${userProfile.country}`}
                </p>
              </div>
            )}
            
            {/* Description/bio (if available) */}
            {userProfile.bio && (
              <div className="w-full max-w-md mb-6 bg-orange-50 p-4 rounded-xl border border-orange-100">
                <p className="text-gray-700 italic">{userProfile.bio}</p>
              </div>
            )}
            
            {/* Contact information section */}
            <div className="w-full max-w-md mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userProfile.email && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <FiMail className="text-orange-500 mr-3 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-500">Correo electrónico</p>
                    <p className="font-medium truncate">{userProfile.email}</p>
                  </div>
                </div>
              )}
              
              {userProfile.phone && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <FiPhone className="text-orange-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Teléfono</p>
                    <p className="font-medium">{userProfile.phone}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Contact button (only show if not viewing your own profile) */}
            {(user?.id !== user_id) && (
              <button 
                onClick={handleContactUser}
                className="w-full max-w-md mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center"
              >
                <FiMessageCircle className="mr-2" /> Contactar ahora
              </button>
            )}
          </div>
        </div>
        
        {/* User's pets section */}
        {userPets.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <MdPets className="mr-2 text-orange-500" />
                Mascotas de {userProfile.name}
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {userPets.map(pet => (
                  <div 
                    key={pet._id} 
                    className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:scale-[1.02]"
                    onClick={() => navigate(`/public-pet-profile/${pet._id}`)}
                  >
                    <div className="w-full aspect-square overflow-hidden">
                      <img 
                        src={pet.profile_picture || (pet.species === 'dog' ? defaultDog : defaultCat)} 
                        alt={pet.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105" 
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-gray-800 truncate">{pet.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-500">{pet.species === 'dog' ? 'Perro' : 'Gato'}</p>
                        {pet.status === 'Perdido' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                            Perdido
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {loadingPets && (
          <div className="text-center p-4">
            <ImSpinner2 className="animate-spin text-orange-500 text-2xl mx-auto" />
            <p className="text-sm text-gray-500 mt-2">Cargando mascotas...</p>
          </div>
        )}

        {/* Footer with disclaimer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2023 PetConnect - Conectando mascotas con familias amorosas</p>
        </div>
      </div>

      {/* Message modal with predefined messages */}
      <AnimatePresence>
        {showMessageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          >
            <motion.div 
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Enviar mensaje</h3>
                <button 
                  onClick={() => setShowMessageModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {messageSent ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <FiCheck className="text-green-500 w-8 h-8" />
                  </div>
                  <p className="text-gray-800 font-medium mb-2">
                    {chatCreatedSuccessfully ? '¡Chat creado y mensaje enviado!' : '¡Mensaje enviado con éxito!'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {chatCreatedSuccessfully ? 'Redirigiendo al chat...' : 'Procesando...'}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">
                    Elige un mensaje predeterminado o escribe uno personalizado para {userProfile.name}:
                  </p>
                  
                  <div className="mb-4 space-y-2">
                    {predefinedMessages.map((message, index) => (
                      <div 
                        key={index}
                        onClick={() => handleSelectMessage(message)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedMessage === message 
                            ? 'bg-orange-100 border border-orange-300' 
                            : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                        }`}
                      >
                        <p className="text-sm text-gray-700">{message}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      O escribe tu propio mensaje:
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={3}
                      placeholder="Escribe tu mensaje aquí..."
                      value={customMessage}
                      onChange={handleCustomMessageChange}
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setShowMessageModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleSendMessage}
                      disabled={isSending || (!selectedMessage && !customMessage.trim())}
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        isSending || (!selectedMessage && !customMessage.trim())
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {isSending ? (
                        <>
                          <ImSpinner2 className="animate-spin mr-2" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <FiSend className="mr-2" />
                          <span>Enviar</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
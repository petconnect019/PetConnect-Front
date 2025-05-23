import { useEffect, useState, useRef } from 'react';
import { useIsFetchedPets } from '../../Contexts/IsFetchedPets/IsFetchedPets';
import { useFetchPetById } from "../../Hooks/useFetchPetById/useFetchPetById";
import { usePet } from '../../Contexts/PetContext/PetContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { GridItem } from '../../Components/GridItem/GridItem';
import { ImSpinner2 } from 'react-icons/im';
import { FiArrowLeft, FiShare2, FiMessageCircle, FiCheck, FiChevronLeft, FiChevronRight, FiHeart, FiMapPin, FiCalendar, FiTag } from 'react-icons/fi';
import { MdPets } from 'react-icons/md';
import defaultCat from '../../assets/images/CatProfilePfp.png'
import defaultDog from '../../assets/images/DogProfilePfp.png'
import defaultOwner from '../../assets/images/DefaultProfile.png'
import { motion, AnimatePresence } from 'framer-motion';
import { NavButton } from '../../Components/NavButton/NavButton';
import SharedImg from '../../assets/images/shared.png'
import { fetchCreateConversation } from '../../Utils/Fetch/FetchChat/FetchChat';

export const PublicPetProfile = () => {
  const { pet_id } = useParams();
  const navigate = useNavigate();
  const fetchedPets = useIsFetchedPets();
  const { getPetById, petResult, redirect } = useFetchPetById();
  const petUser = usePet();
  const {findPet} = petUser?? {};
  const { isFetchedPets } = fetchedPets ?? {};
  const [petData, setPetData] = useState(null);
  const [userData, setUserData] = useState(null);
  const { isAuthenticated } = useAuth();
  const [isContactingOwner, setIsContactingOwner] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [redirected, setRedirected] = useState(false);
  
  // Referencia para el contenedor del carrusel
  const carouselRef = useRef(null);

  useEffect(() => {
    // Obtener datos del usuario del sessionStorage
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
      } catch (error) {
        console.error("Error al parsear datos del usuario:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Siempre intentar cargar los datos del pet
    trigguerGetId();
  }, [pet_id]);

  useEffect(() => {
    if (petResult) {
      setPetData(petResult);
    } else {
      const foundPet = findPet(pet_id);
      if (foundPet) {
        setPetData(foundPet);
      } else {
        trigguerGetId();
      }
    }
  }, [petResult, isFetchedPets, pet_id, findPet]);

  // Handle redirect if present
  useEffect(() => {
    if (redirect) {
      navigate(redirect);
    }
  }, [redirect, navigate]);

  // Verificar si hay interacción con el teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        changePhoto('prev');
      } else if (e.key === 'ArrowRight') {
        changePhoto('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    
  }, [petData]);

  const trigguerGetId = () => {
    getPetById(pet_id);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Función para manejar el cambio de foto en el carrusel
  const changePhoto = (direction) => {
    if (!petData || !petData.photos || petData.photos.length === 0) {
      return;
    }
    
    // Calculamos el número total de fotos (incluyendo la de perfil)
    const totalPhotos = (petData.photos?.length || 0) + 1;
    
    if (direction === 'next') {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % totalPhotos);
    } else {
      setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + totalPhotos) % totalPhotos);
    }
  };

  // Obtener la URL de la foto actual
  const getCurrentPhotoUrl = () => {
    if (!petData) return '';
    
    // Si es el índice 0, mostramos la foto de perfil
    if (currentPhotoIndex === 0) {
      return petData.profile_picture || (petData.species === 'dog' ? defaultDog : defaultCat);
    }
    
    // Si hay fotos adicionales, mostramos la correspondiente
    if (petData.photos && petData.photos.length > 0 && currentPhotoIndex - 1 < petData.photos.length) {
      return petData.photos[currentPhotoIndex - 1];
    }
    
    // Si no hay foto en ese índice, volvemos a la foto de perfil
    return petData.profile_picture || (petData.species === 'dog' ? defaultDog : defaultCat);
  };

  const handleShare = () => {
    try {
      // Método alternativo utilizando un elemento de texto temporal
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      textArea.style.position = 'fixed';  // Evita scroll al agregar el elemento
      textArea.style.left = '-999999px';  // Fuera de la pantalla
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
      // Fallback: mostrar el enlace para que el usuario pueda copiarlo manualmente
      alert(`No se pudo copiar automáticamente. Copia este enlace: ${window.location.href}`);
    }
    
    setIsShareMenuOpen(false);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Aquí iría la lógica para guardar el favorito en el backend
  };

  const handleContactOwner = async () => {
    if (!isAuthenticated) {
      setRedirected(true);
      // Save current path to redirect back after authentication
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      // Give option to login or register
      navigate('/login');
      return;
    }

    setIsContactingOwner(true);
    
    navigate(`/user-profile/${petData?.owner?._id}`);
    setIsContactingOwner(false);
  };

  useEffect(()=> {
    if (redirected) {
      navigate(`/user-profile/${petData?.owner?._id}`);
    }
  }, [redirected]);

  const petDetails = [
    { 
      icon: <MdPets className="w-5 h-5 text-orange-500" />,
      title: 'Género', 
      subtitle: petData?.gender 
    },
    { 
      icon: <FiCalendar className="w-5 h-5 text-orange-500" />,
      title: 'Edad', 
      subtitle: petData?.calculatedAge || "No especificada" 
    },
    { 
      icon: <FiTag className="w-5 h-5 text-orange-500" />,
      title: 'Raza', 
      subtitle: petData?.breed 
    },
    { 
      icon: <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: petData?.color?.toLowerCase() || '#ccc'}}></div>
            </div>,
      title: 'Color', 
      subtitle: petData?.color 
    },
    { 
      icon: petData?.species === "dog" 
        ? <span className="text-xl">🐕</span> 
        : <span className="text-xl">🐈</span>,
      title: 'Tipo', 
      subtitle: petData?.species === "dog" ? 'Perro' : 'Gato' 
    }
  ];

  // Calculamos si hay múltiples fotos para mostrar los controles del carrusel
  const hasMultiplePhotos = petData && ((petData.photos && petData.photos.length > 0) || petData.profile_picture);
  
  if (!petData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-md">
              <ImSpinner2 className="animate-spin text-orange-500 text-4xl" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Cargando información...</p>
          <p className="text-gray-500 text-sm mt-2">Esto podría tomar un momento</p>
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

      {/* Header con botones de navegación */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <button 
              onClick={handleGoBack} 
              className="flex items-center text-gray-700 hover:text-orange-500 transition-colors p-2 rounded-full hover:bg-orange-50"
            >
              <FiArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="ml-2 font-medium hidden sm:inline">Volver</span>
            </button>
            
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
              <span className="hidden sm:inline">Perfil de</span> {petData.name}
              {petData.status === 'Perdido' && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                  Perdido
                </span>
              )}
            </h1>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorited 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'
                }`}
                aria-label={isFavorited ? "Quitar de favoritos" : "Añadir a favoritos"}
              >
                <FiHeart 
                  className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} 
                />
              </button>
              
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        {/* Tarjeta principal */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          {/* Carrusel de imágenes */}
          <div className="relative bg-gray-50" ref={carouselRef}>
            {/* Contenedor de la imagen con tamaño controlado */}
            <div className="relative overflow-hidden w-full" style={{ height: '60vh', maxHeight: '600px' }}>
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentPhotoIndex}
                  src={getCurrentPhotoUrl()}
                  alt={`${petData.name} - foto ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover object-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              
              {/* Indicador de estado de la foto */}
              {hasMultiplePhotos && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                  {currentPhotoIndex + 1} / {1 + (petData.photos?.length || 0)}
                </div>
              )}

              {/* Estado de mascota perdida */}
              {petData?.status === 'Perdido' && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg animate-pulse flex items-center">
                  <span className="mr-2">⚠️</span> 
                  Mascota perdida
                </div>
              )}
            </div>
            
            {/* Botones de navegación del carrusel */}
            {hasMultiplePhotos && (petData.photos?.length > 0 || petData.profile_picture) && (
              <>
                <button 
                  onClick={() => changePhoto('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-transform hover:scale-105"
                  aria-label="Foto anterior"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => changePhoto('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-transform hover:scale-105"
                  aria-label="Siguiente foto"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            {/* Miniaturas del carrusel */}
            {hasMultiplePhotos && (
              <div className="flex justify-center gap-2 p-3 bg-white border-t border-gray-100 overflow-x-auto">
                {/* Miniatura de la foto de perfil */}
                <button 
                  onClick={() => setCurrentPhotoIndex(0)}
                  className={`w-16 h-16 rounded-lg overflow-hidden transition-all ${
                    currentPhotoIndex === 0 
                      ? 'ring-2 ring-orange-500 scale-105 shadow-md' 
                      : 'opacity-70 hover:opacity-100 border border-gray-200'
                  }`}
                >
                  <img 
                    src={petData.profile_picture || (petData.species === 'dog' ? defaultDog : defaultCat)}
                    alt={`${petData.name} - miniatura`}
                    className="w-full h-full object-cover"
                  />
                </button>
                
                {/* Miniaturas de fotos adicionales */}
                {petData.photos && petData.photos.map((photo, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index + 1)}
                    className={`w-16 h-16 rounded-lg overflow-hidden transition-all ${
                      currentPhotoIndex === index + 1 
                        ? 'ring-2 ring-orange-500 scale-105 shadow-md' 
                        : 'opacity-70 hover:opacity-100 border border-gray-200'
                    }`}
                  >
                    <img 
                      src={photo}
                      alt={`${petData.name} - miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Información principal */}
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                  {petData.name}
                  {petData.species === "dog" 
                    ? <span className="ml-2 text-2xl">🐕</span> 
                    : <span className="ml-2 text-2xl">🐈</span>
                  }
                </h2>
                <div className="flex items-center mt-2 text-gray-600">
                  <FiMapPin className="text-orange-500 mr-1" />
                  <p className="text-sm">
                    {userData?.city || 'Ciudad no especificada'}, {userData?.country || 'País no especificado'}
                  </p>
                </div>
              </div>
              
              {/* Badge con estado si está disponible */}
              {petData.status && petData.status !== 'Perdido' && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                  ${petData.status === 'Adoptado' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'}`}
                >
                  {petData.status}
                </span>
              )}
            </div>
            
            {/* Características de la mascota */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-orange-100 text-orange-500 p-1 rounded-lg mr-2">
                  <MdPets className="w-5 h-5" />
                </span>
                Características
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {petDetails.map((detail, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-orange-200 transition-colors hover:bg-orange-50">
                    <div className="flex items-center mb-2">
                      {detail.icon}
                      <p className="text-gray-500 text-sm ml-2">{detail.title}</p>
                    </div>
                    <p className="font-semibold text-gray-900">{detail.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Historia o descripción si existe */}
            {petData.description && (
              <div className="mt-8 bg-orange-50 rounded-xl p-6 border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Sobre {petData.name}</h3>
                <p className="text-gray-700 leading-relaxed">{petData.description}</p>
              </div>
            )}
            
            {/* Información del propietario */}
            <div className="mt-10 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contacta al propietario</h3>
              <div className="flex items-center">
                <div className="relative">
                  <img 
                    src={petData.owner?.profile_picture || defaultOwner} 
                    alt={petData.owner?.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-800 text-lg">{petData.owner?.name || 'Propietario'}</p>
                  <p className="text-gray-600 text-sm flex items-center mt-1">
                    <FiMapPin className="mr-1 text-orange-500" />
                    {petData.owner?.city ? `${petData.owner.city}, ${petData.owner.state}` : 'Ubicación no disponible'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  onClick={handleContactOwner}
                  disabled={isContactingOwner}
                  className={`
                    w-full flex items-center justify-center py-3 px-6 rounded-xl text-white font-semibold 
                    transition-all transform hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
                    ${isContactingOwner ? 
                      'bg-gray-400 cursor-not-allowed' : 
                      'bg-gradient-to-r from-orange-500 to-amber-500 shadow-md hover:shadow-lg'
                    }
                  `}
                >
                  {isContactingOwner ? (
                    <>
                      <ImSpinner2 className="animate-spin mr-2" />
                      <span>Cargando...</span>
                    </>
                  ) : (
                    <>
                      <FiMessageCircle className="mr-2" />
                      <span>Contactar ahora</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer con información legal */}
        <div className="mt-10 text-center text-sm text-gray-500">
          <p>© 2023 PetConnect - Conectando mascotas con familias amorosas</p>
        </div>
      </div>
    </div>
  );
};
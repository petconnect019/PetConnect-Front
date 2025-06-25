import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { usePet } from "../../Contexts/PetContext/PetContext";
import { GridItem } from "../../Components/GridItem/GridItem";
import enableLost from "../../assets/images/enableLost.png";
import enableQR from "../../assets/images/enableQR.png";
import { useNavigate } from "react-router-dom";
import { useIsFetchedPets } from "../../Contexts/IsFetchedPets/IsFetchedPets";
import { useFetchPetById } from "../../Hooks/useFetchPetById/useFetchPetById";
import { ImSpinner2 } from "react-icons/im";
import defaultDog from "../../assets/images/DogProfilePfp.png";
import defaultCat from "../../assets/images/CatProfilePfp.png";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import petPhoto from '../../assets/images/petPhoto.png'
import addPetPhoto from '../../assets/images/addPetPhoto.png'
import { FooterNav } from "../../Components/FooterNav/FooterNav";
import { NavButton } from "../../Components/NavButton/NavButton";
import SharedImg from '../../assets/images/shared.png'
import LocationImg from '../../assets/images/Location.png'
import { useFetchUpdatePet } from "../../Hooks/useFetchUpdatePet/useFetchUpdatePet";
import { FaMapMarkerAlt, FaEdit, FaShare, FaQrcode, FaExclamationTriangle, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

export const PetDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { pet_id } = useParams();
  const [pet, setPet] = useState({});
  const [userData, setUserData] = useState(null);
  const fetchedPets = useIsFetchedPets();
  const { isFetchedPets } = fetchedPets ?? {};
  const pets = usePet();
  const navigate = useNavigate();
  const { findPet } = pets ?? {};
  const { getPetById, petResult, redirect } = useFetchPetById();
  const { fetchUpdatePet } = useFetchUpdatePet();
  const shareMenuRef = useRef(null);

  const handleBackButton = () => {
    navigate('/home');
  }

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
    if (!isFetchedPets) {
      trigguerGetId();
    }
  }, []);

  useEffect(() => {
    if (petResult) {
      setPet(petResult);
    } else {
      setPet(findPet(pet_id));
    }
  }, [petResult, isFetchedPets]);

  // Handle redirect if present
  useEffect(() => {
    if (redirect) {
      navigate(redirect);
    }
  }, [redirect, navigate]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setIsShareMenuOpen(false);
      }
    };

    if (isShareMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShareMenuOpen]);

  const trigguerGetId = () => {
    getPetById(pet_id);
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

  const petDetails = [
    { title: "Género", subtitle: pet?.gender, icon: "🐾" },
    { title: "Edad", subtitle: pet?.calculatedAge, icon: "🎂" },
    { title: "Raza", subtitle: pet?.breed, icon: "🏷️" },
    { title: "Color", subtitle: pet?.color, icon: "🎨" },
    { title: "Tipo", subtitle: pet?.species, icon: "🐕" },
    { title: "Estado", subtitle: pet?.status || "En casa", icon: "🏠" },
  ];

  const handleReportLost = async () => {
    try {
      let token = sessionStorage.getItem("accessToken");
      
      const formData = new FormData();
      formData.append('name', pet.name);
      formData.append('birthDate', pet.birthDate);
      formData.append('breed', pet.breed);
      formData.append('gender', pet.gender);
      formData.append('species', pet.species);
      formData.append('color', pet.color);
      formData.append('_id', pet._id);
      formData.append('status', 'Perdido');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/${pet._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: 'include',
        body: formData
      });

      const result = await response.json();
      
      if (response.ok) {
        setPet(prevPet => ({
          ...prevPet,
          status: 'Perdido'
        }));
        setIsModalOpen(false);
      } else {
        console.error('Error al actualizar el estado:', result.message);
      }
    } catch (error) {
      console.error('Error al reportar mascota como perdida:', error);
    }
  };

  return (
    <>
      {pet ? (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
          {/* Success notification */}
          <AnimatePresence>
            {copySuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
              >
                <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg shadow-lg flex items-center">
                  <FaCheck className="mr-2" /> ¡Enlace copiado!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <section className="flex flex-col items-center py-6 sm:py-8 md:py-10 lg:py-12">
            {/* Header Card */}
            <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-6 relative">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={handleBackButton}
                    className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center flex-1">
                    Detalles de la Mascota
                  </h1>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                      className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all duration-300"
                    >
                      <FaShare className="w-5 h-5 text-white" />
                    </button>
                    
                    {/* Share Menu Dropdown */}
                    {isShareMenuOpen && (
                      <div 
                        ref={shareMenuRef}
                        className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-50 border border-gray-100"
                      >
                        <button 
                          onClick={handleShare}
                          className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 transition-colors"
                        >
                          <FaShare className="mr-2 w-5 h-5 text-gray-500" />
                          Copiar enlace
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pet Profile Section */}
              <div className="p-6 sm:p-8">
                {/* Pet Image and Action Buttons */}
                <div className="flex justify-center items-center gap-8 sm:gap-12 mb-8">
                  {/* QR Button */}
                  <div className="flex flex-col items-center group">
                    <button
                      onClick={() => navigate(`/scanner/${pet_id}`)}
                      className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-700"
                    >
                      <FaQrcode className="w-6 h-6 text-white" />
                    </button>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center font-medium">Activar QR</p>
                  </div>

                  {/* Pet Image */}
                  <div className="relative">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full p-1 shadow-xl">
                      <img
                        className="w-full h-full object-cover rounded-full border-4 border-white"
                        src={
                          pet?.profile_picture ||
                          (pet.species === "dog" ? defaultDog : defaultCat)
                        }
                        alt={`${pet.name} profile`}
                      />
                    </div>
                    {pet.status === 'Perdido' && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                        PERDIDO
                      </div>
                    )}
                  </div>

                  {/* Lost Button */}
                  <div className="flex flex-col items-center group">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-gradient-to-br from-red-400 to-red-600 p-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group-hover:from-red-500 group-hover:to-red-700"
                    >
                      <FaExclamationTriangle className="w-6 h-6 text-white" />
                    </button>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center font-medium">Reportar Perdida</p>
                  </div>
                </div>

                {/* Pet Name and Location */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                    {pet.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <FaMapMarkerAlt className="w-4 h-4 text-orange-500" />
                    <span className="text-sm sm:text-base">
                      {userData?.city || 'Ciudad no especificada'}, {userData?.country || 'País no especificado'}
                    </span>
                  </div>
                </div>

                {/* Pet Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  {petDetails.map((detail, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">{detail.icon}</span>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">{detail.title}</p>
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                        {detail.subtitle || 'No especificado'}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => navigate(`/pet-profile/${pet_id}`)}
                    className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaEdit className="w-4 h-4" />
                    Editar Perfil
                  </button>
                  
                  <button 
                    onClick={() => navigate(`/public-pet-profile/${pet_id}`)}
                    className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaShare className="w-4 h-4" />
                    Ver Perfil Público
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mt-6">
              <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                  Galería de Imágenes
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {[addPetPhoto, petPhoto, petPhoto, petPhoto].map((photo, index) => (
                    <div 
                      key={index} 
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 aspect-square hover:shadow-lg transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <img 
                        src={photo} 
                        alt={`Pet photo ${index + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 sm:p-8 transform transition-all duration-300 scale-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AiOutlineExclamationCircle className="text-red-500 text-2xl" />
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                    Reportar mascota perdida
                  </h2>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Si reportas a tu mascota como perdida, cualquier persona que
                    escanee el QR podrá ver su información de contacto.
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
                      onClick={handleReportLost}
                    >
                      Confirmar
                    </button>
                    <button
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <FooterNav navigate={navigate} />
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex justify-center items-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <ImSpinner2 className="text-white text-2xl animate-spin" />
            </div>
            <p className="text-gray-600 font-medium">Cargando detalles de la mascota...</p>
          </div>
        </div>
      )}
    </>
  );
};

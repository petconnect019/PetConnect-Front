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
import { FooterNav } from "../../Components/FooterNav/FooterNav";
import { NavButton } from "../../Components/NavButton/NavButton";
import SharedImg from '../../assets/images/shared.png'
import LocationImg from '../../assets/images/Location.png'
import { useFetchUpdatePet } from "../../Hooks/useFetchUpdatePet/useFetchUpdatePet";
import { FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { PetPhotoGallery } from "../../Components/PetPhotoGallery/PetPhotoGallery";

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
    { title: "Género", subtitle: pet?.gender },
    { title: "Edad", subtitle: pet?.calculatedAge },
    { title: "Raza", subtitle: pet?.breed },
    { title: "Color", subtitle: pet?.color },
    { title: "Tipo", subtitle: pet?.species },
    { title: "Estado", subtitle: pet?.status || "En casa" },
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
        <section className="flex flex-col items-center sm:py-12 xs:py-6 md:py-8 lg:py-10 xl:py-12 3xl:py-14 4xl:py-16">
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

          <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl xs:max-w-sm lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl 4xl:max-w-5xl bg-white p-4 sm:p-6 xs:p-5 md:p-7 lg:p-8 xl:p-9 3xl:p-10 4xl:p-12 rounded-lg shadow-sm">
            <div className="flex items-center mt-2 mb-3 xs:mb-4 sm:mb-6 md:mb-8 text-center w-full p-1">
              <div className="absolute left-0">
                <NavButton onClick={handleBackButton}/>
              </div>
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-5xl font-bold text-gray-800 flex-grow text-center">
                Detalles de la Mascota
              </h1>
              <div className="absolute right-0">
                <img 
                  onClick={() => setIsShareMenuOpen(!isShareMenuOpen)} 
                  className="w-6 h-6 xs:w-6 xs:h-6 sm:w-7 sm:h-7 3xl:w-8 3xl:h-8 4xl:w-9 4xl:h-9 cursor-pointer" 
                  src={SharedImg} 
                  alt="SharedImg" 
                />
                
                {/* Share Menu Dropdown */}
                {isShareMenuOpen && (
                  <div 
                    ref={shareMenuRef}
                    className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200"
                  >
                    <button 
                      onClick={handleShare}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <img className="mr-2 w-5 h-5" src={SharedImg} alt="Share" />
                      Copiar enlace
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
            <div className="sm:m-10 flex justify-center items-center p-3 gap-6 sm:gap-12 xs:gap-5 md:gap-10 3xl:gap-14 4xl:gap-16">
              <div
                onClick={() => navigate(`/scanner/${pet_id}`)}
                className="flex flex-col items-center cursor-pointer"
              >
                <img className="w-8 h-8 sm:w-10 sm:h-10 xs:w-8 xs:h-8 md:w-9 md:h-9 3xl:w-11 3xl:h-11 4xl:w-12 4xl:h-12" src={enableQR} alt="Activar QR" />
                <p className="text-xs sm:text-base xs:text-base 3xl:text-lg 4xl:text-xl text-center mt-1">Activar Código QR</p>
              </div>

              <img
                onClick={()=>navigate(`/pet-profile/${pet_id}`)}
                className="w-24 sm:w-32 h-24 sm:h-32 xs:w-24 xs:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 xl:w-34 xl:h-34 2xl:w-38 2xl:h-38 3xl:w-42 3xl:h-36 4xl:w-50 4xl:h-50 object-cover rounded-full"
                onClick={()=>navigate(`/pet-profile/${pet_id}`)}
                src={
                  pet?.profile_picture ||
                  (pet.species == "dog" ? defaultDog : defaultCat)
                }
                alt="pfp"
              />

              <div
                onClick={() => setIsModalOpen(true)}
                className="flex flex-col items-center cursor-pointer"
              >
                <img className="w-8 h-8 sm:w-10 sm:h-10 xs:w-8 xs:h-8 md:w-9 md:h-9 3xl:w-11 3xl:h-11 4xl:w-12 4xl:h-12" src={enableLost} alt="Pet is Lost" />
                <p className="text-xs sm:text-base xs:text-base 3xl:text-lg 4xl:text-xl text-center mt-1">Reportar como Perdida</p>
              </div>
            </div>
            

            {/* Pet details */}
            <div className="p-4 sm:p-6 xs:p-5 3xl:p-8 4xl:p-10">
              <h1 className="text-xl sm:text-2xl xs:text-xl md:text-3xl 3xl:text-4xl 4xl:text-5xl font-bold mb-3 sm:mb-4 xs:mb-5 3xl:mb-6 4xl:mb-8">{pet.name}</h1>
              <div className="flex items-center gap-2 mb-4 sm:mb-6 xs:mb-5 3xl:mb-8 4xl:mb-10">
                <img className="w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6 3xl:w-7 3xl:h-7 4xl:w-8 4xl:h-8" src={LocationImg} alt="Location" />
                <span className="text-gray-700 text-base sm:text-lg xs:text-base 3xl:text-xl 4xl:text-2xl">
                  {userData?.city || 'Ciudad no especificada'}, {userData?.country || 'País no especificado'}
                </span>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3 4xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xs:gap-4 3xl:gap-8 4xl:gap-10">
                {petDetails.map((detail, index) => (
                  <div key={index} className="bg-gray-50 p-3 sm:p-4 xs:p-4 3xl:p-5 4xl:p-6 rounded-lg shadow-sm">
                    <p className="text-xs sm:text-sm xs:text-base 3xl:text-base 4xl:text-lg text-gray-500">{detail.title}</p>
                    <p className="text-sm sm:text-base xs:text-base 3xl:text-xl 4xl:text-2xl font-medium text-gray-800">{detail.subtitle || 'No especificado'}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center my-4 sm:m-5 xs:my-5 3xl:my-8 4xl:my-10">
                <button 
                  onClick={()=>navigate(`/pet-profile/${pet_id}`)} 
                  className="bg-[#EC9126] text-white text-sm sm:text-base xs:text-base 3xl:text-xl 4xl:text-2xl p-2 px-4 3xl:px-6 4xl:px-8 rounded-full hover:bg-orange-600 transition-colors"
                >
                  Editar Perfil
                </button>
              </div>
            </div>
            </div>

            {/* Galería de Imagenes de la Mascota */}
            <PetPhotoGallery 
              petId={pet_id} 
              isOwner={userData?._id === pet?.owner?._id || userData?._id === pet?.owner}
            />
          </div>


          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-200/30 backdrop-blur-md flex items-center justify-center z-50 px-4">
              <div className="bg-white p-6 xs:p-5 sm:p-5 md:p-6 3xl:p-8 4xl:p-10 rounded-lg shadow-lg max-w-xs sm:max-w-sm xs:max-w-sm md:max-w-md 3xl:max-w-lg 4xl:max-w-xl w-full text-center">
                <AiOutlineExclamationCircle className="text-red-500 text-3xl sm:text-4xl xs:text-4xl md:text-4xl 3xl:text-5xl 4xl:text-6xl mx-auto mb-2" />
                <h2 className="text-base sm:text-lg xs:text-lg md:text-xl 3xl:text-2xl 4xl:text-3xl font-semibold">
                  Reportar mascota perdida
                </h2>
                <p className="text-xs sm:text-sm xs:text-base md:text-base 3xl:text-lg 4xl:text-xl text-gray-600 mt-2">
                  Si reportas a tu mascota como perdida, cualquier persona que
                  escanee el QR podrá verlo.
                </p>
                <div className="mt-4 flex justify-center gap-3 sm:gap-4 xs:gap-4 3xl:gap-6 4xl:gap-8">
                  <button
                    className="bg-red-500 text-white text-sm sm:text-base xs:text-base 3xl:text-lg 4xl:text-xl px-3 sm:px-4 xs:px-5 3xl:px-6 4xl:px-8 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    onClick={handleReportLost}
                  >
                    Aceptar
                  </button>
                  <button
                    className="bg-gray-300 text-sm sm:text-base xs:text-base 3xl:text-lg 4xl:text-xl px-3 sm:px-4 xs:px-5 3xl:px-6 4xl:px-8 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
          <FooterNav  navigate={navigate}/>
        </section>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <ImSpinner2 className="animate-pulse text-[#EC9126] text-4xl xs:text-4xl sm:text-5xl 3xl:text-6xl 4xl:text-7xl" />
        </div>
      )}
    </>
  );
};

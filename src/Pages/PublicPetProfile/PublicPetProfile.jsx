import { useEffect, useState } from 'react';
import { useIsFetchedPets } from '../../Contexts/IsFetchedPets/IsFetchedPets';
import { useFetchPetById } from "../../Hooks/useFetchPetById/useFetchPetById";
import { usePet } from '../../Contexts/PetContext/PetContext';
import { useParams, useNavigate } from 'react-router-dom';
import { GridItem } from '../../Components/GridItem/GridItem';
import { ArrowLeft, Share2 } from 'lucide-react';
import { ImSpinner2 } from 'react-icons/im';
import defaultCat from '../../assets/images/CatProfilePfp.png'
import defaultDog from '../../assets/images/DogProfilePfp.png'
import defaultOwner from '../../assets/images/DefaultProfile.png'

export const PublicPetProfile = () => {
  const { pet_id } = useParams();
  const navigate = useNavigate();
  const fetchedPets = useIsFetchedPets();
  const { getPetById, petResult } = useFetchPetById();
  const petUser = usePet();
  const {findPet} = petUser?? {};
  const { isFetchedPets } = fetchedPets ?? {};
  const [petData, setPetData] = useState(null);
  const [userData, setUserData] = useState(null);

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

  const trigguerGetId = () => {
    getPetById(pet_id);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert('Link copiado al portapapeles');
      })
      .catch(err => {
        console.error('Error al copiar el enlace', err);
      });
  };

  const petDetails = [
    { title: 'Género', subtitle: petData?.gender },
    { title: 'Edad', subtitle: petData?.calculatedAge || "No especificada" },
    { title: 'Raza', subtitle: petData?.breed },
    { title: 'Color', subtitle: petData?.color },
    { title: 'Tipo', subtitle: petData?.species == "dog"? 'Perro' : 'Gato' }
  ];

  return (
    <div className='grid grid-cols-1 gap-4 py-6 md:py-12 max-w-7xl mx-auto px-4 md:px-6 lg:px-8'>
      {petData ? (
          <div className="bg-white min-h-screen rounded-3xl">
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center p-4 md:p-6">
            <button 
              onClick={handleGoBack} 
              className="hover:bg-orange-100 p-2 rounded-full"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-lg md:text-2xl font-semibold text-gray-800 text-center">Detalles de la mascota</h1>
            <button 
              onClick={handleShare}
              className="hover:bg-orange-100 p-2 rounded-full"
            >
              <Share2 size={24} />
            </button>
          </div>
    
          {/* Pet Photo Carousel */}
          <div className="grid place-items-center mt-2 mb-6 relative">
            <div className="aspect-square w-64 sm:w-80 md:w-[28rem] overflow-hidden rounded-xl">
              <img 
                src={petData.profile_picture || (petData.species=='dog'?defaultDog:defaultCat)} 
                alt={petData.name} 
                className="w-full h-full object-cover"
              />
              {petData?.status === 'Perdido' && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 md:px-3 py-1 rounded-full animate-pulse text-xs md:text-base">
                  {petData.status}
                </div>
              )}
            </div>
          </div>
    
          {/* Pet details */}
          <div className="grid gap-4 p-4 md:p-6">
            <div className="grid gap-2">
              <h1 className="text-lg md:text-2xl font-bold">{petData.name}</h1>
              <span className="text-sm md:text-lg text-gray-700">
                {userData?.city || 'Ciudad no especificada'}, {userData?.country || 'País no especificado'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              {petDetails.map((detail, index) => (
                <GridItem key={index} title={detail.title} subtitle={detail.subtitle} />
              ))}
            </div>
          </div>
    
          {/* Owner Profile Banner */}
          <div className="grid grid-cols-[auto_1fr] gap-4 mx-4 md:mx-6 bg-[#FFF5EA] rounded-lg p-4">
            <img 
              src={petData.owner?.profile_picture || defaultOwner} 
              alt={petData.owner?.name}
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover"
            />
            <div className="grid gap-1">
              <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">{petData.owner?.name}</p>
              <p className="text-sm sm:text-base text-gray-600">{`${petData.owner?.city} , ${petData.owner?.state}`}</p>
            </div>
          </div>
    
          {/* Contact Owner Button */}
          <div className="mx-4 md:mx-6 mt-6 mb-6">
            <button 
              className="w-full bg-[#EC9126] text-white py-2 md:py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm md:text-base"
            >
              Contactar Propietario
            </button>
          </div>
        </div>
      ) : (
        <div className="grid place-items-center h-screen">
          <ImSpinner2 className="animate-spin text-[#EC9126] text-4xl" />
        </div>
      )}
    </div>
  );
};
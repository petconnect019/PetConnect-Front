import { useEffect, useState } from 'react';
import { useIsFetchedPets } from '../../Contexts/IsFetchedPets/IsFetchedPets';
import { useFetchPetById } from "../../Hooks/useFetchPetById/useFetchPetById";
import { usePet } from '../../Contexts/PetContext/PetContext';
import { useParams, useNavigate } from 'react-router-dom';
import { GridItem } from '../../Components/GridItem/GridItem';
import { ImSpinner2 } from 'react-icons/im';
import defaultCat from '../../assets/images/CatProfilePfp.png'
import defaultDog from '../../assets/images/DogProfilePfp.png'
import defaultOwner from '../../assets/images/DefaultProfile.png'
import {NavButton} from '../../Components/NavButton/NavButton';
import SharedImg from '../../assets/images/shared.png'

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
    <div className='grid grid-cols-1 gap-4 py-6 xs:py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 2xl:py-18 max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14'>
      {petData ? (
          <div className="bg-white min-h-screen rounded-3xl">
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center mt-2 mb-3 xs:mb-4 sm:mb-6 md:mb-8 w-full p-1 max-w-7xl mx-auto">
            <div className="flex justify-start">
              <NavButton onClick={handleGoBack}/>
            </div>
            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-5xl font-bold text-gray-800 text-center">
              Detalles de la mascota
            </h1>
            <div className="flex justify-end">
              <img className="w-6 h-6 xs:w-6 xs:h-6 sm:w-7 sm:h-7 3xl:w-8 3xl:h-8 4xl:w-9 4xl:h-9" src={SharedImg} alt="SharedImg" />
            </div>
          </div>
    
          {/* Pet Photo Carousel */}
          <div className="grid place-items-center mt-2 xs:mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-7 2xl:mt-8 mb-6 relative">
            <div className="aspect-square w-64 xs:w-72 sm:w-80 md:w-96 lg:w-[28rem] xl:w-[32rem] 2xl:w-[36rem] overflow-hidden rounded-xl">
              <img 
                src={petData.profile_picture || (petData.species=='dog'?defaultDog:defaultCat)} 
                alt={petData.name} 
                className="w-full h-full object-cover"
              />
              {petData?.status === 'Perdido' && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 xs:px-2.5 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-7 py-1 rounded-full animate-pulse text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                  {petData.status}
                </div>
              )}
            </div>
          </div>
    
          {/* Pet details */}
          <div className="grid gap-4 xs:gap-5 sm:gap-6 md:gap-7 lg:gap-8 xl:gap-9 2xl:gap-10 p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 xl:p-9 2xl:p-10">
            <div className="grid gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold">{petData.name}</h1>
              <span className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-700">
                {userData?.city || 'Ciudad no especificada'}, {userData?.country || 'País no especificado'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 2xl:gap-9">
              {petDetails.map((detail, index) => (
                <GridItem key={index} title={detail.title} subtitle={detail.subtitle} />
              ))}
            </div>
          </div>
    
          {/* Owner Profile Banner */}
          <div className="grid grid-cols-[auto_1fr] gap-4 xs:gap-5 sm:gap-6 md:gap-7 lg:gap-8 xl:gap-9 2xl:gap-10 mx-4 xs:mx-5 sm:mx-6 md:mx-7 lg:mx-8 xl:mx-9 2xl:mx-10 bg-[#FFF5EA] rounded-lg p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 xl:p-9 2xl:p-10">
            <img 
              src={petData.owner?.profile_picture || defaultOwner} 
              alt={petData.owner?.name}
              className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 2xl:w-24 2xl:h-24 rounded-full object-cover"
            />
            <div className="grid gap-1 xs:gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7">
              <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-gray-800">{petData.owner?.name}</p>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-600">{`${petData.owner?.city} , ${petData.owner?.state}`}</p>
            </div>
          </div>
    
          {/* Contact Owner Button */}
          <div className="mx-4 xs:mx-5 sm:mx-6 md:mx-7 lg:mx-8 xl:mx-9 2xl:mx-10 mt-6 xs:mt-7 sm:mt-8 md:mt-9 lg:mt-10 xl:mt-11 2xl:mt-12 mb-6 xs:mb-7 sm:mb-8 md:mb-9 lg:mb-10 xl:mb-11 2xl:mb-12">
            <button 
              className="w-full bg-[#EC9126] text-white py-2 xs:py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 2xl:py-8 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl"
            >
              Contactar Propietario
            </button>
          </div>
        </div>
      ) : (
        <div className="grid place-items-center h-screen">
          <ImSpinner2 className="animate-spin text-[#EC9126] text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-10xl" />
        </div>
      )}
    </div>
  );
};
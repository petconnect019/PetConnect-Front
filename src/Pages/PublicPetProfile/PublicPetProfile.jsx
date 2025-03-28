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

  useEffect(() => {
    if (!isFetchedPets) {
      trigguerGetId();
    }
  }, []);
  
  useEffect(() => {
    if (petResult) {
      setPetData(petResult);
    }else {
      setPetData(findPet(pet_id))
      
    }
  }, [petResult, isFetchedPets]);
  
  const trigguerGetId = () => {
    getPetById(pet_id);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    // implementacion de copiado del perfil
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
    { title: 'Edad', subtitle: petData?.age || "No especificada" },
    { title: 'Raza', subtitle: petData?.breed },
    { title: 'Color', subtitle: petData?.color },
    { title: 'Tipo', subtitle: petData?.species },
    { title: 'Género', subtitle: petData?.gender }
  ];
  console.log(petData);
  

  return (
    <div>
      {petData ? (
          <div className="bg-white min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button 
              onClick={handleGoBack} 
              className="text-[#EC9126] hover:bg-orange-100 p-2 rounded-full"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Detalles de la mascota</h1>
            <button 
              onClick={handleShare}
              className="text-[#EC9126] hover:bg-orange-100 p-2 rounded-full"
            >
              <Share2 size={24} />
            </button>
          </div>
    
          {/* Pet Photo Carousel */}
          <div className="mt-2 mb-6 flex justify-center">
            <div className="aspect-square w-64 overflow-hidden rounded-xl">
              <img 
                src={petData.photos[0] || (petData.species=='dog'?defaultDog:defaultCat)} 
                alt={petData.name} 
                className="w-64 h-64 object-cover"
              />
            </div>
          </div>
    
          {/* Pet details */}
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{petData.name}</h1>
            <div className="flex items-center gap-2 mb-6">
                {/* <MapPin className="text-blue-500" size={24} /> */}
                <span className="text-gray-700 text-lg">Ciudad, País</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
            {petDetails.map((detail, index) => (
                <GridItem key={index} title={detail.title} subtitle={detail.subtitle} />
            ))}
            </div>
          </div>
    
          {/* Owner Profile Banner */}
          <div className="mx-4 bg-[#FFF5EA] rounded-lg p-4 flex items-center space-x-4">
            <img 
              src={petData.owner.profilePicture || defaultOwner} 
              alt={petData.owner.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">{petData.owner.name}</p>
              <p className="text-sm text-gray-600">{petData.owner.location}</p>
            </div>
          </div>
    
          {/* Contact Owner Button */}
          <div className="mx-4 mt-6">
            <button 
              className="w-full bg-[#EC9126] text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              Contactar Propietario
            </button>
          </div>
        </div>
      ) : 
      (
        <div className="flex justify-center items-center h-screen">
          <ImSpinner2 className="animate-pulse text-[#EC9126] text-4xl" />
        </div>
      )
    }
    </div>
    );
};
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { usePet } from "../../Contexts/PetContext/PetContext";
import { GridItem } from "../../Components/GridItem/GridItem";
import enableLost from "../../assets/enableLost.png";
import enableQR from "../../assets/enableQR.png";
import { useNavigate } from "react-router-dom";
import { useIsFetchedPets } from "../../Contexts/IsFetchedPets/IsFetchedPets";
import { useFetchPetById } from "../../Hooks/useFetchPetById/useFetchPetById";
import { FaPaw } from "react-icons/fa";
import defaultDog from "../../assets/DogProfilePfp.png";
import defaultCat from "../../assets/CatProfilePfp.png";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import petPhoto from '../../assets/petPhoto.png'
import addPetPhoto from '../../assets/addPetPhoto.png'

export const PetDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { pet_id } = useParams();
  const [pet, setPet] = useState({});
  const fetchedPets = useIsFetchedPets();
  const { isFetchedPets } = fetchedPets ?? {};
  const pets = usePet();
  const navigate = useNavigate();
  const { findPet } = pets ?? {};
  const { getPetById, petResult } = useFetchPetById();

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

  const trigguerGetId = () => {
    getPetById(pet_id);
  };

  const petDetails = [
    { title: "Género", subtitle: pet?.gender },
    { title: "Edad", subtitle: pet?.calculatedAge },
    { title: "Raza", subtitle: pet?.breed },
    { title: "Color", subtitle: pet?.color },
    { title: "Tipo", subtitle: pet?.species },
    { title: "Género", subtitle: pet?.gender },
  ];
  return (
    <>
      {pet ? (
        <section className="flex flex-col items-center min-h-screen px-4">
          <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg">
            <h1 className="mt-5 text-center text-2xl font-bold text-gray-800">
              Detalles de la Mascota
            </h1>

            <div className="m-10 flex justify-evenly items-center">
              <div
                onClick={() => navigate(`/scanner/${pet_id}`)}
                className="flex flex-col items-center"
              >
                <img className="w-10 h-10" src={enableQR} alt="Activar QR" />
                <p className="text-xs text-center">Activar Código QR</p>
              </div>

              <img
                className="w-32"
                src={
                  pet?.profile_picture ||
                  (pet.species == "dog" ? defaultDog : defaultCat)
                }
                alt="pfp"
              />

              <div
                onClick={() => setIsModalOpen(true)}
                className="flex flex-col items-center"
              >
                <img className="w-10 h-10" src={enableLost} alt="Pet is Lost" />
                <p className="text-xs text-center">Reportar como Perdida</p>
              </div>
            </div>

            {/* Pet details */}
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">{pet.name}</h1>
              <div className="flex items-center gap-2 mb-6">
                {/* <MapPin className="text-blue-500" size={24} /> */}
                <span className="text-gray-700 text-lg">Ciudad, País</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {petDetails.map((detail, index) => (
                  <GridItem
                    key={index}
                    title={detail.title}
                    subtitle={detail.subtitle}
                  />
                ))}
              </div>
              <div className="flex justify-center m-5">
                <button onClick={()=>navigate(`/pet-profile/${pet_id}`)} className="bg-[#EC9126] text-white p-1 px-4 rounded-full">Editar Perfil</button>
              </div>
            </div>

            {/* Galería de Imagenes de la Mascota */}
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">
                Galería de Imágenes
              </h1>
              <div className="grid grid-cols-2 gap-10">
                
                <div className="flex items-center justify-center bg-[#F8FAFC] border-none">
                  <div className="flex items-center justify-center w-40 h-w-40">
                    <img 
                      src={addPetPhoto} 
                      alt={'tag'} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-center bg-[#F8FAFC] border-none">
                  <div className="flex items-center justify-center w-40 h-w-40">
                    <img 
                      src={petPhoto} 
                      alt={'tag'} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-center bg-[#F8FAFC] border-none">
                  <div className="flex items-center justify-center w-40 h-w-40">
                    <img 
                      src={petPhoto} 
                      alt={'tag'} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-center bg-[#F8FAFC] border-none">
                  <div className="flex items-center justify-center w-40 h-w-40">
                    <img 
                      src={petPhoto} 
                      alt={'tag'} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-200/30 backdrop-blur-md flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                <AiOutlineExclamationCircle className="text-red-500 text-4xl mx-auto mb-2" />
                <h2 className="text-lg font-semibold">
                  Reportar mascota perdida
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Si reportas a tu mascota como perdida, cualquier persona que
                  escanee el QR podrá verlo.
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={() => {
                      // Lógica para reportar como perdido
                      setIsModalOpen(false);
                    }}
                  >
                    Aceptar
                  </button>
                  <button
                    className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <FaPaw className="animate-pulse text-[#EC9126] text-4xl" />
        </div>
      )}
    </>
  );
};

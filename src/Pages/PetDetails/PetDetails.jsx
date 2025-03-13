import { useState } from "react";
import { useParams } from "react-router-dom"
import { useEffect } from "react";
import { usePet } from "../../Contexts/PetContext/PetContext";
import { GridItem } from "../../Components/GridItem/GridItem";
import { useIsFetchedPets } from "../../Contexts/IsFetchedPets/IsFetchedPets";
import { useFetchPets } from "../../Hooks/useFetchPets/useFetchPets";
import enableLost from '../../assets/enableLost.png'
import enableQR from '../../assets/enableQR.png'
import { useNavigate } from "react-router-dom";

export const PetDetails = () => {
    const { pet_id } = useParams();
    const [pet, setPet] = useState({});
    const isFetched = useIsFetchedPets();

    const pets = usePet();
    const navigate = useNavigate();
    const { isFetchedPets } = isFetched ?? {};
    const { findPet } = pets?? {};

    //nos traemos la mascota de la lista de mascotas
    useEffect(()=> {
        setPet(findPet(pet_id));
    }, [pet_id, findPet])

    
  //revisamos si las mascotas ya estan traidas o no
  isFetchedPets ? useFetchPets(false) : useFetchPets(true);

  const petDetails = [
    { title: 'Género', subtitle: pet?.gender },
    { title: 'Edad', subtitle: pet?.calculatedAge },
    { title: 'Raza', subtitle: pet?.breed },
    { title: 'Color', subtitle: pet?.color },
    { title: 'Tipo', subtitle: pet?.species },
    { title: 'Género', subtitle: pet?.gender }
  ];
    return(
        <>

            <section className="flex flex-col items-center min-h-screen px-4">
                <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg">
                    <h1 className="text-center text-2xl font-bold text-gray-800">Revisar Protección</h1>
                    
                    <div className="flex justify-evenly">
                        <img onClick={()=> navigate(`/scanner/${pet_id}`)} className="w-10 h-10" src={enableQR} alt="Activar QR" />
                        <img className="w-20" src={pet?.profile_picture} alt="pfp" />
                        <img className="w-10 h-10" src={enableLost} alt="Pet is Lost" />
                    </div>

                    <h1 className="text-2xl font-bold mb-4">Ubicación</h1>
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
            </section>
        </>
    )
}
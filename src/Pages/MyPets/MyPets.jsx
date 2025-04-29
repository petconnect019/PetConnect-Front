import { useNavigate } from "react-router-dom";
import { usePet } from "../../Contexts/PetContext/PetContext";
import defaultDog from "../../assets/images/DogProfilePfp.png";
import defaultCat from "../../assets/images/CatProfilePfp.png";
import { NavButton } from "../../Components/NavButton/NavButton";

export const MyPets = ()=> {
    const navigate = useNavigate();
    const pets = usePet();
    const {petList} = pets?? {};

    return (
        <div className="flex justify-center ">
            <div className="bg-white w-full p-6 md:shadow-lg max-w-md">
                <NavButton onClick={() => navigate(-1)} />
                <div className="flex items-center justify-center mb-6 w-screen p-1">
                    <h1 className="text-3xl font-semibold text-gray-900 pr-10">Mis Mascotas</h1>
                </div>
                <div className="flex flex-wrap justify-between gap-6">
                    {petList.length > 0 ? (
                        petList.map((pet, index)=> (
                            <button 
                                key={index + pet.id} 
                                onClick={()=> navigate(`/pet-details/${pet.id}`)} 
                                className="flex flex-col justify-between items-center p-3 bg-amber-100 w-9/20 h-35 rounded-lg text-sm hover:bg-green-600 transition"
                            >
                                <img 
                                    src={pet.profile_picture || (pet.species === "dog" ? defaultDog : defaultCat)} 
                                    alt="Profile-picture" 
                                    className="w-22 h-22 object-cover rounded-full"
                                />
                                <h2 className="font-semibold text-gray-800">{pet.name}</h2>
                            </button>
                        ))
                    ) : (
                        <p className="text-gray-500">No tienes mascotas registradas.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
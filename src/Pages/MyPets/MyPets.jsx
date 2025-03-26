import { useNavigate } from "react-router-dom";
import { usePet } from "../../Contexts/PetContext/PetContext";


export const MyPets = ()=> {
    const navigate = useNavigate();
    
    const pets = usePet();

    const {petList} = pets?? {};
    console.log(petList);

    // Quitar items-center

    return (
        <div className="bg-white flex justify-center min-h-screen sm:p-4 md:bg-gray-100">
            <div className="bg-white w-screen p-6 rounded-4xl md:shadow-lg max-w-md">
                <h1 className="text-3xl text-center font-semibold text-gray-900 py-15">Mis Mascotas</h1>
                <div className="flex flex-wrap justify-between gap-6">
                    {petList.length > 0 ? (
                        petList.map((pet, index)=> (
                            <button key={index + pet.id} onClick={()=> navigate(`/pet-details/${pet.id}`)} className="flex flex-col justify-between items-center p-3 bg-amber-100 w-9/20 h-35 rounded-lg text-sm hover:bg-green-600 transition">
                                <img src={pet.profile_picture} alt="Profile-picture" className="w-22 h-22 object-cover rounded-full" />
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
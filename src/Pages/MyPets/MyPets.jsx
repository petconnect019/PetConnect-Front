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
                <h1 className="text-3xl text-center font-semibold text-gray-900">Mis Mascotas</h1>
                {petList.length > 0 ? (
                    petList.map((pet, index)=> (
                        <button key={index + pet._id} onClick={()=> navigate(`/pet-details/${pet._id}`)} className="flex flex-col justify-between items-center p-3 bg-amber-50 w-9/20 h-30 rounded-lg text-sm hover:bg-green-600 transition">
                            <h2>{pet.name}</h2>
                            <img src="" alt="" />
                        </button>

))
                ) : (
                    <p className="text-gray-500">No tienes mascotas registradas.</p>
                )}

            </div>
        </div>
    );
}
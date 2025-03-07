import catDefault from "../../assets/CatProfilePfp.png";
import dogDefault from "../../assets/DogProfilePfp.png";

export const ProfilePetSection = ({pet, navigate})=> {
    console.log(pet);
    
    return(
        <div onClick={()=> navigate(`/pet-details/${pet._id}`)} className="w-14 h-14 rounded-full border-2 border-gray-300">
            <img key={pet._id} src={pet.profile_picture || (pet.species == 'gato'? catDefault: dogDefault)} alt={pet.name} className="rounded-full w-full h-auto" />
            <p className="text-center">{pet.name}</p>
        </div>
    )
}
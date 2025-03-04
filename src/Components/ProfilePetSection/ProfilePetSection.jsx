import catDefault from "../../assets/CatProfile.png";
import dogDefault from "../../assets/DogProfile.png";

export const ProfilePetSection = ({pet})=> {
    return(
        <div className="w-14 h-14 rounded-full border-2 border-gray-300 p-1">
            <img key={pet.id} src={pet.imageUrl || (pet.species == 'gato'? catDefault: dogDefault)} alt={pet.name} className="w-full h-auto" />
            <p>{pet.name}</p>
        </div>
    )
}
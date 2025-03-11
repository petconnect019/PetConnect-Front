import catDefault from "../../assets/CatProfilePfp.png";
import dogDefault from "../../assets/DogProfilePfp.png";

export const ItemHighlighted = ({pet, active})=> {
    return (
        <button
            type="button"
            className={`flex flex-col items-center p-2 h-[6rem] w-[6rem] rounded-lg border ${
                active ? "border-orange-400" : "border-gray-300"
            }`}
        >
            <div className="w-14 h-14 rounded-full border-2 border-gray-300">
                <img key={pet._id} src={pet.profile_picture || (pet.species == 'gato'? catDefault: dogDefault)} alt={pet.name} className="rounded-full w-full h-auto" />
                <p className="text-center">{pet.name}</p>
            </div>
        </button>
    )
}
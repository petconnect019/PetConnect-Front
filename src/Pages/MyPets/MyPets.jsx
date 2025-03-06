import { usePet } from "../../Contexts/PetContext/PetContext";

export const MyPets = ()=> {
    console.log("pepe");
    
    const pets = usePet();

    const {petList} = pets?? {};
    console.log(petList);

    return (
        <div>
            {petList.length > 0 ? (
                petList.map((pet, index)=> (
                    <h2 key={index + pet._id}>{pet.name}</h2>
                ))
            ) : (
                <p className="text-gray-500">No tienes mascotas registradas.</p>
            )}
        </div>
    );
}
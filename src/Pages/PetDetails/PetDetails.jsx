import { useState } from "react";
import { useParams } from "react-router-dom"
import { useEffect } from "react";
import { usePet } from "../../Contexts/PetContext/PetContext";

export const PetDetails = () => {
    const { pet_id } = useParams();
    const [pet, setPet] = useState({});

    const pets = usePet();
    const { findPet } = pets?? {};

    //nos traemos la mascota de la lista de mascotas
    useEffect(()=> {
        setPet(findPet(pet_id));
    }, [])

    return(
        <h1>{pet.name}</h1>
    )
}
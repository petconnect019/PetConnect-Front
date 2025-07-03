import { createContext, useContext, useState } from "react";

const PetContext = createContext();

export const PetProvider = ({ children }) => {
    const [petList, setPetList] = useState([]);

    const addPet = (newPet) => {
        if (!findPet(newPet._id)) {
            setPetList((prevPets)=> [...prevPets, newPet]);
        }
    };

    const removePet = (petId) => {
        setPetList((prevPets) => prevPets.filter((pet) => pet._id !== petId && pet.id !== petId));
    };
    const updatePet = (updatedPet) => {
        setPetList((prevPets) =>
            prevPets.map((pet) =>
                pet._id === updatedPet._id ? { ...pet, ...updatedPet } : pet
            )
        );
    };
    const findPet = (petId) => {
        return petList.find((pet) => pet._id === petId);
    }

    return (
        <PetContext.Provider value={{ petList, setPetList, addPet, removePet, findPet, updatePet }}>
            {children}
        </PetContext.Provider>
    );
}

export const usePet = () => useContext(PetContext);
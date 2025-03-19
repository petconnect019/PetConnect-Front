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
        setPetList(petList.filter((pet) => pet._id !== petId));
    };
    const findPet = (petId) => {
        return petList.find((pet) => pet._id === petId);
    }

    return (
        <PetContext.Provider value={{ petList, addPet, removePet, findPet }}>
            {children}
        </PetContext.Provider>
    );
}

export const usePet = () => useContext(PetContext);
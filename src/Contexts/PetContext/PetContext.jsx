import { createContext, useContext, useState } from "react";

const PetContext = createContext();

export const PetProvider = ({ children }) => {
    const [petList, setPetList] = useState([]);
    const [hasPetsUser, setHasPetsUser] = useState(false);

    const addPet = (newPet) => {
        setPetList([...petList, newPet]);
    };

    const removePet = (petId) => {
        setPetList(petList.filter((pet) => pet.id !== petId));
    };

    const hasPets = () => {
        setHasPetsUser(true);
    }

    return (
        <PetContext.Provider value={{ petList, addPet, removePet, hasPets }}>
            {children}
        </PetContext.Provider>
    );
}

export const usePet = () => useContext(PetContext);
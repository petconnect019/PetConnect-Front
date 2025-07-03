import { createContext, useContext, useState } from "react";

const PetContext = createContext();

export const PetProvider = ({ children }) => {
    const [petList, setPetList] = useState([]);

    const addPet = (newPet) => {
        if (!newPet) return;

        try {
            const storedUser = JSON.parse(localStorage.getItem("userData") || "null");
            const loggedUserId = storedUser?._id;

            // Si no hay usuario autenticado, NO agregamos la mascota
            if (!loggedUserId) return;

            // Determinar el ownerId, soportando string u objeto
            const ownerId = typeof newPet.owner === "string" ? newPet.owner : newPet.owner?._id;

            // Solo añadir si la mascota realmente pertenece al usuario autenticado
            if (ownerId !== loggedUserId) return;

            // Evitar duplicados: comparar por _id o id
            const alreadyExists = petList.some(
                (p) => p._id === newPet._id || p.id === newPet._id || p._id === newPet.id
            );

            if (!alreadyExists) {
                setPetList((prevPets) => [...prevPets, newPet]);
            }
        } catch (error) {
            console.error("Error al validar propietario de la mascota:", error);
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
import { createContext, useContext, useState } from "react";

const PetContext = createContext();

export const PetProvider = ({ children }) => {
    const [petList, setPetList] = useState([]);

    const addPet = (newPet) => {
        if (!newPet) return;

        try {
            // Obtener el usuario logueado desde localStorage (estructura guardada por AuthContext)
            const storedUser = JSON.parse(localStorage.getItem("userData") || "null");
            const loggedUserId = storedUser?._id;

            // Verificar que la mascota pertenece al usuario autenticado
            const ownerId = typeof newPet.owner === "string" ? newPet.owner : newPet.owner?._id;

            if (loggedUserId && ownerId && ownerId !== loggedUserId) {
                // No es nuestra mascota → no la añadimos
                return;
            }

            if (!findPet(newPet._id)) {
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
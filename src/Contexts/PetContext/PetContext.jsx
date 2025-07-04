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

            // Solo impedir el añadido si *existe* ownerId y no coincide con el usuario autenticado
            if (ownerId && ownerId !== loggedUserId) return;

            // Utilizamos el callback de setPetList para asegurarnos de trabajar con la versión
            // más reciente del estado y evitar duplicados causados por renderizados concurridos.
            setPetList((prevPets) => {
                const exists = prevPets.some(
                    (p) =>
                        p._id === newPet._id ||
                        p.id === newPet._id ||
                        p._id === newPet.id ||
                        p.id === newPet.id
                );

                // Si ya existe, retornamos el array sin cambios; de lo contrario, añadimos la nueva mascota.
                return exists ? prevPets : [...prevPets, newPet];
            });
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
        return petList.find((pet) => pet._id === petId || pet.id === petId);
    }

    return (
        <PetContext.Provider value={{ petList, setPetList, addPet, removePet, findPet, updatePet }}>
            {children}
        </PetContext.Provider>
    );
}

export const usePet = () => useContext(PetContext);
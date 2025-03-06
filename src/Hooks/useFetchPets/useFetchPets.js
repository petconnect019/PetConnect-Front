import { useEffect } from "react";
import { FetchMascotas } from "../../Utils/Fetch/FetchGetMascotas/FetchGetMascotas";
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";
import { usePet } from "../../Contexts/PetContext/PetContext";

export const useFetchPets = (hasPetsUser) => {
    const { addPet, findPet } = usePet();

    useEffect(() => {
        if (!hasPetsUser) return;

        const fetchData = async () => {
            let token = sessionStorage.getItem('accessToken');
            if (isTokenExpired(token)) {
                try {
                    await FetchRefreshToken();
                    token = sessionStorage.getItem('accessToken');
                } catch (error) {
                    console.error("Error al refrescar el token:", error);
                    return;
                }
            }

            try {
                const data = await FetchMascotas(token);
                data.pets.forEach(pet => {
                    if (!findPet(pet._id)) {
                        addPet(pet);
                    }
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [hasPetsUser]);
};

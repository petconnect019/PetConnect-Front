import { useEffect } from "react";
import { FetchPets } from "../../Utils/Fetch/FetchGetPet/FetchGetPets";
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";
import { usePet } from "../../Contexts/PetContext/PetContext";
import { useIsFetchedPets } from "../../Contexts/IsFetchedPets/IsFetchedPets";

export const useFetchPets = (hasPetsUser) => {
    const { addPet, findPet } = usePet();
    const { isFetchedPets, changeIsFetched } = useIsFetchedPets();
    useEffect(() => {
        if (!hasPetsUser || isFetchedPets) return;

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
                const data = await FetchPets(token);
                data.pets.forEach(pet => {
                    if (!findPet(pet._id)) {
                        addPet(pet);
                    }
                });
                changeIsFetched(true);

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [hasPetsUser]);
};

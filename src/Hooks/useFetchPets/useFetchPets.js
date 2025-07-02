import { useEffect } from "react";
import { FetchPets } from "../../Utils/Fetch/FetchGetPet/FetchGetPets";
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";
import { usePet } from "../../Contexts/PetContext/PetContext";
import { useIsFetchedPets } from "../../Contexts/IsFetchedPets/IsFetchedPets";

export const useFetchPets = (hasPetsUser) => {
    const { addPet, findPet, updatePet } = usePet();
    const { isFetchedPets, changeIsFetched } = useIsFetchedPets();
    useEffect(() => {
        console.log(isFetchedPets);
        
        if (!hasPetsUser || isFetchedPets) return;
        console.log("entra");
        
        const fetchData = async () => {
            let token = localStorage.getItem('accessToken');
            if (isTokenExpired(token)) {
                try {
                    await FetchRefreshToken();
                    token = localStorage.getItem('accessToken');
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
                    } else {
                        updatePet(pet)
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

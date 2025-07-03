import { useEffect } from "react";
import { FetchPets } from "../../Utils/Fetch/FetchGetPet/FetchGetPets";
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";
import { usePet } from "../../Contexts/PetContext/PetContext";
import { useIsFetchedPets } from "../../Contexts/IsFetchedPets/IsFetchedPets";
import { useHasPetsUser } from "../../Contexts/HasPetsUser/HasPetsUser";

export const useFetchPets = (hasPetsUser) => {
    const { addPet, findPet, updatePet } = usePet();
    const { isFetchedPets, changeIsFetched } = useIsFetchedPets();
    const { changeHasPetsUser } = useHasPetsUser();

    useEffect(() => {
        if (isFetchedPets) return;
        
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
                if (data.pets && data.pets.length > 0) {
                    changeHasPetsUser(true);
                    data.pets.forEach(pet => {
                        if (!findPet(pet._id)) {
                            addPet(pet);
                        } else {
                            updatePet(pet)
                        }
                    });
                }
                changeIsFetched(true);

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [hasPetsUser]);
};

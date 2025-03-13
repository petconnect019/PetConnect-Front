import { FetchLinkPetQr } from "../../Utils/Fetch/FetchLinkPetQr/FetchLinkPet";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";

export const useFetchLinkPet = (objectQrPet) => {
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
            const data = await FetchLinkPetQr(objectQrPet, token);
            console.log(data);
            
            // data.pets.forEach(pet => {
            //     if (!findPet(pet._id)) {
            //         addPet(pet);
            //     }
            // });

        } catch (error) {
            console.error(error);
        }
    };

    fetchData();
};

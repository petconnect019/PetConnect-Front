import { FetchScans } from "../../Utils/Fetch/FetchScans/FetchScans";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";

export const useFetchScans = (pet_id) => {
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
            const data = await FetchScans(pet_id);
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

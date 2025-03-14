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
            const result = await FetchLinkPetQr(objectQrPet, token);
            if (result.ok) {
                if (result.data.qr.pet) {
                    //devolvemos el qr con la mascota linkeada
                    return {hasPet: true, pet: result.data.qr.pet};
                } else {
                    //devolvemos el qr sin mascota linkeada
                    return {hasPet: false, pet: null};
                }
            } else return false;
            
        } catch (error) {
            console.error(error);
        }
    };
    return fetchData();
};

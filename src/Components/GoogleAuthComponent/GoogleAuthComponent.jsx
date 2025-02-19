import { GoogleLogin } from "@react-oauth/google";

const handleSuccess = (response) => {
    console.log("Login exitoso", response);
};

const handleError = () => {
    console.log("Error en el login");
};

export const GoogleAuthComponent = () => {
    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
        />
    );
};
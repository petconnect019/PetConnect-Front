import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Navigate } from "react-router-dom";

export const GoogleAuthComponent = () => {
    const [redirect, setRedirect] = useState(false);

    const handleSuccess = (response) => {
        if (response.credential) {
            localStorage.setItem('userToken', response.credential);
            setRedirect(true);
        }
    };

    const handleError = () => {
        console.error("Error en el login");
    };

    if (redirect) {
        return <Navigate to="/home" />;
    }

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
        />
    );
};

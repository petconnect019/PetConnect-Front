import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import { Navigate } from "react-router-dom";

export const ProtectRoute = ({ children }) => {
    const auth = useAuth();

    // Verificamos si el contexto de autenticación está disponible antes de desestructurar
    if (!auth) return <div className="text-center text-gray-600">Verificando acceso...</div>;

    const { isAuthenticated } = auth ?? {};
    return isAuthenticated ? children : <Navigate to="/login" />;
};

import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import { Navigate } from "react-router-dom";

export const ProtectRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
}
import { AiFillHome, AiFillMessage, AiFillSetting, AiOutlineHome, AiOutlineMessage, AiOutlineSetting } from "react-icons/ai";
import { useLocation } from "react-router-dom";

export const FooterNav = ({ navigate }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path) => {
        if (path === "/home") {
            return currentPath === "/home";
        } else if (path === "/messages") {
            // Activar para /messages y /chat (con o sin parámetros)
            return currentPath === "/messages" || currentPath.startsWith("/chat");
        } else if (path === "/settings") {
            return currentPath === "/settings";
        }
        return false;
    };

    return (
        <footer className="bg-white flex justify-around fixed bottom-0 w-full py-3 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <button 
                onClick={() => navigate("/home")}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                    isActive("/home") ? "text-brand" : "text-gray-400 hover:text-brand"
                }`}
            >
                {isActive("/home") ? (
                    <AiFillHome className="text-2xl" />
                ) : (
                    <AiOutlineHome className="text-2xl" />
                )}
                <span className="text-xs">Inicio</span>
            </button>
            
            <button 
                onClick={() => navigate("/messages")}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                    isActive("/messages") ? "text-brand" : "text-gray-400 hover:text-brand"
                }`}
            >
                {isActive("/messages") ? (
                    <AiFillMessage className="text-2xl" />
                ) : (
                    <AiOutlineMessage className="text-2xl" />
                )}
                <span className="text-xs">Mensajes</span>
            </button>
            
            <button 
                onClick={() => navigate("/settings")}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                    isActive("/settings") ? "text-brand" : "text-gray-400 hover:text-brand"
                }`}
            >
                {isActive("/settings") ? (
                    <AiFillSetting className="text-2xl" />
                ) : (
                    <AiOutlineSetting className="text-2xl" />
                )}
                <span className="text-xs">Ajustes</span>
            </button>
        </footer>
    );
};